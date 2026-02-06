"use client";
import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "../../../../../supabase/client";

function RedditCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState("Processing...");
  const [error, setError] = useState("");

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const code = searchParams.get("code");
        const state = searchParams.get("state");
        const storedState = sessionStorage.getItem("reddit_oauth_state");

        if (!code) {
          throw new Error("No authorization code received");
        }

        if (state !== storedState) {
          throw new Error("Invalid state parameter");
        }

        setStatus("Exchanging code for tokens...");

        // Call our edge function to handle the OAuth exchange
        const supabase = createClient();
        const { data, error } = await supabase.functions.invoke(
          "supabase-functions-reddit-auth",
          {
            body: { code, state },
          },
        );

        if (error) {
          throw new Error(
            error.message || "Failed to authenticate with Reddit",
          );
        }

        if (!data.success) {
          throw new Error(data.error || "Authentication failed");
        }

        setStatus("Saving connection...");

        // Save the Reddit connection to the database
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (user) {
          const { error: updateError } = await supabase.from("users").upsert({
            id: user.id,
            email: user.email,
            reddit_username: data.user.name,
            reddit_access_token: data.tokens.access_token,
            reddit_refresh_token: data.tokens.refresh_token,
            reddit_connected: true,
            reddit_connected_at: new Date().toISOString(),
          });

          if (updateError) {
            console.error("Error saving Reddit connection:", updateError);
          }
        }

        // Clean up
        sessionStorage.removeItem("reddit_oauth_state");

        setStatus("Success! Redirecting...");
        setTimeout(() => {
          router.push("/dashboard?reddit_connected=true");
        }, 2000);
      } catch (err) {
        console.error("Reddit callback error:", err);
        setError(
          err instanceof Error ? err.message : "An unknown error occurred",
        );
        setStatus("Authentication failed");
      }
    };

    handleCallback();
  }, [searchParams, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-black">
      <div className="max-w-md w-full bg-white dark:bg-black rounded-lg shadow-md p-8 text-center border dark:border-gray-800">
        <div className="mb-6">
          <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center mx-auto mb-4">
            <div className="w-8 h-8 bg-orange-600 rounded-full" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Reddit Connection
          </h1>
        </div>

        <div className="mb-6">
          <p className="text-gray-600 dark:text-white mb-2">{status}</p>
          {error && (
            <div className="bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 rounded-md p-4 mt-4">
              <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
              <button
                onClick={() => router.push("/dashboard")}
                className="mt-2 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 text-sm underline"
              >
                Return to Dashboard
              </button>
            </div>
          )}
        </div>

        {!error && (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function RedditCallback() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RedditCallbackContent />
    </Suspense>
  );
}

"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "../../../../../supabase/client";

export default function RedditCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState("Processing Reddit connection...");
  const [error, setError] = useState("");

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const code = searchParams.get("code");
        const state = searchParams.get("state");
        const errorParam = searchParams.get("error");

        if (errorParam) {
          throw new Error(`Reddit OAuth error: ${errorParam}`);
        }

        if (!code) {
          throw new Error("No authorization code received from Reddit");
        }

        if (!state) {
          throw new Error("No state parameter received from Reddit");
        }

        setStatus("Verifying Reddit connection...");

        // Get current user first
        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          throw new Error("You must be logged in to connect Reddit");
        }

        // Validate state parameter exists in session storage
        const storedState = sessionStorage.getItem("reddit_oauth_state");
        const storedUserId = sessionStorage.getItem("reddit_oauth_user_id");

        console.log("State validation:", {
          receivedState: state,
          storedState: storedState,
          currentUserId: user.id,
          storedUserId: storedUserId,
        });

        // More flexible state validation - check if state contains user ID
        if (!state.includes(user.id)) {
          console.error("State validation failed:", {
            state,
            userId: user.id,
            storedState,
            storedUserId,
          });
          throw new Error(
            `State parameter validation failed. Expected user ID ${user.id} in state ${state}`,
          );
        }

        setStatus("Exchanging authorization code...");

        // Call our edge function to handle the OAuth exchange
        console.log("Calling reddit-callback function with:", {
          code: !!code,
          state,
        });

        const { data, error } = await supabase.functions.invoke(
          "supabase-functions-reddit-callback",
          {
            body: { code, state },
          },
        );

        console.log("Reddit callback function response:", { data, error });

        if (error) {
          console.error("Supabase function invocation error:", error);
          throw new Error(
            `Function invocation failed: ${error.message || JSON.stringify(error)}`,
          );
        }

        if (!data) {
          console.error("No data received from reddit-callback function");
          throw new Error(
            "No response data received from authentication service",
          );
        }

        if (!data.success) {
          console.error("Reddit auth failed with data:", data);
          throw new Error(
            data?.error || "Reddit authentication failed - no success flag",
          );
        }

        setStatus("Reddit connected successfully! Redirecting...");

        // Clean up any stored state
        if (typeof window !== "undefined") {
          sessionStorage.removeItem("reddit_oauth_state");
          sessionStorage.removeItem("reddit_oauth_user_id");
        }

        // Redirect to dashboard with success message
        setTimeout(() => {
          router.push("/dashboard?tab=settings&reddit_connected=true");
        }, 1500);
      } catch (err) {
        console.error("Reddit callback error:", err);
        setError(
          err instanceof Error ? err.message : "An unknown error occurred",
        );
        setStatus("Reddit connection failed");

        // Clean up on error
        if (typeof window !== "undefined") {
          sessionStorage.removeItem("reddit_oauth_state");
          sessionStorage.removeItem("reddit_oauth_user_id");
        }
      }
    };

    handleCallback();
  }, [searchParams, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-orange-50 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-md w-full bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-8 text-center border border-gray-200 dark:border-gray-700">
        <div className="mb-6">
          <div className="w-20 h-20 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
              <div className="w-6 h-6 bg-red-600 rounded-full" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Reddit Connection
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-sm">
            Connecting your Reddit account to Ocera
          </p>
        </div>

        <div className="mb-6">
          <p className="text-gray-700 dark:text-gray-200 mb-4 font-medium">
            {status}
          </p>
          {error ? (
            <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 rounded-lg p-4 mt-4">
              <div className="flex items-center justify-center mb-3">
                <div className="w-8 h-8 bg-red-100 dark:bg-red-800 rounded-full flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-red-600 dark:text-red-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
              <p className="text-red-700 dark:text-red-300 text-sm mb-3 font-medium">
                {error}
              </p>
              <button
                onClick={() => router.push("/dashboard")}
                className="inline-flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors duration-200"
              >
                Return to Dashboard
              </button>
            </div>
          ) : (
            <div className="flex justify-center">
              <div className="relative">
                <div className="animate-spin rounded-full h-10 w-10 border-4 border-orange-200 border-t-orange-600"></div>
                <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-orange-300 animate-ping"></div>
              </div>
            </div>
          )}
        </div>

        {!error && (
          <div className="text-xs text-gray-500 dark:text-gray-400">
            Please wait while we complete the connection...
          </div>
        )}
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { CheckCircle2, AlertCircle, ExternalLink } from "lucide-react";
import { createClient } from "../../supabase/client";

export default function RedditConnectionCard() {
  const [isConnected, setIsConnected] = useState(false);
  const [redditUsername, setRedditUsername] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    checkRedditConnection();
  }, []);

  const checkRedditConnection = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        const { data: userData } = await supabase
          .from("users")
          .select("reddit_connected, reddit_username")
          .eq("id", user.id)
          .single();

        if (userData) {
          setIsConnected(userData.reddit_connected || false);
          setRedditUsername(userData.reddit_username || "");
        }
      }
    } catch (error) {
      console.error("Error checking Reddit connection:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConnect = () => {
    const REDDIT_CLIENT_ID = "Fe5oPbU_QGVuGtVgot2RIw";
    const REDIRECT_URI = `${window.location.origin}/auth/reddit/callback`;
    const STATE = Math.random().toString(36).substring(7);

    // Store state in sessionStorage for verification
    sessionStorage.setItem("reddit_oauth_state", STATE);

    const authUrl = new URL("https://www.reddit.com/api/v1/authorize");
    authUrl.searchParams.set("client_id", REDDIT_CLIENT_ID);
    authUrl.searchParams.set("response_type", "code");
    authUrl.searchParams.set("state", STATE);
    authUrl.searchParams.set("redirect_uri", REDIRECT_URI);
    authUrl.searchParams.set("duration", "permanent");
    authUrl.searchParams.set("scope", "identity read submit");

    window.location.href = authUrl.toString();
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="w-6 h-6 bg-red-600 rounded-full flex items-center justify-center">
            <div className="w-3 h-3 bg-white rounded-full" />
          </div>
          Reddit Connection
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isConnected ? (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-green-600">
              <CheckCircle2 className="w-5 h-5" />
              <span className="font-medium">Connected</span>
            </div>
            <div className="bg-green-50 p-3 rounded-lg">
              <p className="text-sm text-green-800">
                <strong>Username:</strong> u/{redditUsername}
              </p>
              <p className="text-xs text-green-600 mt-1">
                Your Reddit account is connected and ready for posting.
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() =>
                window.open(
                  "https://reddit.com/user/" + redditUsername,
                  "_blank",
                )
              }
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              View Reddit Profile
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-orange-600">
              <AlertCircle className="w-5 h-5" />
              <span className="font-medium">Not Connected</span>
            </div>
            <div className="bg-orange-50 p-3 rounded-lg">
              <p className="text-sm text-orange-800">
                Connect your Reddit account to start posting to multiple
                subreddits.
              </p>
              <p className="text-xs text-orange-600 mt-1">
                We use secure OAuth2 authentication - we never store your
                password.
              </p>
            </div>
            <Button
              onClick={handleConnect}
              className="w-full bg-red-600 hover:bg-red-700"
            >
              Connect Reddit Account
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

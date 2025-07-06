"use client";
import { Button } from "./ui/button";
import { useState } from "react";

interface RedditLoginButtonProps {
  className?: string;
}

export default function RedditLoginButton({
  className,
}: RedditLoginButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleRedditLogin = () => {
    setIsLoading(true);

    // Generate a temporary user ID for guests
    const tempUserId = `guest_${Date.now()}_${Math.random().toString(36).substring(7)}`;

    const REDDIT_CLIENT_ID = "Fe5oPbU_QGVuGtVgot2RIw";
    const REDIRECT_URI = `https://ocera.top/auth/reddit/callback`;
    const STATE = `${tempUserId}_${Date.now()}_${Math.random().toString(36).substring(7)}`;

    // Store state in sessionStorage for verification
    sessionStorage.setItem("reddit_oauth_state", STATE);
    sessionStorage.setItem("reddit_temp_user_id", tempUserId);

    const authUrl = new URL("https://www.reddit.com/api/v1/authorize");
    authUrl.searchParams.set("client_id", REDDIT_CLIENT_ID);
    authUrl.searchParams.set("response_type", "code");
    authUrl.searchParams.set("state", STATE);
    authUrl.searchParams.set("redirect_uri", REDIRECT_URI);
    authUrl.searchParams.set("duration", "permanent");
    authUrl.searchParams.set(
      "scope",
      "identity read submit edit history mysubreddits subscribe vote wikiedit wikiread",
    );

    console.log("Starting Reddit OAuth for guest user:", {
      tempUserId,
      state: STATE,
      redirectUri: REDIRECT_URI,
    });

    // Redirect directly to Reddit OAuth
    window.location.href = authUrl.toString();
  };

  return (
    <Button
      onClick={handleRedditLogin}
      disabled={isLoading}
      className={`bg-orange-600 hover:bg-orange-700 ${className}`}
    >
      {isLoading ? "Connecting..." : "Connect Reddit"}
    </Button>
  );
}

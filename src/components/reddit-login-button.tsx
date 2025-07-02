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

    const REDDIT_CLIENT_ID = "Fe5oPbU_QGVuGtVgot2RIw";
    // Use the exact redirect URI that matches your Reddit app configuration
    const REDIRECT_URI =
      "https://admiring-nobel5-p6nq9.view-3.tempo-dev.app/auth/reddit/callback";
    const STATE = Math.random().toString(36).substring(7);

    // Store state in sessionStorage for verification
    sessionStorage.setItem("reddit_oauth_state", STATE);

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

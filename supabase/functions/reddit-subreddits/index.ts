import { corsHeaders } from "@shared/cors.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: corsHeaders,
      status: 200,
    });
  }

  try {
    const { subreddit, action = "info" } = await req.json();

    // Get the user's access token from Supabase
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Authorization header required" }),
        {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      {
        global: {
          headers: { Authorization: authHeader },
        },
      },
    );

    // Get the current user
    const {
      data: { user },
      error: userError,
    } = await supabaseClient.auth.getUser();

    if (userError || !user) {
      return new Response(JSON.stringify({ error: "User not authenticated" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Get user's Reddit access token
    const { data: userData, error: dbError } = await supabaseClient
      .from("users")
      .select("reddit_access_token, reddit_connected")
      .eq("id", user.id)
      .single();

    if (
      dbError ||
      !userData?.reddit_connected ||
      !userData?.reddit_access_token
    ) {
      return new Response(
        JSON.stringify({ error: "Reddit account not connected" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    let endpoint = "";
    let method = "GET";
    let body = null;

    switch (action) {
      case "info":
        if (!subreddit) {
          return new Response(
            JSON.stringify({ error: "Subreddit name required for info" }),
            {
              status: 400,
              headers: { ...corsHeaders, "Content-Type": "application/json" },
            },
          );
        }
        endpoint = `https://oauth.reddit.com/r/${subreddit}/about`;
        break;
      case "subscribe":
        if (!subreddit) {
          return new Response(
            JSON.stringify({ error: "Subreddit name required for subscribe" }),
            {
              status: 400,
              headers: { ...corsHeaders, "Content-Type": "application/json" },
            },
          );
        }
        endpoint = "https://oauth.reddit.com/api/subscribe";
        method = "POST";
        body = new URLSearchParams({
          action: "sub",
          sr_name: subreddit,
        });
        break;
      case "unsubscribe":
        if (!subreddit) {
          return new Response(
            JSON.stringify({
              error: "Subreddit name required for unsubscribe",
            }),
            {
              status: 400,
              headers: { ...corsHeaders, "Content-Type": "application/json" },
            },
          );
        }
        endpoint = "https://oauth.reddit.com/api/subscribe";
        method = "POST";
        body = new URLSearchParams({
          action: "unsub",
          sr_name: subreddit,
        });
        break;
      case "my_subreddits":
        endpoint = "https://oauth.reddit.com/subreddits/mine/subscriber";
        break;
      case "popular":
        endpoint = "https://oauth.reddit.com/subreddits/popular";
        break;
      case "search":
        if (!subreddit) {
          return new Response(
            JSON.stringify({ error: "Query required for search" }),
            {
              status: 400,
              headers: { ...corsHeaders, "Content-Type": "application/json" },
            },
          );
        }
        endpoint = `https://oauth.reddit.com/subreddits/search?q=${encodeURIComponent(subreddit)}`;
        break;
      default:
        return new Response(JSON.stringify({ error: "Invalid action" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
    }

    const headers: Record<string, string> = {
      Authorization: `Bearer ${userData.reddit_access_token}`,
      "User-Agent": "Ocera/1.0.0",
    };

    if (method === "POST") {
      headers["Content-Type"] = "application/x-www-form-urlencoded";
    }

    const redditResponse = await fetch(endpoint, {
      method,
      headers,
      body,
    });

    if (!redditResponse.ok) {
      const errorText = await redditResponse.text();
      console.error(
        `Reddit API Error: ${redditResponse.status} - ${errorText}`,
      );
      throw new Error(`Reddit API error: ${redditResponse.status}`);
    }

    const data = await redditResponse.json();

    return new Response(
      JSON.stringify({
        success: true,
        action,
        data,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      },
    );
  } catch (error) {
    console.error("Error with Reddit subreddit operation:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    return new Response(
      JSON.stringify({
        success: false,
        error: "Failed to perform subreddit operation",
        details: errorMessage,
        timestamp: new Date().toISOString(),
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }
});

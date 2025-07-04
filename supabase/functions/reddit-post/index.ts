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
    const { title, content, subreddit } = await req.json();

    if (!title || !content || !subreddit) {
      return new Response(
        JSON.stringify({ error: "Title, content, and subreddit are required" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

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

    // Post to Reddit
    const redditResponse = await fetch("https://oauth.reddit.com/api/submit", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${userData.reddit_access_token}`,
        "Content-Type": "application/x-www-form-urlencoded",
        "User-Agent": "Ocera/1.0.0",
      },
      body: new URLSearchParams({
        api_type: "json",
        kind: content.includes("http") ? "link" : "self",
        sr: subreddit,
        title: title,
        text: content.includes("http") ? "" : content,
        url: content.includes("http") ? content : "",
        resubmit: "true",
      }),
    });

    if (!redditResponse.ok) {
      const errorText = await redditResponse.text();
      console.error(
        `Reddit API Error: ${redditResponse.status} - ${errorText}`,
      );
      throw new Error(`Reddit API error: ${redditResponse.status}`);
    }

    const redditData = await redditResponse.json();

    if (redditData.json?.errors && redditData.json.errors.length > 0) {
      const error = redditData.json.errors[0];
      throw new Error(`Reddit error: ${error[1] || error[0]}`);
    }

    const postUrl =
      redditData.json?.data?.url || `https://reddit.com/r/${subreddit}`;

    return new Response(
      JSON.stringify({
        success: true,
        message: "Post submitted successfully",
        url: postUrl,
        subreddit: subreddit,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      },
    );
  } catch (error) {
    console.error("Error posting to Reddit:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    return new Response(
      JSON.stringify({
        success: false,
        error: "Failed to post to Reddit",
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

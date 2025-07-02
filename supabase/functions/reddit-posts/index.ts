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
    const {
      action = "user_posts",
      username,
      subreddit,
      post_id,
      sort = "new",
      limit = 25,
    } = await req.json();

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
      .select("reddit_access_token, reddit_connected, reddit_username")
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

    switch (action) {
      case "user_posts":
        const targetUsername = username || userData.reddit_username;
        if (!targetUsername) {
          return new Response(JSON.stringify({ error: "Username required" }), {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
        endpoint = `https://oauth.reddit.com/user/${targetUsername}/submitted?sort=${sort}&limit=${limit}`;
        break;
      case "subreddit_posts":
        if (!subreddit) {
          return new Response(
            JSON.stringify({ error: "Subreddit name required" }),
            {
              status: 400,
              headers: { ...corsHeaders, "Content-Type": "application/json" },
            },
          );
        }
        endpoint = `https://oauth.reddit.com/r/${subreddit}/${sort}?limit=${limit}`;
        break;
      case "post_details":
        if (!post_id) {
          return new Response(JSON.stringify({ error: "Post ID required" }), {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
        endpoint = `https://oauth.reddit.com/comments/${post_id}`;
        break;
      case "hot_posts":
        endpoint = `https://oauth.reddit.com/hot?limit=${limit}`;
        break;
      case "trending_posts":
        endpoint = `https://oauth.reddit.com/rising?limit=${limit}`;
        break;
      default:
        return new Response(JSON.stringify({ error: "Invalid action" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
    }

    const redditResponse = await fetch(endpoint, {
      headers: {
        Authorization: `Bearer ${userData.reddit_access_token}`,
        "User-Agent": "Ocera/1.0.0",
      },
    });

    if (!redditResponse.ok) {
      const errorText = await redditResponse.text();
      console.error(
        `Reddit API Error: ${redditResponse.status} - ${errorText}`,
      );
      throw new Error(`Reddit API error: ${redditResponse.status}`);
    }

    const data = await redditResponse.json();

    // Format the response for easier consumption
    let formattedData = data;
    if (data.data && data.data.children) {
      formattedData = {
        posts: data.data.children.map((post: any) => ({
          id: post.data.id,
          title: post.data.title,
          author: post.data.author,
          subreddit: post.data.subreddit,
          score: post.data.score,
          upvote_ratio: post.data.upvote_ratio,
          num_comments: post.data.num_comments,
          created_utc: post.data.created_utc,
          url: post.data.url,
          permalink: post.data.permalink,
          selftext: post.data.selftext,
          is_self: post.data.is_self,
          thumbnail: post.data.thumbnail,
          domain: post.data.domain,
          gilded: post.data.gilded,
          stickied: post.data.stickied,
          over_18: post.data.over_18,
        })),
        after: data.data.after,
        before: data.data.before,
      };
    }

    return new Response(
      JSON.stringify({
        success: true,
        action,
        data: formattedData,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      },
    );
  } catch (error) {
    console.error("Error fetching Reddit posts:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    return new Response(
      JSON.stringify({
        success: false,
        error: "Failed to fetch Reddit posts",
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

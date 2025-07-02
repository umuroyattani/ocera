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
    const { action, post_id, comment_id, text, parent_id } = await req.json();

    if (!action) {
      return new Response(JSON.stringify({ error: "Action is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
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

    let endpoint = "";
    let method = "GET";
    let body = null;

    switch (action) {
      case "get_comments":
        if (!post_id) {
          return new Response(
            JSON.stringify({ error: "Post ID required for getting comments" }),
            {
              status: 400,
              headers: { ...corsHeaders, "Content-Type": "application/json" },
            },
          );
        }
        endpoint = `https://oauth.reddit.com/comments/${post_id}`;
        break;
      case "add_comment":
        if (!text || (!post_id && !comment_id)) {
          return new Response(
            JSON.stringify({
              error:
                "Text and either post_id or comment_id required for adding comment",
            }),
            {
              status: 400,
              headers: { ...corsHeaders, "Content-Type": "application/json" },
            },
          );
        }
        endpoint = "https://oauth.reddit.com/api/comment";
        method = "POST";
        body = new URLSearchParams({
          api_type: "json",
          text: text,
          thing_id: parent_id || post_id || comment_id,
        });
        break;
      case "edit_comment":
        if (!comment_id || !text) {
          return new Response(
            JSON.stringify({
              error: "Comment ID and text required for editing comment",
            }),
            {
              status: 400,
              headers: { ...corsHeaders, "Content-Type": "application/json" },
            },
          );
        }
        endpoint = "https://oauth.reddit.com/api/editusertext";
        method = "POST";
        body = new URLSearchParams({
          api_type: "json",
          text: text,
          thing_id: comment_id,
        });
        break;
      case "delete_comment":
        if (!comment_id) {
          return new Response(
            JSON.stringify({
              error: "Comment ID required for deleting comment",
            }),
            {
              status: 400,
              headers: { ...corsHeaders, "Content-Type": "application/json" },
            },
          );
        }
        endpoint = "https://oauth.reddit.com/api/del";
        method = "POST";
        body = new URLSearchParams({
          id: comment_id,
        });
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

    // Check for Reddit API errors in the response
    if (data.json?.errors && data.json.errors.length > 0) {
      const error = data.json.errors[0];
      throw new Error(`Reddit error: ${error[1] || error[0]}`);
    }

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
    console.error("Error with Reddit comment operation:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    return new Response(
      JSON.stringify({
        success: false,
        error: "Failed to perform comment operation",
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

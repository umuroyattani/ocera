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
      action,
      to,
      subject,
      text,
      message_id,
      mark_read = true,
    } = await req.json();

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
      case "inbox":
        endpoint = "https://oauth.reddit.com/message/inbox";
        break;
      case "unread":
        endpoint = "https://oauth.reddit.com/message/unread";
        break;
      case "sent":
        endpoint = "https://oauth.reddit.com/message/sent";
        break;
      case "compose":
        if (!to || !subject || !text) {
          return new Response(
            JSON.stringify({
              error: "to, subject, and text are required for composing message",
            }),
            {
              status: 400,
              headers: { ...corsHeaders, "Content-Type": "application/json" },
            },
          );
        }
        endpoint = "https://oauth.reddit.com/api/compose";
        method = "POST";
        body = new URLSearchParams({
          api_type: "json",
          to: to,
          subject: subject,
          text: text,
        });
        break;
      case "mark_read":
        if (!message_id) {
          return new Response(
            JSON.stringify({
              error: "message_id is required for marking as read",
            }),
            {
              status: 400,
              headers: { ...corsHeaders, "Content-Type": "application/json" },
            },
          );
        }
        endpoint = "https://oauth.reddit.com/api/read_message";
        method = "POST";
        body = new URLSearchParams({
          id: message_id,
        });
        break;
      case "mark_unread":
        if (!message_id) {
          return new Response(
            JSON.stringify({
              error: "message_id is required for marking as unread",
            }),
            {
              status: 400,
              headers: { ...corsHeaders, "Content-Type": "application/json" },
            },
          );
        }
        endpoint = "https://oauth.reddit.com/api/unread_message";
        method = "POST";
        body = new URLSearchParams({
          id: message_id,
        });
        break;
      case "block_user":
        if (!message_id) {
          return new Response(
            JSON.stringify({
              error: "message_id is required for blocking user",
            }),
            {
              status: 400,
              headers: { ...corsHeaders, "Content-Type": "application/json" },
            },
          );
        }
        endpoint = "https://oauth.reddit.com/api/block";
        method = "POST";
        body = new URLSearchParams({
          id: message_id,
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

    // Format messages for easier consumption
    let formattedData = data;
    if (
      data.data &&
      data.data.children &&
      ["inbox", "unread", "sent"].includes(action)
    ) {
      formattedData = {
        messages: data.data.children.map((msg: any) => ({
          id: msg.data.id,
          name: msg.data.name,
          author: msg.data.author,
          dest: msg.data.dest,
          subject: msg.data.subject,
          body: msg.data.body,
          body_html: msg.data.body_html,
          created_utc: msg.data.created_utc,
          new: msg.data.new,
          was_comment: msg.data.was_comment,
          context: msg.data.context,
          subreddit: msg.data.subreddit,
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
    console.error("Error with Reddit message operation:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    return new Response(
      JSON.stringify({
        success: false,
        error: "Failed to perform message operation",
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

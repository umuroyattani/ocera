import { corsHeaders } from "@shared/cors.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const code = url.searchParams.get("code");
    const state = url.searchParams.get("state");
    const error = url.searchParams.get("error");

    if (error) {
      return new Response(
        `<html><body><h1>Reddit Authorization Failed</h1><p>Error: ${error}</p><script>setTimeout(() => window.close(), 3000);</script></body></html>`,
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "text/html" },
        },
      );
    }

    if (!code) {
      return new Response(
        `<html><body><h1>Reddit Authorization Failed</h1><p>No authorization code received.</p><script>setTimeout(() => window.close(), 3000);</script></body></html>`,
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "text/html" },
        },
      );
    }

    // Get PICA keys
    const picaConnectionKey = Deno.env.get("PICA_REDDIT_CONNECTION_KEY");
    const picaSecretKey = Deno.env.get("PICA_SECRET_KEY");

    if (!picaConnectionKey || !picaSecretKey) {
      return new Response(
        `<html><body><h1>Configuration Error</h1><p>Reddit integration not properly configured.</p><script>setTimeout(() => window.close(), 3000);</script></body></html>`,
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "text/html" },
        },
      );
    }

    // Exchange code for access token using PICA
    const tokenResponse = await fetch(
      "https://pica.new/api/v1/reddit/oauth/token",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${picaSecretKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          connection_key: picaConnectionKey,
          code: code,
          state: state,
        }),
      },
    );

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.json().catch(() => ({}));
      console.error("PICA token exchange error:", errorData);
      return new Response(
        `<html><body><h1>Token Exchange Failed</h1><p>Failed to exchange authorization code for access token.</p><script>setTimeout(() => window.close(), 3000);</script></body></html>`,
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "text/html" },
        },
      );
    }

    const tokenData = await tokenResponse.json();
    const userId = tokenData.user_id;

    if (!userId) {
      return new Response(
        `<html><body><h1>User ID Missing</h1><p>No user ID found in token response.</p><script>setTimeout(() => window.close(), 3000);</script></body></html>`,
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "text/html" },
        },
      );
    }

    // Store Reddit connection in database
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_KEY") ?? "",
    );

    const { error: dbError } = await supabase
      .from("users")
      .update({
        reddit_connected: true,
        reddit_access_token: tokenData.access_token,
        reddit_refresh_token: tokenData.refresh_token,
        reddit_username: tokenData.reddit_username,
        updated_at: new Date().toISOString(),
      })
      .eq("id", userId);

    if (dbError) {
      console.error("Database update error:", dbError);
      return new Response(
        `<html><body><h1>Database Error</h1><p>Failed to save Reddit connection.</p><script>setTimeout(() => window.close(), 3000);</script></body></html>`,
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "text/html" },
        },
      );
    }

    return new Response(
      `<html><body><h1>Reddit Connected Successfully!</h1><p>Your Reddit account has been connected. Redirecting...</p><script>setTimeout(() => { window.opener?.location.reload(); window.close(); }, 2000);</script></body></html>`,
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "text/html" },
      },
    );
  } catch (error) {
    console.error("Reddit callback error:", error);
    return new Response(
      `<html><body><h1>Error</h1><p>An error occurred processing Reddit authorization.</p><script>setTimeout(() => window.close(), 3000);</script></body></html>`,
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "text/html" },
      },
    );
  }
});

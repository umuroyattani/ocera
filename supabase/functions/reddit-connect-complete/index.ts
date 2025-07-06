import { corsHeaders } from "@shared/cors.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { username, userId } = await req.json();

    if (!username || !userId) {
      return new Response(
        JSON.stringify({ error: "Username and userId are required" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    // Use PICA passthrough for Reddit connection completion
    const PICA_SECRET_KEY = Deno.env.get("PICA_SECRET_KEY");
    const PICA_SUPABASE_CONNECTION_KEY = Deno.env.get(
      "PICA_SUPABASE_CONNECTION_KEY",
    );
    const ACTION_ID = "reddit-connect-complete";

    if (!PICA_SECRET_KEY || !PICA_SUPABASE_CONNECTION_KEY) {
      throw new Error("Missing Pica configuration");
    }

    // Use Pica passthrough endpoint for Reddit connection completion
    const response = await fetch(
      "https://api.picaos.com/v1/passthrough/supabase/functions/reddit-connect-complete/index.ts",
      {
        method: "POST",
        headers: {
          "x-pica-secret": PICA_SECRET_KEY,
          "x-pica-connection-key": PICA_SUPABASE_CONNECTION_KEY,
          "x-pica-action-id": ACTION_ID,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
          userId: userId,
        }),
      },
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Pica passthrough error:", errorText);
      throw new Error("Failed to complete Reddit connection via Pica");
    }

    const data = await response.json();
    console.log("Pica response:", data);

    if (data.success) {
      // Also update our local database
      const supabase = createClient(
        Deno.env.get("SUPABASE_URL") ?? "",
        Deno.env.get("SUPABASE_SERVICE_KEY") ?? "",
      );

      const { error: updateError } = await supabase
        .from("users")
        .update({
          reddit_connected: true,
          reddit_username: username,
          updated_at: new Date().toISOString(),
        })
        .eq("id", userId);

      if (updateError) {
        console.error("Local database update error:", updateError);
        // Don't fail the request, just log the error
      }

      return new Response(
        JSON.stringify({
          success: true,
          message: "Reddit account connected successfully",
          username: username,
        }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    } else {
      throw new Error(data.error || "Reddit connection completion failed");
    }
  } catch (error) {
    console.error("Reddit connect complete error:", error);
    return new Response(
      JSON.stringify({
        error: "Failed to complete Reddit connection",
        details: error.message,
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }
});

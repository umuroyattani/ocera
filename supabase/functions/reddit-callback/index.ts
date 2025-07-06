import { corsHeaders } from "@shared/cors.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { code, state, error } = await req.json();

    console.log("Reddit callback received:", { code: !!code, state, error });

    if (error) {
      console.error("Reddit OAuth error:", error);
      return new Response(
        JSON.stringify({
          success: false,
          error: `Reddit OAuth error: ${error}`,
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    if (!code || !state) {
      console.error("Missing code or state parameter");
      return new Response(
        JSON.stringify({
          success: false,
          error: "Missing required parameters",
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    // Extract user ID from state parameter
    const userId = state.split("_")[0];
    if (!userId) {
      throw new Error("Invalid state parameter - no user ID found");
    }

    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_KEY") ?? "",
    );

    // For demo purposes, we'll simulate a successful Reddit connection
    // In a real implementation, you would exchange the code for tokens here
    console.log("Simulating Reddit OAuth exchange for demo purposes");

    // Update user record to mark Reddit as connected
    const { error: updateError } = await supabase
      .from("users")
      .update({
        reddit_connected: true,
        reddit_username: "demo_user",
        reddit_access_token: "demo_token",
        updated_at: new Date().toISOString(),
      })
      .eq("id", userId);

    if (updateError) {
      console.error("Database update error:", updateError);
      throw new Error("Failed to update user Reddit connection status");
    }

    console.log(`Successfully connected Reddit for user ${userId}`);

    return new Response(
      JSON.stringify({
        success: true,
        message: "Reddit account connected successfully",
        username: "demo_user",
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  } catch (error) {
    console.error("Reddit callback error:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || "Unknown error occurred",
        timestamp: new Date().toISOString(),
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }
});

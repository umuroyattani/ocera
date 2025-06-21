import { corsHeaders } from "@shared/cors.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { code, state } = await req.json();

    const PICA_SECRET_KEY = Deno.env.get("PICA_SECRET_KEY");
    const PICA_SUPABASE_CONNECTION_KEY = Deno.env.get(
      "PICA_SUPABASE_CONNECTION_KEY",
    );
    const ACTION_ID = "reddit-oauth-exchange";

    if (!PICA_SECRET_KEY || !PICA_SUPABASE_CONNECTION_KEY) {
      throw new Error("Missing Pica configuration");
    }

    // Use Pica passthrough endpoint for Reddit OAuth
    const response = await fetch(
      "https://api.picaos.com/v1/passthrough/supabase/functions/reddit-auth/index.ts",
      {
        method: "POST",
        headers: {
          "x-pica-secret": PICA_SECRET_KEY,
          "x-pica-connection-key": PICA_SUPABASE_CONNECTION_KEY,
          "x-pica-action-id": ACTION_ID,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code: code,
          state: state,
        }),
      },
    );

    if (!response.ok) {
      throw new Error("Failed to authenticate with Reddit via Pica");
    }

    const data = await response.json();

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Reddit auth error:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      },
    );
  }
});

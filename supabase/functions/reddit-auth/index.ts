import { corsHeaders } from "@shared/cors.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { code, state } = await req.json();

    console.log("Reddit auth function called with:", {
      hasCode: !!code,
      hasState: !!state,
      state: state,
    });

    if (!code || !state) {
      console.error("Missing required parameters:", {
        code: !!code,
        state: !!state,
      });
      throw new Error("Missing code or state parameter");
    }

    const PICA_SECRET_KEY = Deno.env.get("PICA_SECRET_KEY");
    const PICA_SUPABASE_CONNECTION_KEY = Deno.env.get(
      "PICA_SUPABASE_CONNECTION_KEY",
    );
    const ACTION_ID = "reddit-oauth-exchange";

    if (!PICA_SECRET_KEY || !PICA_SUPABASE_CONNECTION_KEY) {
      console.error("Missing Pica configuration");
      throw new Error("Missing Pica configuration");
    }

    // Use Pica passthrough endpoint for Reddit OAuth
    const response = await fetch(
      "https://api.picaos.com/v1/passthrough/api/reddit/oauth/exchange",
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
      const errorText = await response.text();
      console.error("Pica API error:", {
        status: response.status,
        statusText: response.statusText,
        errorText,
      });
      throw new Error(
        `Failed to authenticate with Reddit via Pica: ${response.status} ${errorText}`,
      );
    }

    const data = await response.json();
    console.log("Pica response received:", {
      success: data.success,
      hasData: !!data,
    });

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Reddit auth error:", {
      message: error.message,
      stack: error.stack,
      name: error.name,
    });
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || "Unknown error occurred",
        timestamp: new Date().toISOString(),
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      },
    );
  }
});

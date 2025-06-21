import { corsHeaders } from "@shared/cors.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { plan, userId } = await req.json();

    if (!plan || !userId) {
      return new Response(
        JSON.stringify({ error: "Plan and userId are required" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    // Call Pica passthrough endpoint
    const response = await fetch(
      "https://api.picaos.com/v1/passthrough/api/lemonsqueezy/checkout",
      {
        method: "POST",
        headers: {
          "x-pica-secret": Deno.env.get("PICA_SECRET_KEY")!,
          "x-pica-connection-key": Deno.env.get(
            "PICA_SUPABASE_CONNECTION_KEY",
          )!,
          "x-pica-action-id": "lemonsqueezy-checkout",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ plan, userId }),
      },
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Pica API error:", errorData);
      return new Response(
        JSON.stringify({ error: "Failed to create checkout session" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    const data = await response.json();

    return new Response(
      JSON.stringify({ success: true, checkoutUrl: data.checkoutUrl }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  } catch (error) {
    console.error("Checkout creation error:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

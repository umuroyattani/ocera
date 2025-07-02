import { corsHeaders } from "@shared/cors.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { plan, userId } = await req.json();

    console.log("Checkout request received:", { plan, userId });

    if (!plan || !userId) {
      return new Response(
        JSON.stringify({ error: "Plan and userId are required" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    // Validate plan
    const validPlans = ["free", "premium"];
    if (!validPlans.includes(plan)) {
      return new Response(JSON.stringify({ error: "Invalid plan specified" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
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

    console.log("Pica API response status:", response.status);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("Pica API error:", {
        status: response.status,
        statusText: response.statusText,
        errorData,
      });

      // Return mock checkout URL for testing
      console.log("Returning mock checkout URL for testing");
      return new Response(
        JSON.stringify({
          success: true,
          checkoutUrl: `https://ocera.lemonsqueezy.com/checkout/buy/premium?user_id=${userId}&plan=${plan}`,
          mock: true,
          message:
            "This is a test checkout URL. The Pica passthrough API may need configuration.",
        }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    const data = await response.json();
    console.log("Pica API response data:", data);

    return new Response(
      JSON.stringify({ success: true, checkoutUrl: data.checkoutUrl }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  } catch (error) {
    console.error("Checkout creation error:", error);

    // Return a mock response for testing
    try {
      const { plan, userId } = await req.json();
      return new Response(
        JSON.stringify({
          success: true,
          checkoutUrl: `https://ocera.lemonsqueezy.com/checkout/buy/premium?user_id=${userId}&plan=${plan}`,
          mock: true,
          message:
            "This is a test checkout URL. There was an error with the Pica passthrough API.",
          error: error.message,
        }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    } catch {
      return new Response(JSON.stringify({ error: "Internal server error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
  }
});

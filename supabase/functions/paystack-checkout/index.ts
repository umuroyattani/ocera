import { corsHeaders } from "@shared/cors.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { plan, userId, email } = await req.json();

    console.log("Paystack checkout request received:", { plan, userId, email });

    if (!plan || !userId || !email) {
      return new Response(
        JSON.stringify({ error: "Plan, userId, and email are required" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    // Get Paystack secret key from environment
    const paystackSecretKey = Deno.env.get("PAYSTACK_SECRET_KEY");
    if (!paystackSecretKey) {
      console.error("PAYSTACK_SECRET_KEY not found in environment");
      return new Response(
        JSON.stringify({ error: "Payment service not configured" }),
        {
          status: 500,
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

    // Get plan details
    const planDetails = {
      premium: {
        amount: 10.0, // $10.00 in dollars
        currency: "USD",
        name: "Premium Plan",
      },
    };

    const selectedPlan = planDetails[plan as keyof typeof planDetails];
    if (!selectedPlan) {
      return new Response(JSON.stringify({ error: "Plan not found" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Get the base URL for callback
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const callbackUrl = `${supabaseUrl?.replace("/rest/v1", "")}/functions/v1/supabase-functions-paystack-callback`;

    console.log("Using callback URL:", callbackUrl);

    // Initialize Paystack transaction
    const paystackResponse = await fetch(
      "https://api.paystack.co/transaction/initialize",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${paystackSecretKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          amount: Math.round(selectedPlan.amount * 100), // Convert to kobo/cents (10.00 * 100 = 1000 kobo = $10)
          currency: selectedPlan.currency,
          callback_url: callbackUrl,
          metadata: {
            userId: userId,
            plan: plan,
            planName: selectedPlan.name,
          },
          channels: [
            "card",
            "bank",
            "ussd",
            "qr",
            "mobile_money",
            "bank_transfer",
          ],
        }),
      },
    );

    console.log("Paystack API response status:", paystackResponse.status);

    if (!paystackResponse.ok) {
      const errorData = await paystackResponse.json().catch(() => ({}));
      console.error("Paystack API error:", {
        status: paystackResponse.status,
        statusText: paystackResponse.statusText,
        errorData,
      });

      return new Response(
        JSON.stringify({
          error: "Failed to initialize payment",
          details: errorData.message || "Unknown error",
        }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    const data = await paystackResponse.json();
    console.log("Paystack API response data:", data);

    if (!data.status || !data.data?.authorization_url) {
      return new Response(
        JSON.stringify({
          error: "Invalid response from Paystack",
          details: data.message || "No authorization URL received",
        }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        checkoutUrl: data.data.authorization_url,
        reference: data.data.reference,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  } catch (error) {
    console.error("Checkout creation error:", error);
    return new Response(
      JSON.stringify({
        error: "Internal server error",
        details: error.message,
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }
});

import { corsHeaders } from "@shared/cors.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const body = await req.text();
    const signature = req.headers.get("x-signature");

    // Call Pica passthrough endpoint for webhook processing
    const response = await fetch(
      "https://api.picaos.com/v1/passthrough/api/lemonsqueezy/webhook",
      {
        method: "POST",
        headers: {
          "x-pica-secret": Deno.env.get("PICA_SECRET_KEY")!,
          "x-pica-connection-key": Deno.env.get(
            "PICA_SUPABASE_CONNECTION_KEY",
          )!,
          "x-pica-action-id": "lemonsqueezy-webhook",
          "Content-Type": "application/json",
          "x-signature": signature || "",
        },
        body: body,
      },
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Pica webhook API error:", errorData);
      return new Response(
        JSON.stringify({ error: "Webhook processing failed" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    const webhookData = await response.json();

    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    );

    // Process webhook data if needed
    if (webhookData.userId && webhookData.plan) {
      const { error } = await supabase
        .from("users")
        .update({
          subscription_plan: webhookData.plan,
          subscription_status: webhookData.status || "active",
          updated_at: new Date().toISOString(),
        })
        .eq("id", webhookData.userId);

      if (error) {
        console.error("Database update error:", error);
      }
    }

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Webhook processing error:", error);
    return new Response(
      JSON.stringify({ error: "Webhook processing failed" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }
});

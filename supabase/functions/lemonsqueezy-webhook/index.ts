import { corsHeaders } from "@shared/cors.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Function to verify Paystack webhook signature
async function verifyPaystackSignature(
  body: string,
  signature: string,
  secret: string,
): Promise<boolean> {
  if (!signature || !secret) {
    return false;
  }

  try {
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      "raw",
      encoder.encode(secret),
      { name: "HMAC", hash: "SHA-512" },
      false,
      ["sign"],
    );

    const expectedSignature = await crypto.subtle.sign(
      "HMAC",
      key,
      encoder.encode(body),
    );

    const expectedHex = Array.from(new Uint8Array(expectedSignature))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");

    return signature === expectedHex;
  } catch (error) {
    console.error("Signature verification error:", error);
    return false;
  }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const body = await req.text();
    const signature = req.headers.get("x-paystack-signature");
    const webhookSecret = Deno.env.get("PAYSTACK_SECRET_KEY");

    console.log("Paystack webhook received:", {
      method: req.method,
      hasSignature: !!signature,
      bodyLength: body.length,
      hasSecret: !!webhookSecret,
    });

    // Verify webhook signature
    if (webhookSecret && signature) {
      const isValid = await verifyPaystackSignature(
        body,
        signature,
        webhookSecret,
      );
      if (!isValid) {
        console.error("Invalid webhook signature");
        return new Response(JSON.stringify({ error: "Invalid signature" }), {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      console.log("Webhook signature verified successfully");
    } else {
      console.warn(
        "Webhook signature verification skipped - missing secret or signature",
      );
    }

    const webhookData = JSON.parse(body);
    console.log("Webhook data:", webhookData);

    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_KEY") ?? "",
    );

    // Process different webhook events
    const event = webhookData.event;
    const data = webhookData.data;

    if (!event || !data) {
      console.error("Invalid webhook data structure");
      return new Response(JSON.stringify({ error: "Invalid webhook data" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Extract user information from metadata
    const metadata = data.metadata || {};
    const userId = metadata.userId;
    const plan = metadata.plan || "premium";

    if (!userId) {
      console.error("No userId found in webhook metadata");
      return new Response(JSON.stringify({ error: "No userId in metadata" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    let updateData: any = {
      updated_at: new Date().toISOString(),
    };

    switch (event) {
      case "charge.success":
        // Payment successful - activate subscription
        const expirationDate = new Date();
        expirationDate.setMonth(expirationDate.getMonth() + 1);

        updateData = {
          ...updateData,
          subscription_plan: plan,
          subscription_status: "active",
          subscription_id: data.reference,
          subscription_expires_at: expirationDate.toISOString(),
        };
        console.log(
          `Payment successful for user ${userId}, activating ${plan} plan`,
        );
        break;

      case "subscription.create":
      case "subscription.enable":
        // Subscription created or enabled
        const subscriptionExpirationDate = new Date();
        subscriptionExpirationDate.setMonth(
          subscriptionExpirationDate.getMonth() + 1,
        );

        updateData = {
          ...updateData,
          subscription_plan: plan,
          subscription_status: "active",
          subscription_id: data.subscription_code || data.id,
          subscription_expires_at: subscriptionExpirationDate.toISOString(),
        };
        console.log(`Subscription activated for user ${userId}`);
        break;

      case "subscription.disable":
      case "subscription.not_renew":
        // Subscription cancelled or not renewed
        updateData = {
          ...updateData,
          subscription_status: "cancelled",
          subscription_plan: "free",
        };
        console.log(`Subscription cancelled for user ${userId}`);
        break;

      case "invoice.payment_failed":
        // Payment failed - handle accordingly
        updateData = {
          ...updateData,
          subscription_status: "past_due",
        };
        console.log(`Payment failed for user ${userId}`);
        break;

      default:
        console.log(`Unhandled webhook event: ${event}`);
        return new Response(JSON.stringify({ received: true }), {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
    }

    // Update user subscription in database
    const { error } = await supabase
      .from("users")
      .update(updateData)
      .eq("id", userId);

    if (error) {
      console.error("Database update error:", error);
      return new Response(JSON.stringify({ error: "Database update failed" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log(`Successfully processed ${event} for user ${userId}`);

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Webhook processing error:", error);
    return new Response(
      JSON.stringify({
        error: "Webhook processing failed",
        details: error.message,
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }
});

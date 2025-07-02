import { corsHeaders } from "@shared/cors.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const reference = url.searchParams.get("reference");
    const trxref = url.searchParams.get("trxref");

    console.log("Paystack callback received:", { reference, trxref });

    if (!reference && !trxref) {
      return new Response(
        `<html><body><h1>Payment Error</h1><p>No transaction reference found.</p><script>window.close();</script></body></html>`,
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "text/html" },
        },
      );
    }

    const transactionRef = reference || trxref;
    const paystackSecretKey = Deno.env.get("PAYSTACK_SECRET_KEY");

    if (!paystackSecretKey) {
      console.error("PAYSTACK_SECRET_KEY not found in environment");
      return new Response(
        `<html><body><h1>Configuration Error</h1><p>Payment service not properly configured.</p><script>setTimeout(() => window.close(), 3000);</script></body></html>`,
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "text/html" },
        },
      );
    }

    // Verify the transaction with Paystack
    const verifyResponse = await fetch(
      `https://api.paystack.co/transaction/verify/${transactionRef}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${paystackSecretKey}`,
          "Content-Type": "application/json",
        },
      },
    );

    if (!verifyResponse.ok) {
      console.error("Failed to verify transaction:", verifyResponse.status);
      return new Response(
        `<html><body><h1>Payment Verification Failed</h1><p>Unable to verify your payment. Please contact support.</p><script>setTimeout(() => window.close(), 3000);</script></body></html>`,
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "text/html" },
        },
      );
    }

    const verificationData = await verifyResponse.json();
    console.log("Transaction verification:", verificationData);

    if (verificationData.status && verificationData.data.status === "success") {
      // Update user subscription in database
      const metadata = verificationData.data.metadata || {};
      const userId = metadata.userId;
      const plan = metadata.plan || "premium";

      if (userId) {
        const supabase = createClient(
          Deno.env.get("SUPABASE_URL") ?? "",
          Deno.env.get("SUPABASE_SERVICE_KEY") ?? "",
        );

        // Calculate subscription expiration (1 month from now)
        const expirationDate = new Date();
        expirationDate.setMonth(expirationDate.getMonth() + 1);

        const { error } = await supabase
          .from("users")
          .update({
            subscription_plan: plan,
            subscription_status: "active",
            subscription_id: verificationData.data.reference,
            subscription_expires_at: expirationDate.toISOString(),
            updated_at: new Date().toISOString(),
          })
          .eq("id", userId);

        if (error) {
          console.error("Database update error:", error);
        } else {
          console.log(`Successfully updated subscription for user ${userId}`);
        }
      }

      // Payment successful - redirect to success page
      return new Response(
        `<html><body><h1>Payment Successful!</h1><p>Your subscription has been activated. Redirecting...</p><script>setTimeout(() => { window.opener?.location.reload(); window.close(); }, 2000);</script></body></html>`,
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "text/html" },
        },
      );
    } else {
      // Payment failed
      return new Response(
        `<html><body><h1>Payment Failed</h1><p>Your payment was not successful. Please try again.</p><script>setTimeout(() => window.close(), 3000);</script></body></html>`,
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "text/html" },
        },
      );
    }
  } catch (error) {
    console.error("Callback processing error:", error);
    return new Response(
      `<html><body><h1>Error</h1><p>An error occurred processing your payment. Please contact support.</p><script>setTimeout(() => window.close(), 3000);</script></body></html>`,
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "text/html" },
      },
    );
  }
});

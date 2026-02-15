import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // Authenticate the caller
  const authHeader = req.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 401,
    });
  }

  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_ANON_KEY") ?? ""
  );

  const token = authHeader.replace("Bearer ", "");
  const { data: claimsData, error: claimsError } = await supabaseClient.auth.getClaims(token);
  if (claimsError || !claimsData?.claims) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 401,
    });
  }

  const userId = claimsData.claims.sub as string;

  const supabaseAdmin = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    { auth: { persistSession: false } }
  );

  try {
    const { session_id, order_id } = await req.json();

    if (!session_id || typeof session_id !== "string") {
      throw new Error("Valid session_id is required");
    }

    // Initialize Stripe
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2025-08-27.basil",
    });

    // Retrieve the checkout session
    const session = await stripe.checkout.sessions.retrieve(session_id);

    // Verify the session belongs to this user via metadata
    if (session.metadata?.user_id && session.metadata.user_id !== userId) {
      return new Response(JSON.stringify({ error: "Forbidden" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 403,
      });
    }

    if (session.payment_status === "paid") {
      // Update order status if order_id is provided
      if (order_id) {
        // Verify order belongs to the authenticated user
        const { data: order } = await supabaseAdmin
          .from("orders")
          .select("user_id")
          .eq("id", order_id)
          .single();

        if (!order || order.user_id !== userId) {
          return new Response(JSON.stringify({ error: "Forbidden" }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 403,
          });
        }

        const { error: orderError } = await supabaseAdmin
          .from("orders")
          .update({ status: "payment_approved" })
          .eq("id", order_id);

        if (orderError) {
          console.error("Error updating order:", orderError);
        }

        // Update payment record
        const { error: paymentError } = await supabaseAdmin
          .from("payments")
          .update({
            status: "approved",
            external_id: session.payment_intent as string,
            paid_at: new Date().toISOString(),
          })
          .eq("order_id", order_id);

        if (paymentError) {
          console.error("Error updating payment:", paymentError);
        }
      }

      return new Response(
        JSON.stringify({
          success: true,
          payment_status: session.payment_status,
          customer_email: session.customer_details?.email,
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        }
      );
    }

    return new Response(
      JSON.stringify({
        success: false,
        payment_status: session.payment_status,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Verify payment error:", error);
    return new Response(JSON.stringify({ error: "Payment verification failed" }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});

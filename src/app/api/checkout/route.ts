import { NextResponse } from "next/server";
import { checkoutRequestSchema } from "@/lib/validation";
import { getStripeClient } from "@/lib/stripe";
import { getSiteUrl, hasStripeSecrets } from "@/lib/env";
import { buildOrderSnapshotItems, buildStripeLineItems, buildMetadataPayload, generateOrderNumber, calculateSnapshotSubtotal } from "@/lib/orders";
import { insertOrder, insertOrderItems, upsertCustomer } from "@/lib/db";
import { buildAdminOrderNotificationEmail, buildOrderConfirmationEmail } from "@/lib/email";
import { getAdminNotificationEmail } from "@/lib/env";
import { sendEmail } from "@/lib/mailer";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = checkoutRequestSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "入力を確認してください。" },
      { status: 400 }
    );
  }

  const payload = parsed.data;
  const interval = payload.mode === "subscription" ? payload.interval || "one_month" : undefined;
  const snapshotItems = buildOrderSnapshotItems({
    items: payload.items,
    mode: payload.mode,
    interval,
  });
  const subtotal = calculateSnapshotSubtotal(snapshotItems);

  if (!hasStripeSecrets()) {
    const orderNumber = generateOrderNumber("DEMO");
    const customer = payload.email
      ? await upsertCustomer({
          email: payload.email,
          name: payload.name || null,
          stripeCustomerId: null,
        })
      : null;

    const order = await insertOrder({
      orderNumber,
      customerId: customer?.id || null,
      customerEmail: payload.email || "demo@example.com",
      customerName: payload.name || null,
      mode: payload.mode,
      interval,
      status: "confirmed",
      fulfillmentStatus: "unshipped",
      paymentStatus: "demo",
      subtotalAmount: subtotal,
      totalAmount: subtotal,
      stripeCheckoutSessionId: `demo_${orderNumber}`,
      metadata: {
        source: payload.source || "demo",
        demo: true,
      },
    });

    if (order) {
      await insertOrderItems(order.id, snapshotItems);

      const customerEmail = payload.email || "demo@example.com";
      const adminEmail = getAdminNotificationEmail();
      const orderUrl = `${getSiteUrl()}/checkout/success?demo=1&order=${orderNumber}`;

      const purchaseEmail = buildOrderConfirmationEmail({
        customerName: payload.name || "お客様",
        orderNumber,
        items: snapshotItems.map((item) => ({
          name: item.productName,
          label: item.variantLabel,
          quantity: item.quantity,
        })),
        totalAmount: subtotal,
        orderUrl,
      });
      const adminNotification = buildAdminOrderNotificationEmail({
        orderNumber,
        customerEmail,
        customerName: payload.name || "お客様",
        totalAmount: subtotal,
        mode: payload.mode,
        createdAt: new Date().toISOString(),
      });

      await Promise.all([
        sendEmail({
          to: customerEmail,
          subject: purchaseEmail.subject,
          html: purchaseEmail.html,
          text: purchaseEmail.text,
        }),
        adminEmail
          ? sendEmail({
              to: adminEmail,
              subject: adminNotification.subject,
              html: adminNotification.html,
              text: adminNotification.text,
            })
          : Promise.resolve(null),
      ]);
    }

    return NextResponse.json({
      url: `${getSiteUrl()}/checkout/success?demo=1&order=${orderNumber}`,
    });
  }

  const stripe = getStripeClient();

  if (!stripe) {
    return NextResponse.json(
      { error: "Stripe の初期化に失敗しました。" },
      { status: 500 }
    );
  }

  try {
    const lineItems = buildStripeLineItems({
      items: payload.items,
      mode: payload.mode,
      interval,
    });
    const metadata = buildMetadataPayload({
      items: payload.items,
      mode: payload.mode,
      interval,
      source: payload.source,
    });

    const session = await stripe.checkout.sessions.create({
      mode: payload.mode === "subscription" ? "subscription" : "payment",
      line_items: lineItems,
      customer_email: payload.email || undefined,
      success_url: `${getSiteUrl()}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${getSiteUrl()}/cart`,
      allow_promotion_codes: true,
      shipping_address_collection: {
        allowed_countries: ["JP"],
      },
      billing_address_collection: "required",
      locale: "ja",
      metadata,
      subscription_data:
        payload.mode === "subscription"
          ? {
              metadata,
            }
          : undefined,
      payment_intent_data:
        payload.mode === "one_time"
          ? {
              metadata,
            }
          : undefined,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Stripe checkout の作成に失敗しました。",
      },
      { status: 400 }
    );
  }
}

import Stripe from "stripe";
import { NextResponse } from "next/server";
import { getStripeClient } from "@/lib/stripe";
import { getStripeWebhookSecret, getSiteUrl, getAdminNotificationEmail } from "@/lib/env";
import {
  calculateSnapshotSubtotal,
  buildOrderSnapshotItems,
  generateOrderNumber,
} from "@/lib/orders";
import {
  claimWebhookEvent,
  createRenewalOrder,
  getOrderByStripeSessionId,
  getOrderByStripeSubscriptionId,
  getSubscriptionContractByStripeSubscriptionId,
  insertOrder,
  insertOrderItems,
  releaseWebhookEvent,
  upsertCustomer,
  upsertSubscriptionContract,
} from "@/lib/db";
import {
  buildAdminOrderNotificationEmail,
  buildOrderConfirmationEmail,
} from "@/lib/email";
import { sendEmail } from "@/lib/mailer";
import type { OrderSnapshotItem } from "@/lib/db";

type SubscriptionWithCurrentPeriodEnd = Stripe.Subscription & {
  current_period_end: number;
};

function getSubscriptionId(
  subscription: string | Stripe.Subscription | null | undefined
) {
  if (!subscription) {
    return null;
  }

  return typeof subscription === "string" ? subscription : subscription.id;
}

function getSubscriptionCurrentPeriodEnd(
  subscription: Stripe.Subscription | SubscriptionWithCurrentPeriodEnd
) {
  const typed = subscription as SubscriptionWithCurrentPeriodEnd;
  return typed.current_period_end;
}

export const runtime = "nodejs";

function parseMetadataItems(value: string | undefined) {
  if (!value) {
    return [];
  }

  try {
    return JSON.parse(value) as Array<{
      productSlug: string;
      variantSlug: string;
      quantity: number;
    }>;
  } catch {
    return [];
  }
}

async function handleCheckoutCompleted(
  stripe: Stripe,
  session: Stripe.Checkout.Session
) {
  const mode = session.metadata?.mode === "subscription" ? "subscription" : "one_time";
  const interval =
    session.metadata?.interval === "two_weeks" ? "two_weeks" : "one_month";
  const items = parseMetadataItems(session.metadata?.items);
  const snapshotItems = buildOrderSnapshotItems({
    items,
    mode,
    interval: mode === "subscription" ? interval : undefined,
  });
  const subtotal = calculateSnapshotSubtotal(snapshotItems);
  const customerEmail =
    session.customer_details?.email || session.customer_email || "";
  const customerName = session.customer_details?.name || null;

  const customer = customerEmail
    ? await upsertCustomer({
        email: customerEmail,
        name: customerName,
        stripeCustomerId:
          typeof session.customer === "string" ? session.customer : null,
      })
    : null;

  const existing = await getOrderByStripeSessionId(session.id);

  if (existing) {
    return;
  }

  const orderNumber = generateOrderNumber();
  const order = await insertOrder({
    orderNumber,
    customerId: customer?.id || null,
    customerEmail: customerEmail || "unknown@example.com",
    customerName,
    mode,
    interval: mode === "subscription" ? interval : undefined,
    status: "confirmed",
    fulfillmentStatus: "unshipped",
    paymentStatus: "paid",
    subtotalAmount: subtotal,
    totalAmount: subtotal,
    stripeCheckoutSessionId: session.id,
    stripePaymentIntentId:
      typeof session.payment_intent === "string" ? session.payment_intent : null,
    stripeSubscriptionId:
      typeof session.subscription === "string" ? session.subscription : null,
    metadata: {
      source: session.metadata?.source || "",
    },
  });

  if (!order) {
    return;
  }

  await insertOrderItems(order.id, snapshotItems);

  if (mode === "subscription" && typeof session.subscription === "string") {
    const subscription = (await stripe.subscriptions.retrieve(
      session.subscription
    )) as unknown as SubscriptionWithCurrentPeriodEnd;

    await upsertSubscriptionContract({
      orderId: order.id,
      customerId: customer?.id || null,
      customerEmail: customerEmail || null,
      customerName,
      stripeSubscriptionId: subscription.id,
      interval,
      status: subscription.status,
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
      currentPeriodEnd: new Date(
        getSubscriptionCurrentPeriodEnd(subscription) * 1000
      ).toISOString(),
      itemsSnapshot: snapshotItems,
    });
  }

  const adminEmail = getAdminNotificationEmail();
  const orderUrl = `${getSiteUrl()}/checkout/success?session_id=${session.id}`;
  const purchaseEmail = buildOrderConfirmationEmail({
    customerName: customerName || "お客様",
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
    customerEmail: customerEmail || "unknown@example.com",
    customerName: customerName || "お客様",
    totalAmount: subtotal,
    mode,
    createdAt: new Date().toISOString(),
  });

  await Promise.all([
    customerEmail
      ? sendEmail({
          to: customerEmail,
          subject: purchaseEmail.subject,
          html: purchaseEmail.html,
          text: purchaseEmail.text,
        })
      : Promise.resolve(null),
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

async function handleInvoicePaid(
  stripe: Stripe,
  invoice: Stripe.Invoice
) {
  if (invoice.billing_reason === "subscription_create") {
    return;
  }

  const subscriptionId = getSubscriptionId(
    invoice.parent?.subscription_details?.subscription
  );

  if (!subscriptionId) {
    return;
  }

  const contract = await getSubscriptionContractByStripeSubscriptionId(
    subscriptionId
  );

  if (!contract) {
    return;
  }

  const itemsSnapshot = (contract.items_snapshot || []) as OrderSnapshotItem[];

  const existingOrder = await getOrderByStripeSubscriptionId(subscriptionId);
  const customerEmail =
    contract.customer_email ||
    existingOrder?.customer_email ||
    invoice.customer_email ||
    "";
  const customerName =
    contract.customer_name || existingOrder?.customer_name || null;
  const orderNumber = generateOrderNumber("CS");

  const order = await createRenewalOrder({
    customerEmail,
    customerName,
    customerId: contract.customer_id,
    stripeSubscriptionId: subscriptionId,
    orderNumber,
    interval: contract.subscription_interval,
    subtotalAmount: invoice.amount_paid,
    totalAmount: invoice.amount_paid,
    itemsSnapshot,
  });

  if (!order) {
    return;
  }

  const customerEmailNotification = buildOrderConfirmationEmail({
    customerName: customerName || "お客様",
    orderNumber,
    items: itemsSnapshot.map((item) => ({
      name: item.productName,
      label: item.variantLabel,
      quantity: item.quantity,
    })),
    totalAmount: invoice.amount_paid,
    orderUrl: `${getSiteUrl()}/checkout/success?invoice=${invoice.id}`,
  });

  const adminEmail = getAdminNotificationEmail();
  const adminNotification = buildAdminOrderNotificationEmail({
    orderNumber,
    customerEmail,
    customerName: customerName || "お客様",
    totalAmount: invoice.amount_paid,
    mode: "subscription",
    createdAt: new Date().toISOString(),
  });

  await Promise.all([
    customerEmail
      ? sendEmail({
          to: customerEmail,
          subject: customerEmailNotification.subject,
          html: customerEmailNotification.html,
          text: customerEmailNotification.text,
        })
      : Promise.resolve(null),
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

async function handleSubscriptionUpdated(
  subscription: Stripe.Subscription
) {
  const contract = await getSubscriptionContractByStripeSubscriptionId(
    subscription.id
  );

  if (!contract) {
    return;
  }

  await upsertSubscriptionContract({
    orderId: contract.order_id,
    customerId: contract.customer_id,
    customerEmail: contract.customer_email,
    customerName: contract.customer_name,
    stripeSubscriptionId: subscription.id,
    interval: contract.subscription_interval,
    status: subscription.status,
    cancelAtPeriodEnd: subscription.cancel_at_period_end,
    currentPeriodEnd: new Date(
      getSubscriptionCurrentPeriodEnd(subscription) * 1000
    ).toISOString(),
    itemsSnapshot: contract.items_snapshot,
  });
}

export async function POST(request: Request) {
  const stripe = getStripeClient();
  const webhookSecret = getStripeWebhookSecret();

  if (!stripe || !webhookSecret) {
    return NextResponse.json({ ok: true, demo: true });
  }

  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  const payload = await request.text();
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Webhook signature verification failed",
      },
      { status: 400 }
    );
  }

  const claimed = await claimWebhookEvent({
    id: event.id,
    type: event.type,
    payload: event.data.object,
  });

  if (!claimed) {
    return NextResponse.json({ ok: true, duplicate: true });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed":
        await handleCheckoutCompleted(stripe, event.data.object as Stripe.Checkout.Session);
        break;
      case "invoice.paid":
        await handleInvoicePaid(stripe, event.data.object as Stripe.Invoice);
        break;
      case "customer.subscription.updated":
      case "customer.subscription.deleted":
        await handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
        break;
      default:
        break;
    }
  } catch (error) {
    await releaseWebhookEvent(event.id);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Webhook processing failed",
      },
      { status: 500 }
    );
  }

  return NextResponse.json({ received: true });
}

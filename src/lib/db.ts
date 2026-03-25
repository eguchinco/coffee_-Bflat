import { getSupabaseServiceClient } from "@/lib/supabase";

export type DbMode = "one_time" | "subscription";
export type DbInterval = "two_weeks" | "one_month" | null;

export interface OrderSnapshotItem {
  productSlug: string;
  productName: string;
  variantSlug: string;
  variantLabel: string;
  quantity: number;
  unitAmount: number;
  mode: DbMode;
  interval?: "two_weeks" | "one_month";
}

export async function saveLeadSignup(input: {
  email: string;
  name?: string | null;
  source?: string | null;
  interest?: string | null;
}) {
  const client = getSupabaseServiceClient();

  if (!client) {
    return null;
  }

  const { data, error } = await client
    .from("lead_signups")
    .upsert({
      email: input.email,
      name: input.name || null,
      source: input.source || null,
      interest: input.interest || null,
      consent_at: new Date().toISOString(),
    }, { onConflict: "email" })
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function saveDiagnosisSession(input: {
  email?: string | null;
  name?: string | null;
  source?: string | null;
  answers: unknown;
  result: unknown;
}) {
  const client = getSupabaseServiceClient();

  if (!client) {
    return null;
  }

  const { data, error } = await client
    .from("diagnosis_sessions")
    .insert({
      email: input.email || null,
      name: input.name || null,
      source: input.source || null,
      answers: input.answers,
      result: input.result,
    })
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function upsertCustomer(input: {
  email: string;
  name?: string | null;
  stripeCustomerId?: string | null;
}) {
  const client = getSupabaseServiceClient();

  if (!client) {
    return null;
  }

  const payload: Record<string, string | null> = {
    email: input.email,
    name: input.name || null,
    stripe_customer_id: input.stripeCustomerId || null,
  };

  const { data, error } = await client
    .from("customers")
    .upsert(payload, { onConflict: "email" })
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function insertOrder(input: {
  orderNumber: string;
  customerId?: string | null;
  customerEmail: string;
  customerName?: string | null;
  mode: DbMode;
  interval?: DbInterval;
  status?: string;
  fulfillmentStatus?: string;
  paymentStatus?: string;
  subtotalAmount: number;
  discountAmount?: number;
  totalAmount: number;
  currency?: string;
  stripeCheckoutSessionId?: string | null;
  stripePaymentIntentId?: string | null;
  stripeSubscriptionId?: string | null;
  shippingAddress?: unknown;
  metadata?: unknown;
}) {
  const client = getSupabaseServiceClient();

  if (!client) {
    return null;
  }

  const { data, error } = await client
    .from("orders")
    .insert({
      order_number: input.orderNumber,
      customer_id: input.customerId || null,
      customer_email: input.customerEmail,
      customer_name: input.customerName || null,
      mode: input.mode,
      subscription_interval: input.interval || null,
      status: input.status || "confirmed",
      fulfillment_status: input.fulfillmentStatus || "unshipped",
      payment_status: input.paymentStatus || "paid",
      subtotal_amount: input.subtotalAmount,
      discount_amount: input.discountAmount || 0,
      total_amount: input.totalAmount,
      currency: input.currency || "JPY",
      stripe_checkout_session_id: input.stripeCheckoutSessionId || null,
      stripe_payment_intent_id: input.stripePaymentIntentId || null,
      stripe_subscription_id: input.stripeSubscriptionId || null,
      shipping_address: input.shippingAddress || null,
      metadata: input.metadata || null,
    })
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function insertOrderItems(
  orderId: string,
  items: OrderSnapshotItem[]
) {
  const client = getSupabaseServiceClient();

  if (!client || items.length === 0) {
    return null;
  }

  const { data, error } = await client
    .from("order_items")
    .insert(
      items.map((item) => ({
        order_id: orderId,
        product_slug: item.productSlug,
        product_name: item.productName,
        variant_slug: item.variantSlug,
        variant_label: item.variantLabel,
        quantity: item.quantity,
        unit_amount: item.unitAmount,
        mode: item.mode,
        subscription_interval: item.interval || null,
      }))
    )
    .select("*");

  if (error) {
    throw error;
  }

  return data;
}

export async function upsertSubscriptionContract(input: {
  orderId: string;
  customerId?: string | null;
  customerEmail?: string | null;
  customerName?: string | null;
  stripeSubscriptionId: string;
  interval: "two_weeks" | "one_month";
  status?: string;
  cancelAtPeriodEnd?: boolean;
  currentPeriodEnd?: string | null;
  itemsSnapshot: unknown;
}) {
  const client = getSupabaseServiceClient();

  if (!client) {
    return null;
  }

  const { data, error } = await client
    .from("subscription_contracts")
    .upsert(
      {
        order_id: input.orderId,
        customer_id: input.customerId || null,
        customer_email: input.customerEmail || null,
        customer_name: input.customerName || null,
        stripe_subscription_id: input.stripeSubscriptionId,
        subscription_interval: input.interval,
        status: input.status || "active",
        cancel_at_period_end: input.cancelAtPeriodEnd || false,
        current_period_end: input.currentPeriodEnd || null,
        items_snapshot: input.itemsSnapshot,
      },
      { onConflict: "stripe_subscription_id" }
    )
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function claimWebhookEvent(input: {
  id: string;
  type: string;
  payload: unknown;
}) {
  const client = getSupabaseServiceClient();

  if (!client) {
    return true;
  }

  const { data, error } = await client.rpc("claim_webhook_event", {
    p_event_id: input.id,
    p_event_type: input.type,
    p_payload: input.payload,
  });

  if (error) {
    throw error;
  }

  return Boolean(data);
}

export async function releaseWebhookEvent(eventId: string) {
  const client = getSupabaseServiceClient();

  if (!client) {
    return true;
  }

  const { error } = await client.from("webhook_events").delete().eq("id", eventId);

  if (error) {
    throw error;
  }

  return true;
}

export async function getCustomerByEmail(email: string) {
  const client = getSupabaseServiceClient();

  if (!client) {
    return null;
  }

  const { data, error } = await client
    .from("customers")
    .select("*")
    .eq("email", email)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data;
}

export async function getOrderByStripeSessionId(stripeCheckoutSessionId: string) {
  const client = getSupabaseServiceClient();

  if (!client) {
    return null;
  }

  const { data, error } = await client
    .from("orders")
    .select("*, order_items(*)")
    .eq("stripe_checkout_session_id", stripeCheckoutSessionId)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data;
}

export async function getOrderByStripeSubscriptionId(
  stripeSubscriptionId: string
) {
  const client = getSupabaseServiceClient();

  if (!client) {
    return null;
  }

  const { data, error } = await client
    .from("orders")
    .select("*, order_items(*)")
    .eq("stripe_subscription_id", stripeSubscriptionId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data;
}

export async function getOrderById(orderId: string) {
  const client = getSupabaseServiceClient();

  if (!client) {
    return null;
  }

  const { data, error } = await client
    .from("orders")
    .select("*, order_items(*)")
    .eq("id", orderId)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data;
}

export async function getSubscriptionContractByStripeSubscriptionId(
  stripeSubscriptionId: string
) {
  const client = getSupabaseServiceClient();

  if (!client) {
    return null;
  }

  const { data, error } = await client
    .from("subscription_contracts")
    .select("*")
    .eq("stripe_subscription_id", stripeSubscriptionId)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data;
}

export async function createRenewalOrder(input: {
  customerEmail: string;
  customerName?: string | null;
  customerId?: string | null;
  stripeSubscriptionId: string;
  orderNumber: string;
  interval: "two_weeks" | "one_month";
  subtotalAmount: number;
  totalAmount: number;
  itemsSnapshot: OrderSnapshotItem[];
}) {
  const order = await insertOrder({
    orderNumber: input.orderNumber,
    customerId: input.customerId,
    customerEmail: input.customerEmail,
    customerName: input.customerName,
    mode: "subscription",
    interval: input.interval,
    status: "confirmed",
    fulfillmentStatus: "unshipped",
    paymentStatus: "paid",
    subtotalAmount: input.subtotalAmount,
    totalAmount: input.totalAmount,
    stripeSubscriptionId: input.stripeSubscriptionId,
  });

  if (!order) {
    return null;
  }

  await insertOrderItems(order.id, input.itemsSnapshot);
  return order;
}

export async function getAdminOrders() {
  const client = getSupabaseServiceClient();

  if (!client) {
    return [];
  }

  const { data, error } = await client
    .from("orders")
    .select("*, order_items(*)")
    .order("created_at", { ascending: false })
    .limit(100);

  if (error) {
    throw error;
  }

  return data || [];
}

export async function getAdminStats() {
  const client = getSupabaseServiceClient();

  if (!client) {
    return {
      orders: 0,
      shipped: 0,
      leads: 0,
      diagnosis: 0,
    };
  }

  const [orders, shipped, leads, diagnosis] = await Promise.all([
    client.from("orders").select("id", { count: "exact", head: true }),
    client
      .from("orders")
      .select("id", { count: "exact", head: true })
      .eq("fulfillment_status", "shipped"),
    client.from("lead_signups").select("id", { count: "exact", head: true }),
    client
      .from("diagnosis_sessions")
      .select("id", { count: "exact", head: true }),
  ]);

  return {
    orders: orders.count || 0,
    shipped: shipped.count || 0,
    leads: leads.count || 0,
    diagnosis: diagnosis.count || 0,
  };
}

export async function markOrderShipped(input: {
  orderId: string;
  trackingNumber?: string | null;
  carrier?: string | null;
}) {
  const client = getSupabaseServiceClient();

  if (!client) {
    return null;
  }

  const { data, error } = await client
    .from("orders")
    .update({
      fulfillment_status: "shipped",
      shipped_at: new Date().toISOString(),
      tracking_number: input.trackingNumber || null,
      carrier: input.carrier || null,
    })
    .eq("id", input.orderId)
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function createSubscriptionRenewalOrderFromContract(input: {
  subscriptionId: string;
  invoiceId: string;
  customerEmail: string;
  customerName?: string | null;
  customerId?: string | null;
  subtotalAmount: number;
  totalAmount: number;
  interval: "two_weeks" | "one_month";
  itemsSnapshot: OrderSnapshotItem[];
}) {
  const order = await createRenewalOrder({
    customerEmail: input.customerEmail,
    customerName: input.customerName,
    customerId: input.customerId,
    stripeSubscriptionId: input.subscriptionId,
    orderNumber: `CS-${input.invoiceId.slice(-6).toUpperCase()}`,
    interval: input.interval,
    subtotalAmount: input.subtotalAmount,
    totalAmount: input.totalAmount,
    itemsSnapshot: input.itemsSnapshot,
  });

  return order;
}

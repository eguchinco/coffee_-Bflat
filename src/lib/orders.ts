import {
  getProductBySlug,
  getVariantBySlug,
  getVariantAmount,
  getVariantPriceId,
  type PurchaseMode,
  type SubscriptionInterval,
} from "@/lib/catalog";
import type { CheckoutRequestItem } from "@/lib/checkout-client";
import type { OrderSnapshotItem } from "@/lib/db";

export function generateOrderNumber(prefix = "CS") {
  const date = new Date();
  const stamp = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, "0")}${String(
    date.getDate()
  ).padStart(2, "0")}`;
  const random = crypto.getRandomValues(new Uint32Array(1))[0]
    .toString(36)
    .slice(0, 4)
    .toUpperCase();

  return `${prefix}-${stamp}-${random}`;
}

export function buildOrderSnapshotItems({
  items,
  mode,
  interval,
}: {
  items: ReadonlyArray<CheckoutRequestItem>;
  mode: PurchaseMode;
  interval?: SubscriptionInterval;
}) {
  return items.map((item) => {
    const product = getProductBySlug(item.productSlug);
    const variant = product
      ? getVariantBySlug(product.slug, item.variantSlug)
      : null;

    if (!product || !variant) {
      throw new Error(`Unknown product or variant: ${item.productSlug}/${item.variantSlug}`);
    }

    const amount = getVariantAmount(product.slug, variant.slug, mode, interval);

    if (!amount) {
      throw new Error(`Price is missing for ${product.slug}/${variant.slug}`);
    }

    return {
      productSlug: product.slug,
      productName: product.name,
      variantSlug: variant.slug,
      variantLabel: variant.label,
      quantity: item.quantity,
      unitAmount: amount,
      mode,
      interval,
    } satisfies OrderSnapshotItem;
  });
}

export function calculateSnapshotSubtotal(items: OrderSnapshotItem[]) {
  return items.reduce((sum, item) => sum + item.unitAmount * item.quantity, 0);
}

export function buildStripeLineItems({
  items,
  mode,
  interval,
}: {
  items: ReadonlyArray<CheckoutRequestItem>;
  mode: PurchaseMode;
  interval?: SubscriptionInterval;
}) {
  return items.map((item) => {
    const product = getProductBySlug(item.productSlug);
    const variant = product
      ? getVariantBySlug(product.slug, item.variantSlug)
      : null;

    if (!product || !variant) {
      throw new Error(`Unknown product or variant: ${item.productSlug}/${item.variantSlug}`);
    }

    const priceId = getVariantPriceId(product.slug, variant.slug, mode, interval);

    if (!priceId) {
      throw new Error(`Stripe price is not configured for ${product.slug}/${variant.slug}`);
    }

    return {
      price: priceId,
      quantity: item.quantity,
    } as const;
  });
}

export function buildMetadataPayload({
  mode,
  interval,
  items,
  source,
}: {
  mode: PurchaseMode;
  interval?: SubscriptionInterval;
  items: ReadonlyArray<CheckoutRequestItem>;
  source?: string;
}) {
  return {
    mode,
    interval: interval || "",
    items: JSON.stringify(items),
    source: source || "",
  };
}

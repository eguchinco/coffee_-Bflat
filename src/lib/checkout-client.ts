import type { PurchaseMode, SubscriptionInterval } from "@/lib/catalog";

export interface CheckoutRequestItem {
  productSlug: string;
  variantSlug: string;
  quantity: number;
}

export interface CheckoutRequest {
  mode: PurchaseMode;
  interval?: SubscriptionInterval;
  items: ReadonlyArray<CheckoutRequestItem>;
  email?: string;
  name?: string;
  source?: string;
}

export async function startCheckout(payload: CheckoutRequest) {
  const response = await fetch("/api/checkout", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = (await response.json()) as
    | { url: string }
    | { error: string }
    | Record<string, unknown>;

  if (!response.ok) {
    const message = (data as { error?: string }).error || "Checkout failed";
    throw new Error(message);
  }

  const url = (data as { url?: string }).url;

  if (url) {
    window.location.assign(url);
    return;
  }

  throw new Error("Checkout URL is missing");
}

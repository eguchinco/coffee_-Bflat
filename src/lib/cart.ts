import { getVariantAmount, type PurchaseMode, type SubscriptionInterval } from "@/lib/catalog";

export interface CartItem {
  productSlug: string;
  productName: string;
  variantSlug: string;
  variantLabel: string;
  quantity: number;
  mode: PurchaseMode;
  interval?: SubscriptionInterval;
}

export interface CartState {
  items: CartItem[];
  mode: PurchaseMode | null;
  interval?: SubscriptionInterval;
}

export function emptyCart(): CartState {
  return { items: [], mode: null, interval: undefined };
}

export function getCartItemKey(item: CartItem) {
  return [item.productSlug, item.variantSlug, item.mode, item.interval || "none"].join(":");
}

export function normalizeCartState(state: CartState): CartState {
  return {
    items: state.items.filter((item) => item.quantity > 0),
    mode: state.items.length > 0 ? state.mode : null,
    interval: state.items.length > 0 ? state.interval : undefined,
  };
}

export function mergeCartItem(current: CartState, next: CartItem): CartState {
  const sameMode =
    current.mode === null || current.mode === next.mode;
  const sameInterval =
    current.interval === undefined ||
    current.interval === next.interval ||
    next.mode === "one_time";

  if (!sameMode || !sameInterval) {
    return normalizeCartState({
      items: [next],
      mode: next.mode,
      interval: next.interval,
    });
  }

  const key = getCartItemKey(next);
  const existing = current.items.find((item) => getCartItemKey(item) === key);

  if (existing) {
    return normalizeCartState({
      ...current,
      items: current.items.map((item) =>
        getCartItemKey(item) === key
          ? { ...item, quantity: item.quantity + next.quantity }
          : item
      ),
    });
  }

  return normalizeCartState({
    items: [...current.items, next],
    mode: next.mode,
    interval: next.interval ?? current.interval,
  });
}

export function updateCartItemQuantity(
  current: CartState,
  key: string,
  quantity: number
) {
  const items =
    quantity <= 0
      ? current.items.filter((item) => getCartItemKey(item) !== key)
      : current.items.map((item) =>
          getCartItemKey(item) === key ? { ...item, quantity } : item
        );

  return normalizeCartState({
    items,
    mode: items.length > 0 ? current.mode : null,
    interval: items.length > 0 ? current.interval : undefined,
  });
}

export function removeCartItem(current: CartState, key: string) {
  return normalizeCartState({
    items: current.items.filter((item) => getCartItemKey(item) !== key),
    mode: current.items.length > 1 ? current.mode : null,
    interval: current.items.length > 1 ? current.interval : undefined,
  });
}

export function calculateCartSubtotal(items: CartItem[]) {
  return items.reduce((sum, item) => {
    const amount = getVariantAmount(
      item.productSlug,
      item.variantSlug,
      item.mode,
      item.interval
    );

    if (!amount) {
      return sum;
    }

    return sum + amount * item.quantity;
  }, 0);
}


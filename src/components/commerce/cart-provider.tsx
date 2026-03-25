"use client";

import * as React from "react";
import {
  emptyCart,
  mergeCartItem,
  normalizeCartState,
  removeCartItem,
  updateCartItemQuantity,
  type CartItem,
  type CartState,
} from "@/lib/cart";

const STORAGE_KEY = "mellow_roast_cart_v1";

type CartContextValue = {
  cart: CartState;
  hydrated: boolean;
  drawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
  addItem: (item: CartItem) => void;
  updateQuantity: (key: string, quantity: number) => void;
  removeItem: (key: string) => void;
  clearCart: () => void;
};

const CartContext = React.createContext<CartContextValue | null>(null);

function readCart(): CartState {
  if (typeof window === "undefined") {
    return emptyCart();
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return emptyCart();
    }

    const parsed = JSON.parse(raw) as CartState;
    return normalizeCartState(parsed);
  } catch {
    return emptyCart();
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = React.useState<CartState>(emptyCart());
  const [hydrated, setHydrated] = React.useState(false);
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  React.useEffect(() => {
    setCart(readCart());
    setHydrated(true);
  }, []);

  React.useEffect(() => {
    if (!hydrated) {
      return;
    }

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
  }, [cart, hydrated]);

  const value: CartContextValue = {
    cart,
    hydrated,
    drawerOpen,
    openDrawer: () => setDrawerOpen(true),
    closeDrawer: () => setDrawerOpen(false),
    addItem: (item) => {
      setCart((current) => normalizeCartState(mergeCartItem(current, item)));
      setDrawerOpen(true);
    },
    updateQuantity: (key, quantity) => {
      setCart((current) => updateCartItemQuantity(current, key, quantity));
    },
    removeItem: (key) => {
      setCart((current) => removeCartItem(current, key));
    },
    clearCart: () => {
      setCart(emptyCart());
      setDrawerOpen(false);
    },
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = React.useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }

  return context;
}


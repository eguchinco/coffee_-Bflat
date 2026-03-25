"use client";

import Link from "next/link";
import { Minus, Plus, ShoppingBag, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CheckoutButton } from "@/components/commerce/checkout-button";
import { useCart } from "@/components/commerce/cart-provider";
import { formatYen } from "@/lib/format";
import { calculateCartSubtotal, getCartItemKey } from "@/lib/cart";

export function CartDrawer() {
  const {
    cart,
    hydrated,
    drawerOpen,
    openDrawer,
    closeDrawer,
    updateQuantity,
    removeItem,
    clearCart,
  } = useCart();

  const subtotal = calculateCartSubtotal(cart.items);

  const checkoutPayload =
    cart.mode && cart.items.length > 0
      ? {
          mode: cart.mode,
          interval: cart.interval,
          items: cart.items.map((item) => ({
            productSlug: item.productSlug,
            variantSlug: item.variantSlug,
            quantity: item.quantity,
          })),
          source: "cart-drawer",
        }
      : null;

  return (
    <>
      <button
        type="button"
        onClick={openDrawer}
        className="fixed bottom-5 right-5 z-30 flex items-center gap-3 rounded-full border border-[#e7dacc] bg-white px-4 py-3 shadow-[0_18px_40px_rgba(24,16,11,0.14)] transition hover:-translate-y-0.5"
      >
        <span className="grid size-10 place-items-center rounded-full bg-[#17110d] text-white">
          <ShoppingBag className="size-4" />
        </span>
        <span className="text-left">
          <span className="block text-xs text-[#7f6f63]">カート</span>
          <span className="block text-sm font-semibold text-[#17110d]">
            {hydrated ? `${cart.items.length} 点` : "読み込み中"}
          </span>
        </span>
        {hydrated && cart.items.length > 0 ? <Badge variant="warm">{formatYen(subtotal)}</Badge> : null}
      </button>

      {drawerOpen ? (
        <div className="fixed inset-0 z-50 bg-black/35">
          <button type="button" className="absolute inset-0" aria-label="閉じる" onClick={closeDrawer} />
          <div className="absolute bottom-0 left-0 right-0 max-h-[88vh] overflow-y-auto rounded-t-[28px] border-t border-[#efe6db] bg-white p-5 shadow-[0_-20px_80px_rgba(18,12,8,0.18)] md:left-auto md:right-5 md:bottom-5 md:max-h-[80vh] md:w-[420px] md:rounded-[28px] md:border">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs font-semibold uppercase tracking-[0.2em] text-[#a86a33]">
                  Cart
                </div>
                <div className="text-lg font-semibold text-[#17110d]">購入内容</div>
              </div>
              <Button variant="ghost" size="icon" onClick={closeDrawer} aria-label="閉じる">
                <X className="size-4" />
              </Button>
            </div>
            <Separator className="my-4" />

            {cart.items.length === 0 ? (
              <div className="space-y-4 py-6 text-center">
                <p className="text-sm text-[#6f6156]">カートは空です。</p>
                <Button asChild>
                  <Link href="/diagnosis" onClick={closeDrawer}>
                    診断して選ぶ
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {cart.items.map((item) => {
                  const key = getCartItemKey(item);

                  return (
                    <div key={key} className="rounded-[24px] border border-[#ece2d8] p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="text-sm font-semibold text-[#17110d]">{item.productName}</div>
                          <div className="mt-1 text-sm text-[#6f6156]">{item.variantLabel}</div>
                          <div className="mt-1 text-xs text-[#8d7d71]">
                            {item.mode === "subscription"
                              ? item.interval === "two_weeks"
                                ? "2週間ごと"
                                : "1ヶ月ごと"
                              : "単品"}
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeItem(key)}
                          aria-label="削除"
                        >
                          <X className="size-4" />
                        </Button>
                      </div>

                      <div className="mt-4 flex items-center justify-between">
                        <div className="inline-flex items-center rounded-full border border-[#ece2d8] bg-white">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => updateQuantity(key, item.quantity - 1)}
                            aria-label="数量を減らす"
                          >
                            <Minus className="size-4" />
                          </Button>
                          <div className="min-w-10 text-center text-sm font-semibold text-[#17110d]">
                            {item.quantity}
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => updateQuantity(key, item.quantity + 1)}
                            aria-label="数量を増やす"
                          >
                            <Plus className="size-4" />
                          </Button>
                        </div>
                        <div className="text-sm font-semibold text-[#17110d]">
                          {formatYen(
                            (item.quantity > 0 ? calculateCartSubtotal([item]) : 0) || 0
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}

                <div className="rounded-[24px] bg-[#fbf7f1] p-4">
                  <div className="flex items-center justify-between text-sm text-[#6f6156]">
                    <span>小計</span>
                    <span>{formatYen(subtotal)}</span>
                  </div>
                  <div className="mt-2 text-xs text-[#8d7d71]">送料込み / 日本国内のみ</div>
                </div>

                <div className="flex flex-col gap-3">
                  {checkoutPayload ? (
                    <CheckoutButton payload={checkoutPayload} size="lg" className="w-full">
                      Checkoutへ進む
                    </CheckoutButton>
                  ) : null}
                  <Button variant="outline" size="lg" className="w-full" asChild>
                    <Link href="/cart" onClick={closeDrawer}>
                      カート画面へ
                    </Link>
                  </Button>
                  <Button variant="ghost" className="w-full" onClick={clearCart}>
                    カートを空にする
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : null}
    </>
  );
}


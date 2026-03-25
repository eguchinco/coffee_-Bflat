"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckoutButton } from "@/components/commerce/checkout-button";
import { useCart } from "@/components/commerce/cart-provider";
import { formatYen } from "@/lib/format";
import { calculateCartSubtotal, getCartItemKey } from "@/lib/cart";

export function CartPageClient() {
  const { cart, updateQuantity, removeItem, clearCart } = useCart();
  const subtotal = calculateCartSubtotal(cart.items);

  const payload =
    cart.mode && cart.items.length > 0
      ? {
          mode: cart.mode,
          interval: cart.interval,
          items: cart.items.map((item) => ({
            productSlug: item.productSlug,
            variantSlug: item.variantSlug,
            quantity: item.quantity,
          })),
          source: "cart-page",
        }
      : null;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="space-y-2">
          <CardTitle>カート</CardTitle>
          <p className="text-sm leading-7 text-[#6f6156]">
            単品と定期便は混ぜられません。配送は送料込みです。
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {cart.items.length === 0 ? (
            <div className="space-y-4 py-6 text-center">
              <p className="text-sm text-[#6f6156]">まだ商品が入っていません。</p>
              <Button asChild>
                <Link href="/#products">商品を見る</Link>
              </Button>
            </div>
          ) : (
            <>
              {cart.items.map((item) => {
                const key = getCartItemKey(item);

                return (
                  <div key={key} className="rounded-[24px] border border-[#ece2d8] p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-sm font-semibold text-[#17110d]">{item.productName}</div>
                        <div className="mt-1 text-sm text-[#6f6156]">{item.variantLabel}</div>
                        <Badge variant="subtle" className="mt-2">
                          {item.mode === "subscription"
                            ? item.interval === "two_weeks"
                              ? "2週間ごと"
                              : "1ヶ月ごと"
                            : "単品"}
                        </Badge>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => removeItem(key)}>
                        削除
                      </Button>
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                      <div className="inline-flex items-center rounded-full border border-[#ece2d8] bg-white">
                        <Button variant="ghost" size="icon" onClick={() => updateQuantity(key, item.quantity - 1)}>
                          -
                        </Button>
                        <div className="min-w-10 text-center text-sm font-semibold text-[#17110d]">
                          {item.quantity}
                        </div>
                        <Button variant="ghost" size="icon" onClick={() => updateQuantity(key, item.quantity + 1)}>
                          +
                        </Button>
                      </div>
                      <div className="text-sm font-semibold text-[#17110d]">
                        {formatYen(calculateCartSubtotal([item]))}
                      </div>
                    </div>
                  </div>
                );
              })}

              <div className="rounded-[24px] bg-[#fbf7f1] p-4">
                <div className="flex items-center justify-between text-sm text-[#6f6156]">
                  <span>合計</span>
                  <span>{formatYen(subtotal)}</span>
                </div>
                <div className="mt-2 text-xs text-[#8d7d71]">送料込み / 日本国内</div>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                {payload ? (
                  <CheckoutButton payload={payload} className="flex-1" size="lg">
                    Checkoutへ進む
                  </CheckoutButton>
                ) : null}
                <Button variant="outline" asChild size="lg" className="flex-1">
                  <Link href="/diagnosis">診断で追加する</Link>
                </Button>
                <Button variant="ghost" size="lg" onClick={clearCart}>
                  空にする
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}


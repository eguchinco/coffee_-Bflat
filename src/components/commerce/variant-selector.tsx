"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { CheckoutButton } from "@/components/commerce/checkout-button";
import { useCart } from "@/components/commerce/cart-provider";
import { formatYen } from "@/lib/format";
import type { CheckoutRequest } from "@/lib/checkout-client";
import {
  getVariantAmount,
  type Product,
  type ProductVariant,
  type PurchaseMode,
  type SubscriptionInterval,
} from "@/lib/catalog";

const purchaseModes: { key: PurchaseMode; label: string; helper: string }[] = [
  { key: "one_time", label: "単品", helper: "まずは1回だけ試したい" },
  { key: "subscription", label: "定期購入", helper: "サブスクで続けたい" },
];

const intervals: { key: SubscriptionInterval; label: string; helper: string }[] = [
  { key: "two_weeks", label: "2週間", helper: "鮮度を優先" },
  { key: "one_month", label: "1ヶ月", helper: "ちょうどいい消費ペース" },
];

function variantPayload(
  product: Product,
  variant: ProductVariant,
  mode: PurchaseMode,
  interval?: SubscriptionInterval
) : CheckoutRequest {
  return {
    mode,
    interval,
    items: [
      {
        productSlug: product.slug,
        variantSlug: variant.slug,
        quantity: 1,
      },
    ],
    source: "product-page",
  };
}

export function VariantSelector({
  product,
  defaultVariantSlug,
}: {
  product: Product;
  defaultVariantSlug?: string;
}) {
  const [variantSlug, setVariantSlug] = React.useState(
    defaultVariantSlug || product.variants[0].slug
  );
  const [mode, setMode] = React.useState<PurchaseMode>("subscription");
  const [interval, setInterval] = React.useState<SubscriptionInterval>("one_month");
  const { addItem, openDrawer } = useCart();

  const selectedVariant =
    product.variants.find((variant) => variant.slug === variantSlug) || product.variants[0];

  const amount = getVariantAmount(
    product.slug,
    selectedVariant.slug,
    mode,
    mode === "subscription" ? interval : undefined
  );

  const payload = variantPayload(
    product,
    selectedVariant,
    mode,
    mode === "subscription" ? interval : undefined
  );

  return (
    <Card className="overflow-hidden">
      <CardContent className="space-y-6 p-6">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="warm">{product.roastLevel === "light" ? "浅煎り" : product.roastLevel === "medium" ? "中煎り" : "深煎り"}</Badge>
          <span className="text-sm text-[#7a6a5d]">{product.recommendation}</span>
        </div>

        <div className="grid gap-4">
          <div>
            <div className="mb-2 text-sm font-medium text-[#34281f]">バリエーション</div>
            <div className="grid grid-cols-2 gap-3">
              {product.variants.map((variant) => {
                const selected = variant.slug === selectedVariant.slug;

                return (
                  <button
                    key={variant.slug}
                    type="button"
                    onClick={() => setVariantSlug(variant.slug)}
                    className={`rounded-2xl border px-4 py-3 text-left transition ${
                      selected
                        ? "border-[#17110d] bg-[#17110d] text-white"
                        : "border-[#e4d8ca] bg-white text-[#17110d] hover:bg-[#faf7f2]"
                    }`}
                  >
                    <div className="text-sm font-semibold">{variant.label}</div>
                    <div className={`mt-1 text-xs ${selected ? "text-white/75" : "text-[#8c7d70]"}`}>
                      SKU {variant.sku}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <div className="mb-2 text-sm font-medium text-[#34281f]">購入モード</div>
            <div className="grid gap-3 sm:grid-cols-2">
              {purchaseModes.map((item) => {
                const selected = mode === item.key;

                return (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => setMode(item.key)}
                    className={`rounded-2xl border p-4 text-left transition ${
                      selected
                        ? "border-[#17110d] bg-[#faf4ed]"
                        : "border-[#e4d8ca] bg-white hover:bg-[#faf7f2]"
                    }`}
                  >
                    <div className="text-sm font-semibold text-[#17110d]">{item.label}</div>
                    <div className="mt-1 text-xs text-[#7f6f63]">{item.helper}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {mode === "subscription" ? (
            <div>
              <div className="mb-2 text-sm font-medium text-[#34281f]">お届け間隔</div>
              <div className="grid gap-3 sm:grid-cols-2">
                {intervals.map((item) => {
                  const selected = interval === item.key;

                  return (
                    <button
                      key={item.key}
                      type="button"
                      onClick={() => setInterval(item.key)}
                      className={`rounded-2xl border p-4 text-left transition ${
                        selected
                          ? "border-[#17110d] bg-[#17110d] text-white"
                          : "border-[#e4d8ca] bg-white hover:bg-[#faf7f2]"
                      }`}
                    >
                      <div className="text-sm font-semibold">{item.label}</div>
                      <div className={`mt-1 text-xs ${selected ? "text-white/75" : "text-[#7f6f63]"}`}>
                        {item.helper}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : null}

          <div className="rounded-[24px] bg-[#fbf7f1] p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-xs font-semibold uppercase tracking-[0.22em] text-[#a86a33]">
                  Price
                </div>
                <div className="mt-1 text-2xl font-semibold text-[#17110d]">
                  {amount ? formatYen(amount) : "要設定"}
                </div>
              </div>
              <div className="text-right text-sm text-[#6f6156]">
                <div>{selectedVariant.label}</div>
                <div>{mode === "subscription" ? (interval === "two_weeks" ? "2週間ごと" : "1ヶ月ごと") : "単品購入"}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Button
            size="lg"
            className="flex-1"
            onClick={() => {
              addItem({
                productSlug: product.slug,
                productName: product.name,
                variantSlug: selectedVariant.slug,
                variantLabel: selectedVariant.label,
                quantity: 1,
                mode,
                interval: mode === "subscription" ? interval : undefined,
              });
              openDrawer();
            }}
          >
            カートに入れる
          </Button>
          <CheckoutButton payload={payload} size="lg" variant="outline" className="flex-1">
            そのまま購入
          </CheckoutButton>
        </div>
      </CardContent>
    </Card>
  );
}

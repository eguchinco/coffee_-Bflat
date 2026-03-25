"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckoutButton } from "@/components/commerce/checkout-button";
import { ProductArt } from "@/components/layout/product-art";
import { formatYen } from "@/lib/format";
import type { DiagnosisResult } from "@/lib/diagnosis";
import { getVariantAmount } from "@/lib/catalog";
import type { CheckoutRequest } from "@/lib/checkout-client";

export function RecommendationCard({
  result,
  ctaLabel = "このまま購入",
  showAlternate = true,
}: {
  result: DiagnosisResult;
  ctaLabel?: string;
  showAlternate?: boolean;
}) {
  const primaryAmount = getVariantAmount(
    result.primary.productSlug,
    result.primary.variantSlug,
    result.primary.purchaseMode,
    result.primary.subscriptionInterval
  );

  const primaryPayload: CheckoutRequest = {
    mode: result.primary.purchaseMode,
    interval: result.primary.subscriptionInterval,
    items: [
      {
        productSlug: result.primary.productSlug,
        variantSlug: result.primary.variantSlug,
        quantity: 1,
      },
    ],
    source: "diagnosis",
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      <Card className="overflow-hidden">
        <CardHeader className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="warm">診断結果</Badge>
            <span className="text-sm text-[#7b6c61]">送料込み / 日本国内</span>
          </div>
          <CardTitle className="text-2xl">{result.primary.productName}</CardTitle>
          <p className="text-sm leading-7 text-[#6f6156]">{result.summary}</p>
        </CardHeader>
        <CardContent className="grid gap-5 lg:grid-cols-[0.95fr_1.05fr]">
          <ProductArt roastLevel={result.primary.roastLevel} label={result.primary.productName} />
          <div className="space-y-4">
            <div className="rounded-[24px] bg-[#faf4ed] p-4">
              <div className="text-xs font-semibold uppercase tracking-[0.2em] text-[#a86a33]">
                Recommended
              </div>
              <div className="mt-2 text-lg font-semibold text-[#17110d]">
                {result.primary.variantLabel}
              </div>
              <div className="mt-1 text-sm text-[#6f6156]">{result.primary.explanation}</div>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-2xl border border-[#e9dfd5] p-4">
                <div className="text-[#8b7d70]">価格</div>
                <div className="mt-1 font-semibold text-[#17110d]">
                  {primaryAmount ? formatYen(primaryAmount) : "要設定"}
                </div>
              </div>
              <div className="rounded-2xl border border-[#e9dfd5] p-4">
                <div className="text-[#8b7d70]">間隔</div>
                <div className="mt-1 font-semibold text-[#17110d]">
                  {result.primary.subscriptionInterval === "two_weeks"
                    ? "2週間ごと"
                    : "1ヶ月ごと"}
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {["初心者向け", "サブスク主軸", "送料無料"].map((label) => (
                <Badge key={label} variant="subtle">
                  {label}
                </Badge>
              ))}
            </div>
            <div className="flex flex-wrap gap-3">
              <CheckoutButton payload={primaryPayload} className="min-w-40" size="lg">
                {ctaLabel}
              </CheckoutButton>
              <Button variant="outline" size="lg" asChild>
                <a href={`/products/${result.primary.productSlug}`}>商品ページを見る</a>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      {showAlternate ? (
        <Card className="border-dashed">
          <CardHeader>
            <CardTitle className="text-xl">次点候補</CardTitle>
            <p className="text-sm leading-7 text-[#6f6156]">
              少しだけ違う方向の候補も用意しています。
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-[24px] bg-[#fbf7f1] p-4">
              <div className="text-sm font-semibold text-[#17110d]">
                {result.alternate.productName}
              </div>
              <div className="mt-1 text-sm text-[#6f6156]">{result.alternate.variantLabel}</div>
              <div className="mt-2 text-xs text-[#8a7c71]">{result.alternate.explanation}</div>
            </div>
            <Button variant="secondary" className="w-full" asChild>
              <a href={`/products/${result.alternate.productSlug}`}>比較してみる</a>
            </Button>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ProductArt } from "@/components/layout/product-art";
import { VariantSelector } from "@/components/commerce/variant-selector";
import { JsonLd } from "@/components/seo/json-ld";
import { getProducts, getProductBySlug, getProductPricingSummary, getProductPath } from "@/lib/catalog";
import { productJsonLd } from "@/lib/seo";
import { formatYen } from "@/lib/format";

type Params = { slug: string };
type PageProps = { params: Promise<Params> };

export async function generateStaticParams() {
  return getProducts().map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    return {
      title: "商品が見つかりません",
    };
  }

  return {
    title: product.name,
    description: product.shortDescription,
    openGraph: {
      title: product.name,
      description: product.shortDescription,
      url: getProductPath(product.slug),
    },
  };
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const summary = getProductPricingSummary(product);

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <JsonLd
        data={productJsonLd({
          name: product.name,
          description: product.shortDescription,
          url: getProductPath(product.slug),
          price: summary.minOneTime,
        })}
      />
      <div className="mb-6">
        <Button variant="ghost" asChild className="px-0">
          <Link href="/#products">
            <ArrowLeft className="size-4" />
            商品一覧に戻る
          </Link>
        </Button>
      </div>
      <div className="grid gap-8 lg:grid-cols-[0.96fr_1.04fr]">
        <ProductArt roastLevel={product.roastLevel} label={product.name} className="min-h-[620px]" />
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="warm">
                {product.roastLevel === "light" ? "浅煎り" : product.roastLevel === "medium" ? "中煎り" : "深煎り"}
              </Badge>
              <span className="text-sm text-[#7f6f63]">{product.heroPhrase}</span>
            </div>
            <h1 className="text-4xl font-semibold tracking-tight text-[#17110d] sm:text-5xl">
              {product.name}
            </h1>
            <p className="max-w-2xl text-base leading-8 text-[#6f6156]">{product.shortDescription}</p>
          </div>

          <Card>
            <CardContent className="space-y-4 p-6">
              <div className="text-sm font-semibold text-[#17110d]">このラインの特徴</div>
              <div className="grid gap-3 sm:grid-cols-3">
                {product.notes.map((note) => (
                  <div key={note} className="rounded-2xl bg-[#fbf7f1] p-4 text-sm text-[#17110d]">
                    {note}
                  </div>
                ))}
              </div>
              <p className="text-sm leading-7 text-[#6f6156]">{product.story}</p>
              <div className="grid gap-3 sm:grid-cols-3">
                {product.storyPoints.map((point) => (
                  <div key={point} className="rounded-2xl border border-[#e8ddd2] p-4 text-sm text-[#17110d]">
                    {point}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <VariantSelector product={product} />

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-[24px] border border-[#e8ddd2] bg-white p-4">
              <div className="text-xs uppercase tracking-[0.2em] text-[#a67a57]">単品</div>
              <div className="mt-1 text-sm font-semibold text-[#17110d]">
                {formatYen(summary.minOneTime)}〜
              </div>
            </div>
            <div className="rounded-[24px] border border-[#e8ddd2] bg-white p-4">
              <div className="text-xs uppercase tracking-[0.2em] text-[#a67a57]">定期便</div>
              <div className="mt-1 text-sm font-semibold text-[#17110d]">
                {formatYen(summary.minSubscription)}〜
              </div>
            </div>
          </div>

          <Button asChild variant="outline" className="w-full">
            <Link href="/diagnosis">診断で他のラインと比較する</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}


import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProductArt } from "@/components/layout/product-art";
import { getProducts, getProductPricingSummary } from "@/lib/catalog";
import { formatYen } from "@/lib/format";

export function ProductGrid() {
  const products = getProducts();

  return (
    <section id="products" className="mx-auto w-full max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-4 max-w-3xl">
          <Badge variant="warm">Products</Badge>
          <h2 className="text-3xl font-semibold tracking-tight text-[#17110d] sm:text-4xl">
            3 ラインだけ。だから選びやすい。
          </h2>
          <p className="text-base leading-8 text-[#6f6156]">
            浅煎り / 中煎り / 深煎り の 3
            ラインに絞り、サイズと挽き方だけを選べるようにします。
          </p>
        </div>
        <Button asChild variant="outline">
          <Link href="/diagnosis">
            診断へ進む <ArrowRight className="size-4" />
          </Link>
        </Button>
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-3">
        {products.map((product) => {
          const summary = getProductPricingSummary(product);

          return (
            <Card key={product.slug} className="overflow-hidden">
              <CardHeader className="space-y-4">
                <ProductArt roastLevel={product.roastLevel} label={product.name} />
                <div className="space-y-2">
                  <CardTitle>{product.name}</CardTitle>
                  <p className="text-sm leading-7 text-[#6f6156]">{product.shortDescription}</p>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {product.notes.map((note) => (
                    <Badge key={note} variant="subtle">
                      {note}
                    </Badge>
                  ))}
                </div>
                <div className="rounded-[20px] bg-[#fbf7f1] p-4 text-sm leading-7 text-[#6f6156]">
                  {product.story}
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="rounded-2xl border border-[#e9dfd5] p-4">
                    <div className="text-[#8d7d71]">単品</div>
                    <div className="mt-1 font-semibold text-[#17110d]">{formatYen(summary.minOneTime)}〜</div>
                  </div>
                  <div className="rounded-2xl border border-[#e9dfd5] p-4">
                    <div className="text-[#8d7d71]">定期便</div>
                    <div className="mt-1 font-semibold text-[#17110d]">{formatYen(summary.minSubscription)}〜</div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col gap-3 sm:flex-row">
                <Button asChild className="flex-1">
                  <Link href={`/products/${product.slug}`}>詳細を見る</Link>
                </Button>
                <Button asChild variant="outline" className="flex-1">
                  <Link href="/diagnosis">診断で比較</Link>
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </section>
  );
}


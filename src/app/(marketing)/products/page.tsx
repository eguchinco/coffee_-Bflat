import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductGrid } from "@/components/sections/product-grid";

export const metadata: Metadata = {
  title: "商品一覧",
  description: "浅煎り / 中煎り / 深煎り の 3 ラインを一覧で確認できます。",
};

export default function ProductsPage() {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <Button variant="ghost" asChild className="px-0">
        <Link href="/">
          <ArrowLeft className="size-4" />
          ホームへ戻る
        </Link>
      </Button>
      <ProductGrid />
    </div>
  );
}


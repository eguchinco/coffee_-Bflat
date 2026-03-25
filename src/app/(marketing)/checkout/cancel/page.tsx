import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Checkout キャンセル",
  description: "決済をキャンセルしました。",
};

export default function CheckoutCancelPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <Button variant="ghost" asChild className="px-0">
        <Link href="/">
          <ArrowLeft className="size-4" />
          ホームへ戻る
        </Link>
      </Button>
      <Card className="mt-8">
        <CardContent className="space-y-4 p-6">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#fff3e6] px-4 py-2 text-sm font-medium text-[#a75822]">
            <ShoppingCart className="size-4" />
            決済はキャンセルされました
          </div>
          <h1 className="text-3xl font-semibold tracking-tight text-[#17110d]">
            もう一度商品を選び直せます。
          </h1>
          <p className="max-w-2xl text-base leading-8 text-[#6f6156]">
            カートに戻るか、診断からおすすめを見直してください。
          </p>
          <div className="flex flex-wrap gap-3">
            <Button asChild>
              <Link href="/cart">カートへ戻る</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/diagnosis">診断で選び直す</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


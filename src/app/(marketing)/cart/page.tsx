import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CartPageClient } from "@/components/commerce/cart-page-client";
import { LeadCaptureForm } from "@/components/commerce/lead-capture-form";

export const metadata: Metadata = {
  title: "カート",
  description: "購入内容の確認と Checkout への遷移。",
};

export default function CartPage() {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <Button variant="ghost" asChild className="px-0">
        <Link href="/">
          <ArrowLeft className="size-4" />
          ホームへ戻る
        </Link>
      </Button>
      <div className="mt-6 grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <CartPageClient />
        <LeadCaptureForm
          source="cart-page"
          title="迷ったらメールで比較する"
          description="初回オファー、診断結果、入荷情報をまとめて受け取れます。"
        />
      </div>
    </div>
  );
}


import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CustomerPortalForm } from "@/components/commerce/customer-portal-form";

export const metadata: Metadata = {
  title: "注文完了",
  description: "購入ありがとうございます。",
};

export default function CheckoutSuccessPage() {
  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <Button variant="ghost" asChild className="px-0">
        <Link href="/">
          <ArrowLeft className="size-4" />
          ホームへ戻る
        </Link>
      </Button>
      <div className="mt-8 space-y-6">
        <div className="inline-flex items-center gap-2 rounded-full bg-[#ecf7ef] px-4 py-2 text-sm font-medium text-[#245b35]">
          <CheckCircle2 className="size-4" />
          注文を受け付けました
        </div>
        <h1 className="text-4xl font-semibold tracking-tight text-[#17110d]">
          ご注文ありがとうございます。
        </h1>
        <p className="max-w-2xl text-base leading-8 text-[#6f6156]">
          購入完了メール、管理者通知、発送通知は webhook と管理画面から送れる設計です。
        </p>
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <Card>
          <CardContent className="space-y-4 p-6">
            <div className="text-lg font-semibold text-[#17110d]">次にやること</div>
            <div className="space-y-3 text-sm leading-7 text-[#6f6156]">
              <p>・購入完了メールを確認</p>
              <p>・サブスク管理リンクを受け取る</p>
              <p>・必要なら診断をやり直して比較する</p>
            </div>
            <Button asChild variant="outline">
              <Link href="/diagnosis">診断をもう一度見る</Link>
            </Button>
          </CardContent>
        </Card>
        <CustomerPortalForm />
      </div>
    </div>
  );
}


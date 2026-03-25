import Link from "next/link";
import type { Metadata } from "next";
import { MessageCircleMore } from "lucide-react";
import { Hero } from "@/components/sections/hero";
import { Story } from "@/components/sections/story";
import { Offer } from "@/components/sections/offer";
import { ProductGrid } from "@/components/sections/product-grid";
import { FAQ } from "@/components/sections/faq";
import { LeadCaptureForm } from "@/components/commerce/lead-capture-form";
import { DiagnosisWizard } from "@/components/commerce/diagnosis-wizard";
import { SectionHeading } from "@/components/sections/section-heading";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { JsonLd } from "@/components/seo/json-ld";
import { faqJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "毎日のコーヒーを、迷わず始める。",
  description:
    "コーヒー初心者でも選びやすい、診断ベースのサブスクECサイト。",
};

const faqItems = [
  {
    question: "初心者でも選べますか？",
    answer:
      "はい。3 ラインと 3 問診断だけに絞っているので、味の違いを理解しやすい構成です。",
  },
  {
    question: "定期購入は止められますか？",
    answer:
      "Stripe Customer Portal を使う前提で、スキップ・解約・支払い方法変更に対応します。",
  },
  {
    question: "送料はかかりますか？",
    answer: "MVP では送料込みの価格で設計しています。",
  },
  {
    question: "豆と粉は選べますか？",
    answer:
      "はい。各商品に豆 / 粉 を用意し、100g / 200g のサイズと組み合わせて選べます。",
  },
];

export default function MarketingPage() {
  return (
    <>
      <JsonLd data={faqJsonLd(faqItems)} />
      <Hero />
      <Story />
      <Offer />
      <ProductGrid />

      <section id="diagnosis" className="bg-[#faf5ee] py-20">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Diagnosis"
            title="3問で、いまのあなたに合うコーヒーを返す。"
            description="LLM は使わず、固定ルールで再現性を優先。結果からそのまま購入までつなげます。"
          />
          <div className="mt-10 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
            <DiagnosisWizard />
            <Card>
              <CardContent className="space-y-5 p-6">
                <div className="inline-flex items-center gap-2 rounded-full bg-[#17110d] px-3 py-1 text-xs font-medium text-white">
                  <MessageCircleMore className="size-4" />
                  迷いを減らす3ステップ
                </div>
                <div className="space-y-3 text-sm leading-7 text-[#6f6156]">
                  <p>1. 味わいの好みを選ぶ</p>
                  <p>2. 豆 / 粉 のスタイルを選ぶ</p>
                  <p>3. 飲む量に合うサイズを返す</p>
                </div>
                <div className="rounded-[24px] bg-[#fbf7f1] p-4 text-sm leading-7 text-[#6f6156]">
                  診断結果は、<strong className="text-[#17110d]">primary 1件 + alternate 1件</strong>
                  を返します。購入に迷った場合でも、比較の軸をそのまま残せます。
                </div>
                <Button asChild variant="outline" className="w-full">
                  <Link href="/products">商品一覧を見る</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Lead"
          title="メールを受け取って、初回オファーを逃さない。"
          description="ローンチ情報、入荷、診断の改善を先に届けます。"
        />
        <div className="mt-10 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <LeadCaptureForm source="homepage" />
          <Card>
            <CardContent className="space-y-4 p-6">
              <div className="text-lg font-semibold text-[#17110d]">見るべき指標</div>
              <div className="space-y-3 text-sm leading-7 text-[#6f6156]">
                <p>・診断完了率</p>
                <p>・Checkout 成約率</p>
                <p>・メール取得率</p>
                <p>・サブスク継続率</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <FAQ />
    </>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SectionHeading } from "@/components/sections/section-heading";
import { DiagnosisWizard } from "@/components/commerce/diagnosis-wizard";

export const metadata: Metadata = {
  title: "コーヒー診断",
  description: "3問で、いまのあなたに合うコーヒーを提案します。",
};

export default function DiagnosisPage() {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <Button variant="ghost" asChild className="px-0">
        <Link href="/">
          <ArrowLeft className="size-4" />
          ホームへ戻る
        </Link>
      </Button>

      <div className="mt-6 grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="space-y-6">
          <SectionHeading
            eyebrow="Diagnosis"
            title="たった 3 問で、最初の 1 杯を決める。"
            description="定期便の入口として、初心者が迷わず選べる診断を置きます。"
          />
          <DiagnosisWizard />
        </div>
        <Card className="h-fit">
          <CardContent className="space-y-4 p-6">
            <div className="text-lg font-semibold text-[#17110d]">診断の考え方</div>
            <div className="space-y-3 text-sm leading-7 text-[#6f6156]">
              <p>・味わいは 3 段階だけ</p>
              <p>・豆 / 粉 を明示して迷いを減らす</p>
              <p>・飲む量からサイズと定期便の間隔を決める</p>
              <p>・結果は primary + alternate の 2 パターン</p>
            </div>
            <Button asChild variant="outline" className="w-full">
              <Link href="/#products">商品一覧を見る</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}


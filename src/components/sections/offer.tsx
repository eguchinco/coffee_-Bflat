import { SectionHeading } from "@/components/sections/section-heading";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { formatYen } from "@/lib/format";

export function Offer() {
  return (
    <section className="bg-[#fcf8f2] py-20">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Offer"
          title="初回は 10% OFF。継続前提で、始めるハードルを下げる。"
          description="まずは一度試してもらい、その後の継続は Customer Portal でスキップ・解約できる設計にします。"
        />

        <div className="mt-10 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <Card className="bg-[#17110d] text-white">
            <CardContent className="space-y-5 p-6">
              <Badge variant="warm" className="bg-white text-[#17110d]">
                初回オファー
              </Badge>
              <div className="space-y-2">
                <h3 className="text-2xl font-semibold">サブスク 10% OFF</h3>
                <p className="text-sm leading-7 text-white/78">
                  2週間ごと / 1ヶ月ごとの定期便を、初回から始めやすい価格帯で提示します。
                </p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-[24px] bg-white/8 p-4">
                  <div className="text-xs uppercase tracking-[0.2em] text-white/55">100g</div>
                  <div className="mt-1 text-lg font-semibold">{formatYen(1480)}〜</div>
                </div>
                <div className="rounded-[24px] bg-white/8 p-4">
                  <div className="text-xs uppercase tracking-[0.2em] text-white/55">200g</div>
                  <div className="mt-1 text-lg font-semibold">{formatYen(2680)}〜</div>
                </div>
              </div>
              <Button asChild variant="secondary">
                <Link href="/diagnosis">診断でおすすめを見る</Link>
              </Button>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="space-y-4 p-6">
              <div className="text-sm font-semibold text-[#17110d]">CVR を上げるための設計</div>
              <div className="space-y-3 text-sm leading-7 text-[#6f6156]">
                <p>・単品購入と定期便を分けて、迷いを減らす</p>
                <p>・Checkout で Apple Pay / Google Pay を使えるようにする</p>
                <p>・発送後の通知と管理画面の更新を最短で回す</p>
                <p>・商品数は 3 ラインに絞り、比較しやすくする</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}


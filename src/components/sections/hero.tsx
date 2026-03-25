import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProductArt } from "@/components/layout/product-art";

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-[#efe6db] bg-[radial-gradient(circle_at_top_left,_rgba(255,244,229,.95),_transparent_35%),radial-gradient(circle_at_80%_20%,_rgba(243,207,172,.45),_transparent_25%),linear-gradient(180deg,#fffefc_0%,#fff8f0_100%)]">
      <div className="mx-auto grid w-full max-w-7xl gap-12 px-4 py-14 sm:px-6 lg:grid-cols-[1.02fr_0.98fr] lg:px-8 lg:py-20">
        <div className="flex flex-col justify-center space-y-8">
          <div className="flex flex-wrap items-center gap-3">
            <Badge variant="warm">初回10%OFF</Badge>
            <span className="inline-flex items-center gap-2 text-sm text-[#7f6f63]">
              <Sparkles className="size-4 text-[#b76a2f]" />
              初心者でも選びやすい定期便
            </span>
          </div>

          <div className="space-y-5">
            <h1 className="max-w-2xl text-5xl leading-[1.05] font-semibold tracking-tight text-[#17110d] sm:text-6xl">
              毎日のコーヒーを、
              <span className="block text-[#b45a22]">迷わず始める。</span>
            </h1>
            <p className="max-w-xl text-lg leading-8 text-[#5f5147]">
              Bflat は、サブスクを主軸にしたコーヒー豆 EC。
              診断でおすすめを提案し、単品購入から定期便への移行まで自然につなぎます。
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link href="/diagnosis">
                診断して選ぶ <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/#products">商品を見る</Link>
            </Button>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            {[
              { label: "配送", value: "日本国内のみ" },
              { label: "間隔", value: "2週間 / 1ヶ月" },
              { label: "価格", value: "送料込み" },
            ].map((item) => (
              <div key={item.label} className="rounded-[24px] border border-[#e9dfd5] bg-white/80 p-4">
                <div className="text-xs font-medium uppercase tracking-[0.2em] text-[#a67a57]">
                  {item.label}
                </div>
                <div className="mt-1 text-sm font-semibold text-[#17110d]">{item.value}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative">
          <div className="absolute inset-x-8 top-8 h-24 rounded-full bg-[#c47d45]/20 blur-3xl" />
          <ProductArt roastLevel="medium" label="Daily Balance" className="min-h-[560px]" />
          <div className="absolute -bottom-5 left-5 rounded-3xl border border-[#efe2d5] bg-white px-4 py-3 shadow-[0_18px_50px_rgba(17,10,6,0.12)]">
            <div className="text-xs uppercase tracking-[0.18em] text-[#a67a57]">Subscription first</div>
            <div className="mt-1 text-sm font-semibold text-[#17110d]">診断から Checkout まで一直線</div>
          </div>
        </div>
      </div>
    </section>
  );
}

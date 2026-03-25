import { SectionHeading } from "@/components/sections/section-heading";
import { Card, CardContent } from "@/components/ui/card";

const items = [
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

export function FAQ() {
  return (
    <section id="faq" className="mx-auto w-full max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <SectionHeading
        eyebrow="FAQ"
        title="よくある質問"
        description="購入前に不安になりやすい部分だけ先に解消します。"
      />
      <div className="mt-10 grid gap-4">
        {items.map((item) => (
          <Card key={item.question}>
            <CardContent className="p-6">
              <div className="text-lg font-semibold text-[#17110d]">{item.question}</div>
              <p className="mt-2 text-sm leading-7 text-[#6f6156]">{item.answer}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}


import { SectionHeading } from "@/components/sections/section-heading";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const points = [
  "コーヒー初心者が迷わないように、味わいを3段階に絞る",
  "サブスクを主軸に、継続しやすい価格と配送間隔を用意する",
  "診断結果からそのまま購入できるようにして、離脱を減らす",
];

export function Story() {
  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <SectionHeading
        eyebrow="Story"
        title="売れる導線にだけ集中した、やさしいコーヒー体験。"
        description="過剰な商品数や複雑な会員導線は後回し。まずは「選べる」「買える」「続けられる」を整えます。"
      />
      <div className="mt-10 grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <Card>
          <CardContent className="space-y-4 p-6">
            <div className="flex flex-wrap gap-2">
              <Badge variant="subtle">初心者向け</Badge>
              <Badge variant="subtle">カジュアル路線</Badge>
              <Badge variant="subtle">白ベース</Badge>
            </div>
            <p className="text-sm leading-7 text-[#6f6156]">
              まずは「朝に飲みやすい」「バランスがいい」「夜に落ち着く」の 3
              軸だけ。判断の迷いを減らして、サブスクの継続率を上げます。
            </p>
          </CardContent>
        </Card>
        <div className="grid gap-4">
          {points.map((point, index) => (
            <div key={point} className="rounded-[24px] border border-[#e9dfd5] bg-white p-5">
              <div className="text-xs font-semibold uppercase tracking-[0.2em] text-[#b36a2c]">
                0{index + 1}
              </div>
              <div className="mt-2 text-base font-medium leading-7 text-[#17110d]">{point}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


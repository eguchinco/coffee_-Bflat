import Link from "next/link";
import { SITE, getProducts } from "@/lib/catalog";
import { Separator } from "@/components/ui/separator";
import { BrandMark } from "@/components/layout/brand-mark";

export function SiteFooter() {
  return (
    <footer className="border-t border-[#efe6db] bg-[#fbf7f1]">
      <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-[1.3fr_0.8fr_0.8fr]">
          <div className="space-y-4">
            <BrandMark />
            <p className="max-w-md text-sm leading-7 text-[#6d5f55]">
              {SITE.description}
            </p>
          </div>
          <div className="space-y-3 text-sm">
            <div className="font-semibold text-[#17110d]">商品</div>
            <div className="flex flex-col gap-2 text-[#6d5f55]">
              {getProducts().map((product) => (
                <Link key={product.slug} href={`/products/${product.slug}`}>
                  {product.name}
                </Link>
              ))}
            </div>
          </div>
          <div className="space-y-3 text-sm">
            <div className="font-semibold text-[#17110d]">運用</div>
            <div className="flex flex-col gap-2 text-[#6d5f55]">
              <Link href="/blog">ブログ</Link>
              <Link href="/diagnosis">コーヒー診断</Link>
              <Link href="/admin">管理画面</Link>
            </div>
          </div>
        </div>
        <Separator className="my-8" />
        <div className="flex flex-col gap-2 text-xs text-[#8d7d71] sm:flex-row sm:items-center sm:justify-between">
          <span>Shipping included. Japan only.</span>
          <span>© {new Date().getFullYear()} {SITE.name}</span>
        </div>
      </div>
    </footer>
  );
}

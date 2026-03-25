import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BrandMark } from "@/components/layout/brand-mark";

const navItems = [
  { href: "/#products", label: "商品" },
  { href: "/diagnosis", label: "診断" },
  { href: "/blog", label: "ブログ" },
  { href: "/cart", label: "カート" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-[#efe6db] bg-white/85 backdrop-blur supports-[backdrop-filter]:bg-white/70">
      <div className="mx-auto flex h-20 w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <BrandMark />

        <nav className="hidden items-center gap-2 md:flex">
          {navItems.map((item) => (
            <Button key={item.href} asChild variant="ghost" size="sm">
              <Link href={item.href}>{item.label}</Link>
            </Button>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Badge variant="warm" className="hidden sm:inline-flex">
            初回10%OFF
          </Badge>
          <Button asChild size="sm">
            <Link href="/diagnosis">診断して選ぶ</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}

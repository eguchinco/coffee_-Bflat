import Image from "next/image";
import Link from "next/link";
import { SITE } from "@/lib/catalog";
import { cn } from "@/lib/utils";

export function BrandMark({
  className,
  showLabel = true,
}: {
  className?: string;
  showLabel?: boolean;
}) {
  return (
    <Link href="/" className={cn("inline-flex items-center gap-3", className)} aria-label={SITE.name}>
      <Image
        src="/bflat-logo.png"
        alt={`${SITE.name} ロゴ`}
        width={48}
        height={48}
        className="size-12 rounded-2xl border border-[#efe2d5] bg-white object-cover shadow-sm"
        priority
      />
      {showLabel ? (
        <span className="flex flex-col leading-tight">
          <span className="text-sm font-semibold tracking-[0.18em] text-[#17110d] uppercase">
            {SITE.name}
          </span>
          <span className="text-xs text-[#7f6f63]">Coffee roasters</span>
        </span>
      ) : null}
    </Link>
  );
}

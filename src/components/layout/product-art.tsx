import { cn } from "@/lib/utils";
import type { RoastLevel } from "@/lib/catalog";

const tones: Record<RoastLevel, { shell: string; glow: string; accent: string }> = {
  light: {
    shell: "from-[#fff5e9] via-[#fffaf4] to-[#f4e2c8]",
    glow: "bg-[#f2a66c]/30",
    accent: "bg-[#c97c45]",
  },
  medium: {
    shell: "from-[#f7efe6] via-[#fffdf9] to-[#ead3bf]",
    glow: "bg-[#be8a5f]/25",
    accent: "bg-[#7d5533]",
  },
  dark: {
    shell: "from-[#ede2d5] via-[#fffdf9] to-[#d8c0aa]",
    glow: "bg-[#8b5c38]/25",
    accent: "bg-[#34221a]",
  },
};

export function ProductArt({
  roastLevel,
  className,
  label,
}: {
  roastLevel: RoastLevel;
  className?: string;
  label: string;
}) {
  const tone = tones[roastLevel];

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[32px] border border-white/70 bg-gradient-to-br p-6 shadow-[0_20px_70px_rgba(28,18,10,0.12)]",
        tone.shell,
        className
      )}
    >
      <div className={cn("absolute -left-16 top-8 size-48 rounded-full blur-3xl", tone.glow)} />
      <div className={cn("absolute -bottom-12 right-0 size-40 rounded-full blur-3xl", tone.glow)} />
      <div className="relative flex h-full flex-col justify-between">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="text-xs font-medium uppercase tracking-[0.22em] text-[#79695d]">
              Coffee line
            </div>
            <div className="text-lg font-semibold text-[#17110d]">{label}</div>
          </div>
          <div className={cn("rounded-full px-3 py-1 text-xs font-semibold text-white", tone.accent)}>
            Bflat
          </div>
        </div>
        <div className="mx-auto my-8 flex h-56 w-full max-w-[260px] items-center justify-center rounded-[28px] border border-white/70 bg-white/85 shadow-[0_18px_42px_rgba(45,32,23,0.12)]">
          <div className="relative h-[78%] w-[64%] rounded-[24px] bg-[#17110d] p-4 text-white">
            <div className="flex h-full flex-col justify-between rounded-[18px] border border-white/10 bg-gradient-to-b from-white/6 to-transparent p-4">
              <div className="text-[10px] uppercase tracking-[0.28em] text-white/60">Subscription</div>
              <div className="space-y-2">
                <div className="text-2xl font-semibold leading-tight">Daily</div>
                <div className="text-sm leading-6 text-white/78">
                  サブスクで、毎日の1杯を軽くする。
                </div>
              </div>
              <div className="flex items-center justify-between text-xs text-white/60">
                <span>Japan only</span>
                <span>送料込み</span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <span className="rounded-full bg-white/70 px-3 py-1 text-xs font-medium text-[#6f6156]">
            初心者向け
          </span>
          <span className="rounded-full bg-white/70 px-3 py-1 text-xs font-medium text-[#6f6156]">
            診断推薦
          </span>
          <span className="rounded-full bg-white/70 px-3 py-1 text-xs font-medium text-[#6f6156]">
            送料込み
          </span>
        </div>
      </div>
    </div>
  );
}

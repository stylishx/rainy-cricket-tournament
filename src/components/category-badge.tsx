import type { PlayerCategory } from "@/data/players";
import { cn } from "@/lib/utils";

const CATEGORY_STYLES: Record<PlayerCategory, string> = {
  Batsman: "bg-sky-500/15 text-sky-300 ring-sky-500/30",
  Bowler: "bg-emerald-500/15 text-emerald-300 ring-emerald-500/30",
  "All-Rounder": "bg-violet-500/15 text-violet-300 ring-violet-500/30",
  "Wicket-Keeper": "bg-rose-500/15 text-rose-300 ring-rose-500/30",
};

export function CategoryBadge({
  category,
  className,
}: {
  category: PlayerCategory;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold tracking-wide uppercase ring-1 ring-inset",
        CATEGORY_STYLES[category],
        className
      )}
    >
      {category}
    </span>
  );
}

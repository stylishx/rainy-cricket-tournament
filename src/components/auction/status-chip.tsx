import { CircleDot, Gavel, XCircle } from "lucide-react";

import type { PlayerResult } from "@/lib/auction";
import { cn } from "@/lib/utils";

const STYLES = {
  sold: "border-emerald-400/40 bg-emerald-500/20 text-emerald-200",
  unsold: "border-rose-400/40 bg-rose-500/20 text-rose-200",
  available: "border-white/15 bg-slate-800/80 text-slate-300",
} as const;

/**
 * The SOLD / UNSOLD mark. Kept to a corner chip — the same footprint as the
 * player-number badge — so it never covers the photo underneath.
 */
export function StatusChip({
  result,
  showAvailable = false,
  className,
}: {
  result: PlayerResult | null;
  /** Off by default: an unmarked card already reads as still in the pool. */
  showAvailable?: boolean;
  className?: string;
}) {
  if (!result && !showAvailable) return null;

  const kind = result?.status ?? "available";
  const Icon = kind === "sold" ? Gavel : kind === "unsold" ? XCircle : CircleDot;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-lg border px-2 py-1 text-[11px] font-black tracking-wider uppercase backdrop-blur-sm",
        STYLES[kind],
        className
      )}
    >
      <Icon className="size-3.5" aria-hidden />
      {kind}
    </span>
  );
}

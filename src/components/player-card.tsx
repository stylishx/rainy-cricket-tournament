import type { CSSProperties } from "react";

import type { PlayerEntry } from "@/data/players";
import { getTeam } from "@/data/teams";
import { CategoryBadge } from "@/components/category-badge";
import { StatusChip } from "@/components/auction/status-chip";
import { PlayerImage } from "@/components/player-image";
import { formatPoints, type PlayerResult } from "@/lib/auction";
import { cn } from "@/lib/utils";

type PlayerCardProps = {
  player: PlayerEntry;
  /** Entrance animation class, supplied by the grid. */
  className?: string;
  /** Carries the stagger `animationDelay`. */
  style?: CSSProperties;
  /**
   * Auction outcome. Only the admin grid passes this — the public book leaves
   * it undefined and renders exactly as it always has.
   */
  result?: PlayerResult | null;
  /** Makes the whole card clickable. Admin grid only. */
  onSelect?: () => void;
  selected?: boolean;
};

/**
 * Compact card used by the Strategic Player Book grid.
 *
 * Every card is the same size: a fixed 3:4 photo frame plus a fixed-height
 * text block. Names and roles are single-line truncated so no card can grow
 * taller than its neighbours, and `h-full` makes short cards stretch to the
 * tallest in their row.
 */
export function PlayerCard({
  player,
  className,
  style,
  result,
  onSelect,
  selected = false,
}: PlayerCardProps) {
  const soldTeam = result?.status === "sold" ? getTeam(result.teamId) : undefined;

  return (
    <article
      style={style}
      className={cn(
        "group relative flex h-full flex-col overflow-hidden rounded-2xl border bg-slate-900/60 shadow-lg shadow-black/30",
        // Hover: transform + border/shadow only — nothing that reflows the grid.
        "transition-[transform,border-color,box-shadow] duration-300 ease-out",
        "hover:-translate-y-1 hover:scale-[1.02] hover:border-amber-400/50 hover:shadow-xl hover:shadow-amber-400/15",
        selected ? "border-amber-400 ring-2 ring-amber-400/40" : "border-white/10",
        className
      )}
    >
      {/* Fixed 3:4 frame. The photo is contained inside it, never cropped. */}
      <div
        className={cn(
          "relative aspect-[3/4] w-full overflow-hidden bg-slate-950",
          // Sold players fade back so the pool that is still live stands out.
          result?.status === "sold" && "opacity-55 saturate-50"
        )}
      >
        <PlayerImage
          src={player.imageSrc}
          name={player.name}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />
        <span className="absolute top-2.5 left-2.5 z-10 rounded-lg bg-amber-400 px-2.5 py-1 text-sm font-black text-slate-950 tabular-nums shadow-lg shadow-black/40">
          #{player.number}
        </span>
        <StatusChip result={result ?? null} className="absolute top-2.5 right-2.5 z-10" />
      </div>

      {/* Text lives below the frame so it never covers the photo. */}
      <div className="flex flex-1 flex-col gap-2 p-3">
        <div>
          <h3 className="truncate text-base leading-tight font-bold text-white">
            {player.name}
          </h3>
          <p className="truncate text-xs text-slate-400">{player.role}</p>
        </div>

        <div className="mt-auto flex items-center justify-between gap-2">
          <CategoryBadge category={player.category} />
          <div className="text-right leading-none">
            <p className="text-[10px] tracking-wide text-slate-400 uppercase">
              {soldTeam ? "Sold" : "Base"}
            </p>
            <p className="text-sm font-bold text-amber-300 tabular-nums">
              {result?.status === "sold" ? formatPoints(result.price) : player.basePrice}
            </p>
          </div>
        </div>

        {soldTeam && (
          <p className="truncate border-t border-white/10 pt-2 text-xs font-semibold text-emerald-300">
            {soldTeam.name}
          </p>
        )}
      </div>

      {/*
        A transparent button over the card, rather than a click handler on the
        <article>, so the target is reachable by keyboard and announces itself.
      */}
      {onSelect && (
        <button
          type="button"
          onClick={onSelect}
          className="absolute inset-0 z-20 rounded-2xl focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:outline-none"
        >
          <span className="sr-only">Manage #{player.number} {player.name}</span>
        </button>
      )}
    </article>
  );
}

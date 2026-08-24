import type { CSSProperties } from "react";

import type { PlayerEntry } from "@/data/players";
import { CategoryBadge } from "@/components/category-badge";
import { PlayerImage } from "@/components/player-image";
import { cn } from "@/lib/utils";

type PlayerCardProps = {
  player: PlayerEntry;
  /** Entrance animation class, supplied by the grid. */
  className?: string;
  /** Carries the stagger `animationDelay`. */
  style?: CSSProperties;
};

/**
 * Compact card used by the Strategic Player Book grid.
 *
 * Every card is the same size: a fixed 3:4 photo frame plus a fixed-height
 * text block. Names and roles are single-line truncated so no card can grow
 * taller than its neighbours, and `h-full` makes short cards stretch to the
 * tallest in their row.
 */
export function PlayerCard({ player, className, style }: PlayerCardProps) {
  return (
    <article
      style={style}
      className={cn(
        "group flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-slate-900/60 shadow-lg shadow-black/30",
        // Hover: transform + border/shadow only — nothing that reflows the grid.
        "transition-[transform,border-color,box-shadow] duration-300 ease-out",
        "hover:-translate-y-1 hover:scale-[1.02] hover:border-amber-400/50 hover:shadow-xl hover:shadow-amber-400/15",
        className
      )}
    >
      {/* Fixed 3:4 frame. The photo is contained inside it, never cropped. */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-slate-950">
        <PlayerImage
          src={player.imageSrc}
          name={player.name}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />
        <span className="absolute top-2.5 left-2.5 z-10 rounded-lg bg-amber-400 px-2.5 py-1 text-sm font-black text-slate-950 tabular-nums shadow-lg shadow-black/40">
          #{player.number}
        </span>
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
              Base
            </p>
            <p className="text-sm font-bold text-amber-300 tabular-nums">
              {player.basePrice}
            </p>
          </div>
        </div>
      </div>
    </article>
  );
}

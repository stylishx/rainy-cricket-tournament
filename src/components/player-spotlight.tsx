import type { PlayerEntry } from "@/data/players";
import { CategoryBadge } from "@/components/category-badge";
import { PlayerImage } from "@/components/player-image";
import { cn } from "@/lib/utils";

/**
 * Full-bleed, high-contrast card for the live auction screen.
 * The photo is marked `priority` so it paints without a flash.
 */
export function PlayerSpotlight({
  player,
  className,
}: {
  player: PlayerEntry;
  /** Enter/exit animation class, supplied by the search page. */
  className?: string;
}) {
  return (
    <article
      className={cn(
        "overflow-hidden rounded-3xl border border-amber-400/25 bg-slate-900 shadow-2xl shadow-black/50",
        className
      )}
    >
      <div className="grid gap-0 sm:grid-cols-[minmax(0,260px)_1fr]">
        {/* Fixed 4:5 frame on mobile, full-height column on desktop. The
            photo is contained inside it, so no part of it is ever cut off. */}
        <div className="relative aspect-[4/5] w-full overflow-hidden bg-slate-950 sm:aspect-auto sm:min-h-[340px]">
          <PlayerImage
            src={player.imageSrc}
            name={player.name}
            sizes="(max-width: 640px) 100vw, 260px"
            priority
          />
        </div>

        <div className="flex flex-col justify-center gap-4 p-5 sm:p-7">
          <div className="flex items-center gap-3">
            <span className="rounded-xl bg-amber-400 px-3 py-1.5 text-2xl leading-none font-black text-slate-950 tabular-nums">
              #{player.number}
            </span>
            <CategoryBadge category={player.category} />
          </div>

          <div>
            <h2 className="text-3xl leading-tight font-black text-white sm:text-4xl">
              {player.name}
            </h2>
            <p className="mt-1 text-lg font-medium text-slate-300">
              {player.role}
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3">
            <p className="text-xs font-semibold tracking-widest text-slate-400 uppercase">
              Base Price
            </p>
            <p className="text-3xl font-black text-amber-300 tabular-nums sm:text-4xl">
              {player.basePrice}
            </p>
          </div>
        </div>
      </div>
    </article>
  );
}

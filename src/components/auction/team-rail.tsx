import { SQUAD_SIZE, TEAM_PURSE, TEAM_TONES } from "@/data/teams";
import { formatPoints, type TeamSummary } from "@/lib/auction";
import { cn } from "@/lib/utils";

/**
 * Purse and squad count for every team, sized to sit beside the bidding
 * screen. The bar shows spend, so a team running out of money is obvious at a
 * glance without reading the numbers.
 */
export function TeamRail({
  teams,
  className,
}: {
  teams: TeamSummary[];
  className?: string;
}) {
  return (
    <aside className={cn("flex flex-col gap-2", className)} aria-label="Team purses">
      {teams.map((entry) => {
        const tone = TEAM_TONES[entry.team.tone];
        const spentPercent = Math.min(100, (entry.spent / TEAM_PURSE) * 100);
        return (
          <div
            key={entry.team.id}
            className={cn(
              "rounded-xl border px-3 py-2.5",
              entry.full ? "border-white/10 bg-slate-900/40 opacity-60" : tone.chip
            )}
          >
            <div className="flex items-baseline justify-between gap-2">
              <span className="truncate text-sm font-black">{entry.team.name}</span>
              <span className="shrink-0 text-xs font-bold text-slate-300 tabular-nums">
                {entry.squad.length}/{SQUAD_SIZE}
              </span>
            </div>

            <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-slate-950/70">
              <div
                className={cn("h-full rounded-full transition-[width] duration-300", tone.bar)}
                style={{ width: `${spentPercent}%` }}
              />
            </div>

            <p className="mt-1.5 text-[11px] font-semibold text-slate-400 tabular-nums">
              {entry.full ? (
                "Squad complete"
              ) : (
                <>
                  {formatPoints(entry.remaining)} left · max bid{" "}
                  <span className="text-slate-200">{formatPoints(entry.maxBid)}</span>
                </>
              )}
            </p>
          </div>
        );
      })}
    </aside>
  );
}

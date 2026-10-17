"use client";

import { useMemo, useState } from "react";
import { Gavel, RotateCcw, XCircle } from "lucide-react";

import { playerList, type PlayerEntry } from "@/data/players";
import { BASE_PRICE, TEAM_TONES, getTeam } from "@/data/teams";
import {
  formatPoints,
  markUnsold,
  reopenPlayer,
  resultFor,
  saleError,
  sellPlayer,
  summarize,
  useAuction,
} from "@/lib/auction";
import { cn } from "@/lib/utils";

const BUMPS = [50, 100, 200, 500];

/**
 * The one place a player is sold, passed in or put back. The console, the
 * admin search and the admin book all render this same component, so the
 * purse rules can never behave differently depending on which screen the
 * operator happens to be looking at.
 *
 * Mount it with `key={player.number}` — the remount is what resets the bid
 * field back to base price when the next player comes up.
 */
export function ManagePanel({
  player,
  onDone,
  className,
}: {
  player: PlayerEntry;
  /** Called after a sale or an unsold mark, e.g. to clear the search box. */
  onDone?: () => void;
  className?: string;
}) {
  const state = useAuction();
  const summary = useMemo(() => summarize(state, playerList), [state]);
  const result = resultFor(state, player.number);

  const [bid, setBid] = useState(String(BASE_PRICE));
  const price = Number.parseInt(bid || "0", 10);

  const soldTeam = result?.status === "sold" ? getTeam(result.teamId) : undefined;

  // A sold player must be reopened before being sold again: re-selling in
  // place would validate the new bid against a purse that still contains the
  // old one, and quietly let a team overspend.
  const canBid = result?.status !== "sold";

  function sell(teamId: string) {
    sellPlayer(player.number, teamId, price);
    onDone?.();
  }

  return (
    <section
      className={cn(
        "rounded-2xl border border-white/10 bg-slate-900/70 p-4 sm:p-5",
        className
      )}
      aria-label={`Auction controls for ${player.name}`}
    >
      {/* Current standing */}
      {result?.status === "sold" && soldTeam && (
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-emerald-400/30 bg-emerald-500/10 px-4 py-3">
          <p className="text-sm font-semibold text-emerald-200">
            Sold to <span className="font-black">{soldTeam.name}</span> for{" "}
            <span className="font-black tabular-nums">{formatPoints(result.price)}</span>
          </p>
          <button
            type="button"
            onClick={() => reopenPlayer(player.number)}
            className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-white/15 bg-slate-900 px-3 text-xs font-bold text-slate-200 transition-colors hover:border-white/35 hover:text-white focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:outline-none"
          >
            <RotateCcw className="size-3.5" aria-hidden />
            Reopen
          </button>
        </div>
      )}

      {result?.status === "unsold" && (
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-rose-400/30 bg-rose-500/10 px-4 py-3">
          <p className="text-sm font-semibold text-rose-200">
            Marked unsold — can still be sold in a later round.
          </p>
          <button
            type="button"
            onClick={() => reopenPlayer(player.number)}
            className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-white/15 bg-slate-900 px-3 text-xs font-bold text-slate-200 transition-colors hover:border-white/35 hover:text-white focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:outline-none"
          >
            <RotateCcw className="size-3.5" aria-hidden />
            Back to pool
          </button>
        </div>
      )}

      {canBid && (
        <>
          {/* Bid amount */}
          <div className="flex flex-wrap items-center gap-2">
            <label htmlFor={`bid-${player.number}`} className="sr-only">
              Winning bid for {player.name}
            </label>
            <input
              id={`bid-${player.number}`}
              value={bid}
              onChange={(event) => setBid(event.target.value.replace(/\D/g, "").slice(0, 5))}
              type="text"
              inputMode="numeric"
              autoComplete="off"
              className="h-12 w-32 rounded-xl border-2 border-white/15 bg-slate-950 px-3 text-center text-xl font-black text-amber-300 tabular-nums focus:border-amber-400 focus:outline-none"
            />
            {BUMPS.map((bump) => (
              <button
                key={bump}
                type="button"
                onClick={() => setBid(String((price || 0) + bump))}
                className="h-12 rounded-xl border border-white/15 bg-slate-950 px-3 text-sm font-bold text-slate-300 transition-colors hover:border-white/35 hover:text-white focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:outline-none"
              >
                +{bump}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setBid(String(BASE_PRICE))}
              className="h-12 rounded-xl border border-white/15 bg-slate-950 px-3 text-sm font-bold text-slate-400 transition-colors hover:border-white/35 hover:text-white focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:outline-none"
            >
              Base
            </button>
          </div>

          {/* Sell to a team */}
          <p className="mt-4 mb-2 text-xs font-semibold tracking-widest text-slate-400 uppercase">
            Sell to
          </p>
          {/* auto-fit, so the grid reflows itself for any number of teams —
              6, 8 or 10 all lay out evenly without touching this file. */}
          <div
            className="grid gap-2"
            style={{ gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))" }}
          >
            {summary.teams.map((entry) => {
              const tone = TEAM_TONES[entry.team.tone];
              const error = saleError(entry, price);
              return (
                <button
                  key={entry.team.id}
                  type="button"
                  disabled={error !== null}
                  title={error ?? `Sell to ${entry.team.name} for ${formatPoints(price)}`}
                  onClick={() => sell(entry.team.id)}
                  className={cn(
                    "flex flex-col items-start gap-0.5 rounded-xl border p-2.5 text-left transition-colors focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:outline-none",
                    tone.chip,
                    error
                      ? "cursor-not-allowed opacity-35"
                      : cn(tone.hover, "cursor-pointer")
                  )}
                >
                  <span className="text-sm font-black">{entry.team.name}</span>
                  <span className="text-[11px] font-semibold text-slate-400 tabular-nums">
                    {formatPoints(entry.remaining)} left · {entry.slotsLeft} slot
                    {entry.slotsLeft === 1 ? "" : "s"}
                  </span>
                </button>
              );
            })}
          </div>
        </>
      )}

      {/* Unsold */}
      {result?.status !== "unsold" && (
        <button
          type="button"
          onClick={() => {
            markUnsold(player.number);
            onDone?.();
          }}
          className="mt-4 inline-flex h-11 items-center gap-2 rounded-xl border border-rose-400/40 bg-rose-500/10 px-4 text-sm font-bold text-rose-200 transition-colors hover:bg-rose-500/20 focus-visible:ring-2 focus-visible:ring-rose-400 focus-visible:outline-none"
        >
          <XCircle className="size-4" aria-hidden />
          Mark unsold
        </button>
      )}

      {canBid && (
        <p className="mt-3 flex items-center gap-1.5 text-xs text-slate-500">
          <Gavel className="size-3.5" aria-hidden />
          Teams that cannot afford the bid, or would be left unable to fill their
          squad at base price, are greyed out.
        </p>
      )}
    </section>
  );
}

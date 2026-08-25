"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Gavel, SearchX, Ticket, Undo2, X } from "lucide-react";

import { LockButton } from "@/components/auction/lock-button";
import { ManagePanel } from "@/components/auction/manage-panel";
import { TeamRail } from "@/components/auction/team-rail";
import { PlayerSpotlight } from "@/components/player-spotlight";
import { getPlayer, parsePlayerNumber, playerList } from "@/data/players";
import { getTeam } from "@/data/teams";
import {
  formatPoints,
  lastAction,
  resultFor,
  summarize,
  undoLast,
  useAuction,
} from "@/lib/auction";

export default function AuctioneerPage() {
  const state = useAuction();
  const summary = useMemo(() => summarize(state, playerList), [state]);
  const undoLabel = lastAction(state);

  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const parsed = parsePlayerNumber(query);
  const player = parsed === null ? null : getPlayer(parsed);
  const result = player ? resultFor(state, player.number) : null;

  const clear = useCallback(() => {
    setQuery("");
    inputRef.current?.focus();
  }, []);

  // Ctrl+Z / Cmd+Z anywhere on the page. A mis-tap during live bidding is the
  // one mistake that has to be instantly reversible.
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "z") {
        event.preventDefault();
        undoLast();
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const donePercent = summary.total === 0 ? 0 : ((summary.sold + summary.unsold) / summary.total) * 100;

  const unsoldPool = summary.log.filter((entry) => entry.teamId === null);

  return (
    <main className="flex flex-1 flex-col bg-slate-950 px-4 pt-5 pb-12 sm:px-6">
      <div className="mx-auto w-full max-w-7xl">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="flex size-10 items-center justify-center rounded-xl border border-amber-400/30 bg-amber-400/10">
              <Gavel className="size-5 text-amber-400" aria-hidden />
            </span>
            <div>
              <h1 className="text-xl font-black tracking-tight text-white sm:text-2xl">
                Auction Console
              </h1>
              <p className="text-xs text-slate-400 tabular-nums">
                {summary.sold} sold · {summary.unsold} unsold · {summary.available} left
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={undoLast}
              disabled={!undoLabel}
              title={undoLabel ? `Undo: ${undoLabel}` : "Nothing to undo"}
              className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-white/15 bg-slate-900 px-3 text-xs font-bold text-slate-300 transition-colors hover:border-white/35 hover:text-white focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Undo2 className="size-3.5" aria-hidden />
              Undo
            </button>
            <LockButton />
          </div>
        </div>

        {/* Progress */}
        <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-slate-900">
          <div
            className="h-full rounded-full bg-amber-400 transition-[width] duration-500 ease-out"
            style={{ width: `${donePercent}%` }}
          />
        </div>

        <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,1fr)_260px]">
          <div>
            {/* Number entry */}
            <div className="relative">
              <label htmlFor="console-number" className="sr-only">
                Player number
              </label>
              <Ticket
                className="pointer-events-none absolute top-1/2 left-4 size-6 -translate-y-1/2 text-amber-400"
                aria-hidden
              />
              <input
                id="console-number"
                ref={inputRef}
                value={query}
                onChange={(event) => setQuery(event.target.value.replace(/\D/g, "").slice(0, 4))}
                onKeyDown={(event) => {
                  if (event.key === "Escape") clear();
                }}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                autoComplete="off"
                autoFocus
                enterKeyHint="search"
                placeholder="Player number"
                className="h-16 w-full rounded-2xl border-2 border-white/15 bg-slate-900 pr-16 pl-13 text-2xl font-bold text-white tabular-nums transition-colors duration-200 placeholder:text-lg placeholder:font-medium placeholder:text-slate-500 focus:border-amber-400 focus:outline-none sm:h-20 sm:text-3xl"
              />
              {query.length > 0 && (
                <button
                  type="button"
                  onClick={clear}
                  aria-label="Clear number"
                  className="absolute top-1/2 right-3 flex size-11 -translate-y-1/2 items-center justify-center rounded-xl bg-white/10 text-slate-300 transition-colors hover:bg-white/20 hover:text-white focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:outline-none"
                >
                  <X className="size-5" aria-hidden />
                </button>
              )}
            </div>
            <p className="mt-2 text-xs text-slate-500">
              <kbd className="font-sans font-semibold">Esc</kbd> clears ·{" "}
              <kbd className="font-sans font-semibold">Ctrl+Z</kbd> undoes the last sale
            </p>

            {/* Player + controls */}
            <div className="mt-5" aria-live="polite">
              {player ? (
                <div key={player.number} className="animate-pop-in space-y-4">
                  <PlayerSpotlight player={player} result={result} />
                  <ManagePanel key={player.number} player={player} onDone={clear} />
                </div>
              ) : parsed !== null ? (
                <div className="animate-pop-in flex flex-col items-center gap-3 rounded-3xl border border-dashed border-white/15 px-6 py-14 text-center">
                  <SearchX className="size-10 text-slate-600" aria-hidden />
                  <p className="text-lg font-bold text-white">No player with #{parsed}</p>
                </div>
              ) : (
                <IdlePanel summary={summary} unsoldCount={unsoldPool.length} onPick={setQuery} />
              )}
            </div>
          </div>

          <TeamRail teams={summary.teams} />
        </div>
      </div>
    </main>
  );
}

/** What the console shows between players: recent sales and the unsold pool. */
function IdlePanel({
  summary,
  unsoldCount,
  onPick,
}: {
  summary: ReturnType<typeof summarize>;
  unsoldCount: number;
  onPick: (value: string) => void;
}) {
  const recent = summary.log.slice(0, 8);
  const unsold = summary.log.filter((entry) => entry.teamId === null).slice(0, 24);

  return (
    <div className="space-y-4">
      {unsoldCount > 0 && (
        <section className="rounded-2xl border border-white/10 bg-slate-900/50 p-4">
          <h2 className="text-xs font-semibold tracking-widest text-slate-400 uppercase">
            Unsold pool · {unsoldCount}
          </h2>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {unsold.map((entry) => (
              <button
                key={entry.player.number}
                type="button"
                onClick={() => onPick(String(entry.player.number))}
                className="h-8 rounded-lg border border-rose-400/30 bg-rose-500/10 px-2.5 text-sm font-bold text-rose-200 tabular-nums transition-colors hover:bg-rose-500/20 focus-visible:ring-2 focus-visible:ring-rose-400 focus-visible:outline-none"
              >
                #{entry.player.number}
              </button>
            ))}
          </div>
        </section>
      )}

      <section className="rounded-2xl border border-white/10 bg-slate-900/50 p-4">
        <h2 className="text-xs font-semibold tracking-widest text-slate-400 uppercase">
          Recent activity
        </h2>
        {recent.length === 0 ? (
          <p className="mt-3 text-sm text-slate-500">
            Nothing yet. Type a player number to open the first lot.
          </p>
        ) : (
          <ul className="mt-3 divide-y divide-white/5">
            {recent.map((entry) => {
              const team = entry.teamId ? getTeam(entry.teamId) : undefined;
              return (
                <li
                  key={`${entry.player.number}-${entry.at}`}
                  className="flex items-center justify-between gap-3 py-2"
                >
                  <span className="truncate text-sm text-slate-300">
                    <span className="font-bold text-slate-500 tabular-nums">
                      #{entry.player.number}
                    </span>{" "}
                    {entry.player.name}
                  </span>
                  <span
                    className={
                      team
                        ? "shrink-0 text-sm font-bold text-emerald-300 tabular-nums"
                        : "shrink-0 text-sm font-bold text-rose-300"
                    }
                  >
                    {team ? `${team.short} · ${formatPoints(entry.price)}` : "Unsold"}
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}

"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, SearchX, Ticket, X } from "lucide-react";

import { PlayerSpotlight } from "@/components/player-spotlight";
import {
  getPlayer,
  parsePlayerNumber,
  totalPlayers,
  type PlayerEntry,
} from "@/data/players";
import { cn } from "@/lib/utils";

/** Must stay in sync with the `pop-out` duration in globals.css. */
const EXIT_MS = 130;

type View =
  | { kind: "empty" }
  | { kind: "missing"; number: number }
  | { kind: "player"; player: PlayerEntry };

function viewKey(view: View): string {
  switch (view.kind) {
    case "empty":
      return "empty";
    case "missing":
      return `missing-${view.number}`;
    case "player":
      return `player-${view.player.number}`;
  }
}

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // What the query *should* be showing right now.
  const target = useMemo<View>(() => {
    const parsed = parsePlayerNumber(query);
    if (parsed === null) return { kind: "empty" };
    const player = getPlayer(parsed);
    return player
      ? { kind: "player", player }
      : { kind: "missing", number: parsed };
  }, [query]);

  // What is actually on screen. It lags `target` by one exit animation so the
  // outgoing card can fade/scale down before the incoming one pops in.
  const [view, setView] = useState<View>(target);

  const targetKey = viewKey(target);
  const currentKey = viewKey(view);

  // Derived, not stored: while the two disagree, the visible card is on its
  // way out and the swap below is pending.
  const exiting = targetKey !== currentKey;

  useEffect(() => {
    if (!exiting) return;
    const timer = setTimeout(() => setView(target), EXIT_MS);
    // Fast typing restarts the timer, so the swap lands once input settles.
    return () => clearTimeout(timer);
  }, [target, exiting]);

  const motion = exiting ? "animate-pop-out" : "animate-pop-in";

  const clear = () => {
    setQuery("");
    inputRef.current?.focus();
  };

  return (
    <main className="flex flex-1 flex-col bg-slate-950 px-4 pt-5 pb-12 sm:px-6">
      <div className="mx-auto w-full max-w-3xl">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-400 transition-colors hover:text-white"
        >
          <ArrowLeft className="size-4" aria-hidden />
          Home
        </Link>

        <h1 className="mt-4 text-2xl font-black tracking-tight text-white sm:text-3xl">
          Live Auction Search
        </h1>
        <p className="mt-1 text-sm text-slate-400">
          Type a player number — the card appears instantly.
        </p>

        {/* Search input */}
        <form
          className="mt-5"
          onSubmit={(event) => event.preventDefault()}
          role="search"
        >
          <label htmlFor="player-number" className="sr-only">
            Player number
          </label>
          <div className="relative">
            <Ticket
              className="pointer-events-none absolute top-1/2 left-4 size-6 -translate-y-1/2 text-amber-400"
              aria-hidden
            />
            <input
              id="player-number"
              ref={inputRef}
              value={query}
              onChange={(event) =>
                setQuery(event.target.value.replace(/\D/g, "").slice(0, 4))
              }
              onKeyDown={(event) => {
                if (event.key === "Escape") clear();
              }}
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              autoComplete="off"
              autoFocus
              enterKeyHint="search"
              placeholder="Enter number"
              aria-label="Player number"
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
            Press <kbd className="font-sans font-semibold">Esc</kbd> to clear and
            enter the next number.
          </p>
        </form>

        {/* Result */}
        <div className="mt-6" aria-live="polite">
          {view.kind === "player" ? (
            <PlayerSpotlight
              key={currentKey}
              player={view.player}
              className={motion}
            />
          ) : view.kind === "missing" ? (
            <div
              key={currentKey}
              className={cn(
                "flex flex-col items-center gap-3 rounded-3xl border border-dashed border-white/15 px-6 py-14 text-center",
                motion
              )}
            >
              <SearchX className="size-10 text-slate-600" aria-hidden />
              <p className="text-lg font-bold text-white">
                No player with #{view.number}
              </p>
              <p className="text-sm text-slate-400">
                Check the number and try again.
              </p>
            </div>
          ) : (
            <div
              key={currentKey}
              className={cn(
                "flex flex-col items-center gap-3 rounded-3xl border border-dashed border-white/15 px-6 py-14 text-center",
                motion
              )}
            >
              <Ticket className="size-10 text-slate-600" aria-hidden />
              <p className="text-sm text-slate-400">
                {totalPlayers} players registered. Start typing a number.
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

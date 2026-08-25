"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { SearchX, Ticket, X } from "lucide-react";

import { AdminNav } from "@/components/auction/admin-nav";
import { ManagePanel } from "@/components/auction/manage-panel";
import { PlayerSpotlight } from "@/components/player-spotlight";
import { getPlayer, parsePlayerNumber, playerList } from "@/data/players";
import { resultFor, summarize, useAuction } from "@/lib/auction";

/**
 * The public search screen with the auction layered on top: the same instant
 * number entry, plus the sold/unsold mark and the controls to set it.
 */
export default function AdminSearchPage() {
  const state = useAuction();
  const summary = useMemo(() => summarize(state, playerList), [state]);

  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const parsed = parsePlayerNumber(query);
  const player = parsed === null ? null : getPlayer(parsed);
  const result = player ? resultFor(state, player.number) : null;

  const clear = useCallback(() => {
    setQuery("");
    inputRef.current?.focus();
  }, []);

  return (
    <main className="flex flex-1 flex-col bg-slate-950 px-4 pt-5 pb-12 sm:px-6">
      <div className="mx-auto w-full max-w-3xl">
        <AdminNav
          subtitle={`${summary.sold} sold · ${summary.unsold} unsold`}
        />

        <h1 className="mt-5 text-2xl font-black tracking-tight text-white sm:text-3xl">
          Search &amp; Mark
        </h1>
        <p className="mt-1 text-sm text-slate-400">
          Type a number to pull up a player and set the result.
        </p>

        <div className="relative mt-5">
          <label htmlFor="admin-number" className="sr-only">
            Player number
          </label>
          <Ticket
            className="pointer-events-none absolute top-1/2 left-4 size-6 -translate-y-1/2 text-amber-400"
            aria-hidden
          />
          <input
            id="admin-number"
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
            placeholder="Enter number"
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

        <div className="mt-6" aria-live="polite">
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
            <div className="flex flex-col items-center gap-3 rounded-3xl border border-dashed border-white/15 px-6 py-14 text-center">
              <Ticket className="size-10 text-slate-600" aria-hidden />
              <p className="text-sm text-slate-400 tabular-nums">
                {summary.available} of {summary.total} players still in the pool.
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

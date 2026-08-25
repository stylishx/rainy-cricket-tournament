"use client";

import { useMemo, useState } from "react";
import { X } from "lucide-react";

import { AdminNav } from "@/components/auction/admin-nav";
import { ManagePanel } from "@/components/auction/manage-panel";
import { StatusChip } from "@/components/auction/status-chip";
import { PlayerCard } from "@/components/player-card";
import {
  CATEGORY_FILTERS,
  getPlayer,
  playerList,
  type CategoryFilter,
} from "@/data/players";
import { resultFor, useAuction, type AuctionState } from "@/lib/auction";
import { cn } from "@/lib/utils";

const STATUS_FILTERS = ["All", "In pool", "Sold", "Unsold"] as const;
type StatusFilter = (typeof STATUS_FILTERS)[number];

function matchesStatus(state: AuctionState, number: number, filter: StatusFilter) {
  if (filter === "All") return true;
  const result = resultFor(state, number);
  if (filter === "In pool") return result === null;
  if (filter === "Sold") return result?.status === "sold";
  return result?.status === "unsold";
}

/**
 * The player book with the auction layered on top: every card carries its
 * sold/unsold mark, and tapping one opens the controls in a sheet pinned to
 * the bottom of the screen — the grid stays visible behind it.
 */
export default function AdminBookPage() {
  const state = useAuction();
  const [category, setCategory] = useState<CategoryFilter>("All");
  const [status, setStatus] = useState<StatusFilter>("All");
  const [selected, setSelected] = useState<number | null>(null);

  const visible = useMemo(
    () =>
      playerList.filter(
        (player) =>
          (category === "All" || player.category === category) &&
          matchesStatus(state, player.number, status)
      ),
    [category, status, state]
  );

  const selectedPlayer = selected === null ? null : getPlayer(selected);
  const selectedResult = selected === null ? null : resultFor(state, selected);

  return (
    <main className="flex flex-1 flex-col bg-slate-950 px-4 pt-5 pb-12 sm:px-6">
      <div className="mx-auto w-full max-w-7xl">
        <AdminNav subtitle={`${visible.length} shown`} />

        <h1 className="mt-5 text-2xl font-black tracking-tight text-white sm:text-3xl">
          Player Book
        </h1>
        <p className="mt-1 text-sm text-slate-400">
          Tap any card to sell it, mark it unsold, or put it back in the pool.
        </p>

        {/* Filters */}
        <div className="-mx-4 mt-5 flex gap-2 overflow-x-auto px-4 pb-2 sm:mx-0 sm:flex-wrap sm:px-0">
          {CATEGORY_FILTERS.map((option) => (
            <FilterChip
              key={option}
              label={option}
              active={category === option}
              onClick={() => setCategory(option)}
            />
          ))}
        </div>
        <div className="-mx-4 mt-1 flex gap-2 overflow-x-auto px-4 pb-2 sm:mx-0 sm:flex-wrap sm:px-0">
          {STATUS_FILTERS.map((option) => (
            <FilterChip
              key={option}
              label={option}
              active={status === option}
              tone="slate"
              onClick={() => setStatus(option)}
            />
          ))}
        </div>

        {/* Grid */}
        {visible.length > 0 ? (
          <div
            // Re-keying on the filters remounts the cards, so the cascade
            // replays every time the view changes.
            key={`${category}-${status}`}
            className={cn(
              "mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
              // Room for the sheet so the last row is never trapped under it.
              selectedPlayer && "pb-[26rem] sm:pb-80"
            )}
          >
            {visible.map((player, index) => (
              <PlayerCard
                key={player.number}
                player={player}
                result={resultFor(state, player.number)}
                selected={selected === player.number}
                onSelect={() => setSelected(player.number)}
                className="animate-fade-up"
                style={{ animationDelay: `${Math.min(index * 45, 450)}ms` }}
              />
            ))}
          </div>
        ) : (
          <p className="mt-10 rounded-2xl border border-dashed border-white/15 px-6 py-14 text-center text-sm text-slate-400">
            No players match these filters.
          </p>
        )}
      </div>

      {/* Manage sheet */}
      {selectedPlayer && (
        <div className="animate-pop-in fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-slate-950/95 backdrop-blur">
          <div className="mx-auto max-h-[70vh] w-full max-w-7xl overflow-y-auto px-4 py-4 sm:px-6">
            <div className="flex items-center justify-between gap-3">
              <div className="flex min-w-0 items-center gap-3">
                <span className="shrink-0 rounded-lg bg-amber-400 px-2.5 py-1 text-sm font-black text-slate-950 tabular-nums">
                  #{selectedPlayer.number}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-base font-bold text-white">
                    {selectedPlayer.name}
                  </p>
                  <p className="truncate text-xs text-slate-400">{selectedPlayer.role}</p>
                </div>
                <StatusChip result={selectedResult} className="shrink-0" />
              </div>

              <button
                type="button"
                onClick={() => setSelected(null)}
                aria-label="Close controls"
                className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white/10 text-slate-300 transition-colors hover:bg-white/20 hover:text-white focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:outline-none"
              >
                <X className="size-5" aria-hidden />
              </button>
            </div>

            <ManagePanel
              key={selectedPlayer.number}
              player={selectedPlayer}
              onDone={() => setSelected(null)}
              className="mt-3 border-0 bg-transparent p-0 sm:p-0"
            />
          </div>
        </div>
      )}
    </main>
  );
}

function FilterChip({
  label,
  active,
  onClick,
  tone = "amber",
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  tone?: "amber" | "slate";
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        "h-10 shrink-0 rounded-full px-4 text-sm font-semibold whitespace-nowrap transition-colors focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:outline-none",
        active
          ? tone === "amber"
            ? "bg-amber-400 text-slate-950"
            : "bg-white text-slate-950"
          : "border border-white/15 bg-slate-900 text-slate-300 hover:border-white/30 hover:text-white"
      )}
    >
      {label}
    </button>
  );
}

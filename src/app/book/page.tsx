"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowLeft } from "lucide-react";

import { PlayerCard } from "@/components/player-card";
import {
  CATEGORY_FILTERS,
  playerList,
  totalPlayers,
  type CategoryFilter,
} from "@/data/players";
import { cn } from "@/lib/utils";

export default function BookPage() {
  const [filter, setFilter] = useState<CategoryFilter>("All");

  const visible = useMemo(
    () =>
      filter === "All"
        ? playerList
        : playerList.filter((player) => player.category === filter),
    [filter]
  );

  return (
    <main className="flex flex-1 flex-col bg-slate-950 px-4 pt-5 pb-12 sm:px-6">
      <div className="mx-auto w-full max-w-7xl">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-400 transition-colors hover:text-white"
        >
          <ArrowLeft className="size-4" aria-hidden />
          Home
        </Link>

        <div className="mt-4 flex flex-wrap items-end justify-between gap-2">
          <div>
            <h1 className="text-2xl font-black tracking-tight text-white sm:text-3xl">
              Player Book
            </h1>
            <p className="mt-1 text-sm text-slate-400">
              Showing {visible.length} of {totalPlayers} players
            </p>
          </div>
        </div>

        {/* Category filters */}
        <div
          className="-mx-4 mt-5 flex gap-2 overflow-x-auto px-4 pb-2 sm:mx-0 sm:flex-wrap sm:px-0"
          role="tablist"
          aria-label="Filter by category"
        >
          {CATEGORY_FILTERS.map((category) => {
            const active = filter === category;
            return (
              <button
                key={category}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setFilter(category)}
                className={cn(
                  "h-11 shrink-0 rounded-full px-4 text-sm font-semibold whitespace-nowrap transition-colors focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:outline-none",
                  active
                    ? "bg-amber-400 text-slate-950"
                    : "border border-white/15 bg-slate-900 text-slate-300 hover:border-white/30 hover:text-white"
                )}
              >
                {category}
              </button>
            );
          })}
        </div>

        {/* Grid */}
        {visible.length > 0 ? (
          <div
            // Re-keying on the filter remounts the cards, so the cascade
            // replays every time the user switches category.
            key={filter}
            className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          >
            {visible.map((player, index) => (
              <PlayerCard
                key={player.number}
                player={player}
                className="animate-fade-up"
                style={{
                  // Capped so a long roster never leaves the last card waiting.
                  animationDelay: `${Math.min(index * 45, 450)}ms`,
                }}
              />
            ))}
          </div>
        ) : (
          <p className="mt-10 rounded-2xl border border-dashed border-white/15 px-6 py-14 text-center text-sm text-slate-400">
            No players in this category yet.
          </p>
        )}
      </div>
    </main>
  );
}

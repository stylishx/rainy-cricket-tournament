import Link from "next/link";
import { LayoutGrid, Search, Trophy } from "lucide-react";

import { totalPlayers } from "@/data/players";
import {
  TOURNAMENT_BYLINE,
  TOURNAMENT_NAME,
  TOURNAMENT_YEAR,
} from "@/data/tournament";

export default function HomePage() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center bg-slate-950 px-6 py-12">
      <div className="w-full max-w-md text-center">
        <div className="mx-auto mb-6 flex size-16 items-center justify-center rounded-2xl bg-amber-400 text-slate-950 shadow-lg shadow-amber-400/20">
          <Trophy className="size-8" aria-hidden />
        </div>

        <h1 className="text-4xl font-black tracking-tight text-white sm:text-5xl">
          {TOURNAMENT_NAME}
          <span className="block text-amber-400">{TOURNAMENT_YEAR}</span>
        </h1>
        <p className="mt-3 text-sm font-bold tracking-wide text-amber-400/90">
          {TOURNAMENT_BYLINE}
        </p>
        <p className="mt-1 text-base text-slate-400">
          {totalPlayers} players for auction.
        </p>

        <div className="mt-10 flex flex-col gap-4">
          <Link
            href="/search"
            className="flex h-16 items-center justify-center gap-3 rounded-2xl bg-amber-400 text-lg font-bold text-slate-950 shadow-lg shadow-amber-400/20 transition-all hover:bg-amber-300 focus-visible:ring-4 focus-visible:ring-amber-400/40 focus-visible:outline-none active:translate-y-px"
          >
            <Search className="size-6" aria-hidden />
            Search Player by Number
          </Link>

          <Link
            href="/book"
            className="flex h-16 items-center justify-center gap-3 rounded-2xl border border-white/15 bg-slate-900 text-lg font-bold text-white transition-all hover:border-white/30 hover:bg-slate-800 focus-visible:ring-4 focus-visible:ring-white/20 focus-visible:outline-none active:translate-y-px"
          >
            <LayoutGrid className="size-6" aria-hidden />
            See All Players
          </Link>
        </div>
      </div>
    </main>
  );
}

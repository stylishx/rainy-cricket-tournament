"use client";

import { useMemo } from "react";
import { TriangleAlert } from "lucide-react";

import { AdminNav } from "@/components/auction/admin-nav";
import { BackupTools } from "@/components/auction/backup-tools";
import { playerList, totalPlayers } from "@/data/players";
import { SQUAD_SIZE, TEAM_PURSE, TEAM_TONES, totalSlots } from "@/data/teams";
import { formatPoints, summarize, useAuction } from "@/lib/auction";
import { cn } from "@/lib/utils";

export default function AdminPage() {
  const state = useAuction();
  const summary = useMemo(() => summarize(state, playerList), [state]);

  const stats = [
    { label: "Sold", value: summary.sold, tone: "text-emerald-300" },
    { label: "Unsold", value: summary.unsold, tone: "text-rose-300" },
    { label: "In pool", value: summary.available, tone: "text-amber-300" },
    { label: "Seats", value: `${summary.sold}/${totalSlots}`, tone: "text-white" },
  ];

  return (
    <main className="flex flex-1 flex-col bg-slate-950 px-4 pt-5 pb-12 sm:px-6">
      <div className="mx-auto w-full max-w-7xl">
        <AdminNav subtitle={`${totalPlayers} players`} />

        <h1 className="mt-5 text-2xl font-black tracking-tight text-white sm:text-3xl">
          Auction Overview
        </h1>

        {/* Squad arithmetic is worth stating plainly rather than discovering
            at the end of the night. */}
        {totalPlayers > totalSlots && (
          <p className="mt-3 flex items-start gap-2 rounded-xl border border-amber-400/30 bg-amber-400/10 px-4 py-3 text-sm text-amber-200">
            <TriangleAlert className="mt-0.5 size-4 shrink-0" aria-hidden />
            <span>
              {totalPlayers} players for {totalSlots} seats (8 × {SQUAD_SIZE}).{" "}
              {totalPlayers - totalSlots} player
              {totalPlayers - totalSlots === 1 ? "" : "s"} cannot be placed if every
              squad fills up.
            </span>
          </p>
        )}

        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-white/10 bg-slate-900/50 px-4 py-3"
            >
              <p className="text-[11px] font-semibold tracking-widest text-slate-400 uppercase">
                {stat.label}
              </p>
              <p className={cn("text-2xl font-black tabular-nums", stat.tone)}>
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        {/* Squads */}
        <h2 className="mt-8 text-sm font-black tracking-wide text-white uppercase">
          Squads
        </h2>
        <div className="mt-3 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {summary.teams.map((entry) => {
            const tone = TEAM_TONES[entry.team.tone];
            return (
              <section
                key={entry.team.id}
                className="flex flex-col rounded-2xl border border-white/10 bg-slate-900/50 p-4"
              >
                <div className="flex items-baseline justify-between gap-2">
                  <h3 className={cn("truncate text-base font-black", tone.text)}>
                    {entry.team.name}
                  </h3>
                  <span className="shrink-0 text-xs font-bold text-slate-400 tabular-nums">
                    {entry.squad.length}/{SQUAD_SIZE}
                  </span>
                </div>

                <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-950">
                  <div
                    className={cn("h-full rounded-full", tone.bar)}
                    style={{ width: `${Math.min(100, (entry.spent / TEAM_PURSE) * 100)}%` }}
                  />
                </div>
                <p className="mt-1.5 text-[11px] font-semibold text-slate-400 tabular-nums">
                  {formatPoints(entry.spent)} spent · {formatPoints(entry.remaining)} left
                </p>

                <ul className="mt-3 flex-1 space-y-1">
                  {entry.squad.length === 0 ? (
                    <li className="text-xs text-slate-500">No players yet.</li>
                  ) : (
                    entry.squad.map((pick) => (
                      <li
                        key={pick.player.number}
                        className="flex items-baseline justify-between gap-2 text-xs"
                      >
                        <span className="truncate text-slate-300">
                          <span className="font-bold text-slate-500 tabular-nums">
                            #{pick.player.number}
                          </span>{" "}
                          {pick.player.name}
                        </span>
                        <span className="shrink-0 font-bold text-amber-300 tabular-nums">
                          {formatPoints(pick.price)}
                        </span>
                      </li>
                    ))
                  )}
                </ul>
              </section>
            );
          })}
        </div>

        <div className="mt-8">
          <BackupTools />
        </div>
      </div>
    </main>
  );
}

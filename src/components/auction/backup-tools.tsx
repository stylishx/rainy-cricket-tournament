"use client";

import { useMemo, useRef, useState } from "react";
import { Download, FileSpreadsheet, TriangleAlert, Upload } from "lucide-react";

import { playerList } from "@/data/players";
import {
  exportJson,
  importJson,
  resetAuction,
  summarize,
  toPlayersCsv,
  toTeamsCsv,
  useAuction,
} from "@/lib/auction";

/**
 * With no database, a downloaded file is the only backup and the only way to
 * carry an auction to another laptop. JSON is the one that can be restored;
 * the CSVs are for reading in Excel. Reset is behind a typed confirmation
 * because it is the one action Undo cannot walk back.
 */
export function BackupTools() {
  const state = useAuction();
  const summary = useMemo(() => summarize(state, playerList), [state]);
  const fileRef = useRef<HTMLInputElement>(null);
  const [note, setNote] = useState<string | null>(null);
  const [confirm, setConfirm] = useState("");

  const stamp = new Date().toISOString().slice(0, 10);

  function save(contents: string, filename: string, mime: string, message: string) {
    const blob = new Blob([contents], { type: mime });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
    setNote(message);
  }

  const download = () =>
    save(
      exportJson(state),
      `auction-${stamp}.json`,
      "application/json",
      "Backup downloaded — this is the file that can be restored."
    );

  async function upload(file: File) {
    const outcome = importJson(await file.text());
    setNote(outcome.ok ? "Backup restored." : outcome.error);
    if (fileRef.current) fileRef.current.value = "";
  }

  return (
    <section className="rounded-2xl border border-white/10 bg-slate-900/50 p-4 sm:p-5">
      <h2 className="text-sm font-black tracking-wide text-white uppercase">
        Backup &amp; export
      </h2>
      <p className="mt-1 text-xs text-slate-400">
        The auction lives in this browser only. Export at every break — the JSON file
        is what restores it after a crash or moves it to another machine. The CSVs
        open straight in Excel but cannot be imported back.
      </p>

      {/* For Excel */}
      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() =>
            save(
              toPlayersCsv(state, playerList),
              `auction-players-${stamp}.csv`,
              "text/csv;charset=utf-8",
              "Players sheet downloaded."
            )
          }
          className="inline-flex h-10 items-center gap-2 rounded-xl border border-emerald-400/40 bg-emerald-500/10 px-4 text-sm font-bold text-emerald-200 transition-colors hover:bg-emerald-500/20 focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:outline-none"
        >
          <FileSpreadsheet className="size-4" aria-hidden />
          Players (Excel)
        </button>

        <button
          type="button"
          onClick={() =>
            save(
              toTeamsCsv(summary),
              `auction-teams-${stamp}.csv`,
              "text/csv;charset=utf-8",
              "Teams sheet downloaded."
            )
          }
          className="inline-flex h-10 items-center gap-2 rounded-xl border border-emerald-400/40 bg-emerald-500/10 px-4 text-sm font-bold text-emerald-200 transition-colors hover:bg-emerald-500/20 focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:outline-none"
        >
          <FileSpreadsheet className="size-4" aria-hidden />
          Teams (Excel)
        </button>
      </div>

      {/* For restoring */}
      <div className="mt-2 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={download}
          className="inline-flex h-10 items-center gap-2 rounded-xl border border-white/15 bg-slate-950 px-4 text-sm font-bold text-slate-200 transition-colors hover:border-white/35 hover:text-white focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:outline-none"
        >
          <Download className="size-4" aria-hidden />
          Export JSON
        </button>

        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="inline-flex h-10 items-center gap-2 rounded-xl border border-white/15 bg-slate-950 px-4 text-sm font-bold text-slate-200 transition-colors hover:border-white/35 hover:text-white focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:outline-none"
        >
          <Upload className="size-4" aria-hidden />
          Import JSON
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="application/json,.json"
          className="sr-only"
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) void upload(file);
          }}
        />
      </div>

      {note && <p className="mt-3 text-xs font-semibold text-amber-300">{note}</p>}

      {/* Reset */}
      <div className="mt-5 rounded-xl border border-rose-500/30 bg-rose-500/5 p-4">
        <p className="flex items-center gap-2 text-sm font-bold text-rose-200">
          <TriangleAlert className="size-4" aria-hidden />
          Reset the whole auction
        </p>
        <p className="mt-1 text-xs text-rose-200/70">
          Clears every sale, every unsold mark and the undo history. Type RESET to enable.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <label htmlFor="reset-confirm" className="sr-only">
            Type RESET to confirm
          </label>
          <input
            id="reset-confirm"
            value={confirm}
            onChange={(event) => setConfirm(event.target.value.toUpperCase())}
            placeholder="RESET"
            autoComplete="off"
            className="h-10 w-32 rounded-xl border border-white/15 bg-slate-950 px-3 text-sm font-bold tracking-widest text-white focus:border-rose-400 focus:outline-none"
          />
          <button
            type="button"
            disabled={confirm !== "RESET"}
            onClick={() => {
              resetAuction();
              setConfirm("");
              setNote("Auction reset.");
            }}
            className="inline-flex h-10 items-center rounded-xl bg-rose-500 px-4 text-sm font-bold text-white transition-colors hover:bg-rose-400 focus-visible:ring-2 focus-visible:ring-rose-400 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-30"
          >
            Reset everything
          </button>
        </div>
      </div>
    </section>
  );
}

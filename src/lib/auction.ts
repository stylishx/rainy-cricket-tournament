/**
 * Auction state — a browser-local store, no database.
 *
 * The whole auction lives in `localStorage` under one key and is written on
 * every change, so a refresh, a crash or an accidental tab close mid-auction
 * loses nothing. The trade-off is that state is per-browser: the console and
 * the admin views stay in sync (same origin, plus a `storage` listener for
 * other tabs), but a second laptop starts empty. Export/Import is the bridge.
 */

import { useSyncExternalStore } from "react";

import {
  BASE_PRICE,
  SQUAD_SIZE,
  TEAM_PURSE,
  getTeam,
  teams,
  type Team,
} from "@/data/teams";
import { getPlayer, type PlayerEntry } from "@/data/players";

/**
 * Points, grouped. The locale is pinned rather than left to the runtime so the
 * server and the browser always produce the same string.
 */
const pointsFormat = new Intl.NumberFormat("en-US");

export function formatPoints(value: number): string {
  return pointsFormat.format(value);
}

export type SoldResult = {
  status: "sold";
  teamId: string;
  price: number;
  /** Epoch ms, used to order the activity log. */
  at: number;
};

export type UnsoldResult = { status: "unsold"; at: number };

export type PlayerResult = SoldResult | UnsoldResult;

type UndoEntry = {
  number: number;
  /** The player's result before the action — null means available. */
  previous: PlayerResult | null;
  label: string;
};

export type AuctionState = {
  version: 1;
  /** Keyed by player number as a string, because JSON has no numeric keys. */
  results: Record<string, PlayerResult>;
  undo: UndoEntry[];
};

const STORAGE_KEY = "rainy-auction-v1";
const UNDO_LIMIT = 50;

const EMPTY: AuctionState = { version: 1, results: {}, undo: [] };

let state: AuctionState = EMPTY;
let hydrated = false;
const listeners = new Set<() => void>();

function emit() {
  for (const listener of listeners) listener();
}

function parse(raw: string | null): AuctionState | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as Partial<AuctionState>;
    if (parsed?.version !== 1 || typeof parsed.results !== "object") return null;
    return {
      version: 1,
      results: (parsed.results ?? {}) as Record<string, PlayerResult>,
      undo: Array.isArray(parsed.undo) ? parsed.undo : [],
    };
  } catch {
    // Corrupt or unreadable storage — start clean rather than crash the page.
    return null;
  }
}

function hydrate() {
  if (hydrated || typeof window === "undefined") return;
  hydrated = true;
  state = parse(window.localStorage.getItem(STORAGE_KEY)) ?? EMPTY;

  // Keeps a second tab (console on one, admin board on another) in step.
  window.addEventListener("storage", (event) => {
    if (event.key !== STORAGE_KEY) return;
    state = parse(event.newValue) ?? EMPTY;
    emit();
  });
}

function commit(next: AuctionState) {
  state = next;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Private mode or a full quota: keep going in memory so the auction can
    // continue, and let Export be the operator's safety net.
  }
  emit();
}

function withResult(
  number: number,
  result: PlayerResult | null,
  label: string
): AuctionState {
  const key = String(number);
  const results = { ...state.results };
  if (result) results[key] = result;
  else delete results[key];

  const entry: UndoEntry = {
    number,
    previous: state.results[key] ?? null,
    label,
  };
  return {
    version: 1,
    results,
    undo: [entry, ...state.undo].slice(0, UNDO_LIMIT),
  };
}

/* -------------------------------------------------------------------------- */
/* Reads                                                                      */
/* -------------------------------------------------------------------------- */

function subscribe(listener: () => void) {
  hydrate();
  listeners.add(listener);
  // The first snapshot has to match the server's (empty) render, so the real
  // stored state is published right after mount instead of during it.
  queueMicrotask(emit);
  return () => {
    listeners.delete(listener);
  };
}

function getSnapshot() {
  return state;
}

function getServerSnapshot() {
  return EMPTY;
}

export function useAuction(): AuctionState {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export function resultFor(state: AuctionState, number: number): PlayerResult | null {
  return state.results[String(number)] ?? null;
}

export type SquadPick = { player: PlayerEntry; price: number; at: number };

export type TeamSummary = {
  team: Team;
  squad: SquadPick[];
  spent: number;
  remaining: number;
  slotsLeft: number;
  /** Most this team may bid while still affording base price for every empty slot. */
  maxBid: number;
  full: boolean;
};

export type LogEntry = SquadPick & { teamId: string | null };

export type AuctionSummary = {
  teams: TeamSummary[];
  sold: number;
  unsold: number;
  available: number;
  total: number;
  /** Newest first. */
  log: LogEntry[];
};

export function summarize(state: AuctionState, roster: PlayerEntry[]): AuctionSummary {
  const squads = new Map<string, SquadPick[]>(teams.map((team) => [team.id, []]));
  const log: LogEntry[] = [];
  let sold = 0;
  let unsold = 0;

  for (const player of roster) {
    const result = resultFor(state, player.number);
    if (!result) continue;
    if (result.status === "sold") {
      sold += 1;
      squads.get(result.teamId)?.push({ player, price: result.price, at: result.at });
      log.push({ player, price: result.price, at: result.at, teamId: result.teamId });
    } else {
      unsold += 1;
      log.push({ player, price: 0, at: result.at, teamId: null });
    }
  }

  log.sort((a, b) => b.at - a.at);

  const summaries = teams.map<TeamSummary>((team) => {
    const squad = (squads.get(team.id) ?? []).sort((a, b) => a.at - b.at);
    const spent = squad.reduce((total, pick) => total + pick.price, 0);
    const remaining = TEAM_PURSE - spent;
    const slotsLeft = SQUAD_SIZE - squad.length;
    return {
      team,
      squad,
      spent,
      remaining,
      slotsLeft,
      maxBid: slotsLeft > 0 ? remaining - (slotsLeft - 1) * BASE_PRICE : 0,
      full: slotsLeft === 0,
    };
  });

  return {
    teams: summaries,
    sold,
    unsold,
    available: roster.length - sold - unsold,
    total: roster.length,
    log,
  };
}

/**
 * Why this team cannot take this player at this price, or null if it can.
 * Both the console and the admin views run bids through here, so the purse
 * rules can never drift between screens.
 */
export function saleError(summary: TeamSummary, price: number): string | null {
  if (summary.full) {
    return `${summary.team.name} already has ${SQUAD_SIZE} players`;
  }
  if (!Number.isFinite(price) || price < BASE_PRICE) {
    return `Bid must be at least ${BASE_PRICE}`;
  }
  if (price > summary.remaining) {
    return `${summary.team.name} only has ${summary.remaining} left`;
  }
  if (price > summary.maxBid) {
    const others = summary.slotsLeft - 1;
    return `Leaves too little for ${others} more player${others === 1 ? "" : "s"} (max ${summary.maxBid})`;
  }
  return null;
}

/* -------------------------------------------------------------------------- */
/* Writes                                                                     */
/* -------------------------------------------------------------------------- */

export function sellPlayer(number: number, teamId: string, price: number) {
  const player = getPlayer(number);
  if (!player) return;
  commit(
    withResult(
      number,
      { status: "sold", teamId, price, at: Date.now() },
      `Sold #${number} ${player.name}`
    )
  );
}

export function markUnsold(number: number) {
  const player = getPlayer(number);
  if (!player) return;
  commit(
    withResult(number, { status: "unsold", at: Date.now() }, `Unsold #${number} ${player.name}`)
  );
}

/** Puts a sold or unsold player back into the pool. */
export function reopenPlayer(number: number) {
  const player = getPlayer(number);
  if (!player) return;
  commit(withResult(number, null, `Reopened #${number} ${player.name}`));
}

export function undoLast() {
  const [entry, ...rest] = state.undo;
  if (!entry) return;
  const results = { ...state.results };
  const key = String(entry.number);
  if (entry.previous) results[key] = entry.previous;
  else delete results[key];
  commit({ version: 1, results, undo: rest });
}

export function lastAction(state: AuctionState): string | null {
  return state.undo[0]?.label ?? null;
}

export function resetAuction() {
  commit({ version: 1, results: {}, undo: [] });
}

/* -------------------------------------------------------------------------- */
/* Backup                                                                     */
/* -------------------------------------------------------------------------- */

export function exportJson(state: AuctionState): string {
  return JSON.stringify({ ...state, exportedAt: new Date().toISOString() }, null, 2);
}

/**
 * One CSV cell. Anything containing a comma, a quote or a newline has to be
 * quoted, and inner quotes doubled — a player named O'Brien is fine, but a
 * role written "All-Rounder, Opener" would otherwise split into two columns.
 */
function cell(value: string | number): string {
  const text = String(value);
  return /[",\n\r]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

function toCsv(rows: (string | number)[][]): string {
  // The BOM is what makes Excel read the file as UTF-8; without it, names
  // with accents arrive mangled.
  return `﻿${rows.map((row) => row.map(cell).join(",")).join("\r\n")}\r\n`;
}

/** Master record: every player, one row, whatever their outcome. */
export function toPlayersCsv(state: AuctionState, roster: PlayerEntry[]): string {
  const rows: (string | number)[][] = [
    ["Number", "Name", "Role", "Category", "Base Price", "Status", "Team", "Sold Price"],
  ];

  for (const player of roster) {
    const result = resultFor(state, player.number);
    const team = result?.status === "sold" ? getTeam(result.teamId) : undefined;
    rows.push([
      player.number,
      player.name,
      player.role,
      player.category,
      player.basePrice,
      result ? (result.status === "sold" ? "Sold" : "Unsold") : "In pool",
      team?.name ?? "",
      result?.status === "sold" ? result.price : "",
    ]);
  }

  return toCsv(rows);
}

/** One row per team: squad size and where the purse went. */
export function toTeamsCsv(summary: AuctionSummary): string {
  const rows: (string | number)[][] = [
    ["Team", "Players", "Slots Left", "Spent", "Remaining", "Purse", "Squad"],
  ];

  for (const entry of summary.teams) {
    rows.push([
      entry.team.name,
      entry.squad.length,
      entry.slotsLeft,
      entry.spent,
      entry.remaining,
      TEAM_PURSE,
      entry.squad.map((pick) => `#${pick.player.number} ${pick.player.name}`).join("; "),
    ]);
  }

  return toCsv(rows);
}

export function importJson(raw: string): { ok: true } | { ok: false; error: string } {
  const parsed = parse(raw);
  if (!parsed) return { ok: false, error: "That file is not a valid auction backup." };
  commit(parsed);
  return { ok: true };
}

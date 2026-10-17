/**
 * Team presentation and the figures derived from the auction rules.
 *
 * DO NOT EDIT THE NUMBERS OR THE TEAM LIST HERE — they live in
 * `src/data/tournament.ts`. This file re-exports them so that every existing
 * import keeps working, and adds the values that are *calculated* from them.
 * Change the format in one place and these follow automatically.
 */

import {
  BASE_PRICE,
  SQUAD_SIZE,
  TEAM_PURSE,
  teams,
  type Team,
  type TeamTone,
} from "@/data/tournament";

export {
  BASE_PRICE,
  SQUAD_SIZE,
  TEAM_PURSE,
  teams,
  type Team,
  type TeamTone,
};

/* -------------------------------------------------------------------------- */
/* Derived figures — never typed by hand                                      */
/* -------------------------------------------------------------------------- */

/** How many teams are bidding. */
export const TEAM_COUNT = teams.length;

/** Total seats across the whole auction, e.g. 6 teams × 12 players = 72. */
export const totalSlots = TEAM_COUNT * SQUAD_SIZE;

/** The least a team can pay for a player. */
export const MIN_BID = BASE_PRICE;

/**
 * The most a team can bid on its very first player: spend everything except
 * the base price it must keep back for each remaining empty slot. Teams see
 * their own live ceiling as `maxBid` in `summarize()`; this is the opening
 * figure for the whole auction.
 */
export const MAX_OPENING_BID = TEAM_PURSE - (SQUAD_SIZE - 1) * BASE_PRICE;

/** Points a team must hold back to fill a full squad at base price. */
export const MIN_SQUAD_COST = SQUAD_SIZE * BASE_PRICE;

/* -------------------------------------------------------------------------- */
/* Tones                                                                      */
/* -------------------------------------------------------------------------- */

/**
 * Static class strings. Tailwind scans source text, so an interpolated
 * `bg-${tone}-400` would never be generated — the classes must be spelled out.
 */
export const TEAM_TONES: Record<
  TeamTone,
  { chip: string; hover: string; bar: string; text: string }
> = {
  amber: {
    chip: "border-amber-400/30 bg-amber-400/10 text-amber-300",
    hover: "hover:border-amber-400/70 hover:bg-amber-400/15",
    bar: "bg-amber-400",
    text: "text-amber-300",
  },
  sky: {
    chip: "border-sky-400/30 bg-sky-400/10 text-sky-300",
    hover: "hover:border-sky-400/70 hover:bg-sky-400/15",
    bar: "bg-sky-400",
    text: "text-sky-300",
  },
  emerald: {
    chip: "border-emerald-400/30 bg-emerald-400/10 text-emerald-300",
    hover: "hover:border-emerald-400/70 hover:bg-emerald-400/15",
    bar: "bg-emerald-400",
    text: "text-emerald-300",
  },
  violet: {
    chip: "border-violet-400/30 bg-violet-400/10 text-violet-300",
    hover: "hover:border-violet-400/70 hover:bg-violet-400/15",
    bar: "bg-violet-400",
    text: "text-violet-300",
  },
  rose: {
    chip: "border-rose-400/30 bg-rose-400/10 text-rose-300",
    hover: "hover:border-rose-400/70 hover:bg-rose-400/15",
    bar: "bg-rose-400",
    text: "text-rose-300",
  },
  orange: {
    chip: "border-orange-400/30 bg-orange-400/10 text-orange-300",
    hover: "hover:border-orange-400/70 hover:bg-orange-400/15",
    bar: "bg-orange-400",
    text: "text-orange-300",
  },
  teal: {
    chip: "border-teal-400/30 bg-teal-400/10 text-teal-300",
    hover: "hover:border-teal-400/70 hover:bg-teal-400/15",
    bar: "bg-teal-400",
    text: "text-teal-300",
  },
  fuchsia: {
    chip: "border-fuchsia-400/30 bg-fuchsia-400/10 text-fuchsia-300",
    hover: "hover:border-fuchsia-400/70 hover:bg-fuchsia-400/15",
    bar: "bg-fuchsia-400",
    text: "text-fuchsia-300",
  },
};

const byId = new Map(teams.map((team) => [team.id, team]));

export function getTeam(id: string): Team | undefined {
  return byId.get(id);
}

export function teamLabel(id: string): string {
  return byId.get(id)?.name ?? "Unknown team";
}

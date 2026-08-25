/**
 * Auction rules and the eight team slots.
 *
 * Everything is points — no currency, no database. These four numbers are the
 * single source of truth for every purse calculation in the app, so changing
 * the format or the squad size only ever needs an edit here.
 *
 * To rename a team, edit its `name` / `short` below. Nothing else in the code
 * references the labels.
 */

export const TEAM_PURSE = 10_000;
export const SQUAD_SIZE = 10;
export const BASE_PRICE = 300;

export type TeamTone =
  | "amber"
  | "sky"
  | "emerald"
  | "violet"
  | "rose"
  | "orange"
  | "teal"
  | "fuchsia";

export type Team = {
  id: string;
  name: string;
  /** 2–3 character label for tight spaces. */
  short: string;
  tone: TeamTone;
};

export const teams: Team[] = [
  { id: "t1", name: "MM WARRIORS", short: "MW", tone: "amber" },
  { id: "t2", name: "RAJESH 11", short: "R11", tone: "sky" },
  { id: "t3", name: "HARDIK BLASTER", short: "HB", tone: "emerald" },
  { id: "t4", name: "AAROHI 11", short: "A11", tone: "violet" },
  { id: "t5", name: "MAMA SURVE 11", short: "MS", tone: "rose" },
  { id: "t6", name: "VISHAL 11", short: "V11", tone: "orange" },
  { id: "t7", name: "KUMAR & BHAIJAAN 11", short: "KB", tone: "teal" },
  { id: "t8", name: "ROYAL DEFENDERS", short: "RD", tone: "fuchsia" },
];

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

/** Total seats across the whole auction: 8 × 10 = 80. */
export const totalSlots = teams.length * SQUAD_SIZE;

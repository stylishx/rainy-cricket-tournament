/**
 * ============================================================================
 *  THE ONLY FILE YOU NEED TO EDIT
 * ============================================================================
 *
 * Tournament name, the auction rules and the team list all live here. Every
 * screen in the app reads from this file, so one edit here changes the whole
 * app — titles, purse bars, squad counters, bid limits and warnings.
 *
 *  - Rename the tournament?        edit TOURNAMENT_NAME / YEAR / HOST below.
 *  - Want 6 teams instead of 8?    delete team rows from `teams`.
 *  - Want 12 players per squad?    change SQUAD_SIZE.
 *  - Different money or base bid?   change TEAM_PURSE / BASE_PRICE.
 *
 * Nothing else in the code has these numbers or names typed in by hand.
 */

/* -------------------------------------------------------------------------- */
/* Branding                                                                   */
/* -------------------------------------------------------------------------- */

export const TOURNAMENT_NAME = "SHRADHANJALI CHASHAK";
export const TOURNAMENT_YEAR = "2026";
export const TOURNAMENT_HOST = "Omkar Desai";

/* -------------------------------------------------------------------------- */
/* Auction rules                                                              */
/* -------------------------------------------------------------------------- */

/** Points each team may spend across its whole squad. */
export const TEAM_PURSE = 10_000;

/** Players every team must end up with — also the number each one may buy. */
export const SQUAD_SIZE = 12;

/** The lowest a player can be sold for. */
export const BASE_PRICE = 300;

/* -------------------------------------------------------------------------- */
/* Teams                                                                      */
/* -------------------------------------------------------------------------- */

/**
 * Colour slots. Add or remove a team freely — every tone listed here is
 * available, and unused ones simply go unused.
 */
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

/**
 * The teams bidding in this auction. The app counts this list — it never
 * assumes how long it is — so adding or removing a row is all it takes.
 * Keep each `id` unique and stable; results are saved against it.
 */
export const teams: Team[] = [
  { id: "t1", name: "MM WARRIORS", short: "MW", tone: "amber" },
  { id: "t2", name: "RAJESH 11", short: "R11", tone: "sky" },
  { id: "t3", name: "HARDIK BLASTER", short: "HB", tone: "emerald" },
  { id: "t4", name: "AAROHI 11", short: "A11", tone: "violet" },
  { id: "t5", name: "MAMA SURVE 11", short: "MS", tone: "rose" },
  { id: "t6", name: "VISHAL 11", short: "V11", tone: "orange" },
];

/* -------------------------------------------------------------------------- */
/* Derived labels — built from the three names above, do not edit             */
/* -------------------------------------------------------------------------- */

/** e.g. "SHRADHANJALI CHASHAK 2026" — used for page titles. */
export const TOURNAMENT_TITLE = `${TOURNAMENT_NAME} ${TOURNAMENT_YEAR}`;

/** e.g. "By Omkar Desai" — shown under the title. */
export const TOURNAMENT_BYLINE = `By ${TOURNAMENT_HOST}`;

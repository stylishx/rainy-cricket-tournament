/**
 * Central player dataset for the auction.
 *
 * The KEY is the player's auction number (also used as the id).
 * Images live in /public/players/ — any extension works (.jpg, .png, .webp).
 */

export type PlayerCategory =
  | "Batsman"
  | "Bowler"
  | "All-Rounder"
  | "Wicket-Keeper";

export type Player = {
  /** Full display name. */
  name: string;
  /** Free-text role shown on the card, e.g. "Left Hand Batsman". */
  role: string;
  /** Bucket used by the /book filters. */
  category: PlayerCategory;
  /** Local static path under /public. */
  imageSrc: string;
  /** Rendered verbatim — put "100", "₹100" or "100 pts", whatever you use. */
  basePrice: string;
};

export const players: Record<number, Player> = {
  1: {
    name: "John Doe",
    role: "Left Hand Batsman",
    category: "Batsman",
    imageSrc: "/players/player1.jpeg",
    basePrice: "100",
  },
  2: {
    name: "Jane Smith",
    role: "Right Arm Fast Bowler",
    category: "Bowler",
    imageSrc: "/players/player2.jpeg",
    basePrice: "150",
  },
  3: {
    name: "Arjun Mehta",
    role: "Right Hand Batsman",
    category: "Batsman",
    imageSrc: "/players/player3.jpg",
    basePrice: "120",
  },
  4: {
    name: "Rahul Verma",
    role: "Wicket-Keeper Batsman",
    category: "Wicket-Keeper",
    imageSrc: "/players/player4.jpg",
    basePrice: "200",
  },
  5: {
    name: "Sameer Khan",
    role: "Left Arm Spinner",
    category: "Bowler",
    imageSrc: "/players/player5.jpg",
    basePrice: "90",
  },
  6: {
    name: "Vikram Rao",
    role: "Batting All-Rounder",
    category: "All-Rounder",
    imageSrc: "/players/player6.jpg",
    basePrice: "180",
  },
  7: {
    name: "Imran Sheikh",
    role: "Right Arm Medium Pacer",
    category: "Bowler",
    imageSrc: "/players/player7.jpg",
    basePrice: "110",
  },
  8: {
    name: "Nikhil Joshi",
    role: "Bowling All-Rounder",
    category: "All-Rounder",
    imageSrc: "/players/player8.jpg",
    basePrice: "160",
  },
  9: {
    name: "Aditya Nair",
    role: "Wicket-Keeper",
    category: "Wicket-Keeper",
    imageSrc: "/players/player9.jpg",
    basePrice: "140",
  },
  10: {
    name: "Karan Patel",
    role: "Right Hand Opening Batsman",
    category: "Batsman",
    imageSrc: "/players/player10.jpg",
    basePrice: "130",
  },
  11: {
    name: "Rohit Desai",
    role: "Left Arm Fast Bowler",
    category: "Bowler",
    imageSrc: "/players/player11.jpg",
    basePrice: "170",
  },
  12: {
    name: "Manish Gupta",
    role: "All-Rounder",
    category: "All-Rounder",
    imageSrc: "/players/player12.jpg",
    basePrice: "150",
  },
};

/** A player plus the number it is keyed by. */
export type PlayerEntry = Player & { number: number };

export const CATEGORY_FILTERS = [
  "All",
  "Batsman",
  "Bowler",
  "All-Rounder",
  "Wicket-Keeper",
] as const;

export type CategoryFilter = (typeof CATEGORY_FILTERS)[number];

/** Every player, sorted by auction number. */
export const playerList: PlayerEntry[] = Object.entries(players)
  .map(([number, player]) => ({ number: Number(number), ...player }))
  .sort((a, b) => a.number - b.number);

export const totalPlayers = playerList.length;

/** Look up a single player by auction number. */
export function getPlayer(number: number): PlayerEntry | null {
  const player = players[number];
  return player ? { number, ...player } : null;
}

/** "007" -> 7, "" / "abc" -> null. */
export function parsePlayerNumber(raw: string): number | null {
  const digits = raw.replace(/\D/g, "");
  if (!digits) return null;
  return Number.parseInt(digits, 10);
}

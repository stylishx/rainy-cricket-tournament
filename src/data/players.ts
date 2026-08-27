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
    name: "Aafaque",
    role: "Left Arm Bowler",
    category: "Bowler",
    imageSrc: "/players/player1.jpeg",
    basePrice: "300",
  },
  2: {
    name: "Asif Miraroad",
    role: "Right Arm Bowler",
    category: "Bowler",
    imageSrc: "/players/player2.jpeg",
    basePrice: "300",
  },
  3: {
    name: "Vijya Nambiar",
    role: "Batting All Rounder",
    category: "All-Rounder",
    imageSrc: "/players/player3.jpeg",
    basePrice: "300",
  },
  4: {
    name: "Shukriya Singh",
    role: "Right Arm Bowler",
    category: "Bowler",
    imageSrc: "/players/player4.jpeg",
    basePrice: "300",
  },
  5: {
    name: "Uday (Sam)",
    role: "Left Arm Bowler",
    category: "Bowler",
    imageSrc: "/players/player5.jpeg",
    basePrice: "300",
  },
  6: {
    name: "Amir DZ",
    role: "Right Hand Batsman",
    category: "Batsman",
    imageSrc: "/players/player6.jpeg",
    basePrice: "300",
  },
  7: {
    name: "Nadeem",
    role: "Left Hand Batsman",
    category: "Batsman",
    imageSrc: "/players/player7.jpeg",
    basePrice: "300",
  },
  8: {
    name: "Suraj Anna",
    role: "All-Rounder",
    category: "All-Rounder",
    imageSrc: "/players/player8.jpeg",
    basePrice: "300",
  },
  9: {
    name: "Sharvesh Gosav",
    role: "All-Rounder",
    category: "All-Rounder",
    imageSrc: "/players/player9.jpeg",
    basePrice: "300",
  },
  10: {
    name: "Akib",
    role: "Batsman",
    category: "Batsman",
    imageSrc: "/players/player10.jpeg",
    basePrice: "300",
  },
  11: {
    name: "Mohsin",
    role: "Throw Bowler",
    category: "Bowler",
    imageSrc: "/players/player11.jpeg",
    basePrice: "300",
  },
  12: {
    name: "Siddesh Double",
    role: "Batsman",
    category: "Batsman",
    imageSrc: "/players/player12.jpeg",
    basePrice: "300",
  },
  13: {
    name: "Akshay Gaikwad",
    role: "Batsman",
    category: "Batsman",
    imageSrc: "/players/player13.jpeg",
    basePrice: "300",
  },
  14: {
    name: "Atif Naik",
    role: "Batsman",
    category: "Batsman",
    imageSrc: "/players/player14.jpeg",
    basePrice: "300",
  },
  15: {
    name: "Aadil (Kurla West)",
    role: "Batsman",
    category: "Batsman",
    imageSrc: "/players/player15.jpeg",
    basePrice: "300",
  },
  16: {
    name: "Guddu King",
    role: "All-Rounder",
    category: "All-Rounder",
    imageSrc: "/players/player16.jpeg",
    basePrice: "300",
  },
  17: {
    name: "Babbu",
    role: "Throw Bowler",
    category: "Bowler",
    imageSrc: "/players/player17.jpeg",
    basePrice: "300",
  },
  18: {
    name: "Atharva",
    role: "All-Rounder",
    category: "All-Rounder",
    imageSrc: "/players/player18.jpeg",
    basePrice: "300",
  },
  19: {
    name: "Shanu",
    role: "Batsman",
    category: "Batsman",
    imageSrc: "/players/player19.jpeg",
    basePrice: "300",
  },
  20: {
    name: "Farhan Shamim Tower",
    role: "Batsman",
    category: "Batsman",
    imageSrc: "/players/player20.jpeg",
    basePrice: "300",
  },
  21: {
    name: "Omkar Desai",
    role: "All-Rounder",
    category: "All-Rounder",
    imageSrc: "/players/player21.jpeg",
    basePrice: "300",
  },
  22: {
    name: "Harsh Babu",
    role: "Bowler",
    category: "Bowler",
    imageSrc: "/players/player22.jpeg",
    basePrice: "300",
  },
  23: {
    name: "Ali",
    role: "Batsman",
    category: "Batsman",
    imageSrc: "/players/player23.jpeg",
    basePrice: "300",
  },
  24: {
    name: "Pradip Bade (Mama)",
    role: "All-Rounder",
    category: "All-Rounder",
    imageSrc: "/players/player24.jpeg",
    basePrice: "300",
  },
  25: {
    name: "Ram",
    role: "All-Rounder",
    category: "All-Rounder",
    imageSrc: "/players/player25.jpeg",
    basePrice: "300",
  },
  26: {
    name: "Amwar",
    role: "Bowler",
    category: "Bowler",
    imageSrc: "/players/player26.jpeg",
    basePrice: "300",
  },
  27: {
    name: "Hashim",
    role: "Bowler",
    category: "Bowler",
    imageSrc: "/players/player27.jpeg",
    basePrice: "300",
  },
  28: {
    name: "Immo",
    role: "Batsman",
    category: "Batsman",
    imageSrc: "/players/player28.jpeg",
    basePrice: "300",
  },
  29: {
    name: "Sameer 7 se 7",
    role: "Batsman",
    category: "Batsman",
    imageSrc: "/players/player29.jpeg",
    basePrice: "300",
  },
  30: {
    name: "Wasim Shaikh",
    role: "Batsman",
    category: "Batsman",
    imageSrc: "/players/player30.jpeg",
    basePrice: "300",
  },
  31: {
    name: "Zaid Saudagar",
    role: "Batsman",
    category: "Batsman",
    imageSrc: "/players/player31.jpeg",
    basePrice: "300",
  },
  32: {
    name: "Mehul",
    role: "Throw All-Rounder",
    category: "All-Rounder",
    imageSrc: "/players/player32.jpeg",
    basePrice: "300",
  },
  33: {
    name: "Lucky Chauhan",
    role: "Bowler",
    category: "Bowler",
    imageSrc: "/players/player33.jpeg",
    basePrice: "300",
  },
  34: {
    name: "Niraj",
    role: "Batsman",
    category: "Batsman",
    imageSrc: "/players/player34.jpeg",
    basePrice: "300",
  },
  35: {
    name: "Sahil",
    role: "All-Rounder",
    category: "All-Rounder",
    imageSrc: "/players/player35.jpeg",
    basePrice: "300",
  },
  36: {
    name: "Jyoti Ram Takle",
    role: "Bowler",
    category: "Bowler",
    imageSrc: "/players/player36.jpeg",
    basePrice: "300",
  },
  37: {
    name: "Sudhir Maurya",
    role: "Batsman",
    category: "Batsman",
    imageSrc: "/players/player37.jpeg",
    basePrice: "300",
  },
  38: {
    name: "Ali Abbas (ballu)",
    role: "Batsman",
    category: "Batsman",
    imageSrc: "/players/player38.jpeg",
    basePrice: "300",
  },
  39: {
    name: "Ayan Gidda",
    role: "All-Rounder",
    category: "All-Rounder",
    imageSrc: "/players/player39.jpeg",
    basePrice: "300",
  },
  40: {
    name: "Aiju",
    role: "All-Rounder",
    category: "All-Rounder",
    imageSrc: "/players/player40.jpeg",
    basePrice: "300",
  },
  41: {
    name: "Kumar",
    role: "Batsman",
    category: "Batsman",
    imageSrc: "/players/player41.jpeg",
    basePrice: "300",
  },
  42: {
    name: "Kaif Surve",
    role: "All-Rounder",
    category: "All-Rounder",
    imageSrc: "/players/player42.jpeg",
    basePrice: "300",
  },
  43: {
    name: "Hasmukh",
    role: "Batsman",
    category: "Batsman",
    imageSrc: "/players/player43.jpeg",
    basePrice: "300",
  },
  44: {
    name: "Vishal",
    role: "Batsman",
    category: "Batsman",
    imageSrc: "/players/player44.jpeg",
    basePrice: "300",
  },
  45: {
    name: "Asif Bhaijaan",
    role: "Batsman",
    category: "Batsman",
    imageSrc: "/players/player45.jpeg",
    basePrice: "300",
  },
  46: {
    name: "Mukhtar Qureshi",
    role: "Batsman",
    category: "Batsman",
    imageSrc: "/players/player46.jpeg",
    basePrice: "300",
  },
  47: {
    name: "Huzaif",
    role: "Bowler",
    category: "Bowler",
    imageSrc: "/players/player47.jpeg",
    basePrice: "300",
  },
  48: {
    name: "Arbaz",
    role: "Bowler",
    category: "Bowler",
    imageSrc: "/players/player48.jpeg",
    basePrice: "300",
  },
  49: {
    name: "Asif Ducting",
    role: "Batsman",
    category: "Batsman",
    imageSrc: "/players/player49.jpeg",
    basePrice: "300",
  },
  50: {
    name: "Ayaan Ducting",
    role: "Bowler",
    category: "Bowler",
    imageSrc: "/players/player50.jpeg",
    basePrice: "300",
  },
  51: {
    name: "Wasim Bammay",
    role: "Batsman",
    category: "Batsman",
    imageSrc: "/players/player51.jpeg",
    basePrice: "300",
  },
  52: {
    name: "Imran Khan",
    role: "Throw All-Rounder",
    category: "All-Rounder",
    imageSrc: "/players/player52.jpeg",
    basePrice: "300",
  },
  53: {
    name: "Khalid Bravo",
    role: "All-Rounder",
    category: "All-Rounder",
    imageSrc: "/players/player53.jpeg",
    basePrice: "300",
  },
  54: {
    name: "Rj Vicky (Lalla)",
    role: "Batsman",
    category: "Batsman",
    imageSrc: "/players/player54.jpeg",
    basePrice: "300",
  },
  55: {
    name: "Shezaad Chabi",
    role: "Bowler",
    category: "Bowler",
    imageSrc: "/players/player55.jpeg",
    basePrice: "300",
  },
  56: {
    name: "Rasheed Khan",
    role: "Bowler",
    category: "Bowler",
    imageSrc: "/players/player56.jpeg",
    basePrice: "300",
  },
  57: {
    name: "Moin Naik",
    role: "Batsman",
    category: "Batsman",
    imageSrc: "/players/player57.jpeg",
    basePrice: "300",
  },
  58: {
    name: "Shailesh Loni",
    role: "All-Rounder",
    category: "All-Rounder",
    imageSrc: "/players/player58.jpeg",
    basePrice: "300",
  },
  59: {
    name: "Sachin Sawamt",
    role: "Batsman",
    category: "Batsman",
    imageSrc: "/players/player59.jpeg",
    basePrice: "300",
  },
  60: {
    name: "Vijay Verma",
    role: "Bowler",
    category: "Bowler",
    imageSrc: "/players/player60.jpeg",
    basePrice: "300",
  },
  61: {
    name: "Pintu",
    role: "Bowler",
    category: "Bowler",
    imageSrc: "/players/player61.jpeg",
    basePrice: "300",
  },
  62: {
    name: "Rashid Bawla",
    role: "Throw All-Rounder",
    category: "All-Rounder",
    imageSrc: "/players/player62.jpeg",
    basePrice: "300",
  },
  63: {
    name: "Junaid",
    role: "Batsman",
    category: "Batsman",
    imageSrc: "/players/player63.jpeg",
    basePrice: "300",
  },
  64: {
    name: "Colour",
    role: "Batsman",
    category: "Batsman",
    imageSrc: "/players/player64.jpeg",
    basePrice: "300",
  },
  65: {
    name: "Shree",
    role: "Batsman",
    category: "Batsman",
    imageSrc: "/players/player65.jpeg",
    basePrice: "300",
  },
  66: {
    name: "Santosh",
    role: "Batsman",
    category: "Batsman",
    imageSrc: "/players/player66.jpeg",
    basePrice: "300",
  },
  67: {
    name: "Rehan (TFS)",
    role: "Left Hand Batsman",
    category: "Batsman",
    imageSrc: "/players/player67.jpeg",
    basePrice: "300",
  },
  68: {
    name: "Altamash",
    role: "Bowler",
    category: "Bowler",
    imageSrc: "/players/player68.jpeg",
    basePrice: "300",
  },
  69: {
    name: "Ayaan Baba",
    role: "Bowler",
    category: "Bowler",
    imageSrc: "/players/player69.jpeg",
    basePrice: "300",
  },
  70: {
    name: "Dinesh Bhosle",
    role: "Bowler",
    category: "Bowler",
    imageSrc: "/players/player70.jpeg",
    basePrice: "300",
  },
  71: {
    name: "Bhopiya",
    role: "Right Arm Bowler + Throw bowler ",
    category: "Bowler",
    imageSrc: "/players/player71.jpeg",
    basePrice: "300",
  },
  72: {
    name: "Faizan Gudu",
    role: "Batsman",
    category: "Batsman",
    imageSrc: "/players/player72.jpeg",
    basePrice: "300",
  },
  73: {
    name: "Imran Umarwadi",
    role: "Batsman",
    category: "Batsman",
    imageSrc: "/players/player73.jpeg",
    basePrice: "300",
  },
  74: {
    name: "Zaman Shaikh",
    role: "Batsman",
    category: "Batsman",
    imageSrc: "/players/player74.jpeg",
    basePrice: "300",
  },
  75: {
    name: "Raza",
    role: "Left Arm Bowler",
    category: "Bowler",
    imageSrc: "/players/player75.jpeg",
    basePrice: "300",
  },
  76: {
    name: "Shahid Kadam",
    role: "Batsman",
    category: "Batsman",
    imageSrc: "/players/player76.jpeg",
    basePrice: "300",
  },
  77: {
    name: "Samir Shaikh",
    role: "Bowler",
    category: "Bowler",
    imageSrc: "/players/player77.jpeg",
    basePrice: "300",
  },
  78: {
    name: "Zamir Ali (Chittu)",
    role: "Batsman",
    category: "Batsman",
    imageSrc: "/players/player78.jpeg",
    basePrice: "300",
  },
  79: {
    name: "Mubeen",
    role: "All-Rounder",
    category: "All-Rounder",
    imageSrc: "/players/player79.jpeg",
    basePrice: "300",
  },
  80: {
    name: "Aleem",
    role: "All-Rounder",
    category: "All-Rounder",
    imageSrc: "/players/player80.jpeg",
    basePrice: "300",
  },
  81: {
    name: "Shailiya",
    role: "All-Rounder",
    category: "All-Rounder",
    imageSrc: "/players/player81.jpeg",
    basePrice: "300",
  },
  82: {
    name: "Ayaan Voda",
    role: "Batsman",
    category: "Batsman",
    imageSrc: "/players/player82.jpeg",
    basePrice: "300",
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

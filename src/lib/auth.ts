/**
 * Access codes for the two gated roles.
 *
 * There is no database, so the "session" is a signed cookie shaped
 * `role.expiry.signature`. The signature is an HMAC over `role.expiry` keyed
 * with AUCTION_SECRET, which is what stops a visitor from simply typing
 * `document.cookie = "rainy_session=admin"` in the console — an httpOnly
 * cookie cannot be read by scripts, but scripts can still *write* a cookie of
 * the same name, so the value has to prove it came from the server.
 *
 * Web Crypto only: this module is imported by middleware, which runs on the
 * Edge runtime and has no Node built-ins.
 */

export const SESSION_COOKIE = "rainy_session";

export const ROLES = ["auctioneer", "admin"] as const;
export type Role = (typeof ROLES)[number];

/** How long an unlock lasts. One long tournament day. */
export const SESSION_HOURS = 12;

const encoder = new TextEncoder();

function secret(): string {
  return process.env.AUCTION_SECRET ?? "rainy-cricket-change-me";
}

async function sign(payload: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(payload));
  return Array.from(new Uint8Array(signature))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

/** Length-independent, value-independent comparison. */
function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i += 1) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export async function signSession(role: Role): Promise<string> {
  const expiry = Date.now() + SESSION_HOURS * 60 * 60 * 1000;
  const payload = `${role}.${expiry}`;
  return `${payload}.${await sign(payload)}`;
}

export async function verifySession(token: string | undefined): Promise<Role | null> {
  if (!token) return null;
  const [role, expiry, signature] = token.split(".");
  if (!role || !expiry || !signature) return null;
  if (!ROLES.includes(role as Role)) return null;
  if (!Number.isFinite(Number(expiry)) || Number(expiry) < Date.now()) return null;
  const expected = await sign(`${role}.${expiry}`);
  return safeEqual(expected, signature) ? (role as Role) : null;
}

/**
 * Which role a typed code unlocks, if any. Codes are read from the
 * environment so they never appear in the client bundle; the fallbacks only
 * exist so a fresh clone runs without setup.
 */
export function roleFromCode(code: string): Role | null {
  const admin = process.env.ADMIN_CODE ?? "246810";
  const auctioneer = process.env.AUCTIONEER_CODE ?? "135791";
  if (code && safeEqual(code, admin)) return "admin";
  if (code && safeEqual(code, auctioneer)) return "auctioneer";
  return null;
}

/** Admin can go anywhere the auctioneer can. */
export function roleAllows(role: Role, required: Role): boolean {
  return role === "admin" || role === required;
}

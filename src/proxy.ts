import { NextResponse, type NextRequest } from "next/server";

import { SESSION_COOKIE, roleAllows, verifySession, type Role } from "@/lib/auth";

/**
 * `/auctioneer` and `/admin` are unlinked from the rest of the site, but that
 * only hides them. This is what actually keeps them shut: no valid signed
 * cookie, no page — the protected HTML is never rendered or sent.
 */
const GUARDED: { prefix: string; required: Role }[] = [
  { prefix: "/admin", required: "admin" },
  { prefix: "/auctioneer", required: "auctioneer" },
];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const guard = GUARDED.find(
    (entry) => pathname === entry.prefix || pathname.startsWith(`${entry.prefix}/`)
  );
  if (!guard) return NextResponse.next();

  const role = await verifySession(request.cookies.get(SESSION_COOKIE)?.value);
  if (role && roleAllows(role, guard.required)) return NextResponse.next();

  const url = request.nextUrl.clone();
  url.pathname = "/unlock";
  url.search = "";
  url.searchParams.set("next", pathname);
  // Signed in, but not high enough: say so instead of looking like a bad code.
  if (role) url.searchParams.set("denied", "1");
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/admin/:path*", "/auctioneer/:path*"],
};

import { NextResponse } from "next/server";

import { SESSION_COOKIE, SESSION_HOURS, roleFromCode, signSession } from "@/lib/auth";

/** Checks a typed code and, if it matches, issues the signed session cookie. */
export async function POST(request: Request) {
  let code = "";
  try {
    const body = (await request.json()) as { code?: unknown };
    if (typeof body?.code === "string") code = body.code.trim();
  } catch {
    // Malformed body is treated the same as a wrong code.
  }

  const role = roleFromCode(code);
  if (!role) {
    // A short pause makes guessing a six-digit code over the network tedious.
    await new Promise((resolve) => setTimeout(resolve, 400));
    return NextResponse.json({ error: "That code is not recognised." }, { status: 401 });
  }

  const response = NextResponse.json({ role });
  response.cookies.set({
    name: SESSION_COOKIE,
    value: await signSession(role),
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: process.env.NODE_ENV === "production",
    maxAge: SESSION_HOURS * 60 * 60,
  });
  return response;
}

/** Lock — clears the session cookie. */
export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set({ name: SESSION_COOKIE, value: "", path: "/", maxAge: 0 });
  return response;
}

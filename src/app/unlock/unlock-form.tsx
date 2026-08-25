"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { KeyRound, Loader2, Lock } from "lucide-react";

import { cn } from "@/lib/utils";

/** Only same-origin paths may be used as a redirect target. */
function safeNext(raw: string | null): string | null {
  if (!raw || !raw.startsWith("/") || raw.startsWith("//")) return null;
  return raw;
}

export function UnlockForm() {
  const router = useRouter();
  const params = useSearchParams();
  const next = safeNext(params.get("next"));
  const denied = params.get("denied") === "1";

  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(
    denied ? "That code does not have admin access." : null
  );
  const [busy, setBusy] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (busy || code.length === 0) return;
    setBusy(true);
    setError(null);

    try {
      const response = await fetch("/api/unlock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      const body = (await response.json()) as { role?: string; error?: string };

      if (!response.ok || !body.role) {
        setError(body.error ?? "That code is not recognised.");
        setCode("");
        setBusy(false);
        return;
      }

      // An auctioneer code aimed at /admin would just bounce off the
      // middleware, so send each role somewhere it is actually allowed.
      const destination =
        body.role === "admin" ? (next ?? "/admin") : next?.startsWith("/auctioneer") ? next : "/auctioneer";

      router.replace(destination);
    } catch {
      setError("Could not reach the server. Check the connection and try again.");
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="w-full max-w-sm">
      <div className="flex flex-col items-center gap-3 text-center">
        <span className="flex size-14 items-center justify-center rounded-2xl border border-amber-400/30 bg-amber-400/10">
          <Lock className="size-7 text-amber-400" aria-hidden />
        </span>
        <h1 className="text-2xl font-black tracking-tight text-white">Restricted area</h1>
        <p className="text-sm text-slate-400">Enter your access code to continue.</p>
      </div>

      <label htmlFor="access-code" className="sr-only">
        Access code
      </label>
      <div className="relative mt-7">
        <KeyRound
          className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-slate-500"
          aria-hidden
        />
        <input
          id="access-code"
          value={code}
          onChange={(event) => setCode(event.target.value.replace(/\D/g, "").slice(0, 8))}
          type="password"
          inputMode="numeric"
          autoComplete="off"
          autoFocus
          enterKeyHint="go"
          placeholder="••••••"
          aria-invalid={error !== null}
          aria-describedby={error ? "access-error" : undefined}
          className={cn(
            "h-16 w-full rounded-2xl border-2 bg-slate-900 pr-4 pl-12 text-center text-2xl font-bold tracking-[0.4em] text-white transition-colors duration-200 placeholder:tracking-[0.3em] placeholder:text-slate-600 focus:outline-none",
            error ? "border-rose-500/70" : "border-white/15 focus:border-amber-400"
          )}
        />
      </div>

      {error && (
        <p id="access-error" role="alert" className="mt-3 text-center text-sm font-medium text-rose-400">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={busy || code.length === 0}
        className="mt-5 flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-amber-400 text-base font-bold text-slate-950 transition-colors hover:bg-amber-300 focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-40"
      >
        {busy && <Loader2 className="size-5 animate-spin" aria-hidden />}
        {busy ? "Checking" : "Unlock"}
      </button>
    </form>
  );
}

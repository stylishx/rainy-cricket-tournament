"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { LogOut } from "lucide-react";

import { cn } from "@/lib/utils";

/** Clears the session cookie and drops back to the public site. */
export function LockButton({ className }: { className?: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  return (
    <button
      type="button"
      disabled={busy}
      onClick={async () => {
        setBusy(true);
        await fetch("/api/unlock", { method: "DELETE" });
        router.replace("/");
        router.refresh();
      }}
      className={cn(
        "inline-flex h-9 items-center gap-1.5 rounded-lg border border-white/15 bg-slate-900 px-3 text-xs font-bold text-slate-300 transition-colors hover:border-white/35 hover:text-white focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:outline-none disabled:opacity-50",
        className
      )}
    >
      <LogOut className="size-3.5" aria-hidden />
      Lock
    </button>
  );
}

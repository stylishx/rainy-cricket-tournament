"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Gavel, LayoutGrid, Search, ShieldCheck } from "lucide-react";

import { LockButton } from "@/components/auction/lock-button";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/admin", label: "Overview", icon: ShieldCheck },
  { href: "/admin/search", label: "Search", icon: Search },
  { href: "/admin/book", label: "Book", icon: LayoutGrid },
  { href: "/auctioneer", label: "Console", icon: Gavel },
];

export function AdminNav({ subtitle }: { subtitle?: string }) {
  const pathname = usePathname();

  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <nav
        className="-mx-1 flex gap-1 overflow-x-auto px-1"
        aria-label="Admin sections"
      >
        {LINKS.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "inline-flex h-9 shrink-0 items-center gap-1.5 rounded-lg border px-3 text-xs font-bold whitespace-nowrap transition-colors focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:outline-none",
                active
                  ? "border-amber-400 bg-amber-400 text-slate-950"
                  : "border-white/15 bg-slate-900 text-slate-300 hover:border-white/35 hover:text-white"
              )}
            >
              <Icon className="size-3.5" aria-hidden />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="flex items-center gap-2">
        {subtitle && (
          <span className="text-xs text-slate-400 tabular-nums">{subtitle}</span>
        )}
        <LockButton />
      </div>
    </div>
  );
}

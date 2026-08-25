import type { Metadata } from "next";
import { Suspense } from "react";

import { UnlockForm } from "./unlock-form";

export const metadata: Metadata = {
  title: "Unlock",
  // The gated screens should never turn up in a search result.
  robots: { index: false, follow: false },
};

export default function UnlockPage() {
  return (
    <main className="flex flex-1 items-center justify-center bg-slate-950 px-4 py-16">
      {/* useSearchParams needs a boundary so the shell can still prerender. */}
      <Suspense fallback={null}>
        <UnlockForm />
      </Suspense>
    </main>
  );
}

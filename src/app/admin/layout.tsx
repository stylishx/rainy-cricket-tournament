import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin",
  // Gated screens should never be indexed, even if a URL leaks.
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: LayoutProps<"/admin">) {
  return children;
}

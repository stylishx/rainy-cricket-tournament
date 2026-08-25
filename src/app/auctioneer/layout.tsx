import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Auction Console",
  robots: { index: false, follow: false },
};

export default function AuctioneerLayout({ children }: LayoutProps<"/auctioneer">) {
  return children;
}

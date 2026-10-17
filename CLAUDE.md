# CLAUDE.md - Rules & Token Optimization

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Core Directives
- Framework: Next.js (App Router), React 19, Tailwind CSS, shadcn/ui.
- Code style: TypeScript, functional components, minimal external dependencies.
- shadcn style is `base-vega`, built on `@base-ui/react` — NOT Radix. There is no `asChild`; use base-ui's `render` prop, or apply `buttonVariants()` to a `<Link>`.
- Icons: `lucide-react`. Generated components land in `src/components/ui/`.
- Token Efficiency: Provide direct, fully working code blocks. Skip repetitive boilerplate.

## Constraints & Exclusions
- DO NOT generate test files or test suites.
- Since there are no tests, verify changes with: `npx tsc --noEmit`, `npm run lint`, `npm run build`.
- DO NOT script git operations or Vercel deployments.
- DO NOT use external image URLs for the dataset; use local static paths.

## Application Architecture & Routing
Source lives under `src/`; the `@/*` alias maps to `./src/*`.

Public (unauthenticated):
- `/` (Home): Centered layout with two primary navigation buttons.
- `/search` (Auction Live Search): Numeric input, instant visual card rendering.
- `/book` (Strategic Player Book): Filterable grid of all players.
- `/unlock`: Access-code entry for the gated routes.

Gated (see `src/proxy.ts`) — never link to these from a public page:
- `/auctioneer` (auctioneer or admin code): Live bidding console.
- `/admin`, `/admin/search`, `/admin/book` (admin code only): The public screens plus sold/unsold marks and the controls to set them.

The public `/search` and `/book` must keep working exactly as they do for anyone without a code. `PlayerCard` and `PlayerSpotlight` take an OPTIONAL `result` prop — when it is omitted they render as they always have, so never make auction state a required input to them.

## Auction State & Access
- **No database.** Auction results live in `localStorage` under `rainy-auction-v1`, managed by `src/lib/auction.ts` via `useSyncExternalStore`. Never add a server-side data store without being asked.
- **Single config file: `src/data/tournament.ts`** — tournament name/year/host, `TEAM_PURSE`, `SQUAD_SIZE`, `BASE_PRICE` and the `teams` array. It is the only file edited to change the format. `src/data/teams.ts` re-exports those and holds what is *derived* (`TEAM_COUNT`, `totalSlots`, `MIN_BID`, `MAX_OPENING_BID`, `MIN_SQUAD_COST`) plus `TEAM_TONES` and the lookup helpers. Always read these constants — never hardcode a count or a price, and never write a team count into UI text.
- Every bid must go through `saleError()` so the purse and squad rules cannot drift between screens. Selling always happens in `ManagePanel`.
- Access codes and the cookie secret come from env (`AUCTIONEER_CODE`, `ADMIN_CODE`, `AUCTION_SECRET`) — see `.env.example`. `src/lib/auth.ts` must stay Web-Crypto-only and must never be imported by a client component, or the codes end up in the browser bundle.
- Next 16 uses the `proxy` file convention, not `middleware`.

## Styling
- Tailwind v4 — there is NO `tailwind.config.js`. Theme tokens live in the `@theme inline` block in `src/app/globals.css`.
- The app is forced dark: `<html>` carries the `dark` class in `src/app/layout.tsx`. Pages use an explicit slate/amber auction palette.

## Data & Optimization Strategy
- **Data Object**: `src/data/players.ts` — a dictionary keyed by player number. Import via the `@/` alias (`@/data/players`).
- Each player has both `role` (free-text display string) and `category` (the filter bucket). Filter on `category` — never parse `role`.
- **Image Caching**: MUST use `next/image` (`<Image />`) for all player photos.
- Use the `priority` prop for the Live Search screen to preload images instantly.
- Images will be stored in the `/public/players/` directory using various extensions (.jpg, .png, etc.).

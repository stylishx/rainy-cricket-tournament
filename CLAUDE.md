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
- `/` (Home): Centered layout with two primary navigation buttons.
- `/search` (Auction Live Search): Numeric input, instant visual card rendering.
- `/book` (Strategic Player Book): Filterable grid of all players.

## Styling
- Tailwind v4 — there is NO `tailwind.config.js`. Theme tokens live in the `@theme inline` block in `src/app/globals.css`.
- The app is forced dark: `<html>` carries the `dark` class in `src/app/layout.tsx`. Pages use an explicit slate/amber auction palette.

## Data & Optimization Strategy
- **Data Object**: `src/data/players.ts` — a dictionary keyed by player number. Import via the `@/` alias (`@/data/players`).
- Each player has both `role` (free-text display string) and `category` (the filter bucket). Filter on `category` — never parse `role`.
- **Image Caching**: MUST use `next/image` (`<Image />`) for all player photos.
- Use the `priority` prop for the Live Search screen to preload images instantly.
- Images will be stored in the `/public/players/` directory using various extensions (.jpg, .png, etc.).

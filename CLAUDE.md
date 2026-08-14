# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

The production marketing site for **Bossie's Gym & Personal Training Studio**, a family-run gym in Hennopspark, Centurion, South Africa. It is one client build inside the larger Fynbos Creative workspace (see the parent `CLAUDE.md` two levels up for the venture's cross-client conventions); this repo is its own git history and stack, independent of the sibling `03_Web/fynbos-creative/` site.

It's a lead-generation brochure site (no member portal, no e-commerce, no class booking) plus two things beyond a static brochure that aren't obvious from a first skim: a small Node API for email + geo lookup, and a password-gated internal analytics dashboard backed by Supabase.

**Read `README.md` and `NOTES.md` before editing content** — `NOTES.md` documents which facts came from the client's onboarding questionnaire vs. were inferred, and the site's guiding rule is that unconfirmed facts (trainer bios, photography, pricing) get an explicit "TBD" rather than invented content. `ASSETS_NEEDED.md` lists what's still pending from the client. `DESIGN.md` is the design-token source (colors, type scale, component tokens) in frontmatter + prose form.

## Commands

```bash
npm install

npm run dev          # Vite (:5173) + server.mjs API (:3001) together, via concurrently — one command, cross-platform (cross-env)
npm run dev:web      # Vite only
npm run dev:api      # server.mjs only, in dev mode on :3001

npm run build        # vite build, then postbuild → scripts/prerender.cjs (react-snap prerendering)
npm run preview      # serve the built dist/ — static only, no /api/* routes
npm run serve        # run server.mjs directly against dist/ (production mode, API included)

# Docker (builds + runs the production image, server.mjs serving dist/ + /api/* on :5173)
docker compose up --build
docker compose down
```

There is no `npm test` script. E2E tests run directly via Playwright:

```bash
npx playwright test                          # full suite (tests/e2e/*.spec.ts), starts its own dev server
npx playwright test tests/e2e/home.spec.ts   # single spec
npx playwright test --project=mobile-chrome  # one device profile (chromium | mobile-chrome)
```

No lint or typecheck script is configured (this is a `.jsx`/`.js` codebase, not TypeScript, aside from `playwright.config.ts` and the `tests/e2e/*.spec.ts` files).

## Architecture

**Client-side routed SPA, not the multi-page-per-route pattern used elsewhere in this workspace.** `src/App.jsx` is a single `react-router-dom` route table; `src/main.jsx` mounts it once. Static prerendering is bolted on separately: `npm run build`'s `postbuild` step runs `scripts/prerender.cjs`, which drives `react-snap` (with its own Chromium-discovery fallback — it prefers a real system Chrome/Edge install over react-snap's bundled ancient puppeteer Chromium, which can't parse modern JS syntax) to snapshot each route in `dist/` for crawlers/SEO. This is a different mechanism from `03_Web/fynbos-creative/`'s SSR + `hydrateRoot` prerender pipeline — don't conflate the two. Note: react-snap's real config option is `include` (in both `package.json`'s `reactSnap` block and the `opts` passed to `run()` in `prerender.cjs`), not `routes` — the latter is silently dropped by react-snap's option merge and will silently truncate every build to a single prerendered page if reintroduced.

**`server.mjs` is a hand-rolled Node `http` server, not just a static file server.** It does triple duty:
- In dev (`npm run dev:api`, `cross-env NODE_ENV=development`), it's an API-only server on `:3001` that Vite proxies `/api/*` to. `npm run dev` runs this and Vite together via `concurrently`, under one process — no need to open two terminals.
- In production (`npm run serve` / the Docker image's `CMD`), it serves `dist/` *and* the same API routes on one port (`5173`).
- API surface: `POST /api/send-agreement` (emails the onboarding CSV via SMTP), `POST /api/send-enquiry` (contact form), `GET /api/geo` (IP geolocation for analytics), and `POST/GET /api/dashboard/*` (login, logout, session check, and the two data endpoints the dashboard reads). All dashboard routes require a session cookie set by `/api/dashboard/login`, which checks `DASHBOARD_PASS` — a server-only secret, never bundled to the client. A simple in-memory (per-process) rate limiter guards the POST endpoints.

**Analytics is Supabase-backed and intentionally off the critical path.** `src/lib/tracker.js` lazy-loads `@supabase/supabase-js` on first use (not at import time) so the SDK never ships in the main bundle for a visitor who doesn't trigger it. It tracks page views (with computed duration via `visibilitychange`/`beforeunload`, not a live UPDATE — see the comment in the file for why), scroll-depth milestones, and `data-track`-tagged click events, keyed by a `localStorage`-persisted session id. `src/hooks/useTracker.js` wires this to route changes; schema lives in `supabase/migrations/`. The `/dashboard` route (`src/pages/Dashboard.jsx` + `src/components/dashboard/*`) is the internal-only surface that reads this data back through `server.mjs`'s service-role-keyed endpoints — per `PRODUCT.md`, treat it as a distinct product register (gym-owner tool) from the guest-facing marketing pages, not as part of the public site's design language.

**`/join` and `/onboarding` (same route, aliased) is a membership-agreement form**, not just a lead-capture form — `src/pages/Join.jsx` renders a multi-step form (`src/components/sections/membership-agreement/`: plan → details → sign, per `Step*.jsx` + `useAgreementForm.js`) that builds a CSV and posts it to `/api/send-agreement`, which emails it to the gym as an attachment. Both `/join` and `/onboarding`, plus `/dashboard` and `/community` (legacy alias for `/team`), are set `noindex, nofollow` in `App.jsx`'s per-route meta effect — don't index internal or duplicate-content routes.

**Config/content is centralised, per the workspace-wide convention** (see the parent `CLAUDE.md`'s "React template structure" section): `src/lib/site.js` is the single source of truth for the gym's name, contact details, hours, address, CTAs (`site.ctas.*`), and every rand figure on the site (`site.pricing.*`) — edit there once, not per-page. `src/data/reviews.js` holds review content separately. Framer Motion timing/easing variants (`fadeUp`, `stagger`, `fadeIn`, `pageVariants`) also live in `site.js` so motion stays consistent across the ~10 places `framer-motion` is used (see the table in `README.md`).

**Content discipline is stricter here than a typical client site.** Every business fact must trace to the April 2026 client questionnaire or a documented follow-up (see `NOTES.md`'s "Grounded facts" section) — no invented trainer bios, testimonials, prices, or stats. Missing facts get a visible "TBD" (Team page portraits/bios, Gallery's abstract SVG tiles standing in for real photography) rather than filler content. Don't add or change a price, hours, or a name without a citable source; flag it as `NOTES.md` does instead.

## Known quirks

- **This checkout has a history of losing files** — stray `._*` AppleDouble files that have appeared at the repo root at times (`._NOTES.md`, `._.env`, etc.) indicate it's been copied from macOS without preserving all data. If `git status` ever shows tracked files as `AD` (added in the index, missing from the working tree), or `git fsck` reports invalid/missing objects, or a branch that should have commits appears unborn: **check `origin` before reconstructing anything locally.** `git fetch origin` first (repairs a corrupted local object database in place — confirmed working even when it prints `refs/stash`-related errors, as long as those don't block object transfer). Then check `git log origin/<branch> --oneline` and diff the working tree against it (`git diff origin/<branch> --stat`) — the remote may already have the real, properly-authored commit history for what looks like "lost" local work, in which case `git reset --hard origin/<branch>` (after stashing any uncommitted work as a safety net) is the right fix, not recommitting a locally-reconstructed duplicate. This happened once already: a local session spent real effort recommitting ~50 files' worth of "recovered" work before discovering `origin/feat/next-feature` was 47 commits ahead with the same work already done properly — only 3 genuinely local-only fixes (this file, a react-snap bug, two stale doc corrections) were still worth reapplying on top of the real history. The same recoverability-before-reconstruction logic applies to `node_modules` — if a package looks partially installed (e.g. `vite/dist` present in `package.json` but empty on disk), `rm -rf node_modules && npm install` is the fix, not manually patching files.
- **A dangling `refs/stash`** can appear pointing at a missing object (unrelated to any real stash) — if so it's permanently unrecoverable (stash entries are local-only, never transferred by fetch) and safe to delete with `git update-ref -d refs/stash`; leaving it in place causes `git fetch`/auto-maintenance to print `bad object refs/stash` / `failed to perform geometric repack` on every operation, though it doesn't block commits or fetches from actually working.

## Environment

`.env` (gitignored; `.env.example` documents the shape) supplies: Gmail SMTP creds (`SMTP_*`, `MAIL_FROM`, `MAIL_TO`) for the two `/api/send-*` endpoints, `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` (client-side, analytics) plus the server-only `SUPABASE_SERVICE_ROLE_KEY` (dashboard data reads, bypasses RLS — never expose client-side), and `DASHBOARD_PASS` (server-only dashboard passphrase). Docker Compose passes the two `VITE_*` values as build args (they get baked into the client bundle at build time) and the rest via `env_file: .env` at runtime.

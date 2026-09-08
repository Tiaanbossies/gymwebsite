# Bossie's Gym & Personal Training Studio — Marketing Site

A production-quality, conversion-focused marketing website for **Bossie's Gym & Personal Training Studio** — a small, family-run commercial gym in **Hennopspark, Centurion, South Africa**.

This is a brochure / lead-generation site for an offline service business. There is no member portal, no online booking, no e-commerce. Conversion runs through **Join Online**, **Call the gym**, **WhatsApp** and **Start a Free Trial** — the exact channels the owner confirmed in the onboarding questionnaire.

All business facts on the site (address, phone, hours, pricing, trainer names, facilities, services, brand values) come from the completed **client onboarding questionnaire (April 2026)**. Anything not confirmed is marked TBD, never invented. See `NOTES.md` for the full reasoning and `ASSETS_NEEDED.md` for the photography / bio shot list.

---

## Stack

- **React 18** (functional components + hooks)
- **Vite 5** (dev server + production build)
- **React Router v6** (client-side routing, 10 pages + 404 + legacy `/community` → `/team` alias)
- **Framer Motion 11** (tasteful reveals, page transitions, WhatsApp pulse ring, accordion, CTA emphasis)
- **Tailwind CSS 3** (design tokens in `tailwind.config.js`, utilities + component layer in `src/styles/globals.css`)
- **Lucide React** (icon system)
- **`server.mjs`** — a hand-rolled Node `http` server (no framework). Sends the contact form and the online membership agreement by email over SMTP, does IP geolocation for analytics, and serves the password-gated `/dashboard`'s data endpoints. In production it also serves `dist/` directly (see "Run with Docker" below).
- **Supabase** (`@supabase/supabase-js`) — page-view / event analytics only, lazy-loaded client-side so the SDK never ships to a visitor who doesn't trigger it. Schema in `supabase/migrations/`.

No third-party UI kit — all components are custom so the design system stays cohesive.

---

## Run locally

```bash
# 1. install
npm install

# 2. copy the env template and fill in SMTP + Supabase values
cp .env.example .env

# 3. start Vite AND the API server together (http://localhost:5173)
npm run dev

# 4. build for production
npm run build

# 5. preview the production build (static only — no /api/* routes)
npm run preview
```

`npm run dev` runs `vite` (`dev:web`) and `server.mjs` (`dev:api`) concurrently under one process, so `/api/*` calls made by the frontend (contact form, onboarding form, analytics, dashboard) work out of the box in dev — Vite proxies them to the API server per `vite.config.js`. Run `npm run dev:web` or `npm run dev:api` alone if you only need one half. `npm run preview` only serves the static build with no backend — use `npm run serve` (or Docker) to preview with the API included.

Requires Node 18+. Recommended: Node 20. Without a `.env`, the dev server still runs but the contact/onboarding forms and analytics will fail silently (missing SMTP/Supabase credentials).

---

## Run with Docker

```bash
# build and start the site on http://localhost:5173
docker compose up --build

# stop the containers
docker compose down
```

The Docker image builds the static site (`vite build` + prerender), then runs `server.mjs` in production mode, which serves `dist/` and the `/api/*` routes from the same Node process on one port. This is different from local `npm run preview`, which is static-only.

---

## Project structure

```
gym-website/
├── index.html                   # Page shell, meta, OG, fonts, favicon, LocalBusiness JSON-LD
├── server.mjs                   # Node API server — SMTP email, geo lookup, dashboard auth + data; serves dist/ in production
├── scripts/prerender.cjs        # postbuild — react-snap prerender with its own Chromium-discovery fallback
├── supabase/migrations/         # Analytics schema (page_views, events)
├── ASSETS_NEEDED.md             # Photography + bios to collect from the client
├── NOTES.md                     # Grounded facts, assumptions, open TODOs
├── DESIGN.md                    # Design tokens (colors, type scale, component tokens)
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── public/
│   └── favicon.svg
└── src/
    ├── main.jsx                 # React entry — mounts <App/> inside <BrowserRouter>
    ├── App.jsx                  # Routing + route-aware <title>/meta + layout shell
    ├── styles/
    │   └── globals.css          # Tailwind layers + component classes (.btn-primary, .btn-whatsapp, .eyebrow…)
    ├── lib/
    │   ├── site.js              # Source of truth: name, contact, hours, address, CTAs, pricing, motion variants
    │   └── tracker.js           # Lazy-loaded Supabase analytics client — page views, scroll depth, click events
    ├── hooks/
    │   ├── useTracker.js        # Wires tracker.js to route changes
    │   └── useStructuredData.js
    ├── data/
    │   └── reviews.js
    ├── components/
    │   ├── layout/
    │   │   ├── Header.jsx                 # Sticky top bar, desktop phone CTA, "Join Online" primary
    │   │   ├── MobileNav.jsx              # Slide-down menu w/ WhatsApp + Call + Join stack
    │   │   ├── AnnouncementBar.jsx        # Free-trial strip (Q52)
    │   │   ├── StickyWhatsApp.jsx         # Floating click-to-chat (wa.me)
    │   │   ├── Footer.jsx                 # Real address, hours, Instagram, WhatsApp, email
    │   │   ├── Logo.jsx
    │   │   └── ScrollToTop.jsx
    │   ├── ui/                            # Button, Container, SectionHeading, Reveal, PagePose + motion/decorative primitives
    │   ├── dashboard/                      # DashboardLogin, StatCard, LineChart, SankeyChart — internal analytics UI, not part of the public site
    │   └── sections/
    │       ├── HeroHome.jsx               # Who/What/Why/Value (Q30)
    │       ├── ServiceCard.jsx
    │       ├── MembershipOptions.jsx      # Day pass / Open gym / PT — real prices
    │       ├── membership-agreement/      # Multi-step onboarding form (plan → details → sign) used by pages/Join.jsx
    │       ├── FAQAccordion.jsx
    │       ├── ContactForm.jsx            # Posts to /api/send-enquiry (server.mjs), emailed via SMTP
    │       ├── CTASection.jsx             # Primary (Join) + Ghost (Call) + Link (Free Trial)
    │       ├── PageHero.jsx               # Shared page-header strip
    │       └── TrustSection.jsx           # Family-run / Honesty / Members first / Local
    └── pages/
        ├── Home.jsx
        ├── Services.jsx
        ├── Membership.jsx
        ├── Pricing.jsx                    # Full rate card (day pass, open gym, student, PT) + FAQ
        ├── Gallery.jsx
        ├── Team.jsx                       # Eight-trainer grid (3 Boshoff family + 5 coaches) w/ TBD placeholders
        ├── About.jsx
        ├── Contact.jsx                    # Real address, hours, Google Maps embed, QuickContact strip
        ├── FAQ.jsx
        ├── Join.jsx                       # /join and /onboarding — membership agreement form, emails a CSV via /api/send-agreement
        ├── Dashboard.jsx                  # /dashboard — password-gated internal analytics view
        └── NotFound.jsx
```

`/community` has no dedicated page file — `App.jsx` routes it directly to the `Team` component as a legacy alias.

### Conventions

- **Design tokens** live in `tailwind.config.js`:
  - `brand.*` — Red palette (primary, #dc2b38) — pulled from the BOSSIE'S logo wordmark / ring
  - `accent.*` — Steel-blue palette (#3d6479) — pulled from the figures in the logo crest
  - `ink.*` — Near-black neutrals
  - Custom shadows, `display` font (Barlow Condensed, falls back to Archivo Black — see `DESIGN.md`), `pulseRing` animation.
- **Reusable classes** (`.btn-primary`, `.btn-whatsapp`, `.eyebrow`, `.section`, `.container-x`, `.card-surface`, `.tag`, `.chip-live`, `.nav-link`…) live in `globals.css`.
- Every page composes from shared `sections/*` components — no page fabricates its own card / CTA styling.
- **Every business fact lives in `src/lib/site.js`** — name, phone, address, hours, email, socials, CTAs. Edit once, the whole site updates.
- **CTAs are centralised** under `site.ctas`:
  - `join` — Join Online
  - `call` — tel:+27724827922
  - `enquire` — Send an Enquiry
  - `whatsapp` — wa.me
  - `trial` — Start a Free Trial
  - `pricing` — See Full Pricing → `/pricing`
  - `tour` — Book a Gym Tour
- **All rand figures live in `site.pricing`** — single source of truth for day-pass, open-gym tiers, student membership, personal-training packages and joining fee. The `/pricing` page reads straight from this object.

---

## Where Framer Motion is used

| Location | Motion |
|---|---|
| `App.jsx` | `<AnimatePresence>` for route transitions |
| `PagePose.jsx` | Per-page `initial` / `animate` / `exit` fades |
| `Reveal.jsx` + `fadeUp`, `stagger` variants | Staggered section entrance reveals (`once: true`) |
| `HeroHome.jsx` | Hero copy cascade; gentle floating on the hero visual panel |
| `MobileNav.jsx` | Slide-down menu with `AnimatePresence` |
| `StickyWhatsApp.jsx` | Pulse-ring animation around the FAB |
| `FAQAccordion.jsx` | Height + opacity animation of accordion body |
| `CTASection.jsx`, `TrustSection.jsx`, `Gallery.jsx`, `MembershipOptions.jsx`, `Services.jsx`, `Team.jsx`, `Membership.jsx`, `Pricing.jsx` | Staggered card entrances + viewport reveals |
| `ContactForm.jsx` | Animated success state on submit |
| `PageHero.jsx` | Breadcrumb / eyebrow / heading / description staggered fade-up |
| `membership-agreement/*` | Step transitions in the `/join` onboarding form |

Motion values live in `src/lib/site.js` (`fadeUp`, `stagger`, `fadeIn`, `pageVariants`) so timing and easing stay consistent, and `prefers-reduced-motion` is respected globally in `globals.css`.

---

## Pages at a glance

| Path | Page | Purpose |
|---|---|---|
| `/` | Home | Hero, three services overview (PT + Open Gym + Online), value props, trust pillars, gallery preview, family-team preview, primary CTA |
| `/services` | Services | Deep-dive on each service (PT, Open Gym, Online Coaching, Nutrition, Body Assessments) + quick-jump nav |
| `/membership` | Membership | Day pass (R100) + open gym overview (M2M/6m/12m) + PT, perks, comparison table, FAQ — links through to `/pricing` for the full rate card |
| `/pricing` | Pricing | Full rate breakdown: day pass, open gym (R450/R380/R360), student membership (R250), personal training (R2,100 / R2,700), what's included per tier, R200 joining fee, comparison matrix, pricing FAQ |
| `/gallery` | Gallery | Facility tiles (weight training, cardio, functional, boxing) — real photography pending |
| `/team` | Team | Boshoff-family trainers (Bossie, Rene, Debbie) + five coaches (Niell Bezuidenhout, Quibert Dippenaar, Nikki Bredenkamp, Do-Neill Dowry, Dale Collins), none Boshoff — bios + portraits TBD |
| `/about` | About | Family-run story, values (Honesty / Commitment / Community), coaching approach |
| `/contact` | Contact | Real address, hours, Google Maps embed, QuickContact strip (Call / WhatsApp / Email), enquiry form |
| `/faq` | FAQ | Joining, pricing, training, visiting — grounded in questionnaire policies |
| `/join`, `/onboarding` | Join (aliased) | Multi-step membership agreement form (plan → details → sign); emails a CSV to the gym. `noindex`. |
| `/dashboard` | Dashboard | Password-gated internal analytics view (page views, events) for the gym owner — not part of the public site. `noindex`. |

Plus `/community` → routes straight to `/team` for anyone linking the old route.

---

## SEO / accessibility

- Semantic landmarks (`<header>`, `<nav>`, `<main>`, `<footer>`, `<section>`, `<article>`, `<address>`).
- Per-route `<title>` + `meta description` in `App.jsx`.
- Open Graph + Twitter Card tags in `index.html`.
- **JSON-LD** `HealthClub` structured data with real address, phone, hours, areas served, price range (`R100–R2700`), and `sameAs` linking to Instagram.
- Clear H1 → H2 → H3 hierarchy per page.
- Focus-visible blue outlines and accessible form field labels.
- `prefers-reduced-motion` respected globally.
- Responsive from 380px mobile to wide desktop.
- `tel:` and `wa.me` links everywhere phone appears — one-tap call on mobile.

---

## What to know before editing

- **Every visible rand figure on the site** — R100 day pass, R450/R380/R360 open gym, R250 student membership, R2,100/R2,700 personal training, R200 joining fee — is either from the questionnaire or a client-confirmed follow-up. All of them live in `site.pricing`. Don't add prices the client hasn't confirmed.
- **Trainer bios and portraits are TBD** — see `ASSETS_NEEDED.md`. Don't invent them.
- **No group-class content** — Q36 = No. We don't run classes.
- **CTAs are centralised** in `src/lib/site.js`. Update the label once, the whole site updates.
- **Form handlers are wired.** `ContactForm.jsx` posts to `/api/send-enquiry` and `Join.jsx`'s onboarding form posts to `/api/send-agreement` — both handled by `server.mjs` over SMTP (see `.env.example`). Both also surface WhatsApp + mailto links on success as a backup channel, not as the primary path.

See `NOTES.md` for the full set of grounded facts, assumptions, and open TODOs, and `ASSETS_NEEDED.md` for the shot list.

# Bossie's Gym & Personal Training Studio — Marketing Site

A production-quality, conversion-focused marketing website for **Bossie's Gym & Personal Training Studio** — a small, family-run commercial gym in **Hennopspark, Centurion, South Africa**.

This is a brochure / lead-generation site for an offline service business. There is no member portal, no online booking, no e-commerce. Conversion runs through **Join Online**, **Call the gym**, **WhatsApp** and **Start a Free Trial** — the exact channels the owner confirmed in the onboarding questionnaire.

All business facts on the site (address, phone, hours, pricing, trainer names, facilities, services, brand values) come from the completed **client onboarding questionnaire (April 2026)**. Anything not confirmed is marked TBD, never invented. See `NOTES.md` for the full reasoning and `ASSETS_NEEDED.md` for the photography / bio shot list.

---

## Stack

- **React 18** (functional components + hooks)
- **Vite 5** (dev server + production build)
- **React Router v6** (client-side routing, 9 pages + 404 + legacy `/community` → `/team` alias)
- **Framer Motion 11** (tasteful reveals, page transitions, WhatsApp pulse ring, accordion, CTA emphasis)
- **Tailwind CSS 3** (design tokens in `tailwind.config.js`, utilities + component layer in `src/styles/globals.css`)
- **Lucide React** (icon system)

No third-party UI kit — all components are custom so the design system stays cohesive.

---

## Run locally

```bash
# 1. install
npm install

# 2. start the dev server (http://localhost:5173)
npm run dev

# 3. build for production
npm run build

# 4. preview the production build
npm run preview
```

Requires Node 18+. Recommended: Node 20.

---

## Run with Docker

```bash
# build and start the site on http://localhost:5173
docker compose up --build

# stop the containers
docker compose down
```

The Docker setup serves the production build with `vite preview` and disables browser auto-open inside the container.

---

## Project structure

```
gym-website/
├── index.html                   # Page shell, meta, OG, fonts, favicon, LocalBusiness JSON-LD
├── ASSETS_NEEDED.md             # Photography + bios to collect from the client
├── NOTES.md                     # Grounded facts, assumptions, open TODOs
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── public/
│   └── favicon.svg              # Blue barbell w/ red accent dot
└── src/
    ├── main.jsx                 # React entry — mounts <App/> inside <BrowserRouter>
    ├── App.jsx                  # Routing + route-aware <title>/meta + layout shell
    ├── styles/
    │   └── globals.css          # Tailwind layers + component classes (.btn-primary, .btn-whatsapp, .eyebrow…)
    ├── lib/
    │   └── site.js              # Source of truth: name, contact, hours, address, CTAs, helpers, motion variants
    ├── components/
    │   ├── layout/
    │   │   ├── Header.jsx                 # Sticky top bar, desktop phone CTA, "Join Online" primary
    │   │   ├── MobileNav.jsx              # Slide-down menu w/ WhatsApp + Call + Join stack
    │   │   ├── AnnouncementBar.jsx        # Free-trial strip (Q52)
    │   │   ├── StickyWhatsApp.jsx         # Floating click-to-chat (wa.me)
    │   │   ├── Footer.jsx                 # Real address, hours, Instagram, WhatsApp, email
    │   │   ├── Logo.jsx                   # Blue mark w/ red accent dot
    │   │   ├── PageHero.jsx               # Shared page-header strip
    │   │   └── ScrollToTop.jsx
    │   ├── ui/
    │   │   ├── Button.jsx                 # primary / ghost / link / accent / whatsapp variants
    │   │   ├── Container.jsx
    │   │   ├── SectionHeading.jsx
    │   │   ├── Reveal.jsx                 # Framer Motion reveal helpers
    │   │   └── PagePose.jsx               # Page transition wrapper
    │   └── sections/
    │       ├── HeroHome.jsx               # Who/What/Why/Value (Q30)
    │       ├── ServiceCard.jsx
    │       ├── MembershipOptions.jsx      # Day pass / Open gym / PT — real prices
    │       ├── GalleryGrid.jsx            # Facility tiles (Q33/Q34)
    │       ├── FAQAccordion.jsx
    │       ├── ContactForm.jsx            # Client-side — hands off to WhatsApp + mailto on submit
    │       ├── CTASection.jsx             # Primary (Join) + Ghost (Call) + Link (Free Trial)
    │       └── TrustSection.jsx           # Family-run / Honesty / Members first / Local
    └── pages/
        ├── Home.jsx
        ├── Services.jsx
        ├── Membership.jsx
        ├── Pricing.jsx                    # NEW — Full rate card (day pass, open gym, student, PT) + FAQ
        ├── Gallery.jsx
        ├── Team.jsx                       # Eight-trainer grid (3 Boshoff family + 5 coaches) w/ TBD placeholders
        ├── Community.jsx                  # Legacy re-export of Team
        ├── About.jsx
        ├── Contact.jsx                    # Real address, hours, Google Maps embed, QuickContact strip
        ├── FAQ.jsx
        └── NotFound.jsx
```

### Conventions

- **Design tokens** live in `tailwind.config.js`:
  - `brand.*` — Red palette (primary, #dc2b38) — pulled from the BOSSIE'S logo wordmark / ring
  - `accent.*` — Steel-blue palette (#3d6479) — pulled from the figures in the logo crest
  - `ink.*` — Near-black neutrals
  - Custom shadows, `display` font (Archivo Black), `pulseRing` animation.
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
| `CTASection.jsx`, `TrustSection.jsx`, `GalleryGrid.jsx`, `MembershipOptions.jsx`, `Services.jsx`, `Team.jsx`, `Membership.jsx`, `Pricing.jsx` | Staggered card entrances + viewport reveals |
| `ContactForm.jsx` | Animated success state on submit |
| `PageHero.jsx` | Breadcrumb / eyebrow / heading / description staggered fade-up |

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

Plus `/community` → redirects to `/team` for anyone linking the old route.

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
- **Form handler is not wired.** `ContactForm.jsx` pipes the typed message into WhatsApp and mailto links on success so no enquiry is lost while a backend is set up.

See `NOTES.md` for the full set of grounded facts, assumptions, and open TODOs, and `ASSETS_NEEDED.md` for the shot list.

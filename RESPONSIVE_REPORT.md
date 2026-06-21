# Responsive Audit & Polish — Bossie's Gym

A pass over every layout / page / component to make the site feel dynamic
and polished across small mobile (320px) → ultra-wide desktop (1920px+),
without breaking accessibility, motion preferences, or maintainability.

The build is green: `vite build` ships the same bundle as before, plus the
fluid token / motion changes documented here.

---

## 1. Token & system-level changes

These cascade through every page, so they're listed first.

### Tailwind config (`tailwind.config.js`)

* **Added `xs: 420px` breakpoint** — for the 320–419px phones where
  layout often needs an extra step before `sm` (640px).
* **Fluid spacing tokens** — `fluid-section`, `fluid-section-tight`,
  `fluid-block` use `clamp()` so vertical rhythm scales smoothly.
* **`safe-b: env(safe-area-inset-bottom)`** — for iOS home-indicator
  awareness on floating UI.
* **New shadows** — `glow-lg`, `lift` for hover states.
* **New keyframes / animations** —
  `drift` (slow ambient float, used on hero blobs),
  `drift-slow` (longer cycle),
  `shimmer` (placeholder loading shimmer).

### Global CSS (`src/styles/globals.css`)

* **Skip-link** (`.skip-link`) — keyboard users land on it first;
  jumps straight to `#main`.
* **`.input` form class promoted to globals** so every form uses the
  same tap-friendly fields (min-height 48px, hover/focus states,
  textarea variant). Removed the duplicate inline `<style>` block from
  `ContactForm.jsx`.
* **`.hover-lift` utility** — `translateY(-3px)` + brand glow shadow,
  guarded behind `@media (hover: hover)` so it never fires on touch
  devices, and disabled under `prefers-reduced-motion` via
  `transform: none !important`.
* **`overflow-wrap: anywhere`** on `p, li, dd, dt, figcaption,
  address` — long words / URLs / emails wrap on narrow screens
  instead of pushing the column wider than the viewport.
* **`.text-pretty`, `.no-scrollbar`, `.pb-safe`, `.bottom-safe`** —
  small utilities used in a couple of places.
* **Fluid `display-1/2/3`, `body-lg`, `.section`/`.section-tight`,
  `.container-x`** — already in place from the previous pass; kept.
* **Reduced motion** — broadened to `*, *::before, *::after` and
  explicitly disables the hover-lift translate.

---

## 2. Layout chrome

### Header (`Header.jsx`)
* `btn-compact` keeps the Phone + Join CTAs to one line in the sticky
  bar at every viewport.
* Mobile menu trigger uses a full 40×40 tap target.
* Active-link underline uses `nav-link::after` gradient — animates
  on hover and `nav-link-active`.

### AnnouncementBar (`AnnouncementBar.jsx`)
* **Now dismissable** with a small ✕ button (right-aligned, 28×28).
  Preference persists in `sessionStorage` so it stays out of the way
  for the rest of the visit but reappears for new sessions.
* Padding-right reserves room for the close button on mobile so the
  copy never overlaps it.

### StickyWhatsApp (`StickyWhatsApp.jsx`)
* Uses the new **`bottom-safe`** utility so it honours the iOS home
  indicator and never overlaps primary CTAs.
* `motion-reduce:hidden` on the pulse ring — the ring is decorative,
  so we hide it entirely under reduced-motion rather than freeze it.
* Keeps icon-only on phones, expands to icon + label from `md`.

### Skip-link
* Wired into `App.jsx` as `<a href="#main" class="skip-link">` and the
  matching `<main id="main">`. Invisible until tab-focused.

---

## 3. PageHero & HeroHome

### PageHero
* **`display-1 → display-2`** for inner-page H1s — `display-1` was
  too big at 5.5rem on desktop for routes like `/team`, `/about`.
* `max-w-[14ch] → 18ch` so titles like
  *"Membership & Pricing — real prices, no surprises"* don't break
  awkwardly at three words per line.
* Section vertical padding tightened (`py-12 sm:py-16 lg:py-20`) so
  the inner-page hero is leaner than the home hero.
* Decorative blobs now `motion-safe:animate-drift / drift-slow` — a
  subtle ambient float that disappears under reduced-motion.

### HeroHome
* **Stat row** moved off the arbitrary `min-[560px]` breakpoint to
  use the new `xs` breakpoint, with tighter gap on phones
  (`grid-cols-1 xs:grid-cols-3`).
* Decorative blobs animate with the new `drift` keyframes (was
  static before).
* Background grid + radial fades unchanged — they were already
  responsive.

---

## 4. Content components

### ServiceCard
* Adopts `.hover-lift` (replaces inline `hover:-translate-y-1
  hover:shadow-glow`). Effect now respects `(hover: hover)` and
  `prefers-reduced-motion`.

### MembershipOptions
* `p-8 → p-6 sm:p-8` so the cards feel less tight on phones.
* Both featured and unfeatured tiers use `.hover-lift`.

### Pricing matrix / Membership matrix
* **Mobile stacking simplified** — was a 2-column grid that stacked
  cells in a 2×N grid, which read awkwardly. Now single-column on
  mobile (`grid-cols-1 sm:grid-cols-[1.8fr_repeat(N,1fr)]`) so each
  feature reads as a clean label → row of "✓ Day Pass" / "✓ Open
  Gym" / etc. Desktop layout unchanged.

### FAQAccordion
* Min-height **3.25rem** on the trigger button so every row is a
  comfortable tap target on mobile (was variable depending on copy
  length).
* Plus-icon rotation animates over 300ms.

### GalleryGrid
* First-tile span moved off `min-[700px]:col-span-2` to the standard
  `sm:col-span-2` — the arbitrary breakpoint was off-brand.
* Tiles use `.hover-lift` for a consistent ambient feel.

### ContactForm
* Inline `<style>{`.input{}`}</style>` block removed (now in
  globals.css as `.input`). One source of truth, accessible focus
  ring, 48px min height across the whole form.

---

## 5. Page-level fixes

### Home (`/`)
* `ValueCard` uses `.hover-lift`.
* Service-cards grid keeps the `md:col-span-2 xl:col-span-1` rule on
  the third card so the "online coaching" tile balances rather than
  hanging on its own at md.

### Pricing (`/pricing`)
* Comparison matrix mobile fix (above).
* Best-value tier markup unchanged (already had
  `md:col-span-2 xl:col-span-1`).
* PerkCard already had `hover:-translate-y-1` — kept (it predates
  the new utility but works the same).

### Membership (`/membership`)
* Comparison matrix mobile fix (above).

### Team (`/team`)
* Trainer cards use `.hover-lift` so the whole card lifts on hover
  (was static before).

### Contact (`/contact`)
* Quick-contact strip: `sm:grid-cols-2 xl:grid-cols-3` →
  `sm:grid-cols-3`. The previous layout left an awkward 2-up + 1
  half-width row at sm/md/lg.
* QuickContact card uses `.hover-lift` and tighter padding on
  phones (`p-4 sm:p-5`).

### Footer
* Grid jumped 1 → 2 → 4 with a big gap at lg (1024–1279px). Changed
  to `sm:grid-cols-2 lg:grid-cols-[1.2fr_1fr_1fr_1.1fr]` so the
  4-column layout kicks in at lg, not xl.

---

## 6. Motion & accessibility

* **`prefers-reduced-motion`** — already in place; expanded to all
  pseudo-elements and explicitly disables `.hover-lift` translate.
* **`(hover: hover)`** — `.hover-lift` is gated on this, so touch
  devices don't get a "stuck" hover state after tapping a card.
* **Skip-link** — added.
* **Focus-visible** — already styled at the base layer with a 2px
  brand-blue outline + 3px offset.
* **iOS safe area** — `bottom-safe` utility on StickyWhatsApp.
* **Tap targets** — buttons (`.btn`) min-height 48px;
  `.btn-compact` 38px (header only); FAQ rows 52px; inputs 48px.
* **Long-word wrapping** — `overflow-wrap: anywhere` on text
  containers so emails / URLs never blow out the column.

---

## 7. What was already good (kept untouched)

* Fluid `clamp()` typography on `display-1/2/3` and `body-lg`.
* Fluid section padding (`.section`, `.section-tight`).
* Fluid `.container-x` (`px-4 sm:px-6 lg:px-10 xl:px-12`).
* Animated nav-link underline.
* `tag`, `eyebrow`, `chip-live` typography micro-styles.
* `Reveal` / `PagePose` framer-motion patterns.

---

## 8. Build verification

```
npm run build
✓ 1916 modules transformed.
index.html                   4.65 kB │ gzip:   1.60 kB
assets/index-DFB60IyD.css   48.13 kB │ gzip:   8.50 kB
assets/index-CECSVdKu.js   415.13 kB │ gzip: 121.93 kB
✓ built in 3.89s
```

(Built into a temp directory because the on-disk `dist/` from a
previous run had read-only files we can't `unlink` from this
sandbox. The bundle is identical in production: same imports, same
component tree, same sizes give-or-take a few hundred bytes for the
new utilities.)

Sources for figures / facts on every page remain unchanged from the
previous pass — see `NOTES.md`.

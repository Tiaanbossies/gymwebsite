# Responsive Notes — engineering log

Working notes from the responsive / polish pass. Pairs with
`RESPONSIVE_REPORT.md` (the deliverable summary).

---

## Files touched

```
tailwind.config.js                           # tokens / breakpoints / animations
src/styles/globals.css                       # skip-link, .input, .hover-lift, fluid, motion
src/App.jsx                                  # skip-link, <main id="main">
src/components/layout/AnnouncementBar.jsx    # dismiss button + sessionStorage
src/components/layout/Header.jsx             # (already polished; kept)
src/components/layout/StickyWhatsApp.jsx     # bottom-safe, motion-reduce
src/components/layout/PageHero.jsx           # display-2, max-w-18ch, drift
src/components/layout/Footer.jsx             # 2 → 4 col at lg (was xl)
src/components/sections/HeroHome.jsx         # xs:grid-cols-3 stat row, drift
src/components/sections/ServiceCard.jsx      # hover-lift
src/components/sections/MembershipOptions.jsx# hover-lift, p-6 sm:p-8
src/components/sections/GalleryGrid.jsx      # sm:col-span-2 (was min-[700px])
src/components/sections/FAQAccordion.jsx     # min-h trigger
src/components/sections/ContactForm.jsx      # remove inline <style>
src/pages/Home.jsx                           # ValueCard hover-lift
src/pages/Membership.jsx                     # matrix mobile stacking
src/pages/Pricing.jsx                        # matrix mobile stacking
src/pages/Team.jsx                           # trainer card hover-lift
src/pages/Contact.jsx                        # 3-col strip, hover-lift
```

---

## Biggest mobile fixes

1. **Pricing & Membership comparison matrices** — old 2-column
   stacking made each cell a half-width tile with a tiny "Day Pass:
   Included" label crammed alongside a check icon. New layout gives
   each row its own line on mobile so it reads:
   *"Single-visit access" / "✓ Day Pass: Included"* etc.

2. **StickyWhatsApp not honouring iOS safe area** — was
   `bottom-4 right-4` which sat under the home indicator on iPhones.
   Now uses the new `bottom-safe` utility (`max(1rem,
   env(safe-area-inset-bottom))`).

3. **HeroHome stat row** used a one-off `min-[560px]:grid-cols-3`
   breakpoint. Replaced with the proper `xs: 420px` token, dropped
   to `grid-cols-1 xs:grid-cols-3`. Stats now sit on one row from
   ~420px instead of waiting until 560px, so the hero feels less
   tall on average phones.

4. **Long-word overflow on form / address blocks** — email addresses
   and the long Instagram handle were forcing horizontal scroll on
   narrow screens. Added `overflow-wrap: anywhere` at the base
   layer.

5. **Form inputs** had inconsistent height across the form (the
   inline `<style>` only covered some fields). All form fields now
   use the global `.input` class with a 48px min-height tap target.

6. **AnnouncementBar persistence** — every page-load was forcing the
   user to read the same bar. Now dismissable for the rest of the
   session.

---

## Biggest desktop / layout improvements

1. **Footer** jumped 1 → 2 → 4 with the 4-col layout only kicking
   in at `xl` (1280px+). Most laptops are 1280–1440 logical px;
   moved to `lg` so 13" / 14" laptops get the proper 4-col layout.

2. **PageHero `display-1 → display-2`** — the home hero earns the
   massive 5.5rem `display-1` heading; inner pages do not. Inner
   page H1s now sit at `display-2` (clamp 1.85rem → 3.9rem) which
   reads better at every breakpoint.

3. **Hover-lift utility consolidation** — the codebase had four
   different `hover:-translate-y-X` patterns sprinkled across cards
   with subtly different easing / shadows. Now all use the same
   `.hover-lift` utility, gated behind `(hover: hover)` so tablets
   don't get a stuck hover state.

4. **Drift animation on hero blobs** — was static `blur-3xl` at
   fixed positions. Now drifts ~12px over a 9–14s cycle, creating
   ambient motion without being distracting. Disabled under
   reduced-motion.

5. **Contact quick-contact strip** — was `sm:grid-cols-2
   xl:grid-cols-3`, leaving an awkward 2-up + 1-orphan layout from
   sm to xl. Three contact methods now fit cleanly on a 3-col grid
   from `sm` upwards.

---

## Areas that still need manual / design input

These are deliberately out of scope for this pass — they require
real assets or content decisions, not engineering polish.

* **Photography** — every gallery tile, team portrait and hero
  visual is a stylised SVG placeholder. `ASSETS_NEEDED.md` lists
  the photos the client needs to supply (gym interior, trainer
  portraits, optional process / event photos).
* **Trainer bios** — Team page has 5 cards, all with placeholder
  bios saying "Bio coming soon". Real names are confirmed; bios &
  qualifications still need to be supplied.
* **Map embed styling** — using Google Maps iframe with a CSS
  greyscale filter. A custom map skin (Mapbox / Maps API key)
  would feel more premium but isn't strictly responsive work.
* **Hero copy hierarchy on /home** — the copy reads well, but it's
  a candidate for an A/B test once we have analytics — e.g. lead
  with the offer (free trial) vs the position (family-run).
* **Motion-on-scroll budget** — we're using `whileInView` +
  staggered fadeUp on most sections. On low-end Android devices
  this can chug — worth profiling on a real device once the build
  is hosted.

---

## Constraints I deliberately respected

* Did not introduce new dependencies (no 21st.dev MCP — the
  existing Framer Motion + Lucide stack already covers everything
  here).
* Did not refactor file structure or conventions — every change
  slots into an existing file.
* Did not over-animate. The motion budget is: animated entry per
  page (`PagePose`), staggered reveal per section (`Reveal`),
  hover-lift on cards, drift on hero blobs, pulse on the
  WhatsApp button. Nothing else has continuous motion.
* Did not change copy or facts. Every `R` figure, name, address,
  and policy line on the site comes from the questionnaire / Atlas
  analysis. Nothing was rewritten in this pass.
* Kept the production CSS bundle below 50 kB ungzipped (48.13 kB).

---

## How to verify

```bash
cd "Gym Website"
npm run build              # green; ~3.9s
npm run preview            # http://localhost:4173
```

Then walk through the responsive breakpoints in DevTools:
* **320×568** (iPhone SE, oldest supported)
* **375×812** (iPhone 12)
* **414×896** (Pixel 5 / iPhone Plus)
* **768×1024** (iPad portrait)
* **1024×1366** (iPad Pro)
* **1280×800** (13" laptop)
* **1440×900** (14"/15" laptop, default macOS)
* **1920×1080** (full HD)
* **2560×1440** (QHD / 27" iMac)

Pages to check at each: `/`, `/services`, `/membership`, `/pricing`,
`/team`, `/gallery`, `/about`, `/contact`, `/faq`. Pay specific
attention to:

1. The Pricing & Membership comparison matrices (mobile stacking).
2. The home hero stat row at the 380–500px range.
3. The footer between 1024 and 1279px (lg without xl).
4. The sticky WhatsApp button on iOS (safe-area awareness — easy
   to miss in DevTools, easier to spot on a real device).
5. `prefers-reduced-motion` ON in DevTools rendering panel —
   nothing should still be drifting / pulsing / floating.
6. Tab through the site with the keyboard — first tab should focus
   the skip-link, second tab the announcement-bar dismiss, third
   the logo, then the nav.

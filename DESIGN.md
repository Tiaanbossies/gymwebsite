---
name: Bossie's Gym & Personal Training Studio
description: Dark, athletic marketing site for a family-run Centurion gym — red + steel-blue glow against near-black, restrained until it counts.
colors:
  bossie-red: "#dc2b38"
  bright-ember: "#f4535f"
  soft-rose: "#ff8d96"
  steel-crest: "#3d6479"
  near-black-ink: "#05070d"
  deep-ink: "#0a0d16"
  cool-slate: "#c4c9d8"
  mist-white: "#f5f6fa"
  whatsapp-green: "#25D366"
typography:
  display:
    fontFamily: "\"Archivo Black\", \"Bebas Neue\", system-ui, sans-serif"
    fontSize: "clamp(2.35rem, 7vw, 5.5rem)"
    fontWeight: 400
    lineHeight: 0.95
    letterSpacing: "-0.035em"
  headline:
    fontFamily: "\"Archivo Black\", \"Bebas Neue\", system-ui, sans-serif"
    fontSize: "clamp(1.85rem, 4.8vw, 3.9rem)"
    fontWeight: 400
    lineHeight: 1
    letterSpacing: "-0.02em"
  title:
    fontFamily: "\"Archivo Black\", \"Bebas Neue\", system-ui, sans-serif"
    fontSize: "clamp(1.35rem, 3vw, 2.25rem)"
    fontWeight: 400
    lineHeight: 1.08
    letterSpacing: "-0.02em"
  body:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "clamp(0.95rem, 1.05vw + 0.7rem, 1.125rem)"
    fontWeight: 400
    lineHeight: 1.625
  label:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "11px"
    fontWeight: 600
    letterSpacing: "0.25em"
rounded:
  pill: "9999px"
  card: "1.25rem"
  input: "0.75rem"
spacing:
  section: "clamp(4rem, 8vw, 7rem)"
  section-tight: "clamp(3rem, 6vw, 5.25rem)"
  block: "clamp(2rem, 4vw, 3.5rem)"
components:
  button-primary:
    backgroundColor: "{colors.bossie-red}"
    textColor: "{colors.mist-white}"
    rounded: "{rounded.pill}"
    padding: "12px 20px"
  button-primary-hover:
    backgroundColor: "{colors.bright-ember}"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.mist-white}"
    rounded: "{rounded.pill}"
    padding: "12px 20px"
  button-whatsapp:
    backgroundColor: "{colors.whatsapp-green}"
    textColor: "{colors.near-black-ink}"
    rounded: "{rounded.pill}"
    padding: "12px 20px"
  card-surface:
    backgroundColor: "{colors.deep-ink}"
    rounded: "{rounded.card}"
    padding: "24px"
  input-field:
    backgroundColor: "{colors.near-black-ink}"
    textColor: "{colors.mist-white}"
    rounded: "{rounded.input}"
    padding: "14px 16px"
    height: "48px"
---

# Design System: Bossie's Gym & Personal Training Studio

## 1. Overview

**Creative North Star: "The Early Floor"**

This is a gym that opens at 5am and doesn't dress that up. The system reads as a real training floor under work lights, not a SaaS landing page wearing a fitness skin: a near-black base that's deliberately not true black (the questionnaire explicitly rejects neon-on-black cliché), lit from two directions — Bossie Red from the logo's own wordmark, Steel Crest blue from the muscular figures in the crest — both pulled directly from the client's real logo, never invented.

The personality is friendly, minimal, energetic, community-focused (the client's own words). That means confident typography and real glow effects, but restraint everywhere else: flat surfaces at rest, generous fluid spacing instead of dense stacking, and exactly one move per interaction rather than a pile of simultaneous effects. The system explicitly rejects corporate big-box-gym blandness and influencer-fitness hype pages — every visual flourish has to earn its place the way a real gym does: function first, polish second, never polish standing in for substance.

**Key Characteristics:**
- Near-black base (#05070d), never true black — calm, not gothic
- Two-color glow system: red dominant, steel-blue secondary, used with restraint
- Archivo Black display type paired with Inter body — impact contrasted with legibility
- Flat by default; glow and lift are interaction rewards, not ambient decoration
- Fluid `clamp()` scales everywhere — type and spacing breathe across viewport instead of stepping at breakpoints

## 2. Colors

A two-color glow system over a near-black neutral base — both accent colors traced directly to the real Bossie's Gym logo, not chosen abstractly.

### Primary
- **Bossie Red** (#dc2b38): The logo wordmark and ring color. Carries every primary CTA (Join Online, Start a Free Trial links), heading emphasis spans, focus rings, and the glow shadow on hover. This is the color of commitment — if a user is about to convert, it's red.
- **Bright Ember** (#f4535f): Bossie Red's hover/active state, and the `:focus-visible` outline color site-wide. Slightly warmer and lighter so hover states feel like a step forward, not a flat swap.
- **Soft Rose** (#ff8d96): Reserved for eyebrow labels and link-style CTAs — quiet enough to sit above a headline without competing with it.

### Secondary
- **Steel Crest** (#3d6479): The crest's figure tones. Used sparingly for the accent button variant, decorative radial washes, and anywhere a second voice is needed without implying urgency the way red does. Never the default — red converts, steel grounds.

### Neutral
- **Near-Black Ink** (#05070d): The body background. Calm blue-black, never pure #000 — the questionnaire is explicit that "black" as a brand color should not tip into neon-on-void.
- **Deep Ink** (#0a0d16): Card and surface backgrounds, layered over Near-Black via a subtle gradient (`card-surface`) so panels read as slightly raised without a hard edge.
- **Cool Slate** (#c4c9d8): Default body copy color (`.body-lg`) — readable at 4.5:1+ against both Near-Black and Deep Ink without going stark white.
- **Mist White** (#f5f6fa): Headings and primary text — the only near-white in the system, used for things that must read first.

### Named Rules
**The Two-Glow Rule.** Only Bossie Red and Steel Crest ever glow. No third accent color is introduced for variety — if a screen needs a second voice, it borrows Steel Crest, it doesn't invent a new hue.

**The Single-Use Green Rule.** WhatsApp Green (#25D366) exists only on the WhatsApp CTA (button and sticky FAB). It is never reused as a generic "success" or "live" color elsewhere in the system — `chip-live`'s emerald tone is a deliberate, separate, rarely-used exception for status indicators only, not WhatsApp's green repurposed.

## 3. Typography

**Display Font:** "Archivo Black", with "Bebas Neue" then system-ui as fallback
**Body Font:** Inter, with system-ui fallback

**Character:** Archivo Black is heavy, condensed, and impact-driven — a poster face, not a refined editorial serif — deliberately contrasted against Inter's clean, humanist legibility. The pairing reads as "confident announcement, then a real conversation": headlines shout once, body copy talks normally.

### Hierarchy
- **Display** (400, `clamp(2.35rem, 7vw, 5.5rem)`, leading 0.95, tracking -0.035em): Homepage hero headline only (`.display-1`). The single largest moment on the site.
- **Headline** (400, `clamp(1.85rem, 4.8vw, 3.9rem)`, leading 1, tracking -0.02em): Interior page-hero H1s (`.display-2`, `PageHero`). One per page, always paired with an eyebrow above and a description below.
- **Title** (400, `clamp(1.35rem, 3vw, 2.25rem)`, leading 1.08, tracking -0.02em): Section headings within a page (`.display-3`, `SectionHeading`).
- **Body** (400, `clamp(0.95rem, 1.05vw + 0.7rem, 1.125rem)`, leading 1.625, color Cool Slate): Paragraph copy (`.body-lg`). Capped at a comfortable measure by each section's max-width container, not a bare full-bleed column.
- **Label** (600, 11px, tracking 0.25em, uppercase, color Soft Rose): Eyebrows, tags, button text. The only place letter-spacing this wide is used — it signals "this is a label, not a sentence."

### Named Rules
**The One-Shout Rule.** Display scale (`.display-1`) appears exactly once per page load — the homepage hero. Every interior page hero uses Headline scale instead, so the homepage's first impression stays the loudest moment on the site, not diluted across every page.

## 4. Elevation

Flat by default, with elevation as a direct response to interaction — never ambient decoration. Tactile and confident, restrained until it counts: a card at rest is a gradient-tinted panel with a hairline border; the same card on hover lifts 3px and gains a red-tinted glow, signaling "this is interactive" rather than just "this is a box."

### Shadow Vocabulary
- **card** (`0 8px 30px rgba(0,0,0,0.35)`): Default resting shadow under any raised panel.
- **glow** (`0 0 0 1px rgba(220,43,56,0.45), 0 10px 40px -10px rgba(220,43,56,0.35)`): Primary-button hover and any element claiming "this is the action."
- **glow-lg** (`0 0 0 1px rgba(220,43,56,0.45), 0 22px 70px -18px rgba(220,43,56,0.45)`): Featured / active state for cards competing for attention (e.g. a highlighted pricing tier).
- **soft** (`0 10px 40px -15px rgba(0,0,0,0.25)`): Light separation for panels that shouldn't compete for attention.
- **lift** (`0 18px 60px -18px rgba(0,0,0,0.55)`): Deepest shadow, reserved for modals/overlays sitting above everything else.

### Named Rules
**The Hover-Earns-It Rule.** No shadow appears at rest beyond the minimum needed for legibility (`card`). Glow and lift are always a response to `:hover` or `:focus-visible` — if a static screenshot shows glow, something is wrong, because glow means "the user is touching this right now."

## 5. Components

### Buttons
- **Shape:** Full pill (`rounded-full`, 9999px) — every button on the site, no exceptions.
- **Primary:** Bossie Red background, Mist White text, uppercase 13px label tracking, `12px 20px` padding. Hover shifts to Bright Ember and adds the `glow` shadow; active scales to 0.98.
- **Accent:** Same shape, Steel Crest background — used only where a second, calmer CTA sits beside a primary one.
- **Ghost:** Transparent with a `white/15` border and `white/5` fill — secondary actions (e.g. "Call" beside "Join Online").
- **WhatsApp:** WhatsApp Green background, Near-Black text — exists in exactly one context, the click-to-chat CTA.
- **Link:** No fill, Soft Rose text that brightens on hover — tertiary actions like "Start a Free Trial" when it's the third option in a CTA row.
- **Hover / Focus:** Every variant gets a `:focus-visible` outline in Bright Ember at 2px with 3px offset — never relies on browser default focus rings.

### Chips / Tags
- **Style:** Full pill, `white/10` border, `white/5` fill, 11px uppercase label tracking, Cool Slate text.
- **Live indicator:** A single deliberate exception — emerald border/fill/text for the "chip-live" status chip only.

### Cards / Containers
- **Corner Style:** 1.25rem radius (`card-surface`) — soft enough to feel approachable, not so soft it looks toy-like.
- **Background:** Gradient from Deep Ink at 80% to Near-Black at 80%, so the card reads as a distinct layer without a hard color jump.
- **Shadow Strategy:** Flat at rest; `hover-lift` adds a 3px translateY plus the `glow` shadow combination, gated behind `(hover: hover)` so touch devices never get a stuck hover state, and disabled entirely under `prefers-reduced-motion`.
- **Border:** Hairline `white/10` at rest.
- **Internal Padding:** Generous — cards never feel cramped; copy gets room to breathe inside the panel.

### Inputs / Fields
- **Style:** `0.75rem` radius, `white/10` border, near-transparent `white/[0.03]` fill, 48px minimum height (comfortable mobile tap target).
- **Focus:** Border shifts to Bossie Red at 60% opacity plus a 2px Bossie-Red ring at 30% opacity — visible without being harsh.
- **Hover:** Border brightens to `white/20` as a pre-focus hint.

### Navigation
- **Style:** Text links in Cool Slate, brightening to Mist White on hover/active. Active and hover states share an animated underline — a thin red-gradient bar that scales in from the left via `transform: scaleX()`, never a layout-shifting border.
- **Mobile:** Slide-down panel (Framer Motion `AnimatePresence`) stacking WhatsApp, Call, and Join as full-width buttons rather than compressing nav into icons.

### Sticky WhatsApp FAB (signature component)
A fixed, circular WhatsApp-green button with a continuous soft pulse ring animation (`pulseRing`, 1.8s) — the only ambient (non-hover-gated) motion in the system, justified because it represents a live, always-available channel rather than decoration. Respects `prefers-reduced-motion` like everything else.

## 6. Do's and Don'ts

### Do:
- **Do** keep the base near-black (#05070d), never pure #000 — the brand explicitly avoids the neon-on-void cliché.
- **Do** reserve Display scale (`.display-1`) for exactly one headline per page — the homepage hero.
- **Do** gate all elevation (glow, lift) behind `:hover` / `:focus-visible` — nothing glows at rest.
- **Do** keep WhatsApp Green scoped to the WhatsApp CTA only.
- **Do** disable `hover-lift` transforms and reduce all animation durations to near-zero under `prefers-reduced-motion`.
- **Do** use full-pill buttons everywhere — no square or barely-rounded button variants.

### Don't:
- **Don't** add a third glow color. Red and Steel Crest are the whole palette; don't introduce a new accent hue "for variety."
- **Don't** use fake testimonials, stock-photo gloss, or invented stats/credentials anywhere in the system — per PRODUCT.md, every claim must be traceable to the client questionnaire; unconfirmed content gets an explicit "TBD" placeholder, never a fabricated one.
- **Don't** let the site drift toward corporate big-box-gym blandness or influencer-fitness hype/hard-sell patterns — no countdown timers, no "limited spots" urgency tactics, no oversized hero-metric stat blocks.
- **Don't** use `border-left`/`border-right` colored stripes as a card accent — this system uses full borders, gradient backgrounds, and glow, never side-stripes.
- **Don't** apply gradient text (`background-clip: text` + gradient) — emphasis comes from the Bossie Red color or weight, never a gradient fill.
- **Don't** ship a tiny uppercase eyebrow above every single section as a reflex — the `.eyebrow` class exists and is used on page heroes, but don't add one to every card or sub-section just because the pattern is available.

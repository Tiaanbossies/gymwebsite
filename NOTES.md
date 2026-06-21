# Build Notes — Bossie's Gym Website

This document captures every decision made on top of the completed **client onboarding questionnaire (April 2026)**: what's grounded in the questionnaire, what's inferred, what was deliberately omitted, and where future work can responsibly expand the site. The priority order followed throughout:

1. Factual accuracy from the questionnaire
2. Project instructions in the brief
3. Implementation decisions for polish, structure, and maintainability

No facts have been fabricated. Where content leaned forward, it's called out below.

---

## Grounded facts used in the site (directly from the questionnaire)

These appear in the copy because the questionnaire supports them:

- **Business**: Bossie's Gym & Personal Training Studio (display name: "Bossie's Gym"). Small commercial gym — Q6, Q7, Q18.
- **Owner**: Johan "Bossie" Boshoff — Q2. Family-run with Rene, Debbie and Niell — Q3, Q39.
- **Address**: 1st Floor, 207 Edison Crescent, Hennopspark, Centurion, 0157 — Q8. Publicly displayed per Q14.
- **Phone**: 072 482 7922 — Q11. Used for tel: and WhatsApp (wa.me).
- **Email forwarding**: tiaan374@gmail.com.
- **Hours** — Q10:
  - Mon–Thu: 5am–8pm
  - Fri: 5am–7pm
  - Sat: 8am–11am
  - Sun: Closed
- **Areas served**: Centurion, Midstream, Hennopspark (+ Lyttelton as adjacent catchment) — Q9.
- **Social**: Instagram @bossiesgym — Q15. Google Business Profile — Q16.
- **Services offered** — Q31:
  - 1-on-1 Personal Training (flagship)
  - Open Gym Access
  - Online Coaching
  - Nutrition / Diet Plans
  - Body Assessments
  - **No group classes** (Q36 explicitly = No).
- **Facilities** — Q33/Q34: weight training area, cardio area, functional training area, boxing area.
- **Trainers**: 8 personal trainers on staff — Q40. Three Boshoff-family names (Bossie, Rene, Debbie) come directly from the questionnaire. Niell's surname was corrected from Boshoff to Bezuidenhout at owner review (April 2026) — Niell coaches on the team but is **not** a Boshoff. Four further trainers (Quibert Dippenaar, Nikki Bredenkamp, Do-Neill Dowry, Dale Collins) were confirmed and added to the roster at the same review. The Team page visually distinguishes the five non-family coaches from the family three via a "Personal Trainer" kicker and a steel-blue accent portrait tile (instead of the brand-red one used for family).
- **Pricing** visible on the site (fully wired via `site.pricing` in `src/lib/site.js`, and broken out in full on `/pricing`):
  - R100 day pass — Q42.
  - Open gym — **R450 / month** month-to-month, **R380 / month** on a 6-month contract, **R360 / month** on a 12-month contract (Q43 lengths + client-confirmed rand values, Apr 2026 follow-up).
  - Student membership — **R250 / month** flat rate for open-gym access with a valid student card (Q44 + client-confirmed rand value).
  - Personal training — **R2,100 / month** for 3 sessions/week (Q45), and **R2,700 / month** for 5 sessions/week (client-confirmed in follow-up). Both include a personalised diet plan and regular body assessments.
  - Free trial — Q52 = Yes (surfaced in AnnouncementBar + hero + dedicated trial CTA).
  - Joining fee — **R200 once-off** on new open gym memberships (client-confirmed in follow-up).
- **Primary CTAs** — Q17 checked "Join Online", "Call the Gym", "Send an Enquiry" (Book a Class / Book a Consultation were **not** checked). Hero and all bottom CTAs follow that order, with "Start a Free Trial" as a supporting tertiary action per Q52.
- **Primary enquiry channel** — Q54 + Q78: WhatsApp + phone + website form. Reflected via StickyWhatsApp button, AnnouncementBar, Contact-page QuickContact strip.
- **Ideal member** — Q20: working husband/wife with clear goals → audience 26–35 (Q21). Hero copy references "working professionals".
- **Differentiator** — Q19: "a small gym that focuses on its customers, rather than just trying to grow for growth's sake". Echoed in TrustSection and About.
- **Brand values** — Q23: Honesty, Commitment, Community. Used as About's values section and echoed on Team.
- **Brand feel** — Q27: Friendly, Minimal, Energetic, Community-Focused. Informs typography rhythm, amount of white space, and the family-run voice.
- **Brand colour direction** — Q25 originally listed Blue / Red / Black. Once the client supplied the real Bossie's logo, the palette was re-tuned **directly from the logo's colours**: dominant red (`#dc2b38`, matching the BOSSIE'S wordmark and circular ring) became the primary `brand`; steel-blue (`#3d6479`, matching the muscular figures in the crest) became the secondary `accent`; black/ink remains the surface. Result: Q25's three-colour direction is preserved, but the *primary* shifted from blue to red so the site visually aligns with the actual logo.

All site copy aligns with the above.

---

## Assumptions (kept deliberately conservative)

The following were inferred but kept cautious, non-specific, and consistent with what the questionnaire supports:

- The **contact form** submits client-side and hands the user both a pre-filled WhatsApp link and a mailto link. No backend integration was set up in this build. Q54 confirms enquiries currently go to WhatsApp + phone + website form — the form simply routes the typed message into those channels until a form handler is wired up.
- The **compare table** on `/membership` lists feature-level coverage across day pass, open gym, contract and PT. The **`/pricing` page** shows hard rand figures for every tier (day pass, M2M / 6m / 12m open gym, student membership, 3-session / 5-session PT) — every number there is client-confirmed.
- The **gallery** uses stylised SVG tiles labelled with the real facility names from Q33/Q34 (weight training, cardio, functional, boxing). Tiles are deliberately abstract so no imagery is invented. Real photography is listed in `ASSETS_NEEDED.md`.
- The **Team page** shows four named Boshoff-family trainers with "Bio coming soon" and "Portrait — TBD" placeholders (explicit, visible). The 5th trainer (Q40 mentions 5) is acknowledged in a note below the grid rather than fabricated.
- The **hero visual** is an abstract SVG composition (barbell with one red plate + one steel-blue plate, concentric targets, energy lines). It's not a photo of the owner, a trainer, or the gym interior — both of which would overreach without real imagery.
- The **FAQ** reflects only policies confirmed in the questionnaire plus the client-confirmed follow-ups (R200 joining fee, R2,700/month 5-day PT rate, eight-trainer roster, domain = bossiesgym.co.za). Anything not confirmed — session-booking cadence, cancellation terms beyond month-to-month — is answered with "ask us" rather than a number.
- The **domain** used is `bossiesgym.co.za`, confirmed by the client. Q67 in the questionnaire read "bossiesgy.co.za", which was a typo. Documented in `src/lib/site.js`.

If any of these are incorrect, they should be updated at the copy level only — no structural changes are needed.

---

## What was intentionally omitted

These were explicitly called out as not to be invented and are not present anywhere in the build:

- **Member dashboard** or account portal.
- **Online workout tracking** / exercise logging.
- **Online payments** / checkout / Stripe / any e-commerce.
- **Online booking** for sessions or class slots.
- **Trainer certifications** (NASM, ISSA, CrossFit levels, etc.) — not asked in the questionnaire.
- **Testimonials / reviews / star ratings** — Q65 = none available.
- **Class timetables** — Q36 = no group classes.
- **Before/after transformation photos** or member success metrics — none supplied.
- **Named trainer bios** — flagged as TBD until supplied; the Team page shows names + placeholder tiles only.
- **Invented prices** — every visible rand figure on the site (R100 day pass; R450 / R380 / R360 open gym; R250 student membership; R2,100 / R2,700 personal training; R200 joining fee) is either from the questionnaire or a client-confirmed follow-up. No prices are invented or "placeholder"; there are no "rates on enquiry" lines left on the site.

---

## How trust is built on the site

- `TrustSection` ("Why Bossie's") — four pillars grounded in the questionnaire: family-run, honesty & commitment, members first, local to Centurion.
- `Team` page — real names, family-run positioning, explicit "Bio/Portrait TBD" placeholders (visible honesty > fake polish).
- `About` page — owner named, family listed, values (Honesty/Commitment/Community) spelled out, coaching approach described in principles rather than credentials.
- **Sticky WhatsApp** button + header phone CTA + announcement bar free-trial → low-friction conversion that doesn't rely on hype.
- Real address, real hours, Google Maps embed on Contact. These are the small, verifiable trust signals a local gym needs.

---

## Changes vs. the first build

- Rebranded from gold/amber → first to **Blue (#2f6fe6) / Red accent (#dc2b38) / Black** per Q25, then — once the real logo arrived — re-tuned to **Red (#dc2b38) / Steel-Blue accent (#3d6479) / Black** so the palette is pulled directly from the logo's own colours.
- **Real Bossie's logo wired in** (April 2026). Source CMYK JPEG processed through `process_logo.py` → transparent PNGs at `/public/logo.png` (full), `/public/logo-sm.png` (header), `/public/favicon.png` (crest only). The `Logo.jsx` component now renders the real logo; the placeholder SVG barbell mark is gone. Resolves Q71's "logo TBD".
- Replaced all "Book a Consultation" CTAs with **Join Online** / **Call the Gym** / **Start a Free Trial** (Q17 + Q52).
- Removed all group-class references (Q36 = No).
- Added **Team page** (Bossie / Rene / Debbie / Niell) — new route `/team`, with `/community` aliased back to it for anyone linking the old path.
- Added **StickyWhatsApp**, **AnnouncementBar**, and per-page free-trial CTAs.
- Added **real address**, **real hours**, **Google Maps embed**, **Instagram link**, **tel: links** everywhere phone is shown.
- Rewrote **Membership** with R100 day pass / open gym contract tiers / PT at R2,100 (3×/week) and R2,700 (5×/week). R200 joining fee + student discount surfaced as "perk" tiles.
- Rewrote **FAQ** with real policies (trial, day pass, sign-up channels, student discount, PT pricing, contract lengths, no group classes).
- Rewrote **Services** with five services (PT, Open Gym, Online Coaching, Nutrition, Body Assessments) and facility-accurate descriptions.
- Updated **JSON-LD** in `index.html` to a `HealthClub` schema with the real address, phone, hours, areas served and price range.

---

## Client-confirmed follow-ups (already wired into the site)

These were flagged as open items during initial build and confirmed by the client after the questionnaire was submitted. The site copy reflects each one:

- **Joining fee** — R200 once-off on new **open gym** memberships. Surfaced on `/pricing`, in the Membership "perk" tile, the Membership FAQ, and the site-wide FAQ page.
- **Open gym monthly rates** — R450 (M2M) · R380 (6-month) · R360 (12-month). Shown as a dedicated three-card block on `/pricing`, summarised on `/membership`, and answered concretely in the site FAQ. Stored in `site.pricing.openGym`.
- **Student membership** — R250 / month flat rate for open-gym access with a valid student card. Surfaced as a dedicated tile on `/pricing`, in the Membership FAQ and the site FAQ. Stored in `site.pricing.studentMembership`.
- **5-day-a-week personal training** — R2,700 / month. Shown in `MembershipOptions.jsx` alongside the R2,100 three-session rate, on `/pricing`, and in the PT-pricing FAQ on both the Membership and FAQ pages.
- **Trainer roster** — expanded to eight at owner review: Niell Bezuidenhout (surname-corrected, not a Boshoff), plus four new additions (Quibert Dippenaar, Nikki Bredenkamp, Do-Neill Dowry, Dale Collins). Each appears on `/team` with a visually distinct "Personal Trainer" kicker and steel-blue accent portrait tile so the site never implies they are a Boshoff.
- **Domain** — `bossiesgym.co.za` confirmed. The Q67 "bossiesgy.co.za" spelling was a typo.
- **Logo** — Q71 was originally TBD. The client supplied the real Bossie's Gym crest in April 2026 (CMYK JPEG, 3327×3344). Now wired in across the site as `/logo.png`, `/logo-sm.png`, and `/favicon.png`. The original colour scheme (cobalt blue primary) was re-tuned to the logo's own colours: red primary, steel-blue accent.

## Still open with the client

- **Trainer bios + portraits (all eight)** — see `ASSETS_NEEDED.md`. Currently "Bio coming soon" + "Portrait — TBD" placeholders.
- **Gym photography** — see `ASSETS_NEEDED.md`. Currently abstract SVG gallery tiles.
- **Google Analytics measurement ID** — Q79 = Google Analytics. Stub placeholder is in `index.html`, commented out. Replace `G-XXXXXXX` when provided.
- **Form handler** — currently client-side; wire to Formspree / Resend / a serverless function when ready. Messages are piped into WhatsApp + mailto in the meantime.

---

## Conflicts with the questionnaire

None that change structure. One typo (`bossiesgy.co.za` vs `bossiesgym.co.za`) was resolved to the live domain (`bossiesgym.co.za`) — confirmed by the client and documented in `src/lib/site.js`.

# Assets Needed — Bossie's Gym Website

The site is live-ready with placeholder imagery (abstract SVG compositions) in the places where real photography will eventually go. This document is the shot list the Boshoff family should run through — ideally with one good photographer, one morning, or two mornings on-site.

Everything below is called out because the **client onboarding questionnaire** (Q72, Q73, Q68) confirmed that real photography and videography are planned but not yet on hand. Until they are, the site ships with clearly-labelled placeholders so the design never pretends to show something it isn't.

---

## 1 — Gym facility photography (top priority)

Location: **1st Floor, 207 Edison Crescent, Hennopspark, Centurion** (Q8)

Preferred style: **natural light, wide lenses, real members training if they're happy to be photographed, no cheesy stock-fitness posing**. The questionnaire Q27 selected "Friendly · Minimal · Energetic · Community-Focused" — the photography should reinforce that.

Shots needed:

| # | Shot | Where on the site |
|---|---|---|
| 1 | Wide shot of the full training floor | Gallery hero + Home "Inside Bossie's" preview |
| 2 | Weight training area (racks, plates, barbells) | Gallery tile "Weight Training" |
| 3 | Cardio area (treadmills, bikes, rowers) | Gallery tile "Cardio Area" |
| 4 | Functional training area | Gallery tile "Functional Training" |
| 5 | Boxing area (bags, pads, floor space) | Gallery tile "Boxing Area" |
| 6 | 1-on-1 coaching moment (trainer + client) | Gallery tile "1-on-1 Coaching" + Services PT card |
| 7 | Body assessment area / tools | Gallery tile "Assessments" |
| 8 | Entrance / signage / reception | Contact page header, About |
| 9 | Environmental detail shots (x3–5) — plates being loaded, chalk, calloused hands, PR board, etc. | Peppered as texture throughout |

Format: high-res landscape JPG (minimum 2400×1600). Plus at least one portrait-orientation hero shot for mobile.

Storage: drop them in `public/images/gym/` and swap the placeholder SVG in `src/components/sections/GalleryGrid.jsx`.

---

## 2 — Team portraits (high priority)

Needed for the **Team page** (`/team`) where all eight trainers currently show "Portrait — TBD" placeholders:

| # | Person | Role |
|---|---|---|
| 1 | Johan "Bossie" Boshoff | Owner & Head Coach (Q2) — Boshoff family |
| 2 | Rene Boshoff | Family team / coach (Q3/Q39) — Boshoff family |
| 3 | Debbie Boshoff | Family team / coach (Q3/Q39) — Boshoff family |
| 4 | Niell Bezuidenhout | Personal Trainer — **not** a Boshoff (surname corrected at owner review, April 2026) |
| 5 | Quibert Dippenaar | Personal Trainer — **not** a Boshoff |
| 6 | Nikki Bredenkamp | Personal Trainer — **not** a Boshoff |
| 7 | Do-Neill Dowry | Personal Trainer — **not** a Boshoff |
| 8 | Dale Collins | Personal Trainer — **not** a Boshoff |

Preferred style: **environmental portraits on the training floor**, not studio headshots. Same lens/lighting across all eight so they read as a set — even though five aren't family, they should still feel part of the same visual series.

Format: **square crop (1:1)** at minimum 1200×1200. Second option: **portrait (4:5)** at minimum 1200×1500.

Storage: `public/images/team/<firstname>.jpg` (e.g. `bossie.jpg`, `rene.jpg`, `debbie.jpg`, `niell.jpg`, `quibert.jpg`, `nikki.jpg`, `do-neill.jpg`, `dale.jpg`).

### Also needed: short bios (~60–80 words each)

Per person, answering:

- What do they coach? (e.g. personal training, competition prep, beginners, weight loss…)
- How long have they been coaching at Bossie's?
- Any certifications they want listed (SASOCIA / IFBB / CrossFit / NASM / etc.)
- One sentence of personality

All eight trainers now have full names on file.

---

## 3 — Hero photography / videography

Ideal: **one hero still** + **one 8–12 second hero loop** (muted, no sound, to play softly behind the headline on Home).

Subject options (pick one):

- A trainer setting up a barbell for a client.
- A wide slow-pan of the floor at 6am when it's busy.
- A boxing combo on a bag.

Format:
- Still: landscape JPG at minimum 2880×1800.
- Loop: MP4, H.264, ≤ 4 MB, 1080p, 8–12 seconds, no audio track.

Fallback: the current abstract SVG hero ships when these aren't supplied.

---

## 4 — Logo files

✅ **Resolved (April 2026).** The client supplied the real Bossie's Gym crest. Wired in across the site as:

- `public/logo.png` (800px master) — used for the OG image, the structured-data image, and any future large-surface placement (footer hero etc.).
- `public/logo-sm.png` (256px master) — used by the header at 40–44px (and 2× retina).
- `public/favicon.png` (64×64, crest only — the wordmark is dropped at favicon size for legibility) — used as the browser tab icon and Apple touch icon.

The PNGs are generated from the source CMYK JPEG (kept as `Logo-source.jpg` in the project root) by `process_logo.py`. Re-run that script if the source ever changes.

If the client wants a vector version (SVG) for sharper rendering at huge sizes — and especially for the OG card — drop it at `public/logo.svg` and we'll preference it in `Logo.jsx`. Not blocking; the PNGs look great at every size we currently render.

---

## 5 — Social / Open Graph image (OG card)

Needed for: link previews when someone shares the site on WhatsApp / Instagram DMs / Slack.

- One image at **1200×630** (Facebook/WhatsApp/LinkedIn) — e.g. hero still from section 3 with the Bossie's logo overlayed.
- Save to `public/og-cover.jpg` and update the `og:image` tag in `index.html`. (Currently `og:image` points at `/logo.png` — the logo on a dark surface — which works fine but isn't a true 1200×630 social card.)

---

## 6 — Content the client still needs to confirm (no photography, just copy)

See `NOTES.md` → "Still open with the client". Summary:

- **Short bios (~60–80 words) for all eight trainers**, per the format in section 2 above.
- **Google Analytics measurement ID** (Q79). Stub lives commented-out in `index.html`.
- **Form handler endpoint** (so the contact form can actually POST somewhere). Right now the form pipes the typed message into WhatsApp + mailto on submit.

The following items were **confirmed by the client** after the questionnaire and are now live on the site — no further action needed on copy:

- Joining fee = R200 once-off on new memberships.
- 5-day-a-week personal training = R2,700 / month.
- Roster expanded to eight trainers (three Boshoff family + five additional coaches: Niell Bezuidenhout, Quibert Dippenaar, Nikki Bredenkamp, Do-Neill Dowry, Dale Collins).
- Live domain = `bossiesgym.co.za` (Q67 typo resolved).

---

## What's OK to skip

Not needed:

- Stock photography of barbells / gyms — we won't use it.
- Posed "fitness influencer" style shots — off-brand per Q27 (Friendly, Minimal).
- Before/after client photos — Q65 confirmed these aren't being collected formally.
- Testimonial video clips — same reasoning.

If real photography isn't on the cards soon, the site looks deliberate with the current SVG tiles. It's designed so placeholders read as placeholders, not as poor stock photos.

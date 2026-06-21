import { motion } from 'framer-motion';
import {
  ArrowUpRight,
  Check,
  Info,
  Sparkles,
  Receipt,
  GraduationCap,
  Phone,
  Dumbbell,
  User,
  Calendar,
  Salad,
  LineChart,
  Award,
  Zap,
  ShieldCheck,
} from 'lucide-react';

import PagePose from '../components/ui/PagePose.jsx';
import PageHero from '../components/sections/PageHero.jsx';
import Container from '../components/ui/Container.jsx';
import SectionHeading from '../components/ui/SectionHeading.jsx';
import Button from '../components/ui/Button.jsx';
import FAQAccordion from '../components/sections/FAQAccordion.jsx';
import CTASection from '../components/sections/CTASection.jsx';
import Reveal from '../components/ui/Reveal.jsx';
import { site, fadeUp, stagger, waLink } from '../lib/site.js';

/**
 * Pricing page — comprehensive rate card for Bossie's Gym.
 *
 * Every rand figure on this page lives in src/lib/site.js (`site.pricing`)
 * so a single edit there cascades across the whole page.
 *
 * Figures and policies, with sources:
 * • R100 day pass                                 — Q42
 * • Open gym: R450 / R380 / R360 per month        — client-confirmed (Apr 2026)
 * • Student & pensioner membership: R250 / month  — client-confirmed
 * • Personal training: R2,100 (3×/w), R2,400 (4×/w), R2,700 (5×/w)
 * — Q45 + client follow-ups
 * • R200 joining fee on open gym memberships       — client-confirmed
 * • Free trial available                           — Q52
 * • No group classes                               — Q36
 */

// Shared formatting helpers
const fmtRand = (n) => `R${n.toLocaleString('en-ZA')}`;

const waPricingMsg = waLink(
  "Hi Bossie's — I'd like more info on your pricing and to chat about the right membership for me.",
);

export default function Pricing() {
  const { pricing } = site;
  const m2mRand = pricing.openGym.find((t) => t.contract === 'Month-to-month').rand;

  return (
    <PagePose>
      <PageHero
        eyebrow="Pricing"
        title="Pricing"
        description="Real prices. No surprises. Full breakdown below. Day pass, open gym membership, personal training and what's included in each."
        imagePath="/images/gym/assessment-desk.webp"
        breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'Pricing' }]}
      />

      {/* At-a-glance strip */}
      <section className="border-b border-white/10 bg-white/[0.02]">
        <Container>
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-60px' }}
            className="grid gap-4 py-8 md:grid-cols-2 xl:grid-cols-4"
          >
            <GlanceChip
              icon={Calendar}
              label="Day pass"
              value="R100"
              suffix="per visit, no contract"
            />
            <GlanceChip
              icon={Dumbbell}
              label="Open gym"
              value="From R360"
              suffix="per month (12-month contract)"
            />
            <GlanceChip
              icon={GraduationCap}
              label="Student & pensioner"
              value="R250"
              suffix="per month, valid card / proof required"
            />
            <GlanceChip
              icon={User}
              label="Personal training"
              value="From R2,100"
              suffix="per month (3 sessions/week)"
              accent
            />
          </motion.div>
        </Container>
      </section>

      {/* Day pass */}
      <section className="section-tight">
        <Container>
          <SectionHeading
            eyebrow="Day pass"
            title="In town or just trying us out."
            description="One-off visit, no sign-up, no contract, no joining fee. Walk in during opening hours, train, walk out."
          />

          <Reveal className="mt-10">
            <div className="grid items-stretch gap-6 rounded-2xl border border-white/10 bg-ink-900 p-6 sm:p-8 lg:p-10 md:grid-cols-[1.1fr_1fr]">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-brand-300">
                  Casual · No contract
                </p>
                <div className="mt-3 flex items-baseline gap-3">
                  <span className="font-display text-5xl tracking-headline text-white sm:text-6xl">
                    {fmtRand(pricing.dayPass.rand)}
                  </span>
                  <span className="text-sm text-ink-400">{pricing.dayPass.period}</span>
                </div>
                <p className="mt-5 text-ink-300 leading-relaxed max-w-md">
                  Full access to the training floor — weights, cardio, functional, boxing. Ideal if
                  you're visiting Centurion or want to experience the gym before going for a
                  membership.
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Button to={site.ctas.enquire.to + '?plan=day-pass'} data-track="Day Pass Inquiry — Pricing">
                    Get a day pass
                  </Button>
                  <Button
                    href={site.ctas.call.href}
                    variant="ghost"
                    iconNode={<Phone size={14} strokeWidth={2.5} />}
                    data-track="Call — Pricing"
                  >
                    Call {site.phone.display}
                  </Button>
                </div>
              </div>

              <ul className="flex flex-col justify-center gap-3 border-t border-white/10 pt-6 md:border-l md:border-t-0 md:pl-10 md:pt-0">
                <FeatureLi text="Full training floor (weights, cardio, functional)" />
                <FeatureLi text="Access to the boxing area" />
                <FeatureLi text="No sign-up or joining fee" />
                <FeatureLi text="No booking required — just come in" />
              </ul>
            </div>
          </Reveal>
        </Container>
      </section>

      {/* Open gym */}
      <section className="section-tight">
        <Container>
          <SectionHeading
            eyebrow="Open gym membership"
            title="Train on your own schedule."
            description="Full-access membership across our training floor and boxing area. Pick the contract length that fits — the longer the term, the better the monthly rate."
          />

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-60px' }}
            className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3"
          >
            {pricing.openGym.map((tier) => (
              <motion.article
                key={tier.contract}
                variants={fadeUp}
                className={`relative flex flex-col rounded-2xl border p-7 ${
                  tier.bestValue
                    ? 'border-brand-500/50 bg-gradient-to-b from-brand-500/15 to-ink-900 shadow-glow'
                    : 'border-white/10 bg-ink-900'
                } ${tier.bestValue ? 'md:col-span-2 xl:col-span-1' : ''}`}
              >
                {tier.bestValue && (
                  <span className="absolute -top-3 left-6 rounded-full bg-brand-500 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-white">
                    Best value
                  </span>
                )}
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-brand-300">
                  {tier.contract}
                </p>
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="font-display text-4xl tracking-headline text-white sm:text-5xl">
                    {fmtRand(tier.rand)}
                  </span>
                  <span className="text-xs text-ink-400">/ month</span>
                </div>
                <p className="mt-2 text-xs text-ink-400">{tier.commitment}</p>

                <ul className="mt-6 flex flex-col gap-2.5">
                  <FeatureLi text="Full training floor access" small />
                  <FeatureLi text="Weights · cardio · functional · boxing" small />
                  <FeatureLi
                    text={
                      tier.contract === 'Month-to-month'
                        ? 'Cancel at the end of any paid month'
                        : 'Locked monthly rate for the full term'
                    }
                    small
                  />
                  <FeatureLi text="Free trial before you commit" small />
                </ul>

                <div className="mt-6 border-t border-white/10 pt-5">
                  <p className="text-[11px] text-ink-400">
                    Works out to <span className="text-ink-200">{fmtRand(tier.rand)} × 12 = {fmtRand(tier.rand * 12)}/yr</span>
                    {tier.contract === '12-month contract' && (
                      <span className="text-brand-300"> · save {fmtRand((m2mRand - tier.rand) * 12)} vs month-to-month</span>
                    )}
                    {tier.contract === '6-month contract' && (
                      <span className="text-brand-300"> · save {fmtRand((m2mRand - tier.rand) * 12)}/yr vs month-to-month</span>
                    )}
                  </p>
                </div>
              </motion.article>
            ))}
          </motion.div>

          {/* Student membership — a dedicated sub-tier on open gym */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mt-6 flex flex-wrap items-center gap-6 rounded-2xl border border-brand-500/30 bg-gradient-to-r from-brand-500/10 via-ink-900 to-accent-500/5 p-6 sm:p-7"
          >
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-500/15 text-brand-300 ring-1 ring-brand-500/30">
                <GraduationCap size={18} />
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-brand-300">
                  Student membership
                </p>
                <div className="mt-1 flex flex-wrap items-baseline gap-2">
                  <span className="font-display text-3xl tracking-headline text-white sm:text-4xl">
                    {fmtRand(pricing.studentMembership.rand)}
                  </span>
                  <span className="text-xs text-ink-400">
                    {pricing.studentMembership.period}
                  </span>
                </div>
                <p className="mt-2 max-w-lg text-sm text-ink-300 leading-relaxed">
                  Full open-gym access at a dedicated student rate — {pricing.studentMembership.conditions.toLowerCase()}. Pop in or send a WhatsApp with a photo
                  of your card and we'll sort it.
                </p>
              </div>
            </div>
            <div className="flex w-full flex-wrap gap-3 md:ml-auto md:w-auto">
              <Button
                href={waLink(
                  "Hi Bossie's — I'd like the student membership (R250/month). I'll send through my student card.",
                )}
                variant="whatsapp"
                className="w-full sm:w-auto"
                iconNode={<Zap size={14} strokeWidth={2.5} />}
                data-track="Student Membership — Pricing"
              >
                WhatsApp my student card
              </Button>
            </div>
          </motion.div>

          {/* Joining fee band */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mt-4 flex flex-wrap items-start gap-4 rounded-2xl border border-accent-500/30 bg-accent-500/5 p-6"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent-500/15 text-accent-300 ring-1 ring-accent-500/30">
              <Receipt size={16} />
            </div>
            <div className="flex-1 min-w-[220px]">
              <p className="font-display text-lg tracking-headline text-white">
                R200 once-off joining fee on open gym memberships
              </p>
              <p className="mt-1 text-sm text-ink-300 leading-relaxed">
                Applies to new month-to-month, 6-month, 12-month and student sign-ups. No admin
                fees, no monthly surcharges, no hidden extras.
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-3">
              <Button to={site.ctas.join.to} className="w-full sm:w-auto">{site.ctas.join.label}</Button>
            </div>
          </motion.div>
        </Container>
      </section>

      {/* Personal training */}
      <section className="section-tight">
        <Container>
          <SectionHeading
            eyebrow="Personal training packages"
            title="1-on-1 coaching — every session, every week."
            description="Work directly with one of our trainers on a programme built around your goals, your schedule and your training history. Every package below includes a personalised diet plan and regular body assessments."
          />

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-60px' }}
            className="mt-10 grid gap-5 md:grid-cols-2"
          >
            {pricing.personalTraining.map((tier, i) => (
              <motion.article
                key={tier.sessions}
                variants={fadeUp}
                className={`relative flex flex-col overflow-hidden rounded-2xl border p-8 ${
                  i === 1
                    ? 'border-accent-500/40 bg-gradient-to-b from-accent-500/10 to-ink-900'
                    : 'border-brand-500/40 bg-gradient-to-b from-brand-500/10 to-ink-900'
                }`}
              >
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-brand-300">
                  {i === 0 ? 'Starter PT' : 'Full-time PT'}
                </p>
                <h3 className="mt-2 font-display text-[clamp(1.65rem,3vw,2.2rem)] tracking-headline text-white">
                  {tier.sessions}
                </h3>
                <div className="mt-4 flex items-baseline gap-2">
                  <span className="font-display text-4xl tracking-headline text-white sm:text-5xl">
                    {fmtRand(tier.rand)}
                  </span>
                  <span className="text-xs text-ink-400">/ month</span>
                </div>
                <p className="mt-4 text-sm text-ink-300 leading-relaxed">
                  {i === 0
                    ? 'Three coached 1-on-1 sessions per week. Enough training stimulus to build real momentum, plus room in your week for recovery and your own lifts.'
                    : i === 1
                      ? 'Four coached 1-on-1 sessions per week. A step up in frequency for members who want more structure and faster progress without going full-time.'
                      : 'Five coached 1-on-1 sessions per week. For members who want their training fully structured and their week fully accounted for — serious commitment, serious progress.'}
                </p>

                <ul className="mt-6 flex flex-col gap-2.5">
                  <FeatureLi text={`${tier.sessions} with a dedicated trainer`} small />
                  <FeatureLi text="Personalised diet plan" small />
                  <FeatureLi text="Regular body assessments" small />
                  <FeatureLi text="Programme built around your goals" small />
                  <FeatureLi text="Full training floor access on off days" small />
                </ul>

                <div className="mt-7 flex flex-wrap gap-3">
                  <Button
                    to={site.ctas.enquire.to + `?plan=pt-${i === 0 ? '3x' : '5x'}`}
                    iconNode={<ArrowUpRight size={14} strokeWidth={2.5} />}
                  >
                    Enquire about {tier.sessions}
                  </Button>
                </div>
              </motion.article>
            ))}
          </motion.div>

          {/* What every PT package includes */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mt-6 rounded-2xl border border-white/10 bg-ink-900 p-6 sm:p-8"
          >
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-500/15 text-brand-300 ring-1 ring-brand-500/30">
                <Info size={16} />
              </div>
              <div>
                <p className="font-display text-lg tracking-headline text-white">
                  Every personal training package includes:
                </p>
                <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                  <PTIncluded icon={User} text="1-on-1 coaching — never group sessions" />
                  <PTIncluded icon={Dumbbell} text="Programme tailored to your goals" />
                  <PTIncluded icon={Salad} text="Personalised diet / nutrition plan" />
                  <PTIncluded icon={LineChart} text="Regular body assessments to track progress" />
                  <PTIncluded icon={Award} text="Option to build toward competition stage" />
                  <PTIncluded icon={ShieldCheck} text="Access to the floor on your off days" />
                </ul>
              </div>
            </div>
          </motion.div>
        </Container>
      </section>

      {/* Perks / policies band */}
      <section className="section-tight">
        <Container>
          <SectionHeading
            eyebrow="Extras & policies"
            title="The small print — made small-and-clear."
          />

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-60px' }}
            className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3"
          >
            <PerkCard
              icon={Sparkles}
              title="Free trial"
              body="Come try the gym on us before you sign anything. Book it via the form, give us a call, or drop a WhatsApp."
              cta={{ label: 'Start a free trial', to: site.ctas.trial.to }}
            />
            <PerkCard
              icon={GraduationCap}
              title="Student membership — R250/month"
              body="Dedicated student rate for open gym access. Pop in or WhatsApp a photo of your valid student card and we'll set it up the same day."
              cta={{
                label: 'WhatsApp my student card',
                href: waLink(
                  "Hi Bossie's — I'd like the student membership (R250/month). I'll send through my student card.",
                ),
                external: true,
              }}
            />
            <PerkCard
              icon={Receipt}
              title="Joining fee"
              body="A once-off R200 joining fee applies on open gym memberships. No admin charges, no monthly surcharges, no hidden extras."
              accent
            />
          </motion.div>
        </Container>
      </section>

      {/* What's included matrix */}
      <section className="section-tight">
        <Container>
          <SectionHeading
            eyebrow="Compare"
            title="What's included in each option."
            description="Side-by-side breakdown across day pass, open gym membership and personal training — so you can pick the fit without guessing."
          />

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-60px' }}
            className="mt-10 overflow-hidden rounded-2xl border border-white/10 bg-ink-900"
          >
            <div className="hidden grid-cols-[1.8fr_repeat(3,1fr)] bg-white/[0.03] px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.22em] text-ink-400 sm:grid">
              <span>Feature</span>
              <span className="text-center">Day Pass</span>
              <span className="text-center">Open Gym</span>
              <span className="text-center">Personal Training</span>
            </div>
            <ul className="divide-y divide-white/10">
              {compareMatrix.map((row) => (
                <motion.li
                  key={row.feature}
                  variants={fadeUp}
                  className="grid grid-cols-1 items-center gap-1.5 px-5 py-4 text-sm sm:grid-cols-[1.8fr_repeat(3,1fr)] sm:gap-0 sm:px-6"
                >
                  <span className="font-medium text-ink-100">{row.feature}</span>
                  <MatrixCell value={row.day} labelMobile="Day Pass" />
                  <MatrixCell value={row.open} labelMobile="Open Gym" />
                  <MatrixCell value={row.pt} labelMobile="Personal Training" />
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </Container>
      </section>

      {/* Pricing FAQ */}
      <section className="section-tight">
        <Container>
          <SectionHeading
            eyebrow="Pricing FAQ"
            title="Common pricing questions — answered."
          />
          <div className="mt-10">
            <FAQAccordion items={pricingFaq} />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mt-10 flex flex-col items-start gap-4 rounded-2xl border border-brand-500/30 bg-brand-500/5 p-6 lg:flex-row lg:items-center lg:justify-between"
          >
            <p className="max-w-xl text-sm text-ink-200">
              Not sure which one fits? WhatsApp a quick message or call us and we'll talk you
              through it — no sales pitch, just the right option for your goals.
            </p>
            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:flex-wrap">
              <Button
                href={waPricingMsg}
                variant="whatsapp"
                className="w-full sm:w-auto"
                iconNode={<Zap size={14} strokeWidth={2.5} />}
                data-track="WhatsApp — Pricing"
              >
                Chat on WhatsApp
              </Button>
              <Button
                href={site.ctas.call.href}
                variant="ghost"
                className="w-full sm:w-auto"
                iconNode={<Phone size={14} strokeWidth={2.5} />}
                data-track="Call — Pricing FAQ"
              >
                Call the gym
              </Button>
            </div>
          </motion.div>
        </Container>
      </section>

      <CTASection
        eyebrow="Ready to join?"
        title="Pick an option and hit send."
        description="Free trial, day pass, open gym or personal training — we'll help you choose the right fit."
        primary={{ label: site.ctas.join.label, to: site.ctas.join.to }}
        secondary={{
          label: `Call ${site.phone.display}`,
          href: site.ctas.call.href,
          variant: 'ghost',
        }}
        tertiary={{ label: 'Start a Free Trial', to: site.ctas.trial.to, variant: 'link' }}
      />
    </PagePose>
  );
}

// ---------------------------------------------------------------------------
// Data — kept at the bottom of the file so the component reads cleanly.
// ---------------------------------------------------------------------------

const compareMatrix = [
  { feature: 'Single-visit access',                day: true, open: false, pt: false },
  { feature: 'Full training floor (weights + cardio + functional)', day: true, open: true, pt: true },
  { feature: 'Boxing area',                        day: true, open: true, pt: true },
  { feature: 'Month-to-month membership',          day: false, open: true, pt: false },
  { feature: '6-month / 12-month contract pricing', day: false, open: true, pt: false },
  { feature: 'Student rate (R250/month)',          day: false, open: true, pt: false },
  { feature: '1-on-1 coaching',                    day: false, open: false, pt: true },
  { feature: 'Personalised diet plan',             day: false, open: false, pt: true },
  { feature: 'Regular body assessments',           day: false, open: false, pt: true },
  { feature: 'Competition prep on request',        day: false, open: false, pt: true },
  { feature: 'Free trial available',               day: true, open: true, pt: true },
  { feature: 'Joining fee',                        day: 'None', open: 'R200 once-off', pt: 'None' },
];

const pricingFaq = [
  {
    question: 'Why is open gym cheaper on the 12-month contract?',
    answer:
      "The longer you commit, the better rate we can offer. Month-to-month is R450, 6-month drops to R380, and 12-month brings it down to R360 — that's R1,080 a year less than the M2M rate for the same training.",
  },
  {
    question: 'Does the R200 joining fee apply to personal training too?',
    answer:
      "The R200 joining fee is specifically for open gym memberships. Personal training is billed monthly on its own — get in touch and we'll walk you through how it works for your situation.",
  },
  {
    question: "What's included in personal training at R2,100 / month?",
    answer:
      "Three 1-on-1 sessions a week with a dedicated trainer, a personalised diet plan, regular body assessments, and full access to the floor on the days you're not booked in with your coach. Everything you need to actually move the needle.",
  },
  {
    question: 'What extra do I get moving from 3 to 5 sessions a week?',
    answer:
      "Two more coached 1-on-1 sessions a week (R600 more per month). Recommended if you want your training fully structured and guided every session — or if you're working toward competition prep where the volume and oversight matter.",
  },
  {
    question: 'How much is the student membership?',
    answer:
      "Student membership is R250 per month for full open-gym access, with a valid student card. That's our flat student rate — no separate M2M / 6-month / 12-month tiers on it. The R200 joining fee still applies on first sign-up.",
  },
  {
    question: 'Are there any other fees or add-ons?',
    answer:
      "No. No cancellation fees on month-to-month, no monthly admin charges, no sign-up surcharges beyond the R200 joining fee on open gym. What you see on this page is what you pay.",
  },
  {
    question: 'Do you offer day passes for out-of-town visitors?',
    answer:
      "Yes. R100 per visit, no contract, no joining fee. Walk in during opening hours, train, walk out. Great if you're in Centurion for a few days or trying us out.",
  },
  {
    question: 'Can I pause my membership for injury or travel?',
    answer:
      "Month-to-month members can simply stop at the end of a paid month. For 6-month and 12-month members, chat to us about pause options for injury, travel or other special cases — we sort that out on a case-by-case basis at sign-up.",
  },
];

// ---------------------------------------------------------------------------
// Small presentational helpers (scoped to this page)
// ---------------------------------------------------------------------------

function GlanceChip({ icon: Icon, label, value, suffix, accent = false }) {
  return (
    <motion.div
      variants={fadeUp}
      className={`flex items-start gap-4 rounded-2xl border p-5 ${
        accent
          ? 'border-accent-500/30 bg-accent-500/5'
          : 'border-white/10 bg-ink-900'
      }`}
    >
      <div
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ring-1 ${
          accent
            ? 'bg-accent-500/15 text-accent-300 ring-accent-500/30'
            : 'bg-brand-500/15 text-brand-300 ring-brand-500/30'
        }`}
      >
        <Icon size={18} />
      </div>
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-ink-400">
          {label}
        </p>
        <p className="mt-1 font-display text-lg tracking-headline text-white sm:text-xl">{value}</p>
        <p className="mt-0.5 text-xs text-ink-400">{suffix}</p>
      </div>
    </motion.div>
  );
}

function FeatureLi({ text, small = false }) {
  return (
    <li className={`flex items-start gap-3 text-ink-200 ${small ? 'text-sm' : ''}`}>
      <Check size={16} className="mt-[3px] shrink-0 text-brand-300" />
      <span>{text}</span>
    </li>
  );
}

function PTIncluded({ icon: Icon, text }) {
  return (
    <li className="flex items-start gap-3 text-sm text-ink-200">
      <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-brand-500/10 text-brand-300 ring-1 ring-brand-500/20">
        <Icon size={14} />
      </span>
      <span className="mt-1">{text}</span>
    </li>
  );
}

function PerkCard({ icon: Icon, title, body, cta, accent = false }) {
  return (
    <motion.div
      variants={fadeUp}
      className={`flex h-full flex-col rounded-2xl border p-6 transition-transform duration-300 hover:-translate-y-1 ${
        accent
          ? 'border-accent-500/30 bg-gradient-to-b from-accent-500/10 to-ink-900'
          : 'border-white/10 bg-ink-900'
      }`}
    >
      <div
        className={`flex h-10 w-10 items-center justify-center rounded-lg ring-1 ${
          accent
            ? 'bg-accent-500/15 text-accent-300 ring-accent-500/30'
            : 'bg-brand-500/15 text-brand-300 ring-brand-500/30'
        }`}
      >
        <Icon size={18} />
      </div>
      <p className="mt-4 font-display text-lg tracking-headline text-white">{title}</p>
      <p className="mt-2 flex-1 text-sm text-ink-300 leading-relaxed">{body}</p>
      {cta && (
        <div className="mt-5">
          {cta.href ? (
            <Button href={cta.href} variant="link">
              {cta.label}
            </Button>
          ) : (
            <Button to={cta.to} variant="link">
              {cta.label}
            </Button>
          )}
        </div>
      )}
    </motion.div>
  );
}

function MatrixCell({ value, labelMobile }) {
  const isBool = typeof value === 'boolean';
  const active = isBool ? value : true;

  return (
    <span className="flex items-center justify-start gap-2 sm:justify-center">
      {isBool ? (
        <span
          className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-xs ${
            active
              ? 'bg-brand-500/15 text-brand-300 ring-1 ring-brand-500/30'
              : 'bg-white/5 text-ink-500 ring-1 ring-white/10'
          }`}
          aria-hidden
        >
          {active ? '✓' : '—'}
        </span>
      ) : (
        <span className="inline-flex items-center rounded-full bg-white/5 px-2.5 py-0.5 text-[11px] font-medium text-ink-100 ring-1 ring-white/10">
          {value}
        </span>
      )}
      <span className="text-[11px] text-ink-400 sm:sr-only">
        {labelMobile}: {isBool ? (active ? 'Included' : 'Not included') : value}
      </span>
    </span>
  );
}
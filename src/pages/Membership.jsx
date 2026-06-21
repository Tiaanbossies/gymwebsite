import { motion } from 'framer-motion';
import { ArrowUpRight, Info, Sparkles, GraduationCap, Receipt, Phone } from 'lucide-react';

import PagePose from '../components/ui/PagePose.jsx';
import PageHero from '../components/sections/PageHero.jsx';
import Container from '../components/ui/Container.jsx';
import MembershipOptions from '../components/sections/MembershipOptions.jsx';
import CTASection from '../components/sections/CTASection.jsx';
import SectionHeading from '../components/ui/SectionHeading.jsx';
import Button from '../components/ui/Button.jsx';
import FAQAccordion from '../components/sections/FAQAccordion.jsx';
import { site, fadeUp, stagger } from '../lib/site.js';

const compareRows = [
  { label: 'Single-visit access',               day: true,  m2m: false, contract: false, pt: false },
  { label: 'Full training floor (incl. boxing)', day: true,  m2m: true,  contract: true,  pt: true },
  { label: 'Month-to-month flexibility',         day: false, m2m: true,  contract: false, pt: false },
  { label: '6-month / 12-month pricing',         day: false, m2m: false, contract: true,  pt: false },
  { label: 'Student discount available',         day: false, m2m: true,  contract: true,  pt: false },
  { label: '1-on-1 personal coaching',           day: false, m2m: false, contract: false, pt: true  },
  { label: 'Personalised diet plan',             day: false, m2m: false, contract: false, pt: true  },
  { label: 'Regular body assessments',           day: false, m2m: false, contract: false, pt: true  },
];

const membershipFaq = [
  {
    question: 'Do you offer a free trial?',
    answer:
      "Yes. We offer a free trial so you can come train with us before you commit. Book it via the form, give us a call or drop a WhatsApp and we'll set it up.",
  },
  {
    question: 'How much is a day pass?',
    answer:
      'A day pass is R100. No contract, no joining fee, no catch. Perfect if you want to try us or if you\'re in town for a few days.',
  },
  {
    question: 'Is there a joining fee?',
    answer:
      "Yes — a once-off R200 joining fee applies on new open gym memberships. No other admin or sign-up charges.",
  },
  {
    question: 'Do you give a student discount?',
    answer:
      "Yes — student membership is R250 per month for full open-gym access with a valid student card. Pop in or send a WhatsApp with a photo of your card and we'll set it up.",
  },
  {
    question: 'What does personal training cost?',
    answer:
      "Personal training is R2,100 per month for 3 sessions a week, or R2,700 per month for 5 sessions a week — both include a personalised diet plan and regular body assessments.",
  },
  {
    question: 'What contract lengths do you offer on the gym membership?',
    answer:
      "Month-to-month at R450/month, 6-month contract at R380/month, or 12-month contract at R360/month. Longer contracts get you a better monthly rate. Student rate is R250/month on a valid student card.",
  },
  {
    question: 'Can I cancel or pause my membership?',
    answer:
      "Month-to-month members can stop at the end of a paid month. For 6 and 12-month contracts the terms are set out at sign-up — chat to us about pauses for injury, travel or other special cases.",
  },
];

export default function Membership() {
  return (
    <PagePose>
      <PageHero
        eyebrow="Membership & Pricing"
        title="Real prices. No surprises. Family-run gym in Centurion."
        description="R100 day passes, monthly/6-month/12-month open gym membership, and personal training from R2,100/month. Students pay less. Everyone gets a free trial."
        imagePath="/images/gym/reception-lounge.webp"
        breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'Membership' }]}
      />

      {/* Free-trial highlight strip — Q52 is a primary offer */}
      <section className="border-y border-white/10 bg-gradient-to-r from-accent-500/10 via-ink-900 to-brand-500/10">
        <Container className="flex flex-col items-start gap-4 py-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent-500/15 text-accent-300 ring-1 ring-accent-500/30">
              <Sparkles size={16} />
            </div>
            <div>
              <p className="font-display text-lg tracking-headline text-white">Free trial available</p>
              <p className="mt-0.5 text-sm text-ink-300">
                Come try the gym on us first — then decide which membership fits.
              </p>
            </div>
          </div>
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:flex-wrap">
            <Button to={site.ctas.trial.to}>Start my free trial</Button>
            <Button
              href={site.ctas.call.href}
              variant="ghost"
              iconNode={<Phone size={14} strokeWidth={2.5} />}
            >
              Call {site.phone.display}
            </Button>
          </div>
        </Container>
      </section>

      <section className="section">
        <Container>
          <MembershipOptions />

          {/* Perks grid */}
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-60px' }}
            className="mt-14 grid gap-4 md:grid-cols-2 xl:grid-cols-3"
          >
            <Perk
              icon={Sparkles}
              title="Free trial"
              body="Try the gym before you sign anything. No pressure, no sales pitch."
            />
            <Perk
              icon={GraduationCap}
              title="Student discount"
              body="Valid student card? You pay less on monthly membership."
            />
            <Perk
              icon={Receipt}
              title="R200 joining fee"
              body="A once-off R200 joining fee applies on new open gym memberships. That's it — no admin charges or hidden add-ons."
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mt-10 flex flex-wrap items-start gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-6"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-500/15 text-brand-300 ring-1 ring-brand-500/30">
              <Info size={16} />
            </div>
            <div className="flex-1 min-w-[240px]">
              <p className="font-display text-lg tracking-headline text-white">
                Looking for the full rate card?
              </p>
              <p className="mt-2 text-sm text-ink-300 leading-relaxed">
                The Pricing page has a full breakdown of every option — day pass, open gym
                (M2M/6-month/12-month), student membership, personal training packages and what's
                included in each.
              </p>
            </div>
            <div className="ml-auto flex shrink-0">
              <Button to="/pricing" iconNode={<ArrowUpRight size={14} strokeWidth={2.5} />}>
                See full pricing
              </Button>
            </div>
          </motion.div>
        </Container>
      </section>

      {/* Compare */}
      <section className="section-tight">
        <Container>
          <SectionHeading
            eyebrow="Compare"
            title="What's included in each option."
            description="A side-by-side look at what day passes, open gym membership and personal training include."
          />

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-60px' }}
            className="mt-12 overflow-hidden rounded-2xl border border-white/10 bg-ink-900"
          >
            <div className="hidden grid-cols-[1.8fr_repeat(4,1fr)] bg-white/[0.03] px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.22em] text-ink-400 sm:grid">
              <span>Feature</span>
              <span className="text-center">Day Pass</span>
              <span className="text-center">M2M</span>
              <span className="text-center">Contract</span>
              <span className="text-center">PT</span>
            </div>
            <ul className="divide-y divide-white/10">
              {compareRows.map((row) => (
                <motion.li
                  key={row.label}
                  variants={fadeUp}
                  className="grid grid-cols-1 items-center gap-1.5 px-5 py-4 text-sm sm:grid-cols-[1.8fr_repeat(4,1fr)] sm:gap-0 sm:px-6"
                >
                  <span className="font-medium text-ink-100">{row.label}</span>
                  <Cell active={row.day} labelMobile="Day Pass" />
                  <Cell active={row.m2m} labelMobile="Month-to-month" />
                  <Cell active={row.contract} labelMobile="Contract" />
                  <Cell active={row.pt} labelMobile="PT" />
                </motion.li>
              ))}
            </ul>
          </motion.div>

          <div className="mt-10 flex flex-col items-start gap-4 rounded-2xl border border-brand-500/30 bg-brand-500/5 p-6 lg:flex-row lg:items-center lg:justify-between">
            <p className="max-w-xl text-sm text-ink-200">
              Want us to recommend the right option for your goals? Send a quick WhatsApp or give us a
              call and we'll talk you through it.
            </p>
            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
              <Button to={site.ctas.join.to} iconNode={<ArrowUpRight size={14} strokeWidth={2.5} />}>
                {site.ctas.join.label}
              </Button>
              <Button
                href={site.ctas.call.href}
                variant="ghost"
                iconNode={<Phone size={14} strokeWidth={2.5} />}
              >
                Call the gym
              </Button>
            </div>
          </div>
        </Container>
      </section>

      {/* FAQ */}
      <section className="section-tight">
        <Container>
          <SectionHeading
            eyebrow="Membership FAQ"
            title="Quick answers before you enquire."
          />
          <div className="mt-12">
            <FAQAccordion items={membershipFaq} />
          </div>
        </Container>
      </section>

      <CTASection
        eyebrow="Join Bossie's"
        title="Pick an option, hit send, and train."
        description="Free trial, month-to-month, long contract or full personal training — we'll help you choose the right fit."
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

function Cell({ active, labelMobile }) {
  return (
    <span className="flex items-center justify-start gap-2 sm:justify-center">
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
      <span className="text-[11px] text-ink-400 sm:sr-only">
        {labelMobile}: {active ? 'Included' : 'Not included'}
      </span>
    </span>
  );
}

function Perk({ icon: Icon, title, body }) {
  return (
    <div className="flex items-start gap-4 rounded-2xl border border-white/10 bg-ink-900 p-5">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-500/15 text-brand-300 ring-1 ring-brand-500/30">
        <Icon size={18} />
      </div>
      <div>
        <p className="font-display text-base tracking-headline text-white">{title}</p>
        <p className="mt-1 text-sm text-ink-300">{body}</p>
      </div>
    </div>
  );
}
import {
  Users2,
  Dumbbell,
  Salad,
  LineChart,
  ArrowUpRight,
  CheckCircle2,
  Shield,
} from 'lucide-react';
import { motion } from 'framer-motion';

import PagePose from '../components/ui/PagePose.jsx';
import PageHero from '../components/sections/PageHero.jsx';
import Container from '../components/ui/Container.jsx';
import Button from '../components/ui/Button.jsx';
import CTASection from '../components/sections/CTASection.jsx';
import { site, fadeUp, stagger } from '../lib/site.js';

/**
 * Services — mirrors Q31 (services offered) and Q33/Q34 (facilities).
 *
 * Q31 — Personal training, Open gym access, Nutrition / diet plans,
 * Body assessments. (Group classes were explicitly NOT offered per Q36;
 * online coaching was dropped at owner review in April 2026.)
 *
 * Q33/Q34 — Weight training area, cardio area, functional training area,
 * boxing area. Those are folded into the Open Gym card.
 *
 * CTAs mapped to Q17 selections only (join / call / enquire / trial).
 */
const services = [
  {
    id: 'personal-training',
    icon: Users2,
    kicker: '1-on-1 coaching',
    title: 'Personal Training',
    lead:
      "Our flagship service. Eight personal trainers coach 1-on-1 sessions — every programme is built for you, paired with a diet plan and regular body assessments.",
    whoFor: [
      'Beginners who want a proper start',
      'Working professionals with clear goals',
      'Members chasing body-composition change',
      'Lifters prepping for bodybuilding & competitions',
    ],
    whatsIncluded: [
      'Sessions with one of our eight trainers',
      'Programming shaped around your goals',
      'Personalised diet plan included',
      'Regular body assessments',
    ],
    cta: { label: site.ctas.join.label, to: site.ctas.join.to, variant: 'primary' },
    note: 'Pricing starts at R2,100 / month. Full breakdown on the Membership page.',
  },
  {
    id: 'open-gym',
    icon: Dumbbell,
    kicker: 'Open gym access',
    title: 'Open Gym Access',
    lead:
      "A full commercial training floor — weights, cardio, a functional training area and a boxing area. Month-to-month, 6-month or 12-month contract options, or a R100 day pass if you're just passing through.",
    whoFor: [
      'Self-directed trainees who know their programme',
      'Members who want a proper training floor, not a chain',
      'Locals in Centurion, Midstream & Hennopspark',
      'Visitors wanting a single-day drop-in',
    ],
    whatsIncluded: [
      'Weight training area',
      'Cardio area',
      'Functional training area',
      'Boxing area',
    ],
    cta: { label: site.ctas.pricing.label, to: site.ctas.pricing.to, variant: 'ghost' },
  },
  {
    id: 'nutrition',
    icon: Salad,
    kicker: 'Nutrition coaching',
    title: 'Diet Plans & Nutrition',
    lead:
      'Nutrition guidance included with personal training, and available as a standalone service. Real-food guidance matched to your training, not a generic meal plan.',
    whoFor: [
      'PT clients wanting a clear nutrition direction',
      'Members unsure where to start with food',
      'Lifters cutting, bulking or prepping for stage',
    ],
    whatsIncluded: [
      'Plan tailored to your training',
      'Reviewed alongside training progress',
      'Adjusted as you go',
    ],
    cta: { label: site.ctas.enquire.label, to: site.ctas.enquire.to, variant: 'ghost' },
  },
  {
    id: 'body-assessments',
    icon: LineChart,
    kicker: 'Measured progress',
    title: 'Body Assessments',
    lead:
      "Scheduled check-ins so you can see what's actually changing. Measurements, progress photos and a straight conversation about next steps.",
    whoFor: [
      'Clients on a transformation journey',
      'Members who value measured progress',
      'Anyone who wants data, not guesswork',
    ],
    whatsIncluded: [
      'Scheduled assessments during your programme',
      'Clear feedback on progress',
      'Directly informs your next block of training',
    ],
    cta: { label: site.ctas.enquire.label, to: site.ctas.enquire.to, variant: 'ghost' },
  },
];

export default function Services() {
  return (
    <PagePose>
      <PageHero
        eyebrow="Services"
        title="Personal training, open gym, and the support around it."
        description="Everything we offer at Bossie's — built for working professionals in Centurion who want real coaching and a real training floor."
        imagePath="/images/gym/floor-main-aisle.webp"
        breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'Services' }]}
      />

      {/* Quick jump links */}
      <section className="border-b border-white/10 bg-ink-900/60">
        <Container className="overflow-x-auto py-4">
          <div className="flex min-w-max items-center gap-2">
            <span className="text-xs uppercase tracking-[0.22em] text-ink-400">Jump to:</span>
            {services.map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                className="rounded-full border border-white/10 bg-ink-950 px-3 py-1.5 text-xs font-medium text-ink-200 transition hover:border-brand-500/50 hover:text-white"
              >
                {s.title}
              </a>
            ))}
          </div>
        </Container>
      </section>

      <section className="section">
        <Container>
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-80px' }}
            className="flex flex-col gap-16 sm:gap-20"
          >
            {services.map((s) => (
              <motion.article
                key={s.id}
                id={s.id}
                variants={fadeUp}
                className="grid scroll-mt-28 gap-8 lg:grid-cols-[1.06fr_1fr] lg:gap-14"
              >
                <div>
                  <span className="eyebrow">{s.kicker}</span>
                  <h2 className="mt-3 display-2 text-white text-balance">{s.title}</h2>
                  <p className="mt-5 body-lg max-w-xl text-balance">{s.lead}</p>
                  {s.note && (
                    <p className="mt-4 inline-flex items-center gap-2 rounded-full border border-brand-500/30 bg-brand-500/10 px-3 py-1.5 text-xs font-medium text-brand-200">
                      <Shield size={12} strokeWidth={2.5} />
                      {s.note}
                    </p>
                  )}
                  <div className="mt-8 flex flex-wrap gap-3">
                    <Button
                      to={s.cta.to}
                      href={s.cta.href}
                      variant={s.cta.variant}
                      iconNode={<ArrowUpRight size={16} strokeWidth={2.5} />}
                    >
                      {s.cta.label}
                    </Button>
                    <Button to={site.ctas.trial.to} variant="link">
                      Start a free trial
                    </Button>
                  </div>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <Panel
                    icon={s.icon}
                    kicker="Who it's for"
                    items={s.whoFor}
                  />
                  <Panel
                    icon={CheckCircle2}
                    kicker="What's included"
                    items={s.whatsIncluded}
                    accent
                  />
                </div>
              </motion.article>
            ))}
          </motion.div>
        </Container>
      </section>

      <CTASection
        eyebrow="Not sure which fits?"
        title="Chat to a coach first. No pressure."
        description="Give us a call, send a WhatsApp, or book a free trial. We'll walk you through the floor and help you pick what makes sense."
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

function Panel({ icon: Icon, kicker, items, accent }) {
  return (
    <div
      className={`rounded-2xl border p-5 transition-transform duration-300 hover:-translate-y-1 sm:p-6 ${
        accent
          ? 'border-brand-500/30 bg-gradient-to-b from-brand-500/10 to-ink-900'
          : 'border-white/10 bg-ink-900'
      }`}
    >
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-500/15 text-brand-300 ring-1 ring-brand-500/30">
          <Icon size={16} />
        </div>
        <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-brand-300">
          {kicker}
        </span>
      </div>
      <ul className="mt-5 flex flex-col gap-2.5">
        {items.map((it) => (
          <li key={it} className="flex items-start gap-2.5 text-sm text-ink-200">
            <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500" />
            {it}
          </li>
        ))}
      </ul>
    </div>
  );
}
import { motion } from 'framer-motion';
import { MapPin, Compass, Users2, Target, HeartHandshake, ShieldCheck, Flame, Phone } from 'lucide-react';

import PagePose from '../components/ui/PagePose.jsx';
import PageHero from '../components/sections/PageHero.jsx';
import Container from '../components/ui/Container.jsx';
import SectionHeading from '../components/ui/SectionHeading.jsx';
import CTASection from '../components/sections/CTASection.jsx';
import Button from '../components/ui/Button.jsx';
import Reveal from '../components/ui/Reveal.jsx';
import { site, fadeUp, stagger } from '../lib/site.js';

export default function About() {
  return (
    <PagePose>
      <PageHero
        eyebrow="About"
        title="A family-run gym. Small on purpose."
        description="Bossie's is a family-run commercial gym in Hennopspark, Centurion — built for members who want real coaching and a place that actually knows them."
        breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'About' }]}
      />

      {/* Story */}
      <section className="section">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[1.08fr_1fr] lg:gap-14">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span className="eyebrow">Our story</span>
              <h2 className="mt-3 display-2 text-white text-balance">
                A small gym, run by a family, for the people in it.
              </h2>
              <div className="mt-6 flex flex-col gap-5 text-ink-300 leading-relaxed">
                <p>
                  Bossie's is owned and run by Johan "Bossie" Boshoff and his family — Rene and
                  Debbie — alongside the wider coaching team. We're a small commercial gym in
                  Hennopspark, Centurion, and we're small on purpose. That's the only way to stay
                  focused on the members in front of us.
                </p>
                <p>
                  Our differentiator is simple: we don't chase growth for the sake of growth. We run
                  the floor, coach the sessions and pick up the phone ourselves. If you walk in,
                  you'll talk to a Boshoff — not a 24-hour call centre.
                </p>
                <p>
                  We serve Centurion, Midstream, Lyttelton and the surrounding suburbs with personal training,
                  open gym access, nutrition and body assessments — and we offer a free trial so you
                  can see whether it's the right fit before committing to anything.
                </p>
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <Button to="/team">Meet the team</Button>
                <Button
                  href={site.ctas.call.href}
                  variant="ghost"
                  iconNode={<Phone size={14} strokeWidth={2.5} />}
                >
                  Call {site.phone.display}
                </Button>
              </div>
            </motion.div>

            <Reveal>
              <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-brand-500/25 to-ink-900 p-8 sm:p-10">
                <div className="absolute inset-0 noise opacity-50" />
                <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-accent-500/15 blur-3xl" />
                <div className="relative">
                  <span className="eyebrow">Hennopspark, Centurion</span>
                  <h3 className="mt-3 font-display text-3xl sm:text-4xl tracking-headline text-white">
                    Local, on purpose.
                  </h3>
                  <p className="mt-4 text-ink-300 leading-relaxed">
                    We're rooted here. Our members live and work in and around Centurion, and our
                    training culture reflects that — familiar, direct, honest.
                  </p>
                  <div className="mt-8 grid gap-4 sm:grid-cols-2">
                    <Fact icon={MapPin} label="Area" value={site.location.line2} />
                    <Fact icon={Compass} label="City" value={site.location.city} />
                    <Fact icon={Users2} label="Serves" value={site.areasServed.slice(0, 3).join(', ')} />
                    <Fact icon={Target} label="Focus" value="1-on-1 coaching" />
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* Values — Honesty / Commitment / Community */}
      <section className="section-tight">
        <Container>
          <SectionHeading
            eyebrow="Our values"
            title="Honesty. Commitment. Community."
            description="Three words, picked deliberately. They show up in how we price, how we coach and how we talk to the people who walk through the door."
          />

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-60px' }}
            className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-3"
          >
            <ValueColumn
              icon={ShieldCheck}
              title="Honesty"
              body="Honest prices, honest timelines, honest feedback on your training. No upsells, no locked-in tricks. If we don't think we're the right fit, we'll say so."
            />
            <ValueColumn
              icon={Flame}
              title="Commitment"
              body="From us and from you. We commit to showing up, coaching properly and actually caring about your progress — not just your renewal."
              accent
            />
            <ValueColumn
              icon={HeartHandshake}
              title="Community"
              body="Small gym energy — people know your name, notice when you're missing, cheer when you hit a PR. That's not marketing; it's who we are."
            />
          </motion.div>
        </Container>
      </section>

      {/* Coaching approach */}
      <section className="section-tight">
        <Container>
          <SectionHeading
            eyebrow="Our coaching approach"
            title="Personal. Structured. Grounded."
            description="We don't pretend coaching is a dashboard or an app. It's watching you move, adjusting the plan, and showing up consistently."
          />
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-60px' }}
            className="mt-14 grid gap-6 md:grid-cols-2 xl:grid-cols-3"
          >
            <Principle
              index="01"
              title="Build the plan around you"
              body="No templates. Your goals, training history and lifestyle shape the programme and the diet plan."
            />
            <Principle
              index="02"
              title="Measure what matters"
              body="Regular body assessments keep us honest about what's working and what needs to change."
            />
            <Principle
              index="03"
              title="Adjust as you go"
              body="Progress is rarely linear. Your coach watches, listens and tweaks the plan so the work keeps paying off."
            />
          </motion.div>
        </Container>
      </section>

      <CTASection
        eyebrow="Train with Bossie's"
        title="A family gym that actually helps you progress."
        description="Start with a free trial or a phone call — whichever feels easier."
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

function Fact({ icon: Icon, label, value }) {
  return (
    <div className="rounded-xl border border-white/10 bg-ink-950/40 p-4 backdrop-blur-sm">
      <div className="flex items-center gap-2">
        <Icon size={14} className="text-brand-300" />
        <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-ink-400">
          {label}
        </p>
      </div>
      <p className="mt-1.5 font-display text-lg tracking-headline text-white">{value}</p>
    </div>
  );
}

function ValueColumn({ icon: Icon, title, body, accent }) {
  return (
    <motion.div
      variants={fadeUp}
      className={`rounded-2xl border p-7 ${
        accent
          ? 'border-accent-500/40 bg-gradient-to-b from-accent-500/10 to-ink-900'
          : 'border-white/10 bg-ink-900'
      }`}
    >
      <div
        className={`flex h-11 w-11 items-center justify-center rounded-lg ring-1 ${
          accent
            ? 'bg-accent-500/15 text-accent-300 ring-accent-500/40'
            : 'bg-brand-500/15 text-brand-300 ring-brand-500/30'
        }`}
      >
        <Icon size={20} />
      </div>
      <h3 className="mt-5 font-display text-xl tracking-headline text-white">{title}</h3>
      <p className="mt-3 text-sm text-ink-300 leading-relaxed">{body}</p>
    </motion.div>
  );
}

function Principle({ index, title, body }) {
  return (
    <motion.div
      variants={fadeUp}
      className="rounded-2xl border border-white/10 bg-ink-900 p-7"
    >
      <p className="font-display text-5xl tracking-mega text-brand-500/60">{index}</p>
      <h3 className="mt-4 font-display text-xl tracking-headline text-white">{title}</h3>
      <p className="mt-3 text-sm text-ink-300 leading-relaxed">{body}</p>
    </motion.div>
  );
}

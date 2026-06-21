import { motion } from 'framer-motion';
import { User, ArrowUpRight, Trophy, HeartHandshake, Users2, Flame } from 'lucide-react';

import PagePose from '../components/ui/PagePose.jsx';
import PageHero from '../components/sections/PageHero.jsx';
import Container from '../components/ui/Container.jsx';
import SectionHeading from '../components/ui/SectionHeading.jsx';
import CTASection from '../components/sections/CTASection.jsx';
import Button from '../components/ui/Button.jsx';
import Reveal from '../components/ui/Reveal.jsx';
import { site, fadeUp, stagger } from '../lib/site.js';

/**
 * Team page — real names pulled directly from the questionnaire, plus the
 * trainers confirmed by the client in follow-up reviews.
 * Q2 — owner: Johan "Bossie" Boshoff
 * Q3 / Q39 — family members who run / coach in the gym:
 * Rene and Debbie (Boshoff)
 * Q40 — 1-on-1 personal training roster. Confirmed names:
 * Quibert Dippenaar, Niell Bezuidenhout, Nikki Bredenkamp, Do-Neill Dowry,
 * Dale Collins (none Boshoff family).
 *
 * Note: at owner review (April 2026) Niell's surname was corrected from
 * Boshoff to Bezuidenhout — Niell is on the coaching team but not Boshoff
 * family — and three further trainers were added to the roster.
 *
 * Bios, roles and portraits are explicitly TBD — the client needs to supply
 * them. Every bio line below is either factual (from the questionnaire) or a
 * short, neutral placeholder clearly marked "Bio coming soon" so we never
 * fabricate credentials. Photos use a subtle silhouette placeholder with a
 * visible "Photo TBD" label so it reads correctly even without images.
 *
 * Visual treatment: family cards (Bossie, Rene, Debbie) use the brand-red
 * gradient; non-family coaches use the steel-blue accent gradient so the
 * site never implies a non-family trainer is a Boshoff.
 */
const team = [
  {
    name: 'Johan "Bossie" Boshoff',
    role: 'Owner & Head Coach',
    roleShort: 'Owner',
    bio: "Part of the family team that runs the gym day-to-day. Bio coming soon.",
    placeholderNote: 'Portrait — TBD',
    family: true,
  },
  {
    name: 'Rene Boshoff',
    role: 'Family Team',
    roleShort: 'Family · Coach',
    bio: 'Part of the family team that runs the gym day-to-day. Bio coming soon.',
    placeholderNote: 'Portrait — TBD',
    family: true,
  },
  {
    name: 'Debbie Boshoff',
    role: 'Family Team',
    roleShort: 'Family · Coach',
    bio: 'Part of the family team that runs the gym day-to-day. Bio coming soon.',
    placeholderNote: 'Portrait — TBD',
    family: true,
  },
  {
    name: 'Niell Bezuidenhout',
    role: 'Personal Trainer',
    roleShort: 'Personal Trainer',
    bio: 'Coaches 1-on-1 sessions on the personal training roster. Full bio coming soon.',
    placeholderNote: 'Portrait — TBD',
    family: false,
  },
  {
    name: 'Quibert Dippenaar',
    role: 'Personal Trainer',
    roleShort: 'Personal Trainer',
    bio: 'Coaches on our personal training roster. Full bio coming soon.',
    placeholderNote: 'Portrait — TBD',
    family: false,
  },
  {
    name: 'Nikki Bredenkamp',
    role: 'Personal Trainer',
    roleShort: 'Personal Trainer',
    bio: 'Coaches 1-on-1 sessions on the personal training roster. Full bio coming soon.',
    placeholderNote: 'Portrait — TBD',
    family: false,
  },
  {
    name: 'Do-Neill Dowry',
    role: 'Personal Trainer',
    roleShort: 'Personal Trainer',
    bio: 'Coaches 1-on-1 sessions on the personal training roster. Full bio coming soon.',
    placeholderNote: 'Portrait — TBD',
    family: false,
  },
  {
    name: 'Dale Collins',
    role: 'Personal Trainer',
    roleShort: 'Personal Trainer',
    bio: 'Coaches 1-on-1 sessions on the personal training roster. Full bio coming soon.',
    placeholderNote: 'Portrait — TBD',
    family: false,
  },
];

const culturePillars = [
  {
    icon: HeartHandshake,
    title: 'Family-run',
    body: 'The gym was founded by Bossie and is run with the Boshoff family. You train alongside the people who built it.',
  },
  {
    icon: Users2,
    title: 'Eight trainers, 1-on-1',
    body: 'Personal training here is always one-on-one with one of our eight trainers — not rotating faces and templates.',
  },
  {
    icon: Trophy,
    title: 'Competition culture',
    body: "We've got members who step on stage. If that's your path, you'll find coaching and a gym that understands what it takes.",
  },
  {
    icon: Flame,
    title: 'Quiet consistency',
    body: "Stage or not, what moves the needle is showing up. Most of our people do — every week, for years.",
  },
];

export default function Team() {
  return (
    <PagePose>
      <PageHero
        eyebrow="Team"
        title="Meet the team behind Bossie's Gym."
        description="A Boshoff-family-run gym in Centurion, with a wider coaching team on the floor every day — so you always walk into a room that knows your name."
        imagePath="/images/gym/weights-power-rack.webp"
        lightOverlay={true}
        breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'Team' }]}
      />

      {/* Trainer grid */}
      <section className="section">
        <Container>
          <SectionHeading
            eyebrow="The people"
            title="Three Boshoffs, five coaches alongside them, all on the floor."
            description="Bossie started the gym, and the family runs it with him — joined by a wider coaching team on the personal training roster. Full bios and portraits are on their way; we'd rather put up real photos than stock images."
          />

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-60px' }}
            className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4"
          >
            {team.map((person) => (
              <motion.article
                key={person.name}
                variants={fadeUp}
                className="flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-ink-900 hover-lift"
              >
                <div
                  className={`relative aspect-[4/5] w-full overflow-hidden ${
                    person.family
                      ? 'bg-gradient-to-br from-brand-500/20 via-ink-900 to-accent-500/10'
                      : 'bg-gradient-to-br from-accent-500/15 via-ink-900 to-brand-500/10'
                  }`}
                >
                  {/* Photo-TBD placeholder — deliberately explicit so no fake imagery */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-6 text-center">
                    <div
                      className={`flex h-14 w-14 items-center justify-center rounded-full ring-1 ${
                        person.family
                          ? 'bg-brand-500/15 text-brand-300 ring-brand-500/30'
                          : 'bg-accent-500/15 text-accent-300 ring-accent-500/30'
                      }`}
                    >
                      <User size={22} />
                    </div>
                    <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-ink-400">
                      {person.placeholderNote}
                    </span>
                  </div>
                </div>
                <div className="flex flex-1 flex-col gap-2 p-5">
                  <span
                    className={`text-[11px] font-semibold uppercase tracking-[0.22em] ${
                      person.family ? 'text-brand-300' : 'text-accent-300'
                    }`}
                  >
                    {person.roleShort}
                  </span>
                  <h3 className="font-display text-lg tracking-headline text-white">
                    {person.name}
                  </h3>
                  <p className="text-xs font-medium text-ink-400">{person.role}</p>
                  <p className="mt-2 text-sm text-ink-300 leading-relaxed">{person.bio}</p>
                </div>
              </motion.article>
            ))}
          </motion.div>

          <p className="mt-8 text-xs text-ink-400">
            Full trainer profiles and portraits will go up here as each coach shares their bio and
            photo with us.
          </p>
        </Container>
      </section>

      {/* Culture */}
      <section className="section-tight">
        <Container>
          <SectionHeading
            eyebrow="Culture"
            title="A small gym, with a big sense of ownership."
            description="We're a family gym, not a franchise. That shapes how we coach, how we price, and how members feel when they walk in."
          />

          <motion.ul
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-60px' }}
            className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/5 sm:grid-cols-2 lg:grid-cols-4"
          >
            {culturePillars.map((p) => (
              <motion.li
                key={p.title}
                variants={fadeUp}
                className="flex flex-col gap-4 bg-ink-900 p-7"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-brand-500/15 text-brand-300 ring-1 ring-brand-500/30">
                  <p.icon size={20} />
                </div>
                <h3 className="font-display text-lg tracking-headline text-white">{p.title}</h3>
                <p className="text-sm text-ink-300 leading-relaxed">{p.body}</p>
              </motion.li>
            ))}
          </motion.ul>
        </Container>
      </section>

      {/* Stage story + values tile */}
      <section className="section-tight">
        <Container>
          <div className="grid gap-6 lg:grid-cols-3">
            <Reveal className="lg:col-span-2">
              <div className="h-full rounded-2xl border border-white/10 bg-gradient-to-b from-ink-800 to-ink-900 p-8 sm:p-10">
                <span className="eyebrow">The stage</span>
                <h2 className="mt-3 font-display text-3xl sm:text-4xl tracking-headline text-white text-balance">
                  From our floor to the stage.
                </h2>
                <p className="mt-5 text-ink-300 leading-relaxed max-w-2xl">
                  If competition is your goal, we've got the floor, the coaches and the experience to
                  help you get there. A handful of our members compete — and a few more who are
                  thinking about it. We don't push it, but we're behind you if it's your path.
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Button
                    to={site.ctas.enquire.to}
                    iconNode={<ArrowUpRight size={14} strokeWidth={2.5} />}
                  >
                    Ask about competition prep
                  </Button>
                </div>
              </div>
            </Reveal>

            <Reveal>
              <div className="h-full rounded-2xl border border-accent-500/30 bg-gradient-to-b from-accent-500/10 to-ink-900 p-8 sm:p-10">
                <span className="eyebrow">Our values</span>
                <h2 className="mt-3 font-display text-3xl sm:text-4xl tracking-headline text-white text-balance">
                  {site.values.join(' · ')}
                </h2>
                <p className="mt-5 text-ink-300 leading-relaxed">
                  Three words, picked deliberately. They show up in how we coach, how we price, and
                  how we talk to the people who walk through the door.
                </p>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      <CTASection
        eyebrow="Want to train with us?"
        title="Come meet the team. Then decide."
        description="Start with a free trial or call the gym — one of the family will answer."
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
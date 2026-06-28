import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { HeartHandshake, ShieldCheck, Users2, MapPin } from 'lucide-react';
import anime from 'animejs';

import Container from '../ui/Container.jsx';
import { fadeUp, stagger } from '../../lib/site.js';

/**
 * TrustSection — grounded credibility cues, no testimonials or invented stats.
 *
 * Pillars map directly to the questionnaire:
 *   Q18 — "small commercial gym where members feel part of it"
 *   Q19 — differentiator: focuses on customers, not growth
 *   Q23 — brand values: Honesty, Commitment, Community
 *   Q27 — feel: friendly, minimal, energetic, community-focused
 */
const defaultPillars = [
  {
    icon: HeartHandshake,
    title: 'Family-run',
    body: 'Owned and run by the Boshoff family. The people on the floor are the people who built the gym — you always know who to talk to.',
  },
  {
    icon: ShieldCheck,
    title: 'Honesty & commitment',
    body: 'Our three values are Honesty, Commitment and Community. No hard sells, no lock-ins we wouldn\'t sign ourselves, no overpromising.',
  },
  {
    icon: Users2,
    title: 'Members come first',
    body: 'We\'re small on purpose. That\'s how we stay focused on the people in the room instead of chasing growth for its own sake.',
  },
  {
    icon: MapPin,
    title: 'Local to Centurion',
    body: 'Based in Hennopspark, serving Centurion, Midstream, Lyttelton and surrounding suburbs. A short drive from most of the city.',
  },
];

// ─── AnimatedIcon ─────────────────────────────────────────────────────────────

function AnimatedIcon({ Icon }) {
  const ref = useRef(null);
  const done = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const paths = el.querySelectorAll('svg path');
    paths.forEach((p) => {
      try {
        const len = p.getTotalLength();
        p.style.strokeDasharray = len;
        p.style.strokeDashoffset = len;
      } catch (_) {}
    });

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || done.current) return;
        done.current = true;
        anime({
          targets: paths,
          strokeDashoffset: 0,
          easing: 'easeOutCubic',
          duration: 900,
          delay: anime.stagger(80),
        });
        observer.disconnect();
      },
      { threshold: 0.5 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="flex h-11 w-11 items-center justify-center rounded-lg bg-brand-500/15 text-brand-300 ring-1 ring-brand-500/30"
    >
      <Icon size={20} />
    </div>
  );
}

// ─── TrustSection ─────────────────────────────────────────────────────────────

export default function TrustSection({
  eyebrow = 'Why Bossie\'s',
  title = 'A small gym, run by a family, focused on you.',
  description = "We're not a franchise and we're not trying to be. We're a proper commercial gym in Centurion — small enough to know your name, fully kitted for real training.",
  pillars = defaultPillars,
}) {
  return (
    <section className="section">
      <Container>
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-80px' }}
          className="max-w-3xl"
        >
          <span className="eyebrow">{eyebrow}</span>
          <h2 className="mt-3 display-2 text-white text-balance">{title}</h2>
          <p className="mt-5 body-lg text-balance">{description}</p>
        </motion.div>

        <motion.ul
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-60px' }}
          className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/5 sm:grid-cols-2 lg:grid-cols-4"
        >
          {pillars.map((p) => (
            <motion.li
              key={p.title}
              variants={fadeUp}
              className="flex flex-col gap-4 bg-ink-900 p-6 transition-transform duration-300 hover:-translate-y-1 sm:p-7"
            >
              <AnimatedIcon Icon={p.icon} />
              <h3 className="font-display text-lg tracking-headline text-white">{p.title}</h3>
              <p className="text-sm text-ink-300 leading-relaxed">{p.body}</p>
            </motion.li>
          ))}
        </motion.ul>
      </Container>
    </section>
  );
}

import { Fragment, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import anime from 'animejs';

import Container from '../ui/Container.jsx';
import Button from '../ui/Button.jsx';
import { site, fadeUp, stagger } from '../../lib/site.js';

// ─── Headline word map ────────────────────────────────────────────────────────

const HEADLINE_WORDS = [
  { w: 'A',          accent: false },
  { w: 'small',      accent: false },
  { w: 'gym',        accent: false },
  { w: 'that',       accent: false },
  { w: 'puts',       accent: true  },
  { w: 'you',        accent: true  },
  { w: 'first.',     accent: true  },
  { w: 'Right',      accent: false },
  { w: 'here',       accent: false },
  { w: 'in',         accent: false },
  { w: 'Centurion.', accent: false },
];

// ─── HeroHome ─────────────────────────────────────────────────────────────────

export default function HeroHome() {
  const headlineRef = useRef(null);

  useEffect(() => {
    if (!headlineRef.current) return;
    anime({
      targets: headlineRef.current.querySelectorAll('.hw'),
      opacity: [0, 1],
      translateY: [20, 0],
      delay: anime.stagger(55, { start: 180 }),
      duration: 700,
      easing: 'easeOutExpo',
    });
  }, []);

  return (
    <section className="relative overflow-hidden bg-ink-950">

      <img
        src="/images/gym/floor-hero.webp"
        alt="Bossie's Gym training floor"
        className="absolute inset-0 z-0 h-full w-full object-cover object-[center_40%] opacity-90"
        loading="eager"
        decoding="async"
      />

      {/* Overlay gradients */}
      <div className="absolute inset-0 z-10 bg-gradient-to-r from-ink-950 via-ink-950/80 to-ink-950/20 pointer-events-none" />
      <div className="absolute top-0 inset-x-0 z-10 bg-gradient-to-b from-ink-950/90 to-transparent h-40 pointer-events-none" />
      <div className="absolute bottom-0 inset-x-0 z-10 bg-gradient-to-t from-ink-950 to-transparent h-32 pointer-events-none" />
      <div
        className="absolute inset-0 z-10 pointer-events-none"
        style={{ background: 'radial-gradient(circle at 80% 50%, rgba(61, 100, 121, 0.2), transparent 55%)' }}
      />

      <Container className="relative z-20 pt-0 pb-16 sm:pb-20 lg:pb-28">
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          className="grid gap-12"
        >
          {/* Left: Copy stack */}
          <motion.div variants={fadeUp} className="max-w-2xl">
            {/* Sequenced to start only after the word-by-word headline reveal
                finishes (last word starts at 180ms + 10 * 55ms stagger =
                730ms, animates 700ms -> settles at ~1430ms), so the badge row
                doesn't compete with the headline for attention on load. */}
            <motion.div
              className="flex flex-wrap items-center gap-3 mb-6"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 1.43, ease: [0.22, 1, 0.36, 1] }}
            >
              <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-brand-300">
                <span aria-hidden="true">● </span>Hennopspark · Centurion &amp; Midstream
              </span>
              <span aria-hidden="true" className="text-ink-300">·</span>
              <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-brand-300">
                Family-run since day one
              </span>
              {/* Plain solid text, not ShinyText's gradient-clip shimmer —
                  DESIGN.md bans background-clip:text gradients outright, and
                  the shimmer sweep was one more thing firing on mount
                  alongside the headline and this badge row. */}
              <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#8fafc3]">
                ✦ Free open-gym trial available
              </span>
            </motion.div>

            {/* Word-by-word animated headline */}
            <h1
              ref={headlineRef}
              className="display-1 text-white text-balance leading-tight"
              aria-label="A small gym that puts you first. Right here in Centurion."
            >
              {HEADLINE_WORDS.map((item, i) => (
                <Fragment key={i}>
                  <span
                    aria-hidden="true"
                    className={`hw inline-block${item.accent ? ' text-brand-500' : ''}`}
                    style={{ opacity: 0 }}
                  >
                    {item.w}
                  </span>
                  {i < HEADLINE_WORDS.length - 1 && ' '}
                </Fragment>
              ))}
            </h1>

            <p className="mt-6 body-lg text-ink-200 max-w-xl text-balance leading-relaxed">
              Personal training with eight dedicated coaches. Open gym access. Real nutrition guidance.
              Body assessments.
            </p>

            {/* Plain buttons — the primary variant's own static hover-glow
                (Button.jsx / btn-primary) already signals "this is
                interactive" per the Hover-Earns-It rule, so the Magnet pull
                and ClickSpark particle burst were redundant flourishes. */}
            <div className="mt-8 flex flex-wrap gap-3">
              <Button to={site.ctas.join.to} data-track="Join Now — Hero" iconNode={<ArrowUpRight size={16} strokeWidth={2.5} />}>
                {site.ctas.join.label}
              </Button>
              <Button to={site.ctas.trial.to} variant="ghost" data-track="Free Trial — Hero">
                Free open-gym trial
              </Button>
              <Button href={site.ctas.call.href} variant="link" data-track="Call Gym — Hero">
                Call {site.phone.display}
              </Button>
            </div>

            <div className="mt-10 pt-10 border-t border-white/10 grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="min-w-0">
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-ink-400 mb-1">Founded</p>
                <p className="font-display text-sm text-white">Family-run from day one</p>
              </div>
              <div className="min-w-0">
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-ink-400 mb-1">Trainers</p>
                <p className="font-display text-sm text-white">Eight 1-on-1 coaches</p>
              </div>
              <div className="min-w-0">
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-ink-400 mb-1">Pricing</p>
                {/* Leads with the month-to-month rate (site.pricing.openGym[0],
                    no lock-in) rather than the 12-month-contract figure, so the
                    hero doesn't anchor on a number that needs a contract-length
                    caveat to be accurate — that caveat now sits right below it
                    instead of living only on /pricing. */}
                <p className="font-display text-sm text-white">R100 day pass · Open gym from R450/mo · PT from R2,100</p>
                <p className="mt-0.5 text-[11px] text-ink-400">From R360/mo on a 12-month plan</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </Container>
    </section>
  );
}

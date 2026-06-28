import { useEffect, useMemo, useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
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
          className="grid gap-12 lg:grid-cols-[1fr_auto] lg:items-center xl:gap-20"
        >
          {/* Left: Copy stack */}
          <motion.div variants={fadeUp} className="max-w-2xl">
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-brand-300">
                ● Hennopspark · Centurion &amp; Midstream
              </span>
              <span aria-hidden="true" className="text-ink-500">·</span>
              <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-brand-300">
                Family-run since day one
              </span>
              <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-accent-300 flex items-center gap-1">
                ✦ Free trial available
              </span>
            </div>

            {/* Word-by-word animated headline */}
            <h1
              ref={headlineRef}
              className="display-1 text-white text-balance leading-tight"
              aria-label="A small gym that puts you first. Right here in Centurion."
            >
              {HEADLINE_WORDS.map((item, i) => (
                <span
                  key={i}
                  aria-hidden="true"
                  className={`hw inline-block${item.accent ? ' text-brand-500' : ''}`}
                  style={{ opacity: 0 }}
                >
                  {item.w}
                  {i < HEADLINE_WORDS.length - 1 && ' '}
                </span>
              ))}
            </h1>

            <p className="mt-6 body-lg text-ink-200 max-w-xl text-balance leading-relaxed">
              Personal training with eight dedicated coaches. Open gym access. Real nutrition guidance.
              Body assessments. No group classes—everything is 1-on-1.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button to={site.ctas.join.to} data-track="Join Now — Hero" iconNode={<ArrowUpRight size={16} strokeWidth={2.5} />}>
                {site.ctas.join.label}
              </Button>
              <Button href={site.ctas.call.href} variant="ghost" data-track="Call Gym — Hero">
                Call {site.phone.display}
              </Button>
              <Button to={site.ctas.trial.to} variant="link" data-track="Free Trial — Hero">
                Start a free trial
              </Button>
            </div>

            <div className="mt-10 pt-10 border-t border-white/10 flex flex-wrap gap-6 sm:gap-8">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-ink-400 mb-1">Founded</p>
                <p className="font-display text-sm text-white">Family-run from day one</p>
              </div>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-ink-400 mb-1">Trainers</p>
                <p className="font-display text-sm text-white">Eight 1-on-1 coaches</p>
              </div>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-ink-400 mb-1">Pricing</p>
                <p className="font-display text-sm text-white">R100 day pass · PT from R2,100</p>
              </div>
            </div>
          </motion.div>

          {/* Right: Stat cards */}
          <motion.div
            variants={fadeUp}
            className="grid gap-3 grid-cols-1 sm:grid-cols-3 lg:flex lg:flex-col lg:w-[320px]"
          >
            <StatCard label="Open gym"          value="From R360" detail="per month (12-month)" accent />
            <StatCard label="Personal training" value="R2,100"    detail="3 sessions/week" />
            <StatCard label="Day pass"          value="R100"      detail="no contract" />

            <div className="hidden lg:flex flex-col mt-4 rounded-2xl border border-accent-500/30 bg-gradient-to-br from-accent-500/10 to-brand-500/10 p-6 backdrop-blur-md">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-accent-300 mb-2">Next step</p>
              <p className="font-display text-base tracking-headline text-white mb-3">Try it first</p>
              <p className="text-xs text-ink-200 mb-5 leading-relaxed">
                Book a free trial session and come see the floor. No sign-up, no pressure.
              </p>
              <Link
                to={site.ctas.trial.to}
                className="mt-auto inline-block text-xs font-semibold text-accent-300 hover:text-accent-200 transition-colors"
              >
                Start your trial →
              </Link>
            </div>
          </motion.div>
        </motion.div>
      </Container>
    </section>
  );
}

// ─── StatCard with count-up ───────────────────────────────────────────────────

function parseStatValue(raw) {
  const match = raw.match(/^(.*?R)([\d,]+)(.*)$/);
  if (!match) return null;
  return {
    before: match[1],
    num: parseInt(match[2].replace(/,/g, ''), 10),
    after: match[3],
  };
}

function StatCard({ label, value, detail, accent = false }) {
  const valRef = useRef(null);
  const parsed = useMemo(() => parseStatValue(value), [value]);

  useEffect(() => {
    const el = valRef.current;
    if (!el || !parsed) return;

    const obj = { val: 0 };
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        anime({
          targets: obj,
          val: parsed.num,
          round: 1,
          duration: 1400,
          easing: 'easeOutExpo',
          update() {
            el.textContent = `${parsed.before}${obj.val.toLocaleString('en-ZA')}${parsed.after}`;
          },
        });
      },
      { threshold: 0.5 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [parsed]);

  return (
    <motion.div
      variants={fadeUp}
      className={`flex flex-col justify-center rounded-2xl border p-5 backdrop-blur-md transition-colors ${
        accent ? 'border-brand-500/40 bg-brand-500/15' : 'border-white/10 bg-ink-950/50'
      }`}
    >
      <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-ink-300">{label}</p>
      <p
        ref={valRef}
        className={`mt-2 font-display text-2xl tracking-headline ${accent ? 'text-brand-300' : 'text-white'}`}
      >
        {value}
      </p>
      <p className="mt-1 text-xs text-ink-300">{detail}</p>
    </motion.div>
  );
}

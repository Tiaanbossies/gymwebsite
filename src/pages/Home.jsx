import { Link } from 'react-router-dom';
import {
  Dumbbell,
  Salad,
  LineChart,
  Users2,
  ArrowUpRight,
  Target,
  Sparkles,
  ShieldCheck,
  HeartHandshake,
} from 'lucide-react';
import { motion } from 'framer-motion';

import PagePose from '../components/ui/PagePose.jsx';
import Container from '../components/ui/Container.jsx';
import SectionHeading from '../components/ui/SectionHeading.jsx';
import HeroHome from '../components/sections/HeroHome.jsx';
import GymTicker from '../components/sections/GymTicker.jsx';
import ServiceCard from '../components/sections/ServiceCard.jsx';
import TrustSection from '../components/sections/TrustSection.jsx';
import ReviewsSection from '../components/sections/ReviewsSection.jsx';
import CTASection from '../components/sections/CTASection.jsx';
import Reveal from '../components/ui/Reveal.jsx';
import { site, fadeUp, stagger } from '../lib/site.js';

export default function Home() {
  return (
    <PagePose>
      {/* Hero section with real full-bleed background photograph */}
      <HeroHome />
      <GymTicker />

      {/* Service overview — Personal Training + Open Gym */}
      <section className="section-tight">
        <Container>
          <div className="flex items-end justify-between gap-6 flex-wrap">
            <SectionHeading
              eyebrow="What we offer"
              title="Two ways to train with Bossie's."
              description="A fully kitted training floor in Centurion, and hands-on 1-on-1 coaching with the team that runs it."
            />
            <Link to="/services" className="btn-link shrink-0">
              See all services <ArrowUpRight size={14} strokeWidth={2.5} />
            </Link>
          </div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-60px' }}
            className="mt-12 grid gap-5 md:grid-cols-2"
          >
            <ServiceCard
              icon={Users2}
              tag="1-on-1"
              title="Personal Training"
              description="Hands-on coaching with one of our eight trainers. Every session is programmed for you — paired with a diet plan and regular body assessments."
              bullets={[
                'Eight personal trainers, 1-on-1',
                'Personalised diet plan included',
                'Regular body assessments',
              ]}
              to="/services#personal-training"
            />
            <ServiceCard
              icon={Dumbbell}
              tag="Open gym"
              title="Open Gym Access"
              description="A full commercial training floor — weights, cardio, functional and boxing area. Month-to-month, 6-month or 12-month contracts."
              bullets={[
                'Weights, cardio & boxing area',
                'Monthly, 6-month or 12-month',
                'R100 day passes also available',
              ]}
              to="/services#open-gym"
            />
          </motion.div>
        </Container>
      </section>

      {/* Value props — built around you */}
      <section className="section-tight">
        <Container>
          <SectionHeading
            eyebrow="Built around you"
            title="Real coaching, real structure, real progress."
            description="We pair the training with the bits that make it stick — nutrition, assessments and a community that shows up."
          />

          <Reveal.Group className="mt-14 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            <ValueCard
              icon={Target}
              title="1-on-1 coaching"
              body="Eight trainers who know your name, your goals and where you're at in your training."
            />
            <ValueCard
              icon={Salad}
              title="Diet plans"
              body="Nutrition coaching that supports your programme — included with personal training."
            />
            <ValueCard
              icon={LineChart}
              title="Body assessments"
              body="Regular measurements so you can see progress instead of just hoping for it."
            />
            <ValueCard
              icon={Sparkles}
              title="Free trial"
              body="Come train with us first. If it's the right fit, then we talk memberships."
            />
          </Reveal.Group>
        </Container>
      </section>

      <TrustSection />

      <ReviewsSection featuredOnly />

      {/* Gallery preview — Real photography mapping exactly to your category layout */}
      <section className="section-tight">
        <Container>
          <div className="flex items-end justify-between gap-6 flex-wrap">
            <SectionHeading
              eyebrow="Inside Bossie's"
              title="The training environment."
              description="A look at the spaces you'll train in — weights, cardio, functional and boxing, all in one floor."
            />
            <Link to="/gallery" className="btn-link shrink-0">
              Full gallery <ArrowUpRight size={14} strokeWidth={2.5} />
            </Link>
          </div>
          
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-60px' }}
            className="mt-12 grid gap-3 sm:grid-cols-[2fr_1fr_1fr] auto-rows-[240px] sm:auto-rows-[300px]"
          >
            {/* Weight Training Card */}
            <motion.div
              variants={fadeUp}
              className="group relative overflow-hidden rounded-2xl border border-white/10 bg-ink-900 hover-lift"
            >
              <img
                src="/images/gym/weights-power-rack.webp"
                alt="Power rack and free weights area at Bossie's Gym"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                loading="lazy"
                decoding="async"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink-950/85 via-ink-950/20 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 px-6 pb-5 pt-10">
                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-brand-300">
                  Free Weights & Racks
                </p>
                <h3 className="mt-1 font-display text-xl tracking-headline text-white">
                  Weight Training
                </h3>
              </div>
              <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/5" />
            </motion.div>

            {/* Cardio Area Card */}
            <motion.div
              variants={fadeUp}
              className="group relative overflow-hidden rounded-2xl border border-white/10 bg-ink-900 hover-lift"
            >
              <img
                src="/images/gym/cardio-treadmills-sign.webp"
                alt="Row of treadmills with Bossie's Gym sign on the wall"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                loading="lazy"
                decoding="async"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink-950/85 via-ink-950/20 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 px-6 pb-5 pt-10">
                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-brand-300">
                  Conditioning Equipment
                </p>
                <h3 className="mt-1 font-display text-xl tracking-headline text-white">
                  Cardio Area
                </h3>
              </div>
              <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/5" />
            </motion.div>

            {/* Functional Training Card */}
            <motion.div
              variants={fadeUp}
              className="group relative overflow-hidden rounded-2xl border border-white/10 bg-ink-900 hover-lift"
            >
              <img
                src="/images/gym/functional-stairmill-rower.webp"
                alt="Stair climber and rowing machine at Bossie's Gym"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                loading="lazy"
                decoding="async"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink-950/85 via-ink-950/20 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 px-6 pb-5 pt-10">
                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-brand-300">
                  Mobility & Compound Work
                </p>
                <h3 className="mt-1 font-display text-xl tracking-headline text-white">
                  Functional Training
                </h3>
              </div>
              <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/5" />
            </motion.div>
          </motion.div>
        </Container>
      </section>

      {/* Community / team preview */}
      <section className="section-tight">
        <Container>
          <div className="grid gap-10 rounded-3xl border border-white/10 bg-ink-900 p-6 sm:p-10 lg:grid-cols-[1.15fr_1fr] lg:items-center lg:p-12">
            {/* Text side */}
            <div>
              <span className="eyebrow">The people</span>
              <h2 className="mt-3 display-2 text-white text-balance">
                Eight trainers. One family-run floor. A gym that actually knows you.
              </h2>
              <p className="mt-5 body-lg text-balance">
                Bossie's is run by Johan "Bossie" Boshoff with Rene and Debbie, alongside the wider
                coaching team. Our trainers coach the floor every day — so when you walk in, you walk
                into a room of people who remember what you were working on last week.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link to="/team" className="btn-primary">
                  Meet the team
                </Link>
                <Link to="/about" className="btn-ghost">
                  Our story
                </Link>
              </div>
            </div>

            {/* Image side — 3-Image Real Gym Collage */}
            <div className="grid grid-cols-2 gap-3 h-full min-h-[400px]">
              {/* Left tall image */}
              <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-gradient-to-br from-brand-500/15 to-accent-500/10">
                <img
                  src="/images/gym/floor-main-aisle.webp"
                  alt="Main aisle of the training floor at Bossie's Gym"
                  className="absolute inset-0 h-full w-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-transparent to-transparent opacity-40" />
              </div>
              
              {/* Right stacked images */}
              <div className="grid grid-rows-2 gap-3">
                <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-gradient-to-br from-brand-500/15 to-accent-500/10">
                  <img
                    src="/images/gym/weights-dumbbells-wide.webp"
                    alt="Wide dumbbell rack array at Bossie's Gym"
                    className="absolute inset-0 h-full w-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-gradient-to-br from-brand-500/15 to-accent-500/10">
                  <img
                    src="/images/gym/cardio-treadmills-angle.webp"
                    alt="Row of cardio treadmills at Bossie's Gym"
                    className="absolute inset-0 h-full w-full object-cover"
                    loading="lazy"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Value tiles */}
          <ul className="mt-10 grid list-none gap-3 sm:grid-cols-2">
            <ValueTile
              icon={HeartHandshake}
              title="Family-run"
              body="Owned and operated by the Boshoff family."
            />
            <ValueTile
              icon={Users2}
              title="8 trainers"
              body="1-on-1 sessions available every day we're open."
            />
            <ValueTile
              icon={ShieldCheck}
              title="Honest pricing"
              body="R100 day pass. PT from R2,100/month. No hidden fees."
            />
            <ValueTile
              icon={Sparkles}
              title="Free trial"
              body="Try before you commit — on us."
            />
          </ul>
        </Container>
      </section>

      {/* Global call to action footer */}
      <CTASection
        eyebrow="Ready to start?"
        title="Come see the place before you commit."
        description="Book a free trial, give us a call, or send us a WhatsApp — we'll set you up."
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

function ValueCard({ icon: Icon, title, body }) {
  return (
    <Reveal.Item>
      <div className="hover-lift flex h-full flex-col gap-4 rounded-2xl border border-white/10 bg-ink-900 p-6 transition-colors hover:border-brand-500/40">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-500/15 text-brand-300 ring-1 ring-brand-500/30">
          <Icon size={18} />
        </div>
        <h3 className="font-display text-lg tracking-headline text-white">{title}</h3>
        <p className="text-sm text-ink-300 leading-relaxed">{body}</p>
      </div>
    </Reveal.Item>
  );
}

function ValueTile({ icon: Icon, title, body }) {
  return (
    <li className="flex items-start gap-3 rounded-xl border border-white/10 bg-ink-950/50 p-4">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-500/15 text-brand-300 ring-1 ring-brand-500/30">
        <Icon size={16} />
      </div>
      <div>
        <p className="text-sm font-semibold text-white">{title}</p>
        <p className="mt-0.5 text-xs text-ink-300">{body}</p>
      </div>
    </li>
  );
}
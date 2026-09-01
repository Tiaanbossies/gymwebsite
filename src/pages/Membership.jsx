import { motion } from 'framer-motion';
import { ArrowUpRight, Info, Sparkles, GraduationCap, Receipt, Phone } from 'lucide-react';

import PagePose from '../components/ui/PagePose.jsx';
import PageHero from '../components/sections/PageHero.jsx';
import Container from '../components/ui/Container.jsx';
import MembershipOptions from '../components/sections/MembershipOptions.jsx';
import CTASection from '../components/sections/CTASection.jsx';
import Button from '../components/ui/Button.jsx';
import { site, stagger } from '../lib/site.js';


export default function Membership() {
  return (
    <PagePose>
      <PageHero
        eyebrow="Membership"
        title="Open gym & personal training in Centurion — real prices, no surprises."
        description="R100 day passes, monthly/6-month/12-month open gym membership, and personal training from R2,100/month. Students pay less. Free trial on open-gym access."
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
              <p className="font-display text-lg tracking-headline text-white">Free open-gym trial available</p>
              <p className="mt-0.5 text-sm text-ink-300">
                Come try open-gym access on us first — not applicable to personal training.
              </p>
            </div>
          </div>
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:flex-wrap">
            <Button to={site.ctas.trial.to}>{site.ctas.trial.label}</Button>
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
              title="Free open-gym trial"
              body="Try open-gym access before you sign anything. Not applicable to personal training. No pressure, no sales pitch."
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

      <CTASection
        eyebrow="Join Bossie's"
        title="Pick an option, hit send, and train."
        description="Free open-gym trial, month-to-month, long contract or full personal training — we'll help you choose the right fit."
        primary={{ label: site.ctas.join.label, to: site.ctas.join.to }}
        secondary={{
          label: `Call ${site.phone.display}`,
          href: site.ctas.call.href,
          variant: 'ghost',
        }}
        tertiary={{ label: site.ctas.trial.label, to: site.ctas.trial.to, variant: 'link' }}
      />
    </PagePose>
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
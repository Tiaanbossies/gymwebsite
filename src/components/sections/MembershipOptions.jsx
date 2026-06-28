import { motion } from 'framer-motion';
import { Check, ArrowUpRight } from 'lucide-react';

import Button from '../ui/Button.jsx';
import { fadeUp, stagger, site } from '../../lib/site.js';

/**
 * MembershipOptions — three tiers that map directly to the questionnaire.
 *
 *   • R100 day pass                    (Q42)
 *   • Open gym — M2M R450 / 6m R380 / 12m R360  (client-confirmed Apr 2026)
 *     Student & pensioner rate: R250/month (client-confirmed; Q44 = student discount).
 *   • Personal Training — R2,100 (3×/week) + R2,400 (4×/week) + R2,700 (5×/week)
 *                                       (Q45 + client follow-ups)
 *
 *   Free trial: Q52 = Yes. Shown as a standalone CTA above the grid on the
 *   Membership page, not as a tier (since it isn't a membership itself).
 *   Joining fee: R200 once-off on new open gym memberships (client-confirmed).
 *
 *   The dedicated /pricing page has the full per-tier breakdown — this
 *   component is a top-level summary; "See full pricing" on the Open Gym tier
 *   routes users through to it.
 */
const defaultOptions = [
  {
    name: 'Day Pass',
    kicker: 'Casual',
    priceLine: 'R100',
    pricePeriod: 'per visit',
    description:
      "Just visiting or want to try a single session? Walk in, train, walk out. No contract and no joining fee on day passes.",
    features: [
      'Full access to the training floor',
      'Weights, cardio & boxing area',
      'No sign-up required',
      'Great for travellers & guests',
    ],
    cta: { label: 'Get a day pass', to: '/contact?plan=day-pass' },
    accent: false,
  },
  {
    name: 'Open Gym',
    kicker: 'Members',
    priceLine: 'From R360',
    pricePeriod: 'per month',
    description:
      "Full gym access on month-to-month (R450), 6-month (R380) or 12-month (R360) contracts. Students and pensioners train at R250/month with a valid card or proof. R200 once-off joining fee applies on the 6- and 12-month contracts.",
    features: [
      'Month-to-month: R450 / month',
      '6-month contract: R380 / month · +R200 joining fee',
      '12-month contract: R360 / month · +R200 joining fee',
      'Student & pensioner: R250 / month',
    ],
    cta: { label: 'See full pricing', to: '/pricing' },
    accent: true,
    badge: 'Most popular',
    note: 'R200 once-off joining fee applies on 6- and 12-month contracts.',
  },
  {
    name: 'Personal Training',
    kicker: '1-on-1 coaching',
    priceLine: 'From R2,100',
    pricePeriod: 'per month',
    description:
      "Three, four or five 1-on-1 sessions a week with one of our trainers — diet plan and body assessments included on every package.",
    features: [
      '3 sessions / week · R2,100 / month',
      '4 sessions / week · R2,400 / month',
      '5 sessions / week · R2,700 / month',
      'Personalised diet plan included',
      'Regular body assessments',
    ],
    cta: { label: 'Join Online', to: `${site.ctas.join.to}?plan=pt-3x` },
    accent: false,
  },
];

export default function MembershipOptions({ options = defaultOptions }) {
  return (
    <motion.div
      variants={stagger}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-80px' }}
      className={`grid gap-6 ${
        options.length === 2 ? 'md:grid-cols-2' : 'md:grid-cols-2 lg:grid-cols-3'
      }`}
    >
      {options.map((opt) => (
        <motion.div
          key={opt.name}
          variants={fadeUp}
          className={`relative flex flex-col rounded-2xl border p-6 sm:p-8 transition-[border-color,box-shadow] ${
            opt.accent
              ? 'border-brand-500/50 bg-gradient-to-b from-brand-500/15 to-ink-900 shadow-glow hover-lift'
              : 'border-white/10 bg-ink-900 hover-lift hover:border-white/20'
          }`}
        >
          {opt.badge && (
            <span className="absolute -top-3 left-6 rounded-full bg-brand-500 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-white">
              {opt.badge}
            </span>
          )}
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-brand-300">
              {opt.kicker}
            </p>
            <h3 className="mt-2 font-display text-3xl tracking-headline text-white">{opt.name}</h3>
          </div>

          {opt.priceLine && (
            <div className="mt-4 flex items-baseline gap-2">
              <span className="font-display text-2xl tracking-headline text-white">
                {opt.priceLine}
              </span>
              {opt.pricePeriod && (
                <span className="text-xs text-ink-400">{opt.pricePeriod}</span>
              )}
            </div>
          )}

          <p className="mt-4 text-sm text-ink-300 leading-relaxed">{opt.description}</p>

          <ul className="mt-6 flex flex-col gap-2.5">
            {opt.features.map((f) => (
              <li key={f} className="flex items-start gap-3 text-sm text-ink-200">
                <Check size={16} className="mt-[3px] shrink-0 text-brand-300" />
                {f}
              </li>
            ))}
          </ul>

          <div className="mt-8 flex flex-col gap-3">
            {opt.note && <p className="text-xs text-ink-400">{opt.note}</p>}
            <Button
              to={opt.cta.to}
              href={opt.cta.href}
              variant={opt.accent ? 'primary' : 'ghost'}
              iconNode={<ArrowUpRight size={14} strokeWidth={2.5} />}
              className="w-full justify-center"
            >
              {opt.cta.label}
            </Button>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}

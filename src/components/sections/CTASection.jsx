import { motion } from 'framer-motion';
import { ArrowUpRight, Phone } from 'lucide-react';

import Container from '../ui/Container.jsx';
import Button from '../ui/Button.jsx';
import { fadeUp, site } from '../../lib/site.js';

/**
 * CTASection — high-emphasis conversion band.
 *
 * Default CTA pair follows Q17 ("Join Online" + "Call the Gym"). Callers can
 * override `primary` / `secondary` to surface a different pair (e.g. the Free
 * Trial + WhatsApp for gallery / membership pages).
 */
export default function CTASection({
  eyebrow = 'Ready to train?',
  title = 'Stop overthinking it. Come try us.',
  description = "Start with a free trial, or just pick up the phone. We're a small team — you'll talk to someone who knows the gym.",
  primary = { label: site.ctas.join.label, to: site.ctas.join.to },
  secondary = {
    label: `Call ${site.phone.display}`,
    href: site.ctas.call.href,
    variant: 'ghost',
    iconNode: <Phone size={14} strokeWidth={2.5} />,
  },
  tertiary = { label: 'Start a Free Trial', to: site.ctas.trial.to, variant: 'link' },
  variant = 'default',
}) {
  const isBrand = variant === 'default';
  return (
    <section className="section">
      <Container>
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-80px' }}
          className={`relative overflow-hidden rounded-3xl border ${
            isBrand
              ? 'border-brand-500/40 bg-gradient-to-br from-brand-500/25 via-ink-900 to-ink-950'
              : 'border-white/10 bg-gradient-to-b from-ink-800 to-ink-900'
          } p-8 sm:p-10 lg:p-14`}
        >
          {isBrand && (
            <>
              <div className="pointer-events-none absolute -right-20 -top-20 h-80 w-80 rounded-full bg-brand-500/30 blur-3xl" />
              <div className="pointer-events-none absolute -left-20 bottom-0 h-64 w-64 rounded-full bg-accent-500/15 blur-3xl" />
              <div className="pointer-events-none absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
            </>
          )}
          <div className="relative flex flex-col items-start gap-8 xl:flex-row xl:items-end xl:justify-between">
            <div className="max-w-2xl">
              <span className="eyebrow">{eyebrow}</span>
              <h2 className="mt-3 display-2 text-white text-balance">{title}</h2>
              {description && <p className="mt-5 body-lg text-balance">{description}</p>}
            </div>
            <div className="flex w-full flex-col gap-3 sm:flex-row sm:flex-wrap xl:w-auto xl:justify-end">
              {primary && (
                <Button
                  to={primary.to}
                  href={primary.href}
                  className="w-full sm:w-auto"
                  iconNode={primary.iconNode ?? <ArrowUpRight size={16} strokeWidth={2.5} />}
                  data-track={`${primary.label} — CTA Section`}
                >
                  {primary.label}
                </Button>
              )}
              {secondary && (
                <Button
                  to={secondary.to}
                  href={secondary.href}
                  variant={secondary.variant ?? 'ghost'}
                  className="w-full sm:w-auto"
                  iconNode={secondary.iconNode}
                  icon={secondary.iconNode ? true : false}
                  data-track={secondary.label ? `${secondary.label} — CTA` : undefined}
                >
                  {secondary.label}
                </Button>
              )}
              {tertiary && (
                <Button
                  to={tertiary.to}
                  href={tertiary.href}
                  className="w-full justify-center sm:w-auto"
                  variant={tertiary.variant ?? 'link'}
                >
                  {tertiary.label}
                </Button>
              )}
            </div>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}

import { CheckCircle2, Download, MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';

import { formatDate } from './agreement.js';
import { SummaryMetric } from './fields.jsx';
import { waLink } from '../../../lib/site.js';

export default function SuccessPanel({ form, planSummary, onDownload }) {
  const firstName = form.fullName.trim().split(' ')[0] || 'there';

  const waMessage = [
    `Hi Bossie's Gym, I've completed the membership agreement on the website.`,
    `Plan: ${planSummary.label} (${planSummary.priceLine}).`,
    `Name: ${form.fullName || 'Pending'}.`,
    `Phone: ${form.phone || 'Pending'}.`,
    `Email: ${form.email || 'Pending'}.`,
    'Please send me the next steps.',
  ].join(' ');

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-[1.75rem] border border-brand-500/40 bg-gradient-to-b from-brand-500/10 to-ink-900 p-7 text-center sm:p-9"
    >
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-brand-500/15 text-brand-300 ring-1 ring-brand-500/40">
        <CheckCircle2 size={26} />
      </div>

      <div className="mx-auto mt-5 max-w-xl">
        <p className="eyebrow justify-center">Application received</p>
        <h3 className="mt-3 font-display text-3xl tracking-headline text-white sm:text-4xl">
          Thank you for applying, {firstName}.
        </h3>
        <p className="mt-4 text-sm leading-relaxed text-ink-300 sm:text-base">
          Your membership agreement has been sent to the gym. One of the team will review your
          details and get back to you shortly to confirm the next steps.
        </p>
        <p className="mt-2 text-sm text-ink-400">
          No payment is taken at this stage — everything gets confirmed directly with Bossie's.
        </p>
      </div>

      <div className="mt-8 grid gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:grid-cols-3">
        <SummaryMetric label="Plan" value={planSummary.label} />
        <SummaryMetric label="Starting" value={formatDate(form.startDate)} />
        <SummaryMetric label="Member" value={form.fullName} />
      </div>

      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <a href={waLink(waMessage)} target="_blank" rel="noreferrer" className="btn-whatsapp">
          <span>Follow up on WhatsApp</span>
          <MessageCircle size={16} strokeWidth={2.5} />
        </a>
        <button type="button" onClick={onDownload} className="btn-ghost">
          <span>Download a copy</span>
          <Download size={15} strokeWidth={2.5} />
        </button>
      </div>

      <div className="mt-8 rounded-2xl border border-white/10 bg-ink-950/70 p-5 text-left">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-ink-400">
          What happens next
        </p>
        <ul className="mt-4 space-y-3 text-sm leading-relaxed text-ink-300">
          <li>The gym has received your agreement and will review your details.</li>
          <li>One of the family will call or WhatsApp you directly to confirm sign-up.</li>
          <li>If anything is unclear, they'll reach you on the number you provided.</li>
          <li>No payment is taken on this page. Final onboarding still happens with the gym.</li>
        </ul>
      </div>
    </motion.div>
  );
}

import { AlertCircle } from 'lucide-react';

import { formatDate } from './agreement.js';
import { ConsentRow, Field, PlanSummaryCard, ReviewRow, SectionLabel } from './fields.jsx';

/**
 * Review and sign. Each review row links back to the step that owns it, and the
 * signature date is stamped rather than asked for — it is always "today".
 */
export default function StepSign({
  form,
  errors,
  onChange,
  planSummary,
  isPt,
  onEditStep,
  sendState,
}) {
  const editPlan = () => onEditStep(1);
  const editDetails = () => onEditStep(2);

  return (
    <div className="flex flex-col gap-6">
      <header>
        <p className="eyebrow">Step 3 of 3</p>
        <h3 className="mt-2 font-display text-3xl tracking-headline text-white">
          Review &amp; sign
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-ink-300">
          Check everything reads right, tick the boxes, and type your name to sign.
        </p>
      </header>

      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
        <SectionLabel>Your details</SectionLabel>
        <dl className="mt-4 grid gap-x-6 gap-y-3 sm:grid-cols-2">
          <ReviewRow label="Full name" value={form.fullName || '—'} onEdit={editDetails} />
          <ReviewRow label="Phone" value={form.phone || '—'} onEdit={editDetails} />
          <ReviewRow label="Email" value={form.email || '—'} onEdit={editDetails} />
          <ReviewRow label="Start date" value={formatDate(form.startDate)} onEdit={editDetails} />
          <ReviewRow
            label="Emergency contact"
            value={form.emergencyName ? `${form.emergencyName} · ${form.emergencyPhone}` : '—'}
            onEdit={editDetails}
          />
          <ReviewRow
            label="Health notes"
            value={form.healthFlags.length ? form.healthFlags.join(', ') : 'None flagged'}
            onEdit={editDetails}
          />
        </dl>
        <dl className="mt-4 border-t border-white/10 pt-4">
          <ReviewRow
            label="Plan"
            value={`${planSummary.label} · ${planSummary.priceLine}`}
            onEdit={editPlan}
          />
        </dl>
      </div>

      <PlanSummaryCard planSummary={planSummary} />

      <div className="space-y-3">
        {isPt && (
          <ConsentRow
            name="consentCancellationPolicy"
            checked={form.consentCancellationPolicy}
            onChange={onChange}
            error={errors.consentCancellationPolicy}
          >
            I understand sessions must be cancelled at least 24 hours in advance, and that late
            cancellations and no-shows are forfeited from my monthly package.
          </ConsentRow>
        )}

        <ConsentRow
          name="consentDetailsHealth"
          checked={form.consentDetailsHealth}
          onChange={onChange}
          error={errors.consentDetailsHealth}
        >
          The details above are true and belong to me, and I'll tell the gym about any injury,
          medical condition, or limitation that may affect exercise — including if it changes later.
        </ConsentRow>

        <ConsentRow
          name="consentTerms"
          checked={form.consentTerms}
          onChange={onChange}
          error={errors.consentTerms}
        >
          I understand the plan summary above, including the monthly rate and any commitment or
          joining-fee notes that apply to it.
        </ConsentRow>

        <ConsentRow name="consentContact" checked={form.consentContact} onChange={onChange}>
          Bossie&apos;s Gym may contact me by phone, email, or WhatsApp to finish my sign-up.{' '}
          <span className="text-ink-500">(Optional)</span>
        </ConsentRow>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <Field
          label="Type your name to sign"
          hint="Your typed name is your digital signature."
          error={errors.signatureName}
        >
          <input
            type="text"
            name="signatureName"
            value={form.signatureName}
            onChange={onChange}
            className="input"
            autoComplete="name"
            placeholder="Your full name"
          />
        </Field>
        <div className="flex flex-col gap-2">
          <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-ink-400">
            Signed on
          </span>
          <p className="input flex items-center text-ink-300">{formatDate(form.signatureDate)}</p>
        </div>
      </div>

      {sendState.status === 'error' && (
        <div
          role="alert"
          className="flex items-start gap-3 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300"
        >
          <AlertCircle size={16} className="mt-0.5 shrink-0 text-red-400" />
          <span>{sendState.message}</span>
        </div>
      )}
    </div>
  );
}

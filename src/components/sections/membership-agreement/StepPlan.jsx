import { AlertCircle } from 'lucide-react';

import { ChoiceCard, ErrorText, PlanSummaryCard, SectionLabel } from './fields.jsx';
import { OPEN_GYM_OPTIONS, PLAN_OPTIONS, PT_OPTIONS } from './plans.js';

/**
 * Everything about the plan lives on one screen — personal training used to
 * push its term picker onto a hidden second screen, which made the progress
 * indicator disagree with the number of screens a PT client actually saw.
 */
export default function StepPlan({ form, errors, onChange, planSummary, isPt }) {
  const showTerm = form.planType !== 'student';

  return (
    <div className="flex flex-col gap-6">
      <header>
        <p className="eyebrow">Step 1 of 3</p>
        <h3 className="mt-2 font-display text-3xl tracking-headline text-white">
          Choose your plan
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-ink-300">
          Not 100% sure? Pick the closest option — the gym confirms the final fit with you.
        </p>
      </header>

      <fieldset>
        <legend className="sr-only">Membership option</legend>
        <div className="grid gap-3 sm:grid-cols-3">
          {PLAN_OPTIONS.map((option) => (
            <ChoiceCard
              key={option.value}
              name="planType"
              value={option.value}
              checked={form.planType === option.value}
              onChange={onChange}
              label={option.label}
              priceLine={option.priceLine}
              helper={option.helper}
            />
          ))}
        </div>
        {errors.planType && <ErrorText>{errors.planType}</ErrorText>}
      </fieldset>

      {isPt && (
        <fieldset>
          <legend>
            <SectionLabel>How many sessions a week?</SectionLabel>
          </legend>
          <div className="mt-3 grid gap-3 sm:grid-cols-3">
            {PT_OPTIONS.map((option) => (
              <ChoiceCard
                key={option.value}
                name="ptPlan"
                value={option.value}
                checked={form.ptPlan === option.value}
                onChange={onChange}
                label={option.shortLabel}
                priceLine={option.priceLine}
              />
            ))}
          </div>
          {errors.ptPlan && <ErrorText>{errors.ptPlan}</ErrorText>}
        </fieldset>
      )}

      {showTerm && (
        <fieldset>
          <legend>
            <SectionLabel>Membership term</SectionLabel>
          </legend>
          {isPt && (
            <p className="mt-2 text-sm leading-relaxed text-ink-300">
              Personal training runs alongside full training-floor access — pick the open-gym term
              that goes with your coaching package.
            </p>
          )}
          <div className="mt-3 grid gap-3 sm:grid-cols-3">
            {OPEN_GYM_OPTIONS.map((option) => (
              <ChoiceCard
                key={option.value}
                name="openGymPlan"
                value={option.value}
                checked={form.openGymPlan === option.value}
                onChange={onChange}
                label={option.label}
                priceLine={option.priceLine}
                helper={option.helper}
              />
            ))}
          </div>
          {errors.openGymPlan && <ErrorText>{errors.openGymPlan}</ErrorText>}
        </fieldset>
      )}

      <PlanSummaryCard planSummary={planSummary} />

      {/* The 24-hour rule governs coaching sessions, so only PT clients see it. */}
      {isPt && (
        <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-5">
          <div className="flex items-start gap-3">
            <AlertCircle size={16} className="mt-0.5 shrink-0 text-amber-400" strokeWidth={2.5} />
            <div>
              <p className="text-sm font-semibold text-amber-200">Cancellation policy</p>
              <p className="mt-2 text-sm leading-relaxed text-ink-300">
                Sessions must be cancelled at least{' '}
                <strong className="font-semibold text-white">24 hours in advance</strong>. Late
                cancellations and no-shows are forfeited from your monthly package — no credit or
                make-up session.
              </p>
              <p className="mt-2 text-xs text-ink-500">You'll confirm this on the sign step.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

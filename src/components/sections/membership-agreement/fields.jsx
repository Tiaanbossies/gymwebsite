import { Children, cloneElement, useId } from 'react';
import { Check } from 'lucide-react';

// Shared presentational pieces for the membership agreement steps.
// `data-field` marks the scroll anchor used when a step fails validation.

export function ErrorText({ id, children }) {
  return (
    <p id={id} className="mt-1.5 text-xs text-red-400">
      {children}
    </p>
  );
}

export function Field({ label, hint, error, optional = false, children }) {
  const errorId = useId();
  const child = Children.only(children);
  const enhanced = error
    ? cloneElement(child, { 'aria-invalid': 'true', 'aria-describedby': errorId })
    : children;

  return (
    <label data-field className="flex flex-col gap-2">
      <span className="flex items-baseline gap-2">
        <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-ink-400">
          {label}
        </span>
        {optional && (
          <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-ink-600">
            Optional
          </span>
        )}
      </span>
      {enhanced}
      {hint && !error && <span className="text-xs text-ink-500">{hint}</span>}
      {error && <ErrorText id={errorId}>{error}</ErrorText>}
    </label>
  );
}

/** Radio card used for plan, term, and PT-frequency selection. */
export function ChoiceCard({ name, value, checked, onChange, label, priceLine, helper }) {
  return (
    <label
      data-field
      className={`flex cursor-pointer flex-col rounded-2xl border p-4 transition-colors focus-within:ring-2 focus-within:ring-brand-500/50 focus-within:ring-offset-1 focus-within:ring-offset-ink-950 ${
        checked
          ? 'border-brand-500/45 bg-brand-500/10'
          : 'border-white/10 bg-ink-950/60 hover:border-white/20'
      }`}
    >
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
        className="sr-only"
      />
      <span className="text-sm font-semibold text-white">{label}</span>
      <span className="mt-1.5 font-display text-xl tracking-headline text-brand-200">
        {priceLine}
      </span>
      {helper && <span className="mt-1.5 text-xs leading-relaxed text-ink-400">{helper}</span>}
    </label>
  );
}

/** Compact toggle used for the optional health flags. */
export function HealthChip({ label, checked, onToggle }) {
  return (
    <label
      className={`flex cursor-pointer items-center gap-2.5 rounded-xl border px-3.5 py-2.5 text-sm transition-colors ${
        checked
          ? 'border-accent-500/45 bg-accent-500/10 text-white'
          : 'border-white/10 bg-ink-950/60 text-ink-300 hover:border-white/20'
      }`}
    >
      <input type="checkbox" checked={checked} onChange={onToggle} className="sr-only" />
      <span
        aria-hidden="true"
        className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-[5px] border transition-colors ${
          checked ? 'border-accent-500 bg-accent-500 text-ink-950' : 'border-white/25'
        }`}
      >
        {checked && <Check size={11} strokeWidth={3} />}
      </span>
      <span>{label}</span>
    </label>
  );
}

export function ConsentRow({ checked, name, onChange, error, children }) {
  const errorId = `${name}-error`;
  return (
    <div data-field>
      <label
        className={`flex cursor-pointer items-start gap-3 rounded-2xl border p-4 text-sm leading-relaxed transition-colors ${
          error
            ? 'border-red-400/60 bg-red-500/5 text-ink-100'
            : checked
              ? 'border-brand-500/35 bg-brand-500/10 text-ink-100'
              : 'border-white/10 bg-ink-950/60 text-ink-300 hover:border-white/20'
        }`}
      >
        <input
          type="checkbox"
          name={name}
          checked={checked}
          onChange={onChange}
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={error ? errorId : undefined}
          className="mt-0.5 h-4 w-4 shrink-0 accent-brand-500"
        />
        <span>{children}</span>
      </label>
      {error && <ErrorText id={errorId}>{error}</ErrorText>}
    </div>
  );
}

export function PlanSummaryCard({ planSummary }) {
  return (
    <div className="rounded-2xl border border-brand-500/25 bg-brand-500/5 p-4 text-sm leading-relaxed">
      <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-ink-400">
        Your selection
      </p>
      <p className="mt-2 font-medium text-white">{planSummary.label}</p>
      <p className="mt-1 font-display text-xl tracking-headline text-brand-200">
        {planSummary.priceLine}
      </p>
      <p className="mt-2 text-ink-300">{planSummary.termsLine}</p>
    </div>
  );
}

export function ReviewRow({ label, value, onEdit }) {
  return (
    <div>
      <dt className="text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-500">
        {label}
      </dt>
      <dd className="mt-1 flex items-baseline gap-2 text-sm text-ink-100">
        <span className="min-w-0 break-words">{value}</span>
        {onEdit && (
          <button
            type="button"
            onClick={onEdit}
            className="shrink-0 text-xs font-semibold text-brand-300 underline-offset-2 hover:underline"
          >
            Edit
          </button>
        )}
      </dd>
    </div>
  );
}

export function SectionLabel({ children }) {
  return (
    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-ink-400">{children}</p>
  );
}

export function SummaryMetric({ label, value }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-ink-950/70 p-4">
      <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-ink-500">{label}</p>
      <p className="mt-2 text-sm leading-relaxed text-ink-100">{value}</p>
    </div>
  );
}

import { ChevronDown } from 'lucide-react';

import { Field, HealthChip, SectionLabel } from './fields.jsx';
import { HEALTH_OPTIONS } from './plans.js';

/**
 * One "about you" step instead of two. Required fields sit up top in three
 * short blocks; everything the gym can live without is folded into a single
 * disclosure so the step reads as six fields, not eleven.
 */
export default function StepDetails({ form, errors, onChange, onHealthToggle }) {
  return (
    <div className="flex flex-col gap-7">
      <header>
        <p className="eyebrow">Step 2 of 3</p>
        <h3 className="mt-2 font-display text-3xl tracking-headline text-white">Your details</h3>
        <p className="mt-2 text-sm leading-relaxed text-ink-300">
          Six quick fields. Everything else is optional and tucked away at the bottom.
        </p>
      </header>

      <section className="flex flex-col gap-4">
        <SectionLabel>Contact</SectionLabel>
        <div className="grid gap-5 md:grid-cols-2">
          <Field label="Full name" error={errors.fullName}>
            <input
              type="text"
              name="fullName"
              value={form.fullName}
              onChange={onChange}
              className="input"
              autoComplete="name"
              placeholder="Full legal name"
            />
          </Field>
          <Field label="Phone" error={errors.phone}>
            <input
              type="tel"
              name="phone"
              value={form.phone}
              onChange={onChange}
              className="input"
              autoComplete="tel"
              inputMode="tel"
              placeholder="072 000 0000"
            />
          </Field>
          <Field label="Email" error={errors.email}>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={onChange}
              className="input"
              autoComplete="email"
              inputMode="email"
              placeholder="you@example.com"
            />
          </Field>
          <Field
            label="Preferred start date"
            hint="Today's date is filled in — change it if you'd rather start later."
            error={errors.startDate}
          >
            <input
              type="date"
              name="startDate"
              value={form.startDate}
              onChange={onChange}
              className="input"
            />
          </Field>
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <SectionLabel>Emergency contact</SectionLabel>
        <div className="grid gap-5 md:grid-cols-2">
          <Field label="Name" error={errors.emergencyName}>
            <input
              type="text"
              name="emergencyName"
              value={form.emergencyName}
              onChange={onChange}
              className="input"
              placeholder="Who should the gym call?"
            />
          </Field>
          <Field label="Phone" error={errors.emergencyPhone}>
            <input
              type="tel"
              name="emergencyPhone"
              value={form.emergencyPhone}
              onChange={onChange}
              className="input"
              inputMode="tel"
              placeholder="Emergency contact number"
            />
          </Field>
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <fieldset>
          <legend>
            <SectionLabel>Anything the trainers should know?</SectionLabel>
          </legend>
          <p className="mt-2 text-sm leading-relaxed text-ink-300">
            Tick anything that applies so the team can coach you safely. Skip it if nothing does.
          </p>
          <div className="mt-3 flex flex-wrap gap-2.5">
            {HEALTH_OPTIONS.map((item) => (
              <HealthChip
                key={item}
                label={item}
                checked={form.healthFlags.includes(item)}
                onToggle={() => onHealthToggle(item)}
              />
            ))}
          </div>
        </fieldset>

        <Field label="Injuries or medical notes" optional>
          <textarea
            name="medicalNotes"
            rows={3}
            value={form.medicalNotes}
            onChange={onChange}
            className="input resize-none"
            placeholder="Anything the trainer should know before your first session."
          />
        </Field>
      </section>

      <details className="group rounded-2xl border border-white/10 bg-white/[0.03] p-5">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-3">
          <span>
            <SectionLabel>Add more details</SectionLabel>
            <span className="mt-1 block text-sm text-ink-400">
              ID number, date of birth, address, and your training goals — all optional.
            </span>
          </span>
          <ChevronDown
            size={18}
            className="shrink-0 text-ink-400 transition-transform duration-300 group-open:rotate-180"
          />
        </summary>

        <div className="mt-5 flex flex-col gap-5">
          <div className="grid gap-5 md:grid-cols-2">
            <Field label="SA ID / Passport" optional>
              <input
                type="text"
                name="idNumber"
                value={form.idNumber}
                onChange={onChange}
                className="input"
                placeholder="Optional"
              />
            </Field>
            <Field label="Date of birth" optional>
              <input
                type="date"
                name="birthDate"
                value={form.birthDate}
                onChange={onChange}
                className="input"
                autoComplete="bday"
              />
            </Field>
          </div>
          <Field label="Home address" optional>
            <textarea
              name="address"
              rows={2}
              value={form.address}
              onChange={onChange}
              className="input resize-none"
              placeholder="Street address, suburb, city"
            />
          </Field>
          <Field label="Main training goals" optional>
            <textarea
              name="goals"
              rows={3}
              value={form.goals}
              onChange={onChange}
              className="input resize-none"
              placeholder="Fat loss, strength, consistency, event prep, confidence, rehab support…"
            />
          </Field>
        </div>
      </details>
    </div>
  );
}

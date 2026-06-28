import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Download,
  FileText,
  HeartPulse,
  Loader2,
  MessageCircle,
  ShieldCheck,
  User,
} from 'lucide-react';

import anime from 'animejs';
import { waLink } from '../../lib/site.js';

// ─── Data ─────────────────────────────────────────────────────────────────────

const PLAN_OPTIONS = [
  {
    value: 'open-gym',
    label: 'Open Gym Membership',
    priceLine: 'From R360/month',
    helper: 'Choose month-to-month, 6-month, or 12-month access to the full training floor.',
  },
  {
    value: 'student',
    label: 'Student / Pensioner Membership',
    priceLine: 'R250/month',
    helper: 'Open-gym access at the reduced rate. Valid card or proof required.',
  },
  {
    value: 'pt-3x',
    label: 'Personal Training · 3 sessions / week',
    priceLine: 'R2,100/month',
    helper: '1-on-1 coaching, diet plan, and regular body assessments.',
  },
  {
    value: 'pt-4x',
    label: 'Personal Training · 4 sessions / week',
    priceLine: 'R2,400/month',
    helper: 'Structured 1-on-1 coaching across four weekly sessions.',
  },
  {
    value: 'pt-5x',
    label: 'Personal Training · 5 sessions / week',
    priceLine: 'R2,700/month',
    helper: 'Full-time coaching structure for members who want close oversight.',
  },
];

const OPEN_GYM_OPTIONS = [
  {
    value: 'm2m',
    label: 'Month-to-month',
    priceLine: 'R450/month',
    helper: 'Flexible monthly option. Stop at the end of a paid month.',
  },
  {
    value: '6-month',
    label: '6-month contract',
    priceLine: 'R380/month',
    helper: 'Lower monthly rate with a 6-month commitment.',
  },
  {
    value: '12-month',
    label: '12-month contract',
    priceLine: 'R360/month',
    helper: 'Best monthly rate with a 12-month commitment.',
  },
];

const HEALTH_OPTIONS = [
  'Heart or blood pressure concerns',
  'Back, joint, or mobility limitations',
  'Recent surgery or injury',
  'Pregnancy or postpartum training considerations',
  'Medication that affects exercise tolerance',
];

const STEPS = [
  { id: 1, label: 'Your Plan', icon: FileText },
  { id: 2, label: 'Details',   icon: User },
  { id: 3, label: 'Health',    icon: HeartPulse },
  { id: 4, label: 'Sign',      icon: ShieldCheck },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const planFromQuery = (value) => {
  if (['pt-3x', 'pt-4x', 'pt-5x', 'student', 'open-gym'].includes(value)) return value;
  return 'open-gym';
};

const openGymDefaultFromQuery = (value) => {
  if (['m2m', '6-month', '12-month'].includes(value)) return value;
  return 'm2m';
};

const slideVariants = {
  enter: (dir) => ({ x: dir > 0 ? 36 : -36, opacity: 0 }),
  center: { x: 0, opacity: 1, transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] } },
  exit: (dir) => ({ x: dir > 0 ? -36 : 36, opacity: 0, transition: { duration: 0.2 } }),
};

// ─── Main component ───────────────────────────────────────────────────────────

export default function MembershipAgreementForm() {
  const [params] = useSearchParams();
  const queryPlan = params.get('plan');

  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);

  const [form, setForm] = useState({
    planType: planFromQuery(queryPlan),
    openGymPlan: openGymDefaultFromQuery(queryPlan),
    startDate: new Date().toISOString().slice(0, 10),
    fullName: '',
    idNumber: '',
    birthDate: '',
    phone: '',
    email: '',
    address: '',
    emergencyName: '',
    emergencyPhone: '',
    goals: '',
    medicalNotes: '',
    healthFlags: [],
    consentAccuracy: false,
    consentHealth: false,
    consentTerms: false,
    consentContact: false,
    signatureName: '',
    signatureDate: new Date().toISOString().slice(0, 10),
  });

  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [sendState, setSendState] = useState({ status: 'idle', message: '' });

  // ── Derived ────────────────────────────────────────────────────────────────

  const selectedPlan = useMemo(
    () => PLAN_OPTIONS.find((o) => o.value === form.planType) ?? PLAN_OPTIONS[0],
    [form.planType],
  );

  const selectedOpenGymPlan = useMemo(
    () => OPEN_GYM_OPTIONS.find((o) => o.value === form.openGymPlan) ?? OPEN_GYM_OPTIONS[0],
    [form.openGymPlan],
  );

  const planSummary = useMemo(() => {
    if (form.planType === 'open-gym') {
      return {
        label: `Open Gym · ${selectedOpenGymPlan.label}`,
        priceLine: selectedOpenGymPlan.priceLine,
        termsLine:
          form.openGymPlan === 'm2m'
            ? 'Month-to-month access. You can stop at the end of any paid month. R200 once-off joining fee applies on first sign-up.'
            : `${selectedOpenGymPlan.helper} R200 once-off joining fee applies on first sign-up.`,
      };
    }
    if (form.planType === 'student') {
      return {
        label: 'Student / Pensioner Membership',
        priceLine: 'R250/month',
        termsLine:
          'Reduced-rate open-gym access. Valid student card or pensioner proof required. R200 once-off joining fee applies on first sign-up.',
      };
    }
    return {
      label: selectedPlan.label,
      priceLine: selectedPlan.priceLine,
      termsLine:
        'Monthly coaching package including a personalised diet plan and regular body assessments.',
    };
  }, [form.openGymPlan, form.planType, selectedOpenGymPlan, selectedPlan.label, selectedPlan.priceLine]);

  const applicationCsv = useMemo(() => buildCsv(form, planSummary), [form, planSummary]);

  const shortWaMessage = useMemo(
    () =>
      [
        `Hi Bossie's Gym, I've completed the membership agreement on the website.`,
        `Plan: ${planSummary.label} (${planSummary.priceLine}).`,
        `Name: ${form.fullName || 'Pending'}.`,
        `Phone: ${form.phone || 'Pending'}.`,
        `Email: ${form.email || 'Pending'}.`,
        'Please send me the next steps.',
      ].join(' '),
    [form.email, form.fullName, form.phone, planSummary.label, planSummary.priceLine],
  );

  // ── Handlers ───────────────────────────────────────────────────────────────

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((current) => {
      const next = { ...current, [name]: type === 'checkbox' ? checked : value };
      if (name === 'planType' && value === 'open-gym' && !current.openGymPlan) {
        next.openGymPlan = 'm2m';
      }
      if (name === 'signatureName' && !current.fullName) {
        next.fullName = value;
      }
      return next;
    });
  };

  const onHealthToggle = (item) => {
    setForm((current) => {
      const exists = current.healthFlags.includes(item);
      return {
        ...current,
        healthFlags: exists
          ? current.healthFlags.filter((e) => e !== item)
          : [...current.healthFlags, item],
      };
    });
  };

  const validateStep = (s) => {
    const next = {};
    if (s === 1) {
      if (!form.planType) next.planType = 'Please choose a membership option.';
      if (form.planType === 'open-gym' && !form.openGymPlan)
        next.openGymPlan = 'Please choose an open-gym term.';
    }
    if (s === 2) {
      if (!form.fullName.trim()) next.fullName = 'Please enter your full name.';
      if (!form.startDate) next.startDate = 'Please choose your preferred start date.';
      if (!form.phone.trim()) next.phone = 'Please enter a phone number.';
      if (!form.email.trim()) next.email = 'Please enter an email address.';
      else if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = 'Please enter a valid email.';
    }
    if (s === 3) {
      if (!form.emergencyName.trim()) next.emergencyName = 'Please add an emergency contact name.';
      if (!form.emergencyPhone.trim())
        next.emergencyPhone = 'Please add an emergency contact number.';
    }
    if (s === 4) {
      if (!form.consentAccuracy)
        next.consentAccuracy = 'Please confirm your information is correct.';
      if (!form.consentHealth)
        next.consentHealth = 'Please confirm your health disclosure acknowledgement.';
      if (!form.consentTerms)
        next.consentTerms = 'Please accept the membership terms summary.';
      if (!form.signatureName.trim())
        next.signatureName = 'Please type your full name as your signature.';
      if (!form.signatureDate) next.signatureDate = 'Please confirm the signature date.';
    }
    return next;
  };

  const goNext = () => {
    const errs = validateStep(step);
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    setDirection(1);
    setStep((s) => Math.min(s + 1, 4));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goBack = () => {
    setErrors({});
    setDirection(-1);
    setStep((s) => Math.max(s - 1, 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (sendState.status === 'sending') return;
    const errs = validateStep(4);
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setSendState({ status: 'sending', message: '' });
    try {
      const response = await fetch('/api/send-agreement', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          csv: applicationCsv,
          memberName: form.fullName,
          memberEmail: form.email,
          formData: {
            planLabel: planSummary.label,
            priceLine: planSummary.priceLine,
            termsLine: planSummary.termsLine,
            startDate: form.startDate,
            phone: form.phone,
            idNumber: form.idNumber,
            birthDate: form.birthDate,
            address: form.address,
            emergencyName: form.emergencyName,
            emergencyPhone: form.emergencyPhone,
            healthFlags: form.healthFlags,
            goals: form.goals,
            medicalNotes: form.medicalNotes,
            consentAccuracy: form.consentAccuracy,
            consentHealth: form.consentHealth,
            consentTerms: form.consentTerms,
            consentContact: form.consentContact,
            signatureName: form.signatureName,
            signatureDate: form.signatureDate,
          },
        }),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok || !result.ok)
        throw new Error(result.error || 'The agreement could not be sent.');
      setSubmitted(true);
      setSendState({ status: 'sent', message: '' });
    } catch (error) {
      setSendState({
        status: 'error',
        message:
          error.message ||
          'Something went wrong. Please try WhatsApp or email as a fallback.',
      });
    }
  };

  const downloadCopy = () => {
    const blob = new Blob([applicationCsv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `bossies-gym-agreement-${slugify(form.fullName || 'member')}.csv`;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    URL.revokeObjectURL(url);
  };

  // ── Success state ──────────────────────────────────────────────────────────

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-[1.75rem] border border-brand-500/40 bg-gradient-to-b from-brand-500/10 to-ink-900 p-7 sm:p-9 text-center"
      >
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-brand-500/15 text-brand-300 ring-1 ring-brand-500/40">
          <CheckCircle2 size={26} />
        </div>
        <div className="mx-auto mt-5 max-w-xl">
          <p className="eyebrow justify-center">Application received</p>
          <h3 className="mt-3 font-display text-3xl tracking-headline text-white sm:text-4xl">
            Thank you for applying, {form.fullName.split(' ')[0]}.
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
          <a
            href={waLink(shortWaMessage)}
            target="_blank"
            rel="noreferrer"
            className="btn-whatsapp"
          >
            <span>Follow up on WhatsApp</span>
            <MessageCircle size={16} strokeWidth={2.5} />
          </a>
          <button type="button" onClick={downloadCopy} className="btn-ghost">
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

  // ── Multi-step form ────────────────────────────────────────────────────────

  return (
    <form onSubmit={onSubmit} noValidate>
      <StepIndicator currentStep={step} />

      <div className="mt-8 overflow-hidden">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={step}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
          >
            {step === 1 && (
              <StepPlan
                form={form}
                errors={errors}
                onChange={onChange}
                planSummary={planSummary}
              />
            )}
            {step === 2 && (
              <StepDetails form={form} errors={errors} onChange={onChange} />
            )}
            {step === 3 && (
              <StepHealth
                form={form}
                errors={errors}
                onChange={onChange}
                onHealthToggle={onHealthToggle}
              />
            )}
            {step === 4 && (
              <StepSign
                form={form}
                errors={errors}
                onChange={onChange}
                planSummary={planSummary}
                sendState={sendState}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="mt-8 flex items-center justify-between gap-4 border-t border-white/10 pt-6">
        <button
          type="button"
          onClick={goBack}
          disabled={step === 1}
          className="btn-ghost disabled:pointer-events-none disabled:opacity-0"
        >
          <ArrowLeft size={15} strokeWidth={2.5} />
          <span>Back</span>
        </button>

        {step < 4 ? (
          <div className="flex items-center gap-4">
            <span className="text-xs text-ink-500">
              Step {step} of {STEPS.length}
            </span>
            <button type="button" onClick={goNext} className="btn-primary">
              <span>Next</span>
              <ArrowRight size={15} strokeWidth={2.5} />
            </button>
          </div>
        ) : (
          <button
            type="submit"
            disabled={sendState.status === 'sending'}
            className="btn-primary disabled:cursor-not-allowed disabled:opacity-60"
          >
            {sendState.status === 'sending' ? (
              <>
                <span>Sending…</span>
                <Loader2 size={15} className="animate-spin" />
              </>
            ) : (
              <>
                <span>Complete agreement</span>
                <CheckCircle2 size={15} strokeWidth={2.5} />
              </>
            )}
          </button>
        )}
      </div>

      <p className="mt-4 text-center text-xs text-ink-500">
        No payment is taken here — the gym confirms final sign-up steps with you directly.
      </p>
    </form>
  );
}

// ─── Step indicator ───────────────────────────────────────────────────────────

function StepIndicator({ currentStep }) {
  const lineRefs = useRef([]);

  useEffect(() => {
    lineRefs.current.forEach((el, idx) => {
      if (!el) return;
      anime({
        targets: el,
        scaleX: currentStep > idx + 1 ? 1 : 0,
        duration: 450,
        easing: 'easeOutExpo',
      });
    });
  }, [currentStep]);

  return (
    <div className="flex items-center" role="list" aria-label="Sign-up steps">
      {STEPS.map((s, idx) => {
        const isDone = currentStep > s.id;
        const isActive = currentStep === s.id;
        return (
          <div key={s.id} className="flex flex-1 items-center" role="listitem">
            <div className="flex flex-col items-center gap-1.5">
              <div
                aria-current={isActive ? 'step' : undefined}
                className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold ring-1 transition-all duration-300 ${
                  isDone
                    ? 'bg-brand-500 ring-brand-500 text-white'
                    : isActive
                      ? 'bg-brand-500/15 ring-brand-500/60 text-brand-300'
                      : 'bg-white/[0.04] ring-white/10 text-ink-500'
                }`}
              >
                {isDone ? <CheckCircle2 size={16} strokeWidth={2.5} /> : s.id}
              </div>
              <span
                className={`hidden text-[10px] font-semibold uppercase tracking-[0.18em] sm:block ${
                  isActive ? 'text-brand-300' : isDone ? 'text-ink-300' : 'text-ink-600'
                }`}
              >
                {s.label}
              </span>
            </div>
            {idx < STEPS.length - 1 && (
              <div className="mx-2 flex-1 relative h-px bg-white/10">
                <div
                  ref={(el) => { lineRefs.current[idx] = el; }}
                  className="absolute inset-0 bg-brand-500/70 origin-left"
                  style={{ transform: 'scaleX(0)' }}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Step 1: Plan ─────────────────────────────────────────────────────────────

function StepPlan({ form, errors, onChange, planSummary }) {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="eyebrow">Step 1 of 4</p>
        <h3 className="mt-2 font-display text-3xl tracking-headline text-white">
          Choose your plan
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-ink-300">
          Pick the membership that fits your goals. Not 100% sure? Choose the closest option — the
          gym will confirm the final fit with you.
        </p>
      </div>

      <fieldset>
        <legend className="sr-only">Membership option</legend>
        <div className="grid gap-3 lg:grid-cols-2">
          {PLAN_OPTIONS.map((option) => (
            <ChoiceCard
              key={option.value}
              name="planType"
              checked={form.planType === option.value}
              onChange={onChange}
              value={option.value}
              label={option.label}
              priceLine={option.priceLine}
              helper={option.helper}
            />
          ))}
        </div>
        {errors.planType && <ErrorText>{errors.planType}</ErrorText>}
      </fieldset>

      {form.planType === 'open-gym' && (
        <fieldset>
          <legend className="text-[11px] font-semibold uppercase tracking-[0.22em] text-ink-400">
            Open-gym term
          </legend>
          <div className="mt-3 grid gap-3 md:grid-cols-3">
            {OPEN_GYM_OPTIONS.map((option) => (
              <ChoiceCard
                key={option.value}
                compact
                name="openGymPlan"
                checked={form.openGymPlan === option.value}
                onChange={onChange}
                value={option.value}
                label={option.label}
                priceLine={option.priceLine}
                helper={option.helper}
              />
            ))}
          </div>
          {errors.openGymPlan && <ErrorText>{errors.openGymPlan}</ErrorText>}
        </fieldset>
      )}

      <div className="rounded-2xl border border-brand-500/25 bg-brand-500/5 p-4 text-sm leading-relaxed">
        <p className="font-medium text-white">{planSummary.label}</p>
        <p className="mt-1 text-brand-200">{planSummary.priceLine}</p>
        <p className="mt-2 text-ink-300">{planSummary.termsLine}</p>
      </div>
    </div>
  );
}

// ─── Step 2: Details ──────────────────────────────────────────────────────────

function StepDetails({ form, errors, onChange }) {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="eyebrow">Step 2 of 4</p>
        <h3 className="mt-2 font-display text-3xl tracking-headline text-white">Your details</h3>
        <p className="mt-2 text-sm leading-relaxed text-ink-300">
          Basic member information for the gym's records. Optional fields can be left blank.
        </p>
      </div>

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
        <Field label="Preferred start date" error={errors.startDate}>
          <input
            type="date"
            name="startDate"
            value={form.startDate}
            onChange={onChange}
            className="input"
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
            placeholder="you@example.com"
          />
        </Field>
        <Field label="SA ID / Passport (optional)">
          <input
            type="text"
            name="idNumber"
            value={form.idNumber}
            onChange={onChange}
            className="input"
            placeholder="Optional"
          />
        </Field>
        <Field label="Date of birth (optional)">
          <input
            type="date"
            name="birthDate"
            value={form.birthDate}
            onChange={onChange}
            className="input"
          />
        </Field>
      </div>

      <Field label="Home address (optional)">
        <textarea
          name="address"
          rows={3}
          value={form.address}
          onChange={onChange}
          className="input resize-none"
          placeholder="Street address, suburb, city"
        />
      </Field>
    </div>
  );
}

// ─── Step 3: Health ───────────────────────────────────────────────────────────

function StepHealth({ form, errors, onChange, onHealthToggle }) {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="eyebrow">Step 3 of 4</p>
        <h3 className="mt-2 font-display text-3xl tracking-headline text-white">
          Emergency contact &amp; health notes
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-ink-300">
          Emergency details are required. Health flags and notes help the team coach you safely —
          tick anything that applies.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <Field label="Emergency contact name" error={errors.emergencyName}>
          <input
            type="text"
            name="emergencyName"
            value={form.emergencyName}
            onChange={onChange}
            className="input"
            placeholder="Who should the gym call?"
          />
        </Field>
        <Field label="Emergency contact phone" error={errors.emergencyPhone}>
          <input
            type="tel"
            name="emergencyPhone"
            value={form.emergencyPhone}
            onChange={onChange}
            className="input"
            placeholder="Emergency contact number"
          />
        </Field>
      </div>

      <fieldset>
        <legend className="text-[11px] font-semibold uppercase tracking-[0.22em] text-ink-400">
          Health flags — tick anything that applies
        </legend>
        <div className="mt-3 grid gap-3 md:grid-cols-2">
          {HEALTH_OPTIONS.map((item) => {
            const checked = form.healthFlags.includes(item);
            return (
              <label
                key={item}
                className={`flex cursor-pointer items-start gap-3 rounded-2xl border p-4 text-sm transition-colors ${
                  checked
                    ? 'border-accent-500/40 bg-accent-500/10 text-white'
                    : 'border-white/10 bg-ink-950/60 text-ink-300 hover:border-white/20'
                }`}
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => onHealthToggle(item)}
                  className="mt-1 h-4 w-4 accent-accent-500"
                />
                <span>{item}</span>
              </label>
            );
          })}
        </div>
      </fieldset>

      <div className="grid gap-5 lg:grid-cols-2">
        <Field label="Main training goals (optional)">
          <textarea
            name="goals"
            rows={4}
            value={form.goals}
            onChange={onChange}
            className="input resize-none"
            placeholder="Fat loss, strength, consistency, event prep, confidence, rehab support…"
          />
        </Field>
        <Field label="Medical notes / injuries / extra context (optional)">
          <textarea
            name="medicalNotes"
            rows={4}
            value={form.medicalNotes}
            onChange={onChange}
            className="input resize-none"
            placeholder="Anything the trainer should know before your first session."
          />
        </Field>
      </div>
    </div>
  );
}

// ─── Step 4: Sign ─────────────────────────────────────────────────────────────

function StepSign({ form, errors, onChange, planSummary, sendState }) {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="eyebrow">Step 4 of 4</p>
        <h3 className="mt-2 font-display text-3xl tracking-headline text-white">
          Review &amp; sign
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-ink-300">
          Confirm the plan summary below, tick the consent boxes, and type your name as your
          digital signature.
        </p>
      </div>

      <div className="rounded-2xl border border-brand-500/25 bg-brand-500/5 p-5">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-ink-400">
          Plan selected
        </p>
        <p className="mt-2 font-medium text-white">{planSummary.label}</p>
        <p className="mt-1 text-brand-200">{planSummary.priceLine}</p>
        <p className="mt-2 text-sm text-ink-300">{planSummary.termsLine}</p>
      </div>

      <div className="space-y-3">
        <ConsentRow
          checked={form.consentAccuracy}
          name="consentAccuracy"
          onChange={onChange}
          error={errors.consentAccuracy}
        >
          I confirm the details in this membership agreement are true and belong to me.
        </ConsentRow>
        <ConsentRow
          checked={form.consentHealth}
          name="consentHealth"
          onChange={onChange}
          error={errors.consentHealth}
        >
          I understand I should disclose any injury, medical condition, or limitation that may
          affect exercise, and I'll let the gym know if anything changes.
        </ConsentRow>
        <ConsentRow
          checked={form.consentTerms}
          name="consentTerms"
          onChange={onChange}
          error={errors.consentTerms}
        >
          I understand the selected plan summary above, including the listed monthly rate and any
          commitment or joining-fee notes that apply to it.
        </ConsentRow>
        <ConsentRow
          checked={form.consentContact}
          name="consentContact"
          onChange={onChange}
        >
          Bossie&apos;s Gym may contact me by phone, email, or WhatsApp to finish my sign-up and
          answer questions about this agreement.
        </ConsentRow>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <Field label="Typed signature" error={errors.signatureName}>
          <input
            type="text"
            name="signatureName"
            value={form.signatureName}
            onChange={onChange}
            className="input"
            placeholder="Type your full name"
          />
        </Field>
        <Field label="Signature date" error={errors.signatureDate}>
          <input
            type="date"
            name="signatureDate"
            value={form.signatureDate}
            onChange={onChange}
            className="input"
          />
        </Field>
      </div>

      {sendState.status === 'error' && (
        <p className="text-sm text-red-400">{sendState.message}</p>
      )}
    </div>
  );
}

// ─── Shared sub-components ────────────────────────────────────────────────────

function Field({ label, error, children }) {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-ink-400">
        {label}
      </span>
      {children}
      {error && <ErrorText>{error}</ErrorText>}
    </label>
  );
}

function ChoiceCard({ compact = false, name, value, checked, onChange, label, priceLine, helper }) {
  return (
    <label
      className={`flex cursor-pointer flex-col rounded-2xl border p-4 transition-colors ${
        checked
          ? 'border-brand-500/45 bg-brand-500/10'
          : 'border-white/10 bg-ink-950/60 hover:border-white/20'
      } ${compact ? 'min-h-[132px]' : 'min-h-[154px]'}`}
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
      <span className="mt-2 font-display text-2xl tracking-headline text-brand-200">
        {priceLine}
      </span>
      <span className="mt-2 text-sm leading-relaxed text-ink-300">{helper}</span>
    </label>
  );
}

function ConsentRow({ checked, name, onChange, error, children }) {
  return (
    <div>
      <label
        className={`flex items-start gap-3 rounded-2xl border p-4 text-sm transition-colors ${
          error
            ? 'border-red-400/60 bg-red-500/5 text-ink-100'
            : checked
              ? 'border-brand-500/35 bg-brand-500/10 text-ink-100'
              : 'border-white/10 bg-ink-950/60 text-ink-300'
        }`}
      >
        <input
          type="checkbox"
          name={name}
          checked={checked}
          onChange={onChange}
          className="mt-1 h-4 w-4 accent-brand-500"
        />
        <span>{children}</span>
      </label>
      {error && <ErrorText>{error}</ErrorText>}
    </div>
  );
}

function SummaryMetric({ label, value }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-ink-950/70 p-4">
      <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-ink-500">{label}</p>
      <p className="mt-2 text-sm leading-relaxed text-ink-100">{value}</p>
    </div>
  );
}

function ErrorText({ children }) {
  return <p className="mt-1 text-xs text-red-400">{children}</p>;
}

// ─── Utilities ────────────────────────────────────────────────────────────────

function formatDate(value) {
  if (!value) return 'Not set';
  return new Date(`${value}T00:00:00`).toLocaleDateString('en-ZA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function slugify(value) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function buildCsv(form, planSummary) {
  const rows = [
    [
      'submitted_at', 'agreement_type', 'plan', 'rate', 'plan_notes',
      'preferred_start_date', 'full_name', 'id_or_passport', 'date_of_birth',
      'phone', 'email', 'address', 'emergency_contact_name', 'emergency_contact_phone',
      'health_flags', 'training_goals', 'medical_notes', 'information_accurate',
      'health_disclosure_acknowledged', 'plan_summary_acknowledged', 'contact_consent',
      'signed_by', 'signature_date',
    ],
    [
      new Date().toISOString(),
      "Bossie's Gym Membership Agreement",
      planSummary.label,
      planSummary.priceLine,
      planSummary.termsLine,
      form.startDate,
      form.fullName,
      form.idNumber || '',
      form.birthDate || '',
      form.phone,
      form.email,
      form.address || '',
      form.emergencyName,
      form.emergencyPhone,
      form.healthFlags.length ? form.healthFlags.join('; ') : 'None selected',
      form.goals || '',
      form.medicalNotes || '',
      form.consentAccuracy ? 'Yes' : 'No',
      form.consentHealth ? 'Yes' : 'No',
      form.consentTerms ? 'Yes' : 'No',
      form.consentContact ? 'Yes' : 'No',
      form.signatureName,
      form.signatureDate,
    ],
  ];
  return rows.map((row) => row.map(csvEscape).join(',')).join('\r\n');
}

function csvEscape(value) {
  const text = String(value ?? '');
  return /[",\r\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

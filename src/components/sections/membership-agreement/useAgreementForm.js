import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import {
  buildCsv,
  buildFormData,
  buildPlanSummary,
  isPersonalTraining,
  slugify,
} from './agreement.js';
import { openGymDefaultFromQuery, planFromQuery, ptPlanFromQuery, STEPS } from './plans.js';

const SS_KEY = 'bossies-onboarding';
const LAST_STEP = STEPS.length;
const MIN_PHONE_DIGITS = 9;
// Slightly longer than the 300ms step transition, so a click cannot carry
// through the swap from "Next" to "Complete agreement".
const STEP_SETTLE_MS = 500;

/**
 * Field order per step. Drives which input gets focused when a step fails
 * validation — without this the member taps "Next" and nothing visibly happens
 * because the offending field is off-screen.
 */
const FIELD_ORDER = {
  1: ['planType', 'ptPlan', 'openGymPlan'],
  2: ['fullName', 'phone', 'email', 'startDate', 'emergencyName', 'emergencyPhone'],
  3: [
    'consentCancellationPolicy',
    'consentAccuracy',
    'consentHealth',
    'consentTerms',
    'signatureName',
  ],
};

const today = () => new Date().toISOString().slice(0, 10);

export const defaultForm = (queryPlan) => ({
  planType: planFromQuery(queryPlan),
  openGymPlan: openGymDefaultFromQuery(queryPlan),
  ptPlan: ptPlanFromQuery(queryPlan),
  startDate: today(),
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
  consentCancellationPolicy: false,
  signatureName: '',
  signatureDate: today(),
});

const readSaved = (queryPlan) => {
  if (queryPlan) return null;
  try {
    const saved = sessionStorage.getItem(SS_KEY);
    if (!saved) return null;
    const parsed = JSON.parse(saved);
    if (!parsed || typeof parsed !== 'object') return null;
    // Merge over defaults so a session saved by an older version of the form
    // cannot leave newly added fields undefined.
    return { ...defaultForm(null), ...parsed, healthFlags: parsed.healthFlags ?? [] };
  } catch {
    return null;
  }
};

const hasProgress = (form) =>
  Boolean(form.fullName || form.phone || form.email || form.emergencyName);

export function useAgreementForm() {
  const [params] = useSearchParams();
  const queryPlan = params.get('plan');

  const formRef = useRef(null);
  // Timestamp of the last step change. The nav button lives outside the
  // animated region, so advancing to the final step swaps "Next" into the
  // submit button underneath the cursor — the same physical click could then
  // land on submit and flag every consent red before the member has read them.
  const stepEnteredAt = useRef(0);

  const [initialState] = useState(() => {
    const saved = readSaved(queryPlan);
    return {
      form: saved ?? defaultForm(queryPlan),
      restored: Boolean(saved) && hasProgress(saved),
    };
  });

  const [form, setForm] = useState(initialState.form);
  const [showResumeNotice, setShowResumeNotice] = useState(initialState.restored);

  const [step, setStep] = useState(1);
  const [maxStep, setMaxStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [sendState, setSendState] = useState({ status: 'idle', message: '' });

  useEffect(() => {
    try {
      sessionStorage.setItem(SS_KEY, JSON.stringify(form));
    } catch {
      // Private-browsing quota errors must not break the form.
    }
  }, [form]);

  const planSummary = useMemo(() => buildPlanSummary(form), [form]);
  const isPt = isPersonalTraining(form);

  // ── Field updates ──────────────────────────────────────────────────────────

  const clearError = useCallback((name) => {
    setErrors((current) => {
      if (!current[name]) return current;
      const next = { ...current };
      delete next[name];
      return next;
    });
  }, []);

  const onChange = useCallback(
    (e) => {
      const { name, value, type, checked } = e.target;
      clearError(name);
      setForm((current) => {
        const next = { ...current, [name]: type === 'checkbox' ? checked : value };
        // Typing a signature before a name was entered fills both.
        if (name === 'signatureName' && !current.fullName) next.fullName = value;
        return next;
      });
    },
    [clearError],
  );

  const onHealthToggle = useCallback((item) => {
    setForm((current) => ({
      ...current,
      healthFlags: current.healthFlags.includes(item)
        ? current.healthFlags.filter((flag) => flag !== item)
        : [...current.healthFlags, item],
    }));
  }, []);

  const startOver = useCallback(() => {
    try {
      sessionStorage.removeItem(SS_KEY);
    } catch {
      // Ignore — clearing the in-memory form is what matters.
    }
    setForm(defaultForm(queryPlan));
    setErrors({});
    setStep(1);
    setMaxStep(1);
    setShowResumeNotice(false);
  }, [queryPlan]);

  // ── Validation ─────────────────────────────────────────────────────────────

  const validateStep = useCallback(
    (target) => {
      const next = {};

      if (target === 1) {
        if (!form.planType) next.planType = 'Please choose a membership option.';
        if (!form.openGymPlan) next.openGymPlan = 'Please choose a membership term.';
        if (isPt && !form.ptPlan) next.ptPlan = 'Please choose a session frequency.';
      }

      if (target === 2) {
        if (!form.fullName.trim()) next.fullName = 'Please enter your full name.';
        if (!form.phone.trim()) next.phone = 'Please enter a phone number.';
        else if (form.phone.replace(/\D/g, '').length < MIN_PHONE_DIGITS)
          next.phone = 'That number looks too short — please check it.';
        if (!form.email.trim()) next.email = 'Please enter an email address.';
        else if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = 'Please enter a valid email.';
        if (!form.startDate) next.startDate = 'Please choose your preferred start date.';
        if (!form.emergencyName.trim()) next.emergencyName = 'Please add an emergency contact name.';
        if (!form.emergencyPhone.trim())
          next.emergencyPhone = 'Please add an emergency contact number.';
      }

      if (target === 3) {
        if (!form.consentAccuracy)
          next.consentAccuracy = 'Please confirm your details are correct.';
        if (!form.consentHealth)
          next.consentHealth = 'Please confirm your health disclosure acknowledgement.';
        if (!form.consentTerms) next.consentTerms = 'Please accept the plan summary.';
        if (isPt && !form.consentCancellationPolicy)
          next.consentCancellationPolicy = 'Please acknowledge the cancellation policy.';
        if (!form.signatureName.trim())
          next.signatureName = 'Please type your full name as your signature.';
      }

      return next;
    },
    [form, isPt],
  );

  const focusFirstError = useCallback((target, errs) => {
    const firstName = (FIELD_ORDER[target] ?? []).find((name) => errs[name]);
    if (!firstName || !formRef.current) return;
    const field = formRef.current.querySelector(`[name="${firstName}"]`);
    if (!field) return;
    // Radios and consent boxes are visually hidden inputs, so scroll their
    // labelled container into view rather than the input itself.
    const anchor = field.closest('[data-field], fieldset, label') ?? field;
    anchor.scrollIntoView({ behavior: 'smooth', block: 'center' });
    field.focus({ preventScroll: true });
  }, []);

  const scrollToForm = useCallback(() => {
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  // ── Navigation ─────────────────────────────────────────────────────────────

  const goNext = useCallback(() => {
    const errs = validateStep(step);
    setErrors(errs);
    if (Object.keys(errs).length > 0) {
      focusFirstError(step, errs);
      return;
    }
    setShowResumeNotice(false);
    const target = Math.min(step + 1, LAST_STEP);
    stepEnteredAt.current = Date.now();
    setDirection(1);
    setStep(target);
    setMaxStep((furthest) => Math.max(furthest, target));
    scrollToForm();
  }, [focusFirstError, scrollToForm, step, validateStep]);

  const goBack = useCallback(() => {
    setErrors({});
    setDirection(-1);
    setStep((current) => Math.max(current - 1, 1));
    scrollToForm();
  }, [scrollToForm]);

  /** Step-indicator jump. Only steps already reached are reachable. */
  const goToStep = useCallback(
    (target) => {
      if (target === step || target > maxStep) return;
      stepEnteredAt.current = Date.now();
      setErrors({});
      setDirection(target > step ? 1 : -1);
      setStep(target);
      scrollToForm();
    },
    [maxStep, scrollToForm, step],
  );

  // ── Submit ─────────────────────────────────────────────────────────────────

  const onSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      if (sendState.status === 'sending') return;
      // Ignore a submit that arrives with the step transition itself — it is
      // the "Next" click landing on the button that replaced it, not intent.
      if (Date.now() - stepEnteredAt.current < STEP_SETTLE_MS) return;

      const errs = validateStep(LAST_STEP);
      setErrors(errs);
      if (Object.keys(errs).length > 0) {
        focusFirstError(LAST_STEP, errs);
        return;
      }

      setSendState({ status: 'sending', message: '' });
      try {
        const response = await fetch('/api/send-agreement', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            csv: buildCsv(form, planSummary),
            memberName: form.fullName,
            memberEmail: form.email,
            formData: buildFormData(form, planSummary),
          }),
        });
        const result = await response.json().catch(() => ({}));
        if (!response.ok || !result.ok)
          throw new Error(result.error || 'The agreement could not be sent.');
        setSubmitted(true);
        setSendState({ status: 'sent', message: '' });
        try {
          sessionStorage.removeItem(SS_KEY);
        } catch {
          // Nothing to recover from — the submission already succeeded.
        }
      } catch (error) {
        setSendState({
          status: 'error',
          message:
            error.message || 'Something went wrong. Please try WhatsApp or email as a fallback.',
        });
      }
    },
    [focusFirstError, form, planSummary, sendState.status, validateStep],
  );

  const downloadCopy = useCallback(() => {
    const blob = new Blob([buildCsv(form, planSummary)], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `bossies-gym-agreement-${slugify(form.fullName || 'member')}.csv`;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    URL.revokeObjectURL(url);
  }, [form, planSummary]);

  const dismissResumeNotice = useCallback(() => setShowResumeNotice(false), []);

  return {
    form,
    errors,
    errorCount: Object.keys(errors).length,
    step,
    maxStep,
    direction,
    isPt,
    planSummary,
    formRef,
    sendState,
    submitted,
    showResumeNotice,
    onChange,
    onHealthToggle,
    goNext,
    goBack,
    goToStep,
    onSubmit,
    downloadCopy,
    startOver,
    dismissResumeNotice,
  };
}

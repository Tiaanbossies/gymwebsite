// Derivations for the membership agreement: plan summary, outbound payload, CSV.
//
// The CSV columns and the `formData` keys below are a wire contract with
// server.mjs (handleSendAgreement -> email body + Supabase `onboarded_members`).
// Renaming or dropping either breaks the gym's records — extend, don't rewrite.

import { OPEN_GYM_OPTIONS, PLAN_OPTIONS, PT_OPTIONS } from './plans.js';

const JOINING_FEE_NOTE = 'R200 once-off joining fee applies on first sign-up.';

export const findOpenGymOption = (value) =>
  OPEN_GYM_OPTIONS.find((o) => o.value === value) ?? OPEN_GYM_OPTIONS[0];

export const findPtOption = (value) => PT_OPTIONS.find((o) => o.value === value) ?? PT_OPTIONS[0];

export const findPlanOption = (value) =>
  PLAN_OPTIONS.find((o) => o.value === value) ?? PLAN_OPTIONS[0];

export const isPersonalTraining = (form) => form.planType === 'personal-training';

/** The plan card shown throughout the form, and the wording stored on the record. */
export function buildPlanSummary(form) {
  const openGym = findOpenGymOption(form.openGymPlan);

  if (form.planType === 'open-gym') {
    return {
      label: `Open Gym · ${openGym.label}`,
      priceLine: openGym.priceLine,
      termsLine:
        form.openGymPlan === 'm2m'
          ? `Month-to-month access. You can stop at the end of any paid month. ${JOINING_FEE_NOTE}`
          : `${openGym.helper} ${JOINING_FEE_NOTE}`,
    };
  }

  if (form.planType === 'student') {
    return {
      label: 'Student / Pensioner Membership',
      priceLine: 'R250/month',
      termsLine: `Reduced-rate open-gym access. Valid student card or pensioner proof required. ${JOINING_FEE_NOTE}`,
    };
  }

  if (form.planType === 'personal-training') {
    const pt = findPtOption(form.ptPlan);
    return {
      label: `${pt.label} + ${openGym.label} membership`,
      priceLine: `${pt.priceLine} + ${openGym.priceLine} membership`,
      termsLine:
        `Monthly coaching package including a personalised diet plan and regular body assessments. ` +
        `Sessions require 24 hours’ notice to cancel — late cancellations and no-shows are forfeited ` +
        `from your monthly package. Personal training runs alongside a ${openGym.label.toLowerCase()} ` +
        `open-gym membership for full training-floor access — ${JOINING_FEE_NOTE}`,
    };
  }

  const plan = findPlanOption(form.planType);
  return { label: plan.label, priceLine: plan.priceLine, termsLine: '' };
}

/**
 * The 24-hour cancellation policy only governs personal-training sessions, so
 * open-gym and student members are not asked to accept it. The column is still
 * written so the gym's export keeps a consistent shape.
 */
const cancellationValue = (form) =>
  isPersonalTraining(form)
    ? form.consentCancellationPolicy
      ? 'Yes'
      : 'No'
    : 'N/A (no PT sessions)';

/**
 * One tick covers both "my details are true" and "I'll disclose relevant health
 * conditions"; both recorded columns are driven from it.
 */
const detailsHealthValue = (form) => (form.consentDetailsHealth ? 'Yes' : 'No');

/** Payload for POST /api/send-agreement. Keys are consumed by server.mjs. */
export function buildFormData(form, planSummary) {
  return {
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
    consentAccuracy: form.consentDetailsHealth,
    consentHealth: form.consentDetailsHealth,
    consentTerms: form.consentTerms,
    consentContact: form.consentContact,
    signatureName: form.signatureName,
    signatureDate: form.signatureDate,
  };
}

export function buildCsv(form, planSummary) {
  const rows = [
    [
      'submitted_at', 'agreement_type', 'plan', 'rate', 'plan_notes',
      'preferred_start_date', 'full_name', 'id_or_passport', 'date_of_birth',
      'phone', 'email', 'address', 'emergency_contact_name', 'emergency_contact_phone',
      'health_flags', 'training_goals', 'medical_notes', 'information_accurate',
      'health_disclosure_acknowledged', 'plan_summary_acknowledged', 'contact_consent',
      'cancellation_policy_acknowledged', 'signed_by', 'signature_date',
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
      detailsHealthValue(form),
      detailsHealthValue(form),
      form.consentTerms ? 'Yes' : 'No',
      form.consentContact ? 'Yes' : 'No',
      cancellationValue(form),
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

export function formatDate(value) {
  if (!value) return 'Not set';
  return new Date(`${value}T00:00:00`).toLocaleDateString('en-ZA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function slugify(value) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

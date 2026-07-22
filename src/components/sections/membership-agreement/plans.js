// Plan catalogue and query-string helpers for the membership agreement.

export const PLAN_OPTIONS = [
  {
    value: 'open-gym',
    label: 'Open Gym Membership',
    priceLine: 'From R360/month',
    helper: 'Full access to the training floor. Pick your term below.',
  },
  {
    value: 'personal-training',
    label: 'Personal Training',
    priceLine: 'From R2,100/month',
    helper: '1-on-1 coaching, diet plan, and regular body assessments.',
  },
  {
    value: 'student',
    label: 'Student / Pensioner',
    priceLine: 'R250/month',
    helper: 'Open-gym access at the reduced rate. Valid card or proof required.',
  },
];

export const PT_OPTIONS = [
  {
    value: '3x',
    shortLabel: '3 sessions/week',
    label: 'Personal Training · 3 sessions/week',
    priceLine: 'R2,100/month',
    helper: '1-on-1 coaching, diet plan, and regular body assessments.',
  },
  {
    value: '4x',
    shortLabel: '4 sessions/week',
    label: 'Personal Training · 4 sessions/week',
    priceLine: 'R2,400/month',
    helper: 'Structured 1-on-1 coaching across four weekly sessions.',
  },
  {
    value: '5x',
    shortLabel: '5 sessions/week',
    label: 'Personal Training · 5 sessions/week',
    priceLine: 'R2,700/month',
    helper: 'Full-time coaching structure for members who want close oversight.',
  },
];

export const OPEN_GYM_OPTIONS = [
  {
    value: 'm2m',
    label: 'Month-to-month',
    priceLine: 'R450/month',
    helper: 'Flexible. Stop at the end of a paid month.',
  },
  {
    value: '6-month',
    label: '6-month contract',
    priceLine: 'R380/month',
    helper: 'Lower monthly rate, 6-month commitment.',
  },
  {
    value: '12-month',
    label: '12-month contract',
    priceLine: 'R360/month',
    helper: 'Best monthly rate, 12-month commitment.',
  },
];

export const HEALTH_OPTIONS = [
  'Heart or blood pressure concerns',
  'Back, joint, or mobility limitations',
  'Recent surgery or injury',
  'Pregnancy or postpartum considerations',
  'Medication affecting exercise tolerance',
];

export const STEPS = [
  { id: 1, label: 'Plan' },
  { id: 2, label: 'Details' },
  { id: 3, label: 'Sign' },
];

export const planFromQuery = (value) => {
  if (['personal-training', 'pt-3x', 'pt-4x', 'pt-5x'].includes(value)) return 'personal-training';
  if (['student', 'open-gym'].includes(value)) return value;
  return 'open-gym';
};

export const openGymDefaultFromQuery = (value) => {
  if (['m2m', '6-month', '12-month'].includes(value)) return value;
  return 'm2m';
};

export const ptPlanFromQuery = (value) => {
  if (value === 'pt-4x') return '4x';
  if (value === 'pt-5x') return '5x';
  return '3x';
};

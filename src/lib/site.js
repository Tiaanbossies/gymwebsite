// Central site config — source of truth for business facts.
// All values below are taken directly from the completed client onboarding
// questionnaire (April 2026). Do not invent additional facts here.

export const site = {
  name: "Bossie's Gym", // Q7: preferred display name
  fullName: "Bossie's Gym & Personal Training Studio", // Q6
  owner: 'Johan "Bossie" Boshoff', // Q2
  tagline: 'A family-run gym in Centurion. Real coaching. Real community.',
  shortDescription:
    "A small commercial gym in Centurion run by the Boshoff family — where members feel part of it.", // Q18
  differentiator:
    "A small gym that focuses on its customers, rather than just trying to grow for growth's sake.", // Q19
  idealMember:
    'A working husband or wife who wants personal training, clear health goals and a real community.', // Q20
  values: ['Honesty', 'Commitment', 'Community'], // Q23

  // Contact
  phone: {
    display: '072 482 7922', // Q11
    tel: '+27724827922', // international format for tel: and wa.me
    digitsOnly: '27724827922',
  },
  email: 'bossiesgym@gmail.com',
  enquiryEmail: 'bossiesgym@gmail.com',

  // Location (Q8 — address shown publicly per Q14 = Yes)
  location: {
    line1: '1st Floor, 207 Edison Crescent',
    line2: 'Hennopspark',
    city: 'Centurion',
    postalCode: '0157',
    region: 'Gauteng',
    country: 'South Africa',
    mapsQuery: '1st Floor, 207 Edison Crescent, Hennopspark, Centurion, 0157',
  },

  // Areas served (Q9)
  areasServed: ['Centurion', 'Midstream', 'Hennopspark', 'Lyttelton'],
  // Core areas from questionnaire are Centurion and Midstream; Hennopspark is the
  // exact suburb and Lyttelton is included as an adjacent catchment.

  // Hours (Q10)
  hours: [
    { day: 'Monday – Thursday', open: '05:00', close: '20:00', display: '5am – 8pm' },
    { day: 'Friday', open: '05:00', close: '19:00', display: '5am – 7pm' },
    { day: 'Saturday', open: '08:00', close: '11:00', display: '8am – 11am' },
    { day: 'Sunday', open: null, close: null, display: 'Closed' },
    { day: 'Public holidays', open: '08:00', close: '11:00', display: '8am – 11am' },
  ],

  // Social / external (Q15, Q16)
  socials: {
    instagram: 'https://www.instagram.com/bossiesgym/',
    googleBusinessProfile: 'https://www.google.com/maps/search/?api=1&query=Bossies+Gym+Centurion',
  },

  // Domain — confirmed by the client as bossiesgym.co.za
  // (Q67 in the questionnaire read "bossiesgy.co.za" but this was a typo.)
  url: 'https://bossiesgym.co.za',

  // Primary conversion actions, ordered by questionnaire Q17 selection:
  // "Join Online", "Call the Gym", "Send an Enquiry" were checked.
  // (Book a Consultation and Book a Class were NOT checked.)
  // Free Trial is offered (Q52), so we surface it as a conversion path.
  ctas: {
    // Join Online now routes to the in-site membership agreement + sign-up
    // flow so the user never has to leave the website to complete it.
    join:    { label: 'Join Online',    to: '/onboarding', href: '/onboarding' },
    call:    { label: 'Call the Gym',   href: 'tel:+27724827922' },
    enquire: { label: 'Send an Enquiry', to: '/contact' },
    whatsapp:{ label: 'WhatsApp Us',    href: 'https://wa.me/27724827922' },
    trial:   { label: 'Start a Free Trial', to: '/contact?intent=trial' },
    pricing: { label: 'See Full Pricing', to: '/pricing' },
    tour:    { label: 'Book a Gym Tour', to: '/contact?intent=tour' },
  },

  nav: [
    { label: 'Home', to: '/' },
    { label: 'Services', to: '/services' },
    { label: 'Membership', to: '/membership' },
    { label: 'Pricing', to: '/pricing' },
    { label: 'Team', to: '/team' },
    { label: 'Gallery', to: '/gallery' },
    { label: 'About', to: '/about' },
    { label: 'FAQ', to: '/faq' },
    { label: 'Contact', to: '/contact' },
  ],

  // Pricing — single source of truth for rand figures shown on the site.
  //   Day pass — Q42.
  //   Open gym M2M/6m/12m — client-confirmed (Apr 2026 follow-up).
  //   Personal training 3/4/5 sessions — Q45 + client-confirmed 4-day & 5-day rates.
  //   Joining fee — client-confirmed (R200 on open gym memberships).
  pricing: {
    dayPass: { rand: 100, period: 'per visit', label: 'Day Pass' },
    openGym: [
      { contract: 'Month-to-month', rand: 450, period: 'per month', commitment: 'Cancel anytime' },
      { contract: '6-month contract', rand: 380, period: 'per month', commitment: 'Locked for 6 months', joiningFee: 200 },
      { contract: '12-month contract', rand: 360, period: 'per month', commitment: 'Locked for 12 months', bestValue: true, joiningFee: 200 },
    ],
    personalTraining: [
      { sessions: '3 sessions / week', rand: 2100, period: 'per month' },
      { sessions: '4 sessions / week', rand: 2400, period: 'per month' },
      { sessions: '5 sessions / week', rand: 2700, period: 'per month' },
    ],
    joiningFee: { rand: 200, applies: 'open gym memberships' },
    studentMembership: {
      rand: 250,
      period: 'per month',
      audiences: ['Student', 'Pensioner'],
      conditions: 'Valid student card or proof of pensioner status',
    },
    freeTrial: { available: true },
  },
};

// Helpers used throughout the site so links stay consistent
export const waLink = (text) => {
  const base = `https://wa.me/${site.phone.digitsOnly}`;
  return text ? `${base}?text=${encodeURIComponent(text)}` : base;
};

export const mapsLink = () =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    site.location.mapsQuery,
  )}`;

// Reusable framer-motion variants
export const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

export const stagger = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  },
};


export const pageVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.25, ease: 'easeIn' } },
};

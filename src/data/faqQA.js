import { site } from '../lib/site.js';

/**
 * Curated FAQ Q&A knowledge base — answers are sourced strictly from the
 * completed client questionnaire, plus client-confirmed follow-ups (joining
 * fee = R200 on open gym memberships; 5-day PT rate = R2,700/month; fifth
 * trainer = Jakkie; domain = bossiesgym.co.za; open gym rates = R450 M2M /
 * R380 6m / R360 12m; student membership = R250/month).
 *
 * This is the single source of truth for both the public FAQ page
 * (src/pages/FAQ.jsx) and the AI sales agent (server/salesAgent.mjs), which
 * consumes `answerText` exclusively — never `answer`/`link` (which the FAQ
 * page uses to render an inline JSX link). Do not invent or edit content
 * here without a citable source (see NOTES.md).
 *
 * Plain data only — no JSX — so this module can be imported from both the
 * client (FAQ.jsx, which renders a <Link> for entries with a `link` field)
 * and the server (salesAgent.mjs, which only ever reads `answerText`).
 *
 * An item has either:
 *   - `answer`: a plain string, rendered as-is, or
 *   - `answerText` + `link`: a plain-text mirror for JSON-LD / the sales
 *     agent, plus a `{ before, label, to, after }` descriptor FAQ.jsx uses
 *     to render `{before}<Link to={to}>{label}</Link>{after}`.
 */
export const faqGroups = [
  {
    heading: 'Joining & trying us out',
    items: [
      {
        question: 'Do you offer a free trial?',
        answer:
          "Yes — a free open-gym trial. We'd rather you try the floor before you commit. This covers open-gym access only, not personal training; book it and come in for a session, and if it's the right fit, we'll talk memberships after.",
      },
      {
        question: 'How do I sign up?',
        link: {
          before: 'Three options, pick the one that suits you best:\n• Fill in the form on our ',
          label: 'Contact page',
          to: '/contact',
          after: `.\n• Send a WhatsApp to ${site.phone.display}.\n• Call the gym — we answer during opening hours.`,
        },
        // Plain-text mirror for FAQPage JSON-LD and the sales agent —
        // acceptedAnswer.text must be a string, and the agent never renders JSX.
        answerText: `Three options, pick the one that suits you best:\n• Fill in the form on our Contact page.\n• Send a WhatsApp to ${site.phone.display}.\n• Call the gym — we answer during opening hours.`,
      },
      {
        question: 'Is there a joining fee?',
        answer:
          "Yes — a once-off R200 joining fee applies on new open gym memberships. No other admin or sign-up charges.",
      },
      {
        question: 'Do I need to book sessions in advance?',
        answer:
          "For personal training, yes — you'll agree a recurring time slot with your trainer. For open gym, no bookings are needed; just come in during opening hours.",
      },
    ],
  },
  {
    heading: 'Pricing & membership',
    items: [
      {
        question: 'How much is a day pass?',
        answer:
          "A day pass is R100. No contract, no joining fee, no catch — ideal if you're visiting or just want to try us.",
      },
      {
        question: 'What does an open-gym membership cost?',
        link: {
          before: 'Three contract lengths:\n• Month-to-month — R450 / month (cancel any time)\n• 6-month — R380 / month\n• 12-month — R360 / month (best value)\n\nA once-off R200 joining fee applies on new sign-ups. See the ',
          label: 'Pricing page',
          to: '/pricing',
          after: ' for the full breakdown.',
        },
        answerText: 'Three contract lengths:\n• Month-to-month — R450 / month (cancel any time)\n• 6-month — R380 / month\n• 12-month — R360 / month (best value)\n\nA once-off R200 joining fee applies on new sign-ups. See the Pricing page for the full breakdown.',
      },
      {
        question: 'What does personal training cost?',
        answer:
          "Personal training starts at R2,100 per month for 3 sessions a week, including a personalised diet plan and regular body assessments. Four-day-a-week coaching is R2,400 per month, and five-day-a-week coaching is R2,700 per month.",
      },
      {
        question: 'Do you offer a student or pensioner discount?',
        answer:
          "Yes — students and pensioners both train on a R250 / month open-gym membership. Pop in or send a WhatsApp with a photo of your student card or proof of pensioner status and we'll set it up.",
      },
      {
        question: 'What about corporate or family rates?',
        answer:
          "Get in touch — we're a family gym and we're happy to chat about shared memberships for couples or households, or group sign-ups from the same workplace.",
      },
    ],
  },
  {
    heading: 'Training & coaching',
    items: [
      {
        question: 'What services do you offer?',
        answer:
          "Personal training, open gym access, nutrition / diet plans, and body assessments.",
      },
      {
        question: 'Do you run group classes?',
        answer:
          "We're a small commercial gym focused on personal training and open-gym training.",
      },
      {
        question: 'Do you have a boxing area?',
        answer:
          "Yes. We've got a dedicated boxing area, alongside the weight training floor, cardio area and functional training space.",
      },
      {
        question: 'Do you help with competition prep?',
        answer:
          "Yes. We've got a competitive training culture and members who've stepped on stage from our floor. Mention competition prep when you enquire and we'll match you with the right trainer.",
      },
      {
        question: 'I\'m a beginner — is Bossie\'s right for me?',
        answer:
          "Yes — a lot of our members join as beginners. Personal training is the simplest starting point: one-on-one from day one with a coach who programs around where you actually are.",
      },
    ],
  },
  {
    heading: 'Sessions & cancellations',
    items: [
      {
        question: 'What is the cancellation policy for personal training?',
        answer:
          "Sessions must be cancelled at least 24 hours in advance. Cancel within that window — or don't show up — and the session is forfeited from your monthly package. No credit, no refund, and no make-up session will be offered.\n\nThis policy applies to all personal training plans and is acknowledged as part of the membership agreement.",
      },
      {
        question: 'Can I reschedule a session?',
        answer:
          "Yes, with at least 24 hours' notice. Contact your trainer or call the gym and we'll find another time that works. Sessions rescheduled within 24 hours of the start time are treated as a late cancellation and forfeited.",
      },
      {
        question: 'Why does the cancellation policy exist?',
        answer:
          "Your trainer blocks that hour specifically for you. A last-minute cancellation or no-show leaves that slot empty with no time to fill it — which isn't fair on the coach or on other members who could have used it. The 24-hour window gives everyone a fair chance to reorganise.",
      },
    ],
  },
  {
    heading: 'Visiting & logistics',
    items: [
      {
        question: 'Where are you located?',
        answer:
          `${site.fullName} is on the 1st Floor, 207 Edison Crescent, Hennopspark, Centurion, 0157. A short drive from Midstream and surrounding Centurion suburbs.`,
      },
      {
        question: 'What are your opening hours?',
        answer:
          site.hours
            .map((h) => `• ${h.day}: ${h.display}`)
            .join('\n'),
      },
      {
        question: 'Is there parking?',
        answer:
          "Yes — parking is available on-site.",
      },
      {
        question: 'How do I contact you?',
        answer:
          `Call ${site.phone.display}, WhatsApp the same number, email ${site.email}, or DM @bossiesgym on Instagram. The form on our Contact page goes to the same inbox.`,
      },
    ],
  },
];

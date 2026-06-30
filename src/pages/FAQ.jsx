import PagePose from '../components/ui/PagePose.jsx';
import PageHero from '../components/sections/PageHero.jsx';
import Container from '../components/ui/Container.jsx';
import FAQAccordion from '../components/sections/FAQAccordion.jsx';
import CTASection from '../components/sections/CTASection.jsx';
import SectionHeading from '../components/ui/SectionHeading.jsx';
import { useStructuredData } from '../hooks/useStructuredData.js';
import { site } from '../lib/site.js';

/**
 * FAQ — answers are sourced strictly from the completed client questionnaire,
 * plus client-confirmed follow-ups (joining fee = R200 on open gym memberships;
 * 5-day PT rate = R2,700/month; fifth trainer = Jakkie; domain = bossiesgym.co.za;
 * open gym rates = R450 M2M / R380 6m / R360 12m; student membership = R250/month).
 */
const faqGroups = [
  {
    heading: 'Joining & trying us out',
    items: [
      {
        question: 'Do you offer a free trial?',
        answer:
          "Yes. We'd rather you try the gym before you commit. Book a free trial and come in for a session — if it's the right fit, we'll talk memberships after.",
      },
      {
        question: 'How do I sign up?',
        answer:
          "Three options, pick the one that suits you best:\n• Fill in the form on our Contact page.\n• Send a WhatsApp to " + site.phone.display + ".\n• Call the gym — we answer during opening hours.",
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
        answer:
          "Three contract lengths:\n• Month-to-month — R450 / month (cancel any time)\n• 6-month — R380 / month\n• 12-month — R360 / month (best value)\n\nA once-off R200 joining fee applies on new sign-ups. See the Pricing page for the full breakdown.",
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

export default function FAQ() {
  useStructuredData({
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqGroups.flatMap((g) =>
      g.items.map((item) => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: { '@type': 'Answer', text: item.answer },
      }))
    ),
  });

  return (
    <PagePose>
      <PageHero
        eyebrow="FAQ"
        title="The practical stuff — answered."
        description="The questions we get asked most. If something isn't covered here, send a WhatsApp and we'll come back to you."
        imagePath="/images/gym/assessment-desk.webp"
        breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'FAQ' }]}
      />

      <section className="section">
        <Container>
          <div className="flex flex-col gap-16">
            {faqGroups.map((group) => (
              <div key={group.heading}>
                <SectionHeading title={group.heading} />
                <div className="mt-10">
                  <FAQAccordion items={group.items} />
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <CTASection
        eyebrow="Still have questions?"
        title="Easiest way is to just ask us."
        description="We're a small team — you'll talk to someone who actually coaches on the floor."
        primary={{ label: site.ctas.join.label, to: site.ctas.join.to }}
        secondary={{
          label: `Call ${site.phone.display}`,
          href: site.ctas.call.href,
          variant: 'ghost',
        }}
        tertiary={{ label: 'Start a Free Trial', to: site.ctas.trial.to, variant: 'link' }}
      />
    </PagePose>
  );
}
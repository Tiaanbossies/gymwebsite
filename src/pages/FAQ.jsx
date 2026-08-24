import { Link } from 'react-router-dom';

import PagePose from '../components/ui/PagePose.jsx';
import PageHero from '../components/sections/PageHero.jsx';
import Container from '../components/ui/Container.jsx';
import FAQAccordion from '../components/sections/FAQAccordion.jsx';
import CTASection from '../components/sections/CTASection.jsx';
import SectionHeading from '../components/ui/SectionHeading.jsx';
import { useStructuredData } from '../hooks/useStructuredData.js';
import { faqGroups } from '../data/faqQA.js';
import { site } from '../lib/site.js';

// The data module (src/data/faqQA.js) stays plain-data-only so it can also be
// imported server-side by the AI sales agent. Entries whose rendered answer
// needs a <Link> carry a `link: { before, label, to, after }` descriptor
// instead of JSX — reconstruct the JSX here, once, for display.
function renderedFaqGroups(groups) {
  return groups.map((group) => ({
    ...group,
    items: group.items.map((item) => {
      if (!item.link) return item;
      const { before, label, to, after } = item.link;
      return {
        ...item,
        answer: (
          <>
            {before}
            <Link to={to} className="text-brand-300 underline decoration-brand-500/40 underline-offset-2 hover:text-brand-200">{label}</Link>
            {after}
          </>
        ),
      };
    }),
  }));
}

export default function FAQ() {
  const displayGroups = renderedFaqGroups(faqGroups);

  useStructuredData({
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqGroups.flatMap((g) =>
      g.items.map((item) => ({
        '@type': 'Question',
        name: item.question,
        // answerText covers the entries whose rendered answer is JSX
        // (contains a <Link>) — JSON.stringify on a React element doesn't
        // produce readable text, so those entries need a plain-string mirror.
        acceptedAnswer: { '@type': 'Answer', text: item.answerText || item.answer },
      }))
    ),
  });

  return (
    <PagePose>
      <PageHero
        eyebrow="FAQ"
        title="The practical stuff — answered."
        description="The questions we get asked most. If something isn't covered here, send a WhatsApp and we'll come back to you."
        imagePath="/images/gym/reception-lounge.webp"
        breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'FAQ' }]}
      />

      <section className="section">
        <Container>
          <div className="flex flex-col gap-16">
            {displayGroups.map((group) => (
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
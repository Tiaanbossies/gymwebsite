import { FileText, Phone, ShieldCheck, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

import PagePose from '../components/ui/PagePose.jsx';
import PageHero from '../components/sections/PageHero.jsx';
import Container from '../components/ui/Container.jsx';
import MembershipAgreementForm from '../components/sections/MembershipAgreementForm.jsx';
import Button from '../components/ui/Button.jsx';
import { site, waLink } from '../lib/site.js';

export default function Onboarding() {
  return (
    <PagePose>
      <PageHero
        eyebrow="Onboarding"
        title="Complete your membership agreement online."
        description="Choose your plan, add your details, review the essentials, and email a CSV-ready agreement straight through to Bossie’s team."
        breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'Onboarding' }]}
      />

      <section className="section">
        <Container>
          <div className="grid gap-10 xl:grid-cols-[1.15fr_0.85fr]">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="rounded-[1.75rem] border border-white/10 bg-ink-900 p-6 sm:p-8"
            >
              <span className="eyebrow">Membership agreement</span>
              <h2 className="mt-3 font-display text-3xl tracking-headline text-white sm:text-4xl">
                Complete the essentials once.
              </h2>
              <p className="mt-4 max-w-2xl text-sm leading-relaxed text-ink-300 sm:text-base">
                This form captures the practical details the gym needs to start your onboarding:
                your chosen plan, emergency contact, health notes, and your agreement to the basics.
              </p>
              <div className="mt-8">
                <MembershipAgreementForm />
              </div>
            </motion.div>

            <motion.aside
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.08 }}
              className="flex flex-col gap-6"
            >
              <InfoCard
                icon={FileText}
                eyebrow="What this covers"
                title="The sign-up essentials"
                body="Plan selection, member details, emergency contact, relevant health notes, and the agreement checkboxes needed to start your membership cleanly."
              />

              <InfoCard
                icon={ShieldCheck}
                eyebrow="Kept simple"
                title="Clear, not legalese-heavy"
                body="We’ve kept this form focused on the operational essentials the site can responsibly collect. Final onboarding details still get confirmed directly with the gym."
              />

              <div className="rounded-2xl border border-brand-500/30 bg-gradient-to-b from-brand-500/10 to-ink-900 p-6">
                <span className="eyebrow">Need help first?</span>
                <h3 className="mt-3 font-display text-2xl tracking-headline text-white">
                  Talk to the gym before you sign.
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-ink-300">
                  If you’d rather ask a few questions first, call or WhatsApp. One of the family
                  will walk you through the right option before you commit.
                </p>
                <div className="mt-5 flex flex-col gap-3">
                  <Button
                    href={site.ctas.call.href}
                    variant="ghost"
                    iconNode={<Phone size={14} strokeWidth={2.5} />}
                    className="w-full justify-center"
                  >
                    Call {site.phone.display}
                  </Button>
                  <Button
                    href={waLink("Hi Bossie's Gym, I want to ask a few questions before I complete the membership agreement.")}
                    variant="whatsapp"
                    className="w-full justify-center"
                  >
                    WhatsApp Us
                  </Button>
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent-500/15 text-accent-300 ring-1 ring-accent-500/30">
                    <Sparkles size={18} />
                  </div>
                  <div>
                    <p className="font-display text-xl tracking-headline text-white">
                      Not ready to sign yet?
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-ink-300">
                      Start with the free trial instead. Come see the floor, meet the team, and then
                      circle back to the agreement if it feels right.
                    </p>
                  </div>
                </div>
                <div className="mt-5">
                  <Button to={site.ctas.trial.to} className="w-full justify-center">
                    {site.ctas.trial.label}
                  </Button>
                </div>
              </div>
            </motion.aside>
          </div>
        </Container>
      </section>
    </PagePose>
  );
}

function InfoCard({ icon: Icon, eyebrow, title, body }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-500/15 text-brand-300 ring-1 ring-brand-500/30">
        <Icon size={18} />
      </div>
      <span className="eyebrow mt-5">{eyebrow}</span>
      <h3 className="mt-3 font-display text-2xl tracking-headline text-white">{title}</h3>
      <p className="mt-3 text-sm leading-relaxed text-ink-300">{body}</p>
    </div>
  );
}

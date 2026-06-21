import { MapPin, Mail, Clock, Phone, Instagram, MessageCircle, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';

import PagePose from '../components/ui/PagePose.jsx';
import PageHero from '../components/sections/PageHero.jsx';
import Container from '../components/ui/Container.jsx';
import ContactForm from '../components/sections/ContactForm.jsx';
import SectionHeading from '../components/ui/SectionHeading.jsx';
import Button from '../components/ui/Button.jsx';
import { site, mapsLink, waLink } from '../lib/site.js';

export default function Contact() {
  const mapsUrl = mapsLink();
  return (
    <PagePose>
      <PageHero
        eyebrow="Get in touch"
        title="Hennopspark, Centurion. Come say hi."
        description="Drop by, call the gym, or send a WhatsApp — one of the family will answer. We reply quickly and honestly."
        imagePath="/images/gym/reception-lounge.webp"
        breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'Contact' }]}
      />

      {/* Quick-contact strip */}
      <section className="border-b border-white/10 bg-ink-900/60">
        <Container>
          <div className="grid gap-3 py-6 sm:grid-cols-3">
            <QuickContact
              icon={Phone}
              label="Call the gym"
              body={site.phone.display}
              href={site.ctas.call.href}
              trackLabel="Call — Contact"
            />
            <QuickContact
              icon={MessageCircle}
              label="WhatsApp"
              body="Fastest reply"
              href={waLink("Hi Bossie's Gym, I'd like to know more about joining.")}
              external
              accent
              trackLabel="WhatsApp — Contact"
            />
            <QuickContact
              icon={Mail}
              label="Email"
              body={site.email}
              href={`mailto:${site.email}`}
            />
          </div>
        </Container>
      </section>

      <section className="section">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[1.05fr_1fr] lg:gap-14">
            {/* Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="rounded-2xl border border-white/10 bg-ink-900 p-7 sm:p-10"
            >
              <span className="eyebrow">Send us an enquiry</span>
              <h2 className="mt-3 font-display text-3xl sm:text-4xl tracking-headline text-white">
                Tell us what you're looking for.
              </h2>
              <p className="mt-4 text-sm text-ink-300 leading-relaxed">
                Join online, book a free trial, or just ask a question. We'll come back with the
                latest rates and next steps.
              </p>
              <div className="mt-8">
                <ContactForm />
              </div>
            </motion.div>

            {/* Details */}
            <motion.aside
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="flex flex-col gap-6"
            >
              {/* Address block */}
              <div className="rounded-2xl border border-white/10 bg-ink-900 p-7">
                <span className="eyebrow">Visit the gym</span>
                <h3 className="mt-3 font-display text-2xl tracking-headline text-white">
                  {site.location.line2}, {site.location.city}
                </h3>
                <address className="mt-3 not-italic text-sm text-ink-200 leading-relaxed">
                  {site.fullName}
                  <br />
                  {site.location.line1}
                  <br />
                  {site.location.line2}, {site.location.city}
                  <br />
                  {site.location.postalCode}, {site.location.region}
                </address>
                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-brand-300 hover:text-brand-200"
                >
                  Open in Google Maps
                  <ExternalLink size={14} strokeWidth={2.5} />
                </a>
              </div>

              {/* Hours block */}
              <div className="rounded-2xl border border-white/10 bg-ink-900 p-7">
                <span className="eyebrow">Opening hours</span>
                <h3 className="mt-3 flex items-center gap-2 font-display text-2xl tracking-headline text-white">
                  <Clock size={18} className="text-brand-300" />
                  When we're open
                </h3>
                <ul className="mt-4 divide-y divide-white/10 text-sm">
                  {site.hours.map((h) => (
                    <li
                      key={h.day}
                      className="flex items-center justify-between py-2.5 text-ink-200"
                    >
                      <span>{h.day}</span>
                      <span className="font-mono text-ink-300">{h.display}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Social / quick actions */}
              <ul className="grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/5 sm:grid-cols-2">
                <InfoCell
                  icon={Phone}
                  title="Phone"
                  body={site.phone.display}
                  href={site.ctas.call.href}
                  trackLabel="Call — Contact"
                />
                <InfoCell
                  icon={MessageCircle}
                  title="WhatsApp"
                  body="Click to chat"
                  href={waLink("Hi Bossie's Gym, I'd like to know more about joining.")}
                  external
                  trackLabel="WhatsApp — Contact"
                />
                <InfoCell
                  icon={Mail}
                  title="Email"
                  body={site.email}
                  href={`mailto:${site.email}`}
                />
                <InfoCell
                  icon={Instagram}
                  title="Instagram"
                  body="@bossiesgym"
                  href={site.socials.instagram}
                  external
                />
              </ul>

              {/* Free trial card */}
              <div className="rounded-2xl border border-accent-500/30 bg-gradient-to-b from-accent-500/10 to-ink-900 p-7">
                <span className="eyebrow">Free trial</span>
                <h3 className="mt-3 font-display text-2xl tracking-headline text-white">
                  Train with us first.
                </h3>
                <p className="mt-3 text-sm text-ink-300 leading-relaxed">
                  Come in, try the floor, meet a trainer — all on us. If it's a fit, we sort the rest
                  out after.
                </p>
                <div className="mt-5 flex flex-wrap gap-3">
                  <Button to={site.ctas.trial.to}>Book my free trial</Button>
                </div>
              </div>
            </motion.aside>
          </div>
        </Container>
      </section>

      {/* Map / area section */}
      <section className="section-tight">
        <Container>
          <SectionHeading
            eyebrow="Area served"
            title="Bossie's Gym — Hennopspark, Centurion."
            description={`A short drive from ${site.areasServed.slice(0, 3).join(', ')} and surrounding Centurion suburbs.`}
          />
          <div className="mt-10 grid gap-6 xl:grid-cols-[0.95fr_1.2fr]">
            {/* Location summary card */}
            <div className="rounded-2xl border border-white/10 bg-ink-900 p-7">
              <MapPin size={20} className="text-brand-300" />
              <h3 className="mt-4 font-display text-2xl tracking-headline text-white">
                {site.location.line1}
              </h3>
              <p className="mt-2 text-sm text-ink-300">
                {site.location.line2}, {site.location.city} · {site.location.postalCode}
              </p>
              <p className="mt-5 text-sm text-ink-200 leading-relaxed">
                Tucked into Edison Crescent in Hennopspark. Easy parking out front, easy access from
                the N1 and Rooihuiskraal.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Button href={mapsUrl} iconNode={<ExternalLink size={14} strokeWidth={2.5} />}>
                  Open in Maps
                </Button>
                <Button href={site.ctas.call.href} variant="ghost" iconNode={<Phone size={14} strokeWidth={2.5} />}>
                  Call {site.phone.display}
                </Button>
              </div>
            </div>

            {/* Embedded map (no-API-key lightweight embed) */}
            <div className="relative aspect-[5/4] overflow-hidden rounded-2xl border border-white/10 bg-ink-900 sm:aspect-[4/3]">
              <iframe
                title="Bossie's Gym location on Google Maps"
                src={`https://www.google.com/maps?q=${encodeURIComponent(site.location.mapsQuery)}&output=embed`}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0 h-full w-full"
                style={{ border: 0, filter: 'grayscale(0.35) contrast(0.95) brightness(0.85)' }}
              />
            </div>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {site.areasServed.map((area) => (
              <div
                key={area}
                className="rounded-2xl border border-white/10 bg-ink-900 p-5 text-center"
              >
                <MapPin size={16} className="mx-auto text-brand-300" />
                <p className="mt-3 font-display text-lg tracking-headline text-white">{area}</p>
              </div>
            ))}
          </div>
          <p className="mt-6 text-center text-xs text-ink-500">
            Further afield? Give us a call — we're happy to point you to the right local gym.
          </p>
        </Container>
      </section>
    </PagePose>
  );
}

function InfoCell({ icon: Icon, title, body, href, external, trackLabel }) {
  const Comp = href ? 'a' : 'div';
  const extraProps = {
    ...(href && external ? { target: '_blank', rel: 'noreferrer' } : {}),
    ...(trackLabel ? { 'data-track': trackLabel } : {}),
  };
  return (
    <li>
      <Comp
        href={href}
        {...extraProps}
        className="flex h-full items-start gap-4 bg-ink-900 p-6 transition-colors hover:bg-ink-800"
      >
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-500/15 text-brand-300 ring-1 ring-brand-500/30">
          <Icon size={16} />
        </div>
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-ink-400">
            {title}
          </p>
          <p className="mt-1.5 text-sm text-ink-100 leading-relaxed">{body}</p>
        </div>
      </Comp>
    </li>
  );
}

function QuickContact({ icon: Icon, label, body, href, external, accent, trackLabel }) {
  return (
    <a
      href={href}
      {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}
      {...(trackLabel ? { 'data-track': trackLabel } : {})}
      className={`flex items-center gap-4 rounded-2xl border p-4 transition-colors hover-lift sm:p-5 ${
        accent
          ? 'border-[#25D366]/40 bg-[#25D366]/10 hover:border-[#25D366]/70'
          : 'border-white/10 bg-ink-900 hover:border-brand-500/40'
      }`}
    >
      <div
        className={`flex h-11 w-11 items-center justify-center rounded-lg ring-1 ${
          accent
            ? 'bg-[#25D366]/20 text-[#25D366] ring-[#25D366]/40'
            : 'bg-brand-500/15 text-brand-300 ring-brand-500/30'
        }`}
      >
        <Icon size={18} />
      </div>
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-ink-400">
          {label}
        </p>
        <p className="mt-0.5 text-sm font-semibold text-white">{body}</p>
      </div>
    </a>
  );
}
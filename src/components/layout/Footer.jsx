import { Link } from 'react-router-dom';
import { MapPin, Mail, Phone, ArrowRight, Clock, Instagram, MessageCircle } from 'lucide-react';

import Logo from './Logo.jsx';
import { site, waLink, mapsLink } from '../../lib/site.js';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative mt-24 border-t border-white/10 bg-ink-900">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-500/50 to-transparent" />

      <div className="container-x pt-16 pb-10 sm:pt-20">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.2fr_1fr_1fr_1.1fr] lg:gap-10 xl:gap-12">
          <div>
            <Logo />
            <p className="mt-6 max-w-sm text-sm text-ink-400 leading-relaxed">
              {site.shortDescription} We run personal training and open gym access out of our studio
              in {site.location.line2}, {site.location.city}.
            </p>
            <Link
              to={site.ctas.join.to}
              className="mt-8 inline-flex items-center gap-2 rounded-full border border-brand-500/40 bg-brand-500/10 px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.18em] text-brand-300 transition hover:bg-brand-500/20"
            >
              {site.ctas.join.label} <ArrowRight size={14} />
            </Link>

            {/* Social */}
            <div className="mt-6 flex items-center gap-2">
              <a
                href={site.socials.instagram}
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-ink-200 transition hover:border-white/30 hover:text-white"
              >
                <Instagram size={16} />
              </a>
              <a
                href={waLink("Hi Bossie's Gym, I'd like to find out more.")}
                target="_blank"
                rel="noreferrer"
                aria-label="WhatsApp"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-[#25D366] transition hover:border-white/30"
              >
                <MessageCircle size={16} />
              </a>
            </div>
          </div>

          <FooterCol
            title="Explore"
            links={[
              { label: 'Home', to: '/' },
              { label: 'Services', to: '/services' },
              { label: 'Membership', to: '/membership' },
              { label: 'Pricing', to: '/pricing' },
              { label: 'Gallery', to: '/gallery' },
              { label: 'Team', to: '/team' },
            ]}
          />

          <FooterCol
            title="Company"
            links={[
              { label: 'About', to: '/about' },
              { label: 'FAQ', to: '/faq' },
              { label: 'Contact', to: '/contact' },
            ]}
          />

          <div>
            <h4 className="text-[11px] font-semibold uppercase tracking-[0.22em] text-ink-400">
              Visit & Contact
            </h4>
            {/* Semantic NAP block — <address> is the signal Google's local
                search uses to recognise the business's contact details. The
                JSON-LD in index.html still does the heavy SEO lifting; this
                element is the HTML-level reinforcement. */}
            <address className="mt-5 flex flex-col gap-3 text-sm not-italic text-ink-200">
              <a
                href={mapsLink()}
                target="_blank"
                rel="noreferrer"
                className="flex items-start gap-3 hover:text-white"
              >
                <MapPin size={16} className="mt-0.5 shrink-0 text-brand-300" />
                <span>
                  {site.location.line1},<br />
                  {site.location.line2}, {site.location.city}, {site.location.postalCode}
                </span>
              </a>
              <a href={site.ctas.call.href} className="flex items-start gap-3 hover:text-white">
                <Phone size={16} className="mt-0.5 shrink-0 text-brand-300" />
                <span>{site.phone.display}</span>
              </a>
              <a
                href={`mailto:${site.email}`}
                className="flex items-start gap-3 hover:text-white"
              >
                <Mail size={16} className="mt-0.5 shrink-0 text-brand-300" />
                <span className="break-all">{site.email}</span>
              </a>
              <div className="flex items-start gap-3">
                <Clock size={16} className="mt-0.5 shrink-0 text-brand-300" />
                <div>
                  {site.hours.map((h) => (
                    <div key={h.day} className="text-xs text-ink-300">
                      <span className="text-ink-200">{h.day}:</span> {h.display}
                    </div>
                  ))}
                </div>
              </div>
            </address>
          </div>
        </div>

        <div className="mt-16 flex flex-col items-start justify-between gap-4 border-t border-white/10 pt-8 text-xs text-ink-500 sm:flex-row sm:items-center">
          <p>© {year} {site.fullName}. All rights reserved.</p>
          <p className="text-ink-500">
            Family-run in {site.location.city}, serving {site.areasServed.slice(0, 2).join(' & ')}.
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }) {
  return (
    <div>
      <h4 className="text-[11px] font-semibold uppercase tracking-[0.22em] text-ink-400">{title}</h4>
      <ul className="mt-5 flex flex-col gap-2.5">
        {links.map((l) => (
          <li key={l.to}>
            <Link to={l.to} className="text-sm text-ink-200 hover:text-white transition-colors">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

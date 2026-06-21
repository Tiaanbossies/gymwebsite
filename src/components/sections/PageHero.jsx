import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

import Container from '../ui/Container.jsx';
import { useStructuredData } from '../../hooks/useStructuredData.js';

const SITE_ORIGIN = 'https://bossiesgym.co.za';

/**
 * Shared interior-page hero. Renders a photo background when `imagePath` is
 * given, otherwise falls back to the decorative gradient/grid treatment.
 * Breadcrumbs (when provided) render both the visual nav and a matching
 * BreadcrumbList JSON-LD block via useStructuredData.
 */
export default function PageHero({ eyebrow, title, description, imagePath, lightOverlay = false, breadcrumbs = [] }) {
  useStructuredData(
    breadcrumbs.length > 0
      ? {
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: breadcrumbs.map((b, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            name: b.label,
            ...(b.to ? { item: `${SITE_ORIGIN}${b.to === '/' ? '' : b.to}` } : {}),
          })),
        }
      : null
  );

  return (
    <section className="relative overflow-hidden border-b border-white/10 bg-ink-900">
      {imagePath ? (
        <>
          <img
            src={imagePath}
            alt={title}
            className="absolute inset-0 z-0 h-full w-full object-cover object-center"
            loading="eager"
            decoding="async"
          />
          <div
            className={`absolute inset-0 z-10 pointer-events-none bg-gradient-to-t ${
              lightOverlay
                ? 'from-ink-950 via-ink-950/40 to-ink-950/10'
                : 'from-ink-950 via-ink-950/70 to-ink-950/40'
            }`}
          />
          <div
            className={`absolute inset-0 z-10 pointer-events-none bg-gradient-to-r ${
              lightOverlay
                ? 'from-ink-950/80 via-ink-950/30 to-transparent'
                : 'from-ink-950/90 via-ink-950/50 to-transparent'
            }`}
          />
        </>
      ) : (
        <>
          <div className="pointer-events-none absolute inset-0 bg-radial-fade opacity-80" />
          <div className="pointer-events-none absolute inset-0 bg-radial-fade-red opacity-70" />
          <div className="pointer-events-none absolute inset-0 bg-grid opacity-[0.12]" />
          <div className="pointer-events-none absolute -right-16 top-12 h-48 w-48 rounded-full bg-brand-500/15 blur-3xl motion-safe:animate-drift-slow sm:h-72 sm:w-72" />
          <div className="pointer-events-none absolute left-0 top-1/2 h-40 w-40 -translate-x-1/3 rounded-full bg-accent-500/10 blur-3xl motion-safe:animate-drift sm:h-64 sm:w-64" />
        </>
      )}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-px bg-gradient-to-r from-transparent via-brand-500/40 to-transparent" />

      <Container className="relative z-20 py-12 sm:py-16 lg:py-20">
        {breadcrumbs.length > 0 && (
          <motion.nav
            aria-label="Breadcrumb"
            className="mb-6 flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-ink-400 sm:mb-8"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {breadcrumbs.map((b, i) => (
              <span key={i} className="flex items-center gap-2">
                {b.to ? (
                  <Link to={b.to} className="hover:text-brand-400">
                    {b.label}
                  </Link>
                ) : (
                  <span className="text-ink-300">{b.label}</span>
                )}
                {i < breadcrumbs.length - 1 && <ChevronRight size={12} />}
              </span>
            ))}
          </motion.nav>
        )}

        <div className="max-w-4xl">
          {eyebrow && (
            <motion.span
              className="eyebrow"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              {eyebrow}
            </motion.span>
          )}
          <motion.h1
            className="mt-4 display-2 max-w-[18ch] text-white text-balance"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05 }}
          >
            {title}
          </motion.h1>
          {description && (
            <motion.p
              className="mt-5 max-w-2xl body-lg text-balance sm:mt-6"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              {description}
            </motion.p>
          )}
        </div>
      </Container>
    </section>
  );
}

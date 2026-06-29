import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { lazy, Suspense, useEffect } from 'react';
import { useTracker } from './hooks/useTracker.js';

import AnnouncementBar from './components/layout/AnnouncementBar.jsx';
import Header from './components/layout/Header.jsx';
import Footer from './components/layout/Footer.jsx';
import ScrollToTop from './components/layout/ScrollToTop.jsx';
import StickyWhatsApp from './components/layout/StickyWhatsApp.jsx';

import Home from './pages/Home.jsx';
import Services from './pages/Services.jsx';
import Membership from './pages/Membership.jsx';
import Onboarding from './pages/Join.jsx';
import Pricing from './pages/Pricing.jsx';
import Team from './pages/Team.jsx';
import Contact from './pages/Contact.jsx';

const Gallery = lazy(() => import('./pages/Gallery.jsx'));
const About = lazy(() => import('./pages/About.jsx'));
const FAQ = lazy(() => import('./pages/FAQ.jsx'));
const Dashboard = lazy(() => import('./pages/Dashboard.jsx'));
const NotFound = lazy(() => import('./pages/NotFound.jsx'));

// Site origin used for canonical + OG URLs. Kept at module scope so the meta
// effect below has a single source of truth alongside the route map.
const SITE_ORIGIN = 'https://bossiesgym.co.za';

// Default OG image used by every route unless an entry overrides it.
const DEFAULT_OG_IMAGE = `${SITE_ORIGIN}/logo.png`;

/**
 * upsertMeta — set or create a <meta> by selector and update its content.
 *
 *   selector  — full CSS selector e.g. 'meta[property="og:title"]'
 *   attrName  — attribute used to identify the tag if it has to be created
 *   attrValue — that attribute's value
 *   content   — the actual content="..." we want to set
 */
function upsertMeta(selector, attrName, attrValue, content) {
  let el = document.head.querySelector(selector);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attrName, attrValue);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

/** upsertLink — same idea for <link rel="..."> tags (used for canonical). */
function upsertLink(rel, href) {
  let el = document.head.querySelector(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', rel);
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

export default function App() {
  const location = useLocation();
  useTracker();

  // Per-route SEO — title, description, canonical, OG, Twitter.
  // The OG/Twitter tags mirror the per-route title + description so social
  // shares from /pricing, /services etc. surface that page's specific copy
  // instead of falling back to the homepage meta in index.html.
  useEffect(() => {
    const meta = {
      '/':           { title: "Bossie's Gym — Personal Training Studio in Centurion",              desc: "A family-run gym in Hennopspark, Centurion. Personal training, open gym access, nutrition coaching and body assessments." },
      '/services':   { title: "Services — Personal Training & Open Gym | Bossie's Gym",             desc: "1-on-1 personal training, open gym access, nutrition coaching and body assessments at Bossie's Gym in Centurion." },
      '/membership': { title: "Gym Membership Centurion — Open Gym & Personal Training | Bossie's Gym", desc: "Personal training, monthly / 6-month / 12-month open gym contracts, R100 day passes, free trial and student & pensioner discounts." },
      '/onboarding': { title: "Onboarding — Membership Agreement | Bossie's Gym",                    desc: "Complete your Bossie's Gym membership agreement online. Choose your plan, add your details, confirm the essentials, and email the CSV agreement to the gym." },
      '/join':       { title: "Onboarding — Membership Agreement | Bossie's Gym",                    desc: "Complete your Bossie's Gym membership agreement online. Choose your plan, add your details, confirm the essentials, and email the CSV agreement to the gym." },
      '/pricing':    { title: "Pricing — Full Breakdown | Bossie's Gym, Centurion",                  desc: "Full pricing for Bossie's Gym: R100 day pass, open gym from R360/month, personal training from R2100/month, R200 joining fee, student & pensioner discount and free trial." },
      '/team':       { title: "Our Team — Trainers at Bossie's Gym, Centurion",                      desc: "Meet the Boshoff-family team and the wider coaching crew behind Bossie's Gym in Centurion." },
      '/gallery':    { title: "Gallery — Inside Bossie's Gym, Centurion",                           desc: "A look inside Bossie's Gym — weight training, cardio, functional and boxing areas in Hennopspark, Centurion." },
      '/about':      { title: "About Bossie's Gym — A Family-Run Studio in Centurion",              desc: "Small, family-run commercial gym in Centurion focused on real coaching and real community." },
      '/contact':    { title: "Contact Bossie's Gym — Hennopspark, Centurion",                      desc: "Visit Bossie's Gym at 1st Floor, 207 Edison Crescent, Hennopspark, Centurion. Call 072 482 7922 or WhatsApp us." },
      '/faq':        { title: "FAQ — Membership, Pricing & Policies | Bossie's Gym",                 desc: "Answers on free trials, day passes, joining fees, student discounts, sign-up and policies at Bossie's Gym, Centurion." },
    };

    // /community is a routed alias to /team, and /join is a routed alias to
    // /onboarding — surface the canonical route's meta so neither alias leaks
    // the homepage description or creates a duplicate, self-referencing canonical.
    const ALIASES = { '/community': '/team', '/join': '/onboarding' };
    const path = ALIASES[location.pathname] || location.pathname;
    const entry = meta[path] || meta['/'];
    const canonical = `${SITE_ORIGIN}${path === '/' ? '' : path}`;

    // Title + description
    document.title = entry.title;
    upsertMeta('meta[name="description"]', 'name', 'description', entry.desc);

    // Canonical — tells crawlers which URL is the source of truth even when
    // query strings (e.g. ?intent=join) are appended by CTAs.
    upsertLink('canonical', canonical);

    // Noindex — sign-up flows and internal tools should not appear in search results.
    const NOINDEX_ROUTES = new Set(['/onboarding', '/dashboard']);
    if (NOINDEX_ROUTES.has(path)) {
      upsertMeta('meta[name="robots"]', 'name', 'robots', 'noindex, nofollow');
    } else {
      const robotsEl = document.head.querySelector('meta[name="robots"]');
      if (robotsEl) robotsEl.remove();
    }

    // Open Graph — what a page looks like when shared on WhatsApp / Facebook.
    upsertMeta('meta[property="og:title"]',       'property', 'og:title',       entry.title);
    upsertMeta('meta[property="og:description"]', 'property', 'og:description', entry.desc);
    upsertMeta('meta[property="og:url"]',         'property', 'og:url',         canonical);
    upsertMeta('meta[property="og:type"]',        'property', 'og:type',        'website');
    upsertMeta('meta[property="og:image"]',        'property', 'og:image',        entry.image || DEFAULT_OG_IMAGE);
    upsertMeta('meta[property="og:image:width"]',  'property', 'og:image:width',  entry.imageWidth  || '796');
    upsertMeta('meta[property="og:image:height"]', 'property', 'og:image:height', entry.imageHeight || '800');

    // Twitter — large-image card; mirrors OG so X shares match WhatsApp shares.
    upsertMeta('meta[name="twitter:card"]',        'name', 'twitter:card',        'summary_large_image');
    upsertMeta('meta[name="twitter:title"]',       'name', 'twitter:title',       entry.title);
    upsertMeta('meta[name="twitter:description"]', 'name', 'twitter:description', entry.desc);
    upsertMeta('meta[name="twitter:image"]',       'name', 'twitter:image',       entry.image || DEFAULT_OG_IMAGE);
  }, [location.pathname]);

  return (
    <div className="relative flex min-h-screen flex-col bg-ink-950 text-ink-100">
      <a href="#main" className="skip-link">Skip to content</a>
      <ScrollToTop />
      <AnnouncementBar />
      <Header />
      <main id="main" className="flex-1">
        <Suspense fallback={null}>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Home />} />
            <Route path="/services" element={<Services />} />
            <Route path="/membership" element={<Membership />} />
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/join" element={<Onboarding />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/team" element={<Team />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/faq" element={<FAQ />} />
            {/* Keep /community alive as an alias to /team for anyone linking the old route */}
            <Route path="/community" element={<Team />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AnimatePresence>
        </Suspense>
      </main>
      <Footer />
      <StickyWhatsApp />
    </div>
  );
}

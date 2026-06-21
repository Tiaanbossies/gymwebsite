import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Menu, Phone } from 'lucide-react';

import Logo from './Logo.jsx';
import MobileNav from './MobileNav.jsx';
import Button from '../ui/Button.jsx';
import { site } from '../../lib/site.js';

// Nav items shown on desktop (we keep it compact — FAQ & Contact live in secondary UI)
// 'About' is intentionally omitted from the desktop bar — it stays in the footer,
// the mobile nav, and is still routable directly — so the primary conversion-path
// items (Services, Membership, Pricing, Team, Gallery, FAQ) have room to breathe
// alongside the Call + Join CTAs.
const DESKTOP_NAV = ['Home', 'Services', 'Membership', 'Pricing', 'Team', 'Gallery'];

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          scrolled
            ? 'border-b border-white/10 bg-ink-950/80 backdrop-blur-xl'
            : 'border-b border-transparent bg-transparent'
        }`}
      >
        <div className="container-x flex min-h-[4.5rem] items-center justify-between py-4 sm:py-5">
          <Logo />

          <nav aria-label="Primary" className="hidden lg:block">
            <ul className="flex items-center gap-5 xl:gap-6">
              {site.nav
                .filter((item) => DESKTOP_NAV.includes(item.label))
                .map((item) => (
                  <li key={item.to}>
                    <NavLink
                      to={item.to}
                      end={item.to === '/'}
                      className={({ isActive }) =>
                        `nav-link ${isActive ? 'nav-link-active' : ''}`
                      }
                    >
                      {item.label}
                    </NavLink>
                  </li>
                ))}
              <li>
                <NavLink
                  to="/faq"
                  className={({ isActive }) =>
                    `nav-link ${isActive ? 'nav-link-active' : ''}`
                  }
                >
                  FAQ
                </NavLink>
              </li>
            </ul>
          </nav>

          <div className="flex items-center gap-2">
            {/* Call CTA — Q17 "Call the Gym" was selected as a primary action.
                btn-compact keeps the phone pill to one line in the sticky header. */}
            <Button
              href={site.ctas.call.href}
              variant="ghost"
              className="hidden md:inline-flex btn-compact"
              iconNode={<Phone size={13} strokeWidth={2.5} />}
            >
              {site.phone.display}
            </Button>
            <Button to={site.ctas.join.to} className="hidden sm:inline-flex btn-compact">
              {site.ctas.join.label}
            </Button>

            <button
              onClick={() => setOpen(true)}
              className="lg:hidden rounded-full border border-white/10 bg-white/5 p-2.5 text-ink-200 hover:border-white/30 hover:text-white"
              aria-label="Open menu"
            >
              <Menu size={18} />
            </button>
          </div>
        </div>
      </header>

      <MobileNav open={open} onClose={() => setOpen(false)} />
    </>
  );
}

import { AnimatePresence, motion } from 'framer-motion';
import { NavLink } from 'react-router-dom';
import { X, Phone, MessageCircle } from 'lucide-react';
import { useEffect } from 'react';

import Button from '../ui/Button.jsx';
import Logo from './Logo.jsx';
import { site, waLink } from '../../lib/site.js';

export default function MobileNav({ open, onClose }) {
  // Lock body scroll when menu is open
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 lg:hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-ink-950/85 backdrop-blur-xl" onClick={onClose} />
          <motion.div
            className="absolute inset-x-0 top-0 bg-ink-900 border-b border-white/10 shadow-card"
            initial={{ y: -24, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -24, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
          >
            <div className="container-x flex items-center justify-between py-5">
              <Logo />
              <button
                onClick={onClose}
                className="rounded-full border border-white/10 bg-white/5 p-2 text-ink-200 hover:border-white/30 hover:text-white"
                aria-label="Close menu"
              >
                <X size={18} />
              </button>
            </div>
            <nav className="container-x pb-8">
              <ul className="flex flex-col divide-y divide-white/5 border-y border-white/5">
                {site.nav.map((item) => (
                  <li key={item.to}>
                    <NavLink
                      to={item.to}
                      onClick={onClose}
                      end={item.to === '/'}
                      className={({ isActive }) =>
                        `flex items-center justify-between py-4 text-lg font-medium uppercase tracking-[0.12em] ${
                          isActive ? 'text-brand-300' : 'text-ink-200 hover:text-white'
                        }`
                      }
                    >
                      {item.label}
                      <span className="text-ink-500">→</span>
                    </NavLink>
                  </li>
                ))}
              </ul>

              <div className="mt-8 flex flex-col gap-3">
                <Button to={site.ctas.join.to} className="w-full justify-center" onClick={onClose}>
                  {site.ctas.join.label}
                </Button>
                <Button
                  href={site.ctas.call.href}
                  variant="ghost"
                  className="w-full justify-center"
                  iconNode={<Phone size={14} strokeWidth={2.5} />}
                  onClick={onClose}
                >
                  Call {site.phone.display}
                </Button>
                <Button
                  href={waLink("Hi Bossie's Gym, I'd like to find out more about joining.")}
                  variant="whatsapp"
                  className="w-full justify-center"
                  iconNode={<MessageCircle size={14} strokeWidth={2.5} />}
                  onClick={onClose}
                >
                  WhatsApp Us
                </Button>
              </div>

              <p className="mt-6 text-center text-[11px] uppercase tracking-[0.22em] text-ink-500">
                {site.location.line1}, {site.location.city}
              </p>
            </nav>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

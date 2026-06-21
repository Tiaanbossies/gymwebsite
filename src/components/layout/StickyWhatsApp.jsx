import { MessageCircle } from 'lucide-react';
import { waLink } from '../../lib/site.js';

/**
 * StickyWhatsApp — floating click-to-chat button.
 * Q54 (How does someone sign up?) and Q78 (Where should enquiries go?)
 * both flag WhatsApp as a primary channel. This gives it a permanent,
 * high-conversion anchor on every page without dominating the layout.
 *
 * Honours iOS home-indicator safe area via `bottom-safe`, sits above the
 * footer on all viewports, and avoids overlapping primary CTAs by being
 * compact on phones (icon only) and pill-shaped on md+ (icon + label).
 */
export default function StickyWhatsApp() {
  return (
    <a
      href={waLink("Hi Bossie's Gym, I'm interested in joining. Can you share more info?")}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat with Bossie's Gym on WhatsApp"
      data-track="WhatsApp — Sticky"
      className="group fixed right-4 bottom-safe z-30 inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#25D366] text-[#05070d] shadow-card transition-transform duration-200 hover:scale-105 hover:bg-[#1ebb5a] active:scale-95 sm:right-6 sm:h-14 sm:w-14 md:w-auto md:gap-2 md:px-4"
    >
      <span
        aria-hidden="true"
        className="absolute inline-flex h-full w-full animate-pulseRing rounded-full bg-[#25D366]/60 motion-reduce:hidden"
      />
      <MessageCircle size={22} strokeWidth={2.5} className="relative" />
      <span className="relative hidden text-sm font-semibold md:inline">WhatsApp</span>
      <span className="sr-only">Chat with us on WhatsApp</span>
    </a>
  );
}

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, X } from 'lucide-react';

import { site } from '../../lib/site.js';

/**
 * AnnouncementBar — surfaces the Free Trial offer (Q52) in a highly
 * visible spot without being loud. Appears above the header.
 *
 * Dismiss preference persists in sessionStorage so it stays out of the way
 * for the rest of the visit but reappears for new sessions / repeat visits.
 */
const STORAGE_KEY = 'bg.announcementBar.dismissed.v1';

export default function AnnouncementBar() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    try {
      const dismissed = window.sessionStorage.getItem(STORAGE_KEY);
      if (dismissed === '1') setVisible(false);
    } catch {
      /* ignore — sessionStorage may be unavailable in private modes */
    }
  }, []);

  const dismiss = () => {
    setVisible(false);
    try {
      window.sessionStorage.setItem(STORAGE_KEY, '1');
    } catch {
      /* ignore */
    }
  };

  if (!visible) return null;

  return (
    <div className="relative isolate border-b border-white/5 bg-gradient-to-r from-brand-600/30 via-ink-900 to-accent-600/30">
      <div className="container-x flex flex-wrap items-center justify-center gap-x-3 gap-y-1 py-2 pr-10 text-center text-[11px] font-medium text-ink-100 sm:text-[13px]">
        <span className="inline-flex items-center gap-1.5 text-brand-200">
          <Sparkles size={13} strokeWidth={2.5} />
          Free Trial available
        </span>
        <span className="hidden text-ink-500 sm:inline">·</span>
        <span className="text-ink-300">
          Come try {site.name} before you commit —{' '}
          <Link
            to={site.ctas.trial.to}
            className="font-semibold text-white underline decoration-accent-400/60 decoration-2 underline-offset-4 hover:decoration-accent-300"
          >
            book your trial
          </Link>
        </span>
      </div>
      <button
        type="button"
        onClick={dismiss}
        aria-label="Dismiss announcement"
        className="absolute right-2 top-1/2 -translate-y-1/2 inline-flex h-7 w-7 items-center justify-center rounded-full text-ink-300 transition-colors hover:bg-white/10 hover:text-white sm:right-3"
      >
        <X size={14} strokeWidth={2.5} />
      </button>
    </div>
  );
}

import { Link } from 'react-router-dom';

/**
 * Bossie's Gym brand mark.
 *
 * Uses the crest-only PNG (`/logo-mark.png`) for the header / inline use —
 * the full logo wordmark becomes unreadable below ~80px. The text wordmark
 * sits alongside it so "BOSSIE'S GYM" remains scannable at every size.
 *
 * Header passes `compact` to render the crest only (mobile / tight bars).
 *
 * PNG sources in /public:
 *   • /logo-mark.png — 192px crest only (header / inline)
 *   • /logo-sm.png   — 256px full logo (mid surfaces)
 *   • /logo.png      — 800px full logo (OG card / footer hero)
 */
export default function Logo({ compact = false, className = '' }) {
  return (
    <Link
      to="/"
      aria-label="Bossie's Gym — home"
      className={`group inline-flex items-center gap-3 ${className}`}
    >
      <img
        src="/logo-mark.png"
        alt=""
        aria-hidden="true"
        width={44}
        height={44}
        className="h-10 w-10 shrink-0 transition-transform duration-300 group-hover:-rotate-3 sm:h-11 sm:w-11 drop-shadow-[0_4px_18px_rgba(220,43,56,0.35)]"
        loading="eager"
        decoding="async"
      />
      {!compact && (
        <span className="flex flex-col leading-none">
          <span className="font-display text-base tracking-headline text-white">BOSSIE'S GYM</span>
          <span className="mt-1 text-[10px] font-medium uppercase tracking-[0.22em] text-ink-400">
            Centurion · Personal Training
          </span>
        </span>
      )}
    </Link>
  );
}

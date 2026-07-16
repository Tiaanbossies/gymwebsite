import { useEffect, useMemo, useRef } from 'react';
import anime from 'animejs';

/**
 * useCountUp — animates a "R450"-style display string from 0 up to its
 * numeric value the first time the returned ref enters the viewport.
 *
 * Parses one leading numeric run out of `value` (formatted with thousands
 * separators via `toLocaleString`) and tweens it with Anime.js `easeOutExpo`,
 * matching the pattern already used by HeroHome's stat cards. Any text
 * before/after the number (e.g. "From R", "/ month") is preserved as-is.
 *
 * Non-numeric values (or `disabled`) render as static text — no ref wiring,
 * no observer.
 */
export function useCountUp(value, { duration = 1400, disabled = false } = {}) {
  const ref = useRef(null);
  const parsed = useMemo(() => parseNumericValue(value), [value]);

  useEffect(() => {
    const el = ref.current;
    if (!el || !parsed || disabled) return;

    const obj = { val: 0 };
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        anime({
          targets: obj,
          val: parsed.num,
          round: 1,
          duration,
          easing: 'easeOutExpo',
          update() {
            el.textContent = `${parsed.before}${obj.val.toLocaleString('en-ZA')}${parsed.after}`;
          },
        });
      },
      { threshold: 0.5 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [parsed, duration, disabled]);

  return ref;
}

function parseNumericValue(raw) {
  if (typeof raw !== 'string') return null;
  const match = raw.match(/^(.*?)([\d,]+)(.*)$/);
  if (!match) return null;
  return {
    before: match[1],
    num: parseInt(match[2].replace(/,/g, ''), 10),
    after: match[3],
  };
}

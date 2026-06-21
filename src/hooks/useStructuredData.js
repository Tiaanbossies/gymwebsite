import { useEffect } from 'react';

/**
 * Injects a JSON-LD <script> into <head> on mount and removes it on unmount.
 * Safe for SPA navigation — each page gets its own schema, cleaned up on route change.
 *
 * Pass a stable reference (useMemo at the call site) to avoid removing and
 * re-injecting the script tag on every render.
 */
export function useStructuredData(data) {
  useEffect(() => {
    if (!data) return;
    const script = document.createElement('script');
    script.setAttribute('type', 'application/ld+json');
    script.textContent = JSON.stringify(data);
    document.head.appendChild(script);
    return () => {
      if (document.head.contains(script)) document.head.removeChild(script);
    };
  }, [data]);
}

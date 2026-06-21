import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { initTracker, trackPageView } from '../lib/tracker.js';

export function useTracker() {
  const location = useLocation();
  const inited = useRef(false);

  useEffect(() => {
    if (!inited.current) {
      initTracker();
      inited.current = true;
    }
  }, []);

  useEffect(() => {
    if (location.pathname === '/dashboard') return;
    trackPageView(location.pathname);
  }, [location.pathname]);
}

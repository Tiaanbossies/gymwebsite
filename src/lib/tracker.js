import { createClient } from '@supabase/supabase-js';

let client = null;
let sessionId = null;
let listenersAttached = false;
let firedMilestones = new Set();

// Pending page view — held in memory until the user navigates away or the tab
// hides, at which point we INSERT once with duration_ms already calculated.
// This eliminates the need for a Supabase UPDATE and the RLS UPDATE policy.
let pending = null; // { id, page, sessionId, device, geo, enteredAt }
let currentPath = null;
let lastGeo = { country: null, city: null };

const SESSION_TIMEOUT_MS = 30 * 60 * 1000;

function refreshSession() {
  const now = Date.now();
  const existing = localStorage.getItem('_gym_sid');
  const expiry = parseInt(localStorage.getItem('_gym_sid_exp') || '0', 10);

  if (existing && expiry > now) {
    localStorage.setItem('_gym_sid_exp', String(now + SESSION_TIMEOUT_MS));
    return existing;
  }

  const id = crypto.randomUUID();
  localStorage.setItem('_gym_sid', id);
  localStorage.setItem('_gym_sid_exp', String(now + SESSION_TIMEOUT_MS));
  return id;
}

let geoPromise = null;

function getClient() {
  if (!client) {
    client = createClient(
      import.meta.env.VITE_SUPABASE_URL,
      import.meta.env.VITE_SUPABASE_ANON_KEY,
    );
  }
  return client;
}

function detectDevice() {
  const ua = navigator.userAgent;
  if (!/Mobi|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua)) return 'desktop';
  if (/iPad/i.test(ua) || (navigator.maxTouchPoints > 1 && !/Mobile/i.test(ua))) return 'tablet';
  return 'mobile';
}

function throttle(fn, ms) {
  let last = 0;
  return (...args) => {
    const now = Date.now();
    if (now - last >= ms) { last = now; fn(...args); }
  };
}

// INSERT the pending page view with duration computed at call time.
async function commitPending() {
  if (!pending) return;
  const snap = pending;
  pending = null;
  const durationMs = Date.now() - snap.enteredAt;
  const { error } = await getClient()
    .from('page_views')
    .insert({
      id: snap.id,
      session_id: snap.sessionId,
      page: snap.page,
      entered_at: new Date(snap.enteredAt).toISOString(),
      duration_ms: durationMs > 0 ? durationMs : null,
      device: snap.device,
      country: snap.geo.country,
      city: snap.geo.city,
    });
  if (error) console.error('[tracker] page view commit failed:', error.message);
}

function handleVisibilityChange() {
  if (document.visibilityState === 'hidden') {
    commitPending();
  } else {
    // Tab visible again — restart timing for the current page so hidden time
    // is not counted toward duration.
    if (currentPath && sessionId) {
      pending = {
        id: crypto.randomUUID(),
        page: currentPath,
        sessionId,
        device: detectDevice(),
        geo: lastGeo,
        enteredAt: Date.now(),
      };
    }
  }
}

export function initTracker() {
  sessionId = refreshSession();

  geoPromise = fetch('/api/geo')
    .then((r) => r.json())
    .then((d) => ({ country: d.country || null, city: d.city || null }))
    .catch(() => ({ country: null, city: null }));

  if (listenersAttached) return;
  listenersAttached = true;

  document.addEventListener('visibilitychange', handleVisibilityChange);
  window.addEventListener('beforeunload', commitPending);

  const MILESTONES = [25, 50, 75, 90];
  window.addEventListener('scroll', throttle(() => {
    const el = document.documentElement;
    const pct = ((window.scrollY + window.innerHeight) / el.scrollHeight) * 100;
    for (const m of MILESTONES) {
      if (!firedMilestones.has(m) && pct >= m) {
        firedMilestones.add(m);
        trackEvent('scroll_depth', `${m}%`, window.location.pathname);
      }
    }
  }, 300), { passive: true });

  document.addEventListener('click', (e) => {
    const target = e.target.closest('[data-track]');
    if (!target) return;
    const label = target.dataset.track || target.textContent.trim().slice(0, 60);
    trackEvent('click', label, window.location.pathname);
  });
}

export async function trackPageView(pathname) {
  currentPath = pathname;
  sessionId = refreshSession();

  // Commit the previous page view with its duration before recording the new one.
  await commitPending();

  firedMilestones = new Set();

  const geo = await geoPromise;
  lastGeo = geo;

  pending = {
    id: crypto.randomUUID(),
    page: pathname,
    sessionId,
    device: detectDevice(),
    geo,
    enteredAt: Date.now(),
  };
}

export function trackEvent(eventType, label, pathname) {
  getClient()
    .from('events')
    .insert({ session_id: sessionId, page: pathname, event_type: eventType, label })
    .then(({ error }) => {
      if (error) console.error('[tracker] event insert failed:', error.message);
    });
}

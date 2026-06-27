import { createClient } from '@supabase/supabase-js';

let client = null;
let sessionId = null;
let currentViewId = null;
let enteredAt = null;
let firedMilestones = new Set();
let listenersAttached = false;

// Sessions expire after 30 minutes of inactivity, matching the standard
// analytics session model. Using localStorage (not sessionStorage) so that
// the same person browsing across multiple tabs shares one session — each new
// sessionStorage tab was creating its own session, fragmenting Sankey data.
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

// Stored as a Promise so trackPageView can await it — avoids the race condition
// where the first page view is inserted before the geo response arrives.
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

export async function flushDuration() {
  if (!currentViewId) return;
  const id = currentViewId;
  const ms = Date.now() - enteredAt;
  currentViewId = null;
  await getClient().from('page_views').update({ duration_ms: ms }).eq('id', id);
}

function handleVisibilityChange() {
  if (document.visibilityState === 'hidden') {
    flushDuration();
  } else {
    enteredAt = Date.now();
  }
}

export function initTracker() {
  sessionId = refreshSession();

  // Geo is resolved server-side via /api/geo — the server reads the visitor's
  // real IP from the X-Real-IP header set by nginx, then calls ipwho.is.
  // This avoids ad blockers, CORS issues, and external-domain fetch failures.
  geoPromise = fetch('/api/geo')
    .then((r) => r.json())
    .then((d) => ({ country: d.country || null, city: d.city || null }))
    .catch(() => ({ country: null, city: null }));

  if (listenersAttached) return;
  listenersAttached = true;

  document.addEventListener('visibilitychange', handleVisibilityChange);
  window.addEventListener('beforeunload', flushDuration);

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
  sessionId = refreshSession();
  await flushDuration();
  firedMilestones = new Set();
  enteredAt = Date.now();

  // Await geo — resolves in ~100–400ms, ensuring city/country are always set.
  const geo = await geoPromise;

  // Generate the id client-side instead of reading it back via .select().single():
  // anon has no SELECT policy on page_views (intentionally — see
  // 20260621000000_analytics_restrict_anon_select.sql), and under RLS an
  // INSERT ... RETURNING is evaluated against the SELECT policy. Without one,
  // every insert was rejected outright with "new row violates row-level
  // security policy", which silently broke all page-view tracking.
  const id = crypto.randomUUID();
  const { error } = await getClient()
    .from('page_views')
    .insert({
      id,
      session_id: sessionId,
      page: pathname,
      entered_at: new Date().toISOString(),
      device: detectDevice(),
      country: geo.country,
      city: geo.city,
    });

  if (!error) currentViewId = id;
}

export function trackEvent(eventType, label, pathname) {
  getClient()
    .from('events')
    .insert({ session_id: sessionId, page: pathname, event_type: eventType, label })
    .then(({ error }) => {
      if (error) console.error('[tracker] event insert failed:', error.message);
    });
}

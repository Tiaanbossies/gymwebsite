import { createClient } from '@supabase/supabase-js';

let client = null;
let sessionId = null;
let currentViewId = null;
let enteredAt = null;
let firedMilestones = new Set();
let listenersAttached = false;

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
  sessionId = sessionStorage.getItem('_gym_sid');
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    sessionStorage.setItem('_gym_sid', sessionId);
  }

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
  await flushDuration();
  firedMilestones = new Set();
  enteredAt = Date.now();

  // Await geo — resolves in ~100–400ms, ensuring city/country are always set.
  const geo = await geoPromise;

  const { data, error } = await getClient()
    .from('page_views')
    .insert({
      session_id: sessionId,
      page: pathname,
      entered_at: new Date().toISOString(),
      country: geo.country,
      city: geo.city,
    })
    .select('id')
    .single();

  if (!error && data) currentViewId = data.id;
}

export function trackEvent(eventType, label, pathname) {
  getClient().from('events').insert({
    session_id: sessionId,
    page: pathname,
    event_type: eventType,
    label,
  });
}

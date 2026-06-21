import { useState, useEffect, useCallback } from 'react';

import PagePose from '../components/ui/PagePose.jsx';
import Container from '../components/ui/Container.jsx';
import StatCard from '../components/dashboard/StatCard.jsx';
import LineChart from '../components/dashboard/LineChart.jsx';
import DashboardLogin from '../components/dashboard/DashboardLogin.jsx';

// ─── Helpers ─────────────────────────────────────────────────────────────────
function rangeStart(days) {
  return new Date(Date.now() - days * 86_400_000).toISOString();
}

function fmtDuration(ms) {
  if (!ms || ms < 0) return '—';
  const s = Math.round(ms / 1000);
  const m = Math.floor(s / 60);
  return m > 0 ? `${m}m ${s % 60}s` : `${s}s`;
}

function groupBy(arr, key) {
  return arr.reduce((acc, item) => {
    const k = item[key];
    acc[k] = (acc[k] || 0) + 1;
    return acc;
  }, {});
}

function groupAvg(arr, groupKey, valueKey) {
  const counts = {};
  const sums = {};
  for (const item of arr) {
    const k = item[groupKey];
    counts[k] = (counts[k] || 0) + 1;
    sums[k] = (sums[k] || 0) + (item[valueKey] || 0);
  }
  return Object.entries(sums).map(([k, sum]) => ({
    page: k,
    avg: sum / counts[k],
    sessions: counts[k],
  }));
}

function fmtDateTime(iso) {
  if (!iso) return '—';
  const d = new Date(iso);
  const date = d.toLocaleDateString('en-ZA', { day: '2-digit', month: 'short', year: 'numeric' });
  const time = d.toLocaleTimeString('en-ZA', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
  return `${date} ${time}`;
}

function allDatesInRange(days) {
  const out = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(Date.now() - i * 86_400_000);
    out.push(d.toISOString().slice(0, 10));
  }
  return out;
}

// ─── ProtectedDashboard ───────────────────────────────────────────────────────
// Auth lives server-side now (server.mjs `/api/dashboard/*`) — the passphrase
// is never bundled to the client and analytics data is fetched with the
// Supabase service_role key, not the public anon key.
function ProtectedDashboard({ children }) {
  const [authed, setAuthed] = useState(null); // null = checking
  const [pass, setPass] = useState('');
  const [error, setError] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetch('/api/dashboard/session', { credentials: 'include' })
      .then((r) => setAuthed(r.ok))
      .catch(() => setAuthed(false));
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError(false);
    try {
      const res = await fetch('/api/dashboard/login', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: pass }),
      });
      if (res.ok) {
        setAuthed(true);
      } else {
        setError(true);
        setPass('');
      }
    } catch {
      setError(true);
    } finally {
      setSubmitting(false);
    }
  }

  if (authed === null) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <p className="text-ink-400 text-sm">Checking session…</p>
      </div>
    );
  }
  if (!authed) {
    return (
      <DashboardLogin
        onSubmit={handleSubmit}
        pass={pass}
        setPass={setPass}
        error={error}
        submitting={submitting}
      />
    );
  }
  return children;
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────
const RANGES = [
  { label: '7 days', days: 7 },
  { label: '30 days', days: 30 },
  { label: '90 days', days: 90 },
];

export default function Dashboard() {
  const [range, setRange] = useState(30);
  const [loading, setLoading] = useState(true);
  const [views, setViews] = useState([]);
  const [events, setEvents] = useState([]);

  const load = useCallback(async () => {
    setLoading(true);
    const start = rangeStart(range);

    const res = await fetch(`/api/dashboard/data?start=${encodeURIComponent(start)}`, {
      credentials: 'include',
    });

    if (res.status === 401) {
      // Session expired — reload to fall back to the login screen.
      window.location.reload();
      return;
    }

    const { views: pvData, events: evData } = res.ok
      ? await res.json()
      : { views: [], events: [] };

    setViews(pvData || []);
    setEvents(evData || []);
    setLoading(false);
  }, [range]);

  useEffect(() => { load(); }, [load]);

  function handleLogout() {
    fetch('/api/dashboard/logout', { method: 'POST', credentials: 'include' }).finally(() => {
      window.location.reload();
    });
  }

  // ── Derived stats — ordered so every variable is declared before use ────────
  const totalViews = views.length;
  const uniqueSessions = new Set(views.map((v) => v.session_id)).size;
  const durViews = views.filter((v) => v.duration_ms != null);
  const avgDuration = durViews.length
    ? durViews.reduce((s, v) => s + v.duration_ms, 0) / durViews.length
    : null;
  const totalEvents = events.length;

  // Click events (needed by several sections below)
  const clicks = events.filter((e) => e.event_type === 'click');
  const clickGroups = groupBy(clicks, 'label');
  const topClicks = Object.entries(clickGroups).sort(([, a], [, b]) => b - a).slice(0, 15);

  // Page groups (needed by views-per-page series below)
  const pageGroups = groupBy(views, 'page');
  const topPages = Object.entries(pageGroups).sort(([, a], [, b]) => b - a).slice(0, 10);

  // Shared date axis
  const dates = allDatesInRange(range);

  // Views over time
  const viewsByDayMap = views.reduce((acc, v) => {
    const d = v.entered_at.slice(0, 10);
    acc[d] = (acc[d] || 0) + 1;
    return acc;
  }, {});
  const viewsOverTime = dates.map((date) => ({ date, count: viewsByDayMap[date] || 0 }));

  // Clicks over time
  const clicksByDayMap = clicks.reduce((acc, e) => {
    const d = e.created_at.slice(0, 10);
    acc[d] = (acc[d] || 0) + 1;
    return acc;
  }, {});
  const clicksOverTime = dates.map((date) => ({ date, count: clicksByDayMap[date] || 0 }));

  // Views per page over time — top 5 pages as separate series
  const PAGE_COLORS = ['#dc2b38', '#3d6479', '#22c55e', '#eab308', '#a855f7'];
  const top5Pages = Object.entries(pageGroups).sort(([, a], [, b]) => b - a).slice(0, 5).map(([p]) => p);
  const viewsByPageDay = views.reduce((acc, v) => {
    const d = v.entered_at.slice(0, 10);
    if (!acc[v.page]) acc[v.page] = {};
    acc[v.page][d] = (acc[v.page][d] || 0) + 1;
    return acc;
  }, {});
  const viewsPerPageSeries = top5Pages.map((page, i) => ({
    label: page,
    color: PAGE_COLORS[i],
    data: dates.map((date) => ({ date, count: viewsByPageDay[page]?.[date] || 0 })),
  }));

  // Avg time on page
  const avgByPage = groupAvg(durViews, 'page', 'duration_ms')
    .sort((a, b) => b.sessions - a.sessions)
    .slice(0, 10);

  // Scroll depth
  const scrollEvents = events.filter((e) => e.event_type === 'scroll_depth');
  const scrollGroups = groupBy(scrollEvents, 'label');
  const scrollMilestones = ['25%', '50%', '75%', '90%'].map((m) => ({
    label: m,
    count: scrollGroups[m] || 0,
  }));
  const scrollMax = Math.max(...scrollMilestones.map((s) => s.count), 1);

  // WhatsApp vs Call
  const waClicks = clicks.filter((e) => e.label?.startsWith('WhatsApp')).length;
  const callClicks = clicks.filter((e) => e.label?.startsWith('Call')).length;
  const waVsCallMax = Math.max(waClicks, callClicks, 1);

  // Geo breakdown
  const cityGroups = groupBy(views.filter((v) => v.city), 'city');
  const topCities = Object.entries(cityGroups).sort(([, a], [, b]) => b - a).slice(0, 10);
  const countryGroups = groupBy(views.filter((v) => v.country), 'country');
  const topCountries = Object.entries(countryGroups).sort(([, a], [, b]) => b - a).slice(0, 5);

  // Student membership clicks
  const studentClicks = clicks.filter((e) => e.label?.includes('Student')).length;

  // Day pass inquiries
  const dayPassClicks = clicks.filter((e) => e.label?.includes('Day Pass')).length;

  // Recent activity feed — last 100 entries across page views and events, newest first
  const recentActivity = [
    ...views.map((v) => ({
      type: 'view',
      time: v.entered_at,
      page: v.page,
      label: null,
      duration: v.duration_ms,
      city: v.city,
      country: v.country,
      session: v.session_id?.slice(0, 8),
    })),
    ...events.map((e) => ({
      type: e.event_type,
      time: e.created_at,
      page: e.page,
      label: e.label,
      duration: null,
      city: null,
      country: null,
      session: e.session_id?.slice(0, 8),
    })),
  ]
    .sort((a, b) => new Date(b.time) - new Date(a.time))
    .slice(0, 100);

  return (
    <PagePose>
      <ProtectedDashboard>
        <section className="section">
          <Container>

            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between mb-10">
              <div>
                <span className="eyebrow">Analytics</span>
                <h1 className="mt-2 display-2 text-white">Dashboard</h1>
              </div>
              <div className="flex gap-2">
                {RANGES.map(({ label, days }) => (
                  <button
                    key={days}
                    onClick={() => setRange(days)}
                    className={`btn text-sm px-4 py-2 rounded-full transition-colors ${
                      range === days ? 'btn-primary' : 'btn-ghost'
                    }`}
                  >
                    {label}
                  </button>
                ))}
                <button
                  onClick={handleLogout}
                  className="btn btn-ghost text-sm px-4 py-2 rounded-full text-ink-400 hover:text-white transition-colors"
                >
                  Log out
                </button>
              </div>
            </div>

            {loading ? (
              <p className="text-ink-400 text-sm">Loading…</p>
            ) : (
              <div className="flex flex-col gap-10">

                {/* Stat cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <StatCard label="Page Views" value={totalViews.toLocaleString()} />
                  <StatCard label="Unique Sessions" value={uniqueSessions.toLocaleString()} />
                  <StatCard
                    label="Avg Time on Page"
                    value={fmtDuration(avgDuration)}
                    sub="excluding bounces"
                  />
                  <StatCard label="Total Events" value={totalEvents.toLocaleString()} />
                </div>

                {/* Views over time */}
                <div className="card-surface rounded-2xl p-6">
                  <span className="eyebrow text-[10px]">Page Views Over Time</span>
                  <div className="mt-4">
                    <LineChart
                      series={[{ label: 'Views', color: '#dc2b38', data: viewsOverTime }]}
                      dates={dates}
                    />
                  </div>
                </div>

                {/* Clicks over time */}
                <div className="card-surface rounded-2xl p-6">
                  <span className="eyebrow text-[10px]">Clicks Over Time</span>
                  <div className="mt-4">
                    <LineChart
                      series={[{ label: 'Clicks', color: '#3d6479', data: clicksOverTime }]}
                      dates={dates}
                    />
                  </div>
                </div>

                {/* Views per page over time */}
                <div className="card-surface rounded-2xl p-6">
                  <span className="eyebrow text-[10px]">Views per Page Over Time</span>
                  <p className="text-xs text-ink-500 mt-1">Top {top5Pages.length} pages</p>
                  <div className="mt-4">
                    <LineChart
                      series={viewsPerPageSeries}
                      dates={dates}
                      height={220}
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">

                  {/* Top pages */}
                  <div className="card-surface rounded-2xl p-6">
                    <span className="eyebrow text-[10px]">Top Pages</span>
                    <table className="mt-4 w-full text-sm">
                      <thead>
                        <tr className="text-left text-ink-500 text-xs border-b border-white/10">
                          <th className="pb-2 font-medium">Page</th>
                          <th className="pb-2 font-medium text-right">Views</th>
                        </tr>
                      </thead>
                      <tbody>
                        {topPages.length ? topPages.map(([page, count]) => (
                          <tr key={page} className="border-b border-white/5 last:border-0">
                            <td className="py-2 text-ink-200 font-mono text-xs truncate max-w-[180px]">{page}</td>
                            <td className="py-2 text-right text-white">{count}</td>
                          </tr>
                        )) : (
                          <tr><td colSpan={2} className="py-4 text-ink-500 text-xs">No data yet.</td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/* Avg time on page */}
                  <div className="card-surface rounded-2xl p-6">
                    <span className="eyebrow text-[10px]">Avg Time on Page</span>
                    <table className="mt-4 w-full text-sm">
                      <thead>
                        <tr className="text-left text-ink-500 text-xs border-b border-white/10">
                          <th className="pb-2 font-medium">Page</th>
                          <th className="pb-2 font-medium text-right">Avg Time</th>
                          <th className="pb-2 font-medium text-right">Sessions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {avgByPage.length ? avgByPage.map((row) => (
                          <tr key={row.page} className="border-b border-white/5 last:border-0">
                            <td className="py-2 text-ink-200 font-mono text-xs truncate max-w-[140px]">{row.page}</td>
                            <td className="py-2 text-right text-white">{fmtDuration(row.avg)}</td>
                            <td className="py-2 text-right text-ink-400">{row.sessions}</td>
                          </tr>
                        )) : (
                          <tr><td colSpan={3} className="py-4 text-ink-500 text-xs">No data yet.</td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/* Click events */}
                  <div className="card-surface rounded-2xl p-6">
                    <span className="eyebrow text-[10px]">Click Events</span>
                    <table className="mt-4 w-full text-sm">
                      <thead>
                        <tr className="text-left text-ink-500 text-xs border-b border-white/10">
                          <th className="pb-2 font-medium">CTA</th>
                          <th className="pb-2 font-medium text-right">Clicks</th>
                        </tr>
                      </thead>
                      <tbody>
                        {topClicks.length ? topClicks.map(([label, count]) => (
                          <tr key={label} className="border-b border-white/5 last:border-0">
                            <td className="py-2 text-ink-200 text-xs">{label}</td>
                            <td className="py-2 text-right text-white">{count}</td>
                          </tr>
                        )) : (
                          <tr><td colSpan={2} className="py-4 text-ink-500 text-xs">No clicks tracked yet.</td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/* Scroll depth funnel */}
                  <div className="card-surface rounded-2xl p-6">
                    <span className="eyebrow text-[10px]">Scroll Depth Funnel</span>
                    <div className="mt-4 flex flex-col gap-3">
                      {scrollMilestones.map(({ label, count }) => (
                        <div key={label} className="flex items-center gap-3">
                          <span className="text-xs text-ink-400 w-8">{label}</span>
                          <div className="flex-1 h-5 bg-ink-800 rounded overflow-hidden">
                            <div
                              className="h-full bg-accent-500 rounded transition-all"
                              style={{ width: `${(count / scrollMax) * 100}%` }}
                            />
                          </div>
                          <span className="text-xs text-white w-8 text-right">{count}</span>
                        </div>
                      ))}
                      {scrollMilestones.every((s) => s.count === 0) && (
                        <p className="text-ink-500 text-xs">No scroll data yet.</p>
                      )}
                    </div>
                  </div>

                </div>

            {/* ── Business Insights ─────────────────────────────────────── */}
            <div>
              <h2 className="eyebrow text-[10px]">Business Insights</h2>
              <div className="mt-4 grid md:grid-cols-2 gap-6">

                {/* WhatsApp vs Call */}
                <div className="card-surface rounded-2xl p-6">
                  <span className="eyebrow text-[10px]">WhatsApp vs. Call Clicks</span>
                  <p className="mt-1 text-xs text-ink-500">Dictates whether to prioritise the phone desk or WhatsApp line</p>
                  <div className="mt-5 flex flex-col gap-4">
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-[#25D366] font-semibold">WhatsApp</span>
                        <span className="text-white">{waClicks}</span>
                      </div>
                      <div className="h-5 bg-ink-800 rounded overflow-hidden">
                        <div className="h-full bg-[#25D366] rounded transition-all" style={{ width: `${(waClicks / waVsCallMax) * 100}%` }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-accent-300 font-semibold">Phone Call</span>
                        <span className="text-white">{callClicks}</span>
                      </div>
                      <div className="h-5 bg-ink-800 rounded overflow-hidden">
                        <div className="h-full bg-accent-500 rounded transition-all" style={{ width: `${(callClicks / waVsCallMax) * 100}%` }} />
                      </div>
                    </div>
                    {waClicks + callClicks > 0 && (
                      <p className="text-xs text-ink-400 mt-1">
                        {waClicks > callClicks
                          ? `WhatsApp preferred — ${Math.round((waClicks / (waClicks + callClicks)) * 100)}% of contact clicks`
                          : callClicks > waClicks
                          ? `Phone preferred — ${Math.round((callClicks / (waClicks + callClicks)) * 100)}% of contact clicks`
                          : 'Even split between WhatsApp and phone'}
                      </p>
                    )}
                  </div>
                </div>

                {/* Student + Day Pass */}
                <div className="card-surface rounded-2xl p-6 flex flex-col gap-6">
                  <div>
                    <span className="eyebrow text-[10px]">Student Membership Clicks</span>
                    <p className="mt-1 text-xs text-ink-500">Validates demand for the R250/month student rate</p>
                    <p className="mt-3 font-display text-4xl tracking-headline text-white">{studentClicks}</p>
                    <p className="text-xs text-ink-400 mt-1">WhatsApp student card clicks in this period</p>
                  </div>
                  <div className="border-t border-white/10 pt-5">
                    <span className="eyebrow text-[10px]">Day Pass Inquiries</span>
                    <p className="mt-1 text-xs text-ink-500">Seasonal or out-of-town interest in the R100 drop-in</p>
                    <p className="mt-3 font-display text-4xl tracking-headline text-white">{dayPassClicks}</p>
                    <p className="text-xs text-ink-400 mt-1">Day pass CTA clicks in this period</p>
                  </div>
                </div>

                {/* Local Traffic — Cities */}
                <div className="card-surface rounded-2xl p-6">
                  <span className="eyebrow text-[10px]">Local Traffic — Top Cities</span>
                  <p className="mt-1 text-xs text-ink-500">Confirms if local SEO is hitting Centurion &amp; Midstream</p>
                  <table className="mt-4 w-full text-sm">
                    <thead>
                      <tr className="text-left text-ink-500 text-xs border-b border-white/10">
                        <th className="pb-2 font-medium">City</th>
                        <th className="pb-2 font-medium text-right">Sessions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {topCities.length ? topCities.map(([city, count]) => (
                        <tr key={city} className="border-b border-white/5 last:border-0">
                          <td className="py-2 text-ink-200 text-xs">{city}</td>
                          <td className="py-2 text-right text-white">{count}</td>
                        </tr>
                      )) : (
                        <tr><td colSpan={2} className="py-4 text-ink-500 text-xs">No geo data yet — new sessions will include location.</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Local Traffic — Countries */}
                <div className="card-surface rounded-2xl p-6">
                  <span className="eyebrow text-[10px]">Local Traffic — Countries</span>
                  <p className="mt-1 text-xs text-ink-500">South Africa vs. international traffic split</p>
                  <div className="mt-4 flex flex-col gap-3">
                    {topCountries.length ? (() => {
                      const countryMax = Math.max(...topCountries.map(([, c]) => c), 1);
                      return topCountries.map(([country, count]) => (
                        <div key={country} className="flex items-center gap-3">
                          <span className="text-xs text-ink-400 w-28 truncate">{country}</span>
                          <div className="flex-1 h-4 bg-ink-800 rounded overflow-hidden">
                            <div className="h-full bg-brand-500 rounded" style={{ width: `${(count / countryMax) * 100}%` }} />
                          </div>
                          <span className="text-xs text-white w-6 text-right">{count}</span>
                        </div>
                      ));
                    })() : (
                      <p className="text-ink-500 text-xs">No geo data yet.</p>
                    )}
                  </div>
                </div>

              </div>
            </div>

            {/* ── Recent Activity ───────────────────────────────────────── */}
            <div>
              <h2 className="eyebrow text-[10px]">Recent Activity</h2>
              <p className="mt-1 text-xs text-ink-500">Last 100 entries — page views, clicks and scroll events, newest first</p>
              <div className="mt-4 card-surface rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="text-left text-ink-500 border-b border-white/10 bg-white/[0.02]">
                        <th className="px-4 py-3 font-medium whitespace-nowrap">Time</th>
                        <th className="px-4 py-3 font-medium">Type</th>
                        <th className="px-4 py-3 font-medium">Page</th>
                        <th className="px-4 py-3 font-medium">Detail</th>
                        <th className="px-4 py-3 font-medium whitespace-nowrap">Duration</th>
                        <th className="px-4 py-3 font-medium">City</th>
                        <th className="px-4 py-3 font-medium">Country</th>
                        <th className="px-4 py-3 font-medium">Session</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentActivity.length ? recentActivity.map((row, i) => (
                        <tr key={i} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors">
                          <td className="px-4 py-2.5 text-ink-400 whitespace-nowrap font-mono">{fmtDateTime(row.time)}</td>
                          <td className="px-4 py-2.5 whitespace-nowrap">
                            {row.type === 'view' && <span className="inline-flex items-center rounded-full bg-brand-500/15 text-brand-300 px-2 py-0.5 text-[10px] font-semibold">Page View</span>}
                            {row.type === 'click' && <span className="inline-flex items-center rounded-full bg-accent-500/15 text-accent-300 px-2 py-0.5 text-[10px] font-semibold">Click</span>}
                            {row.type === 'scroll_depth' && <span className="inline-flex items-center rounded-full bg-white/10 text-ink-300 px-2 py-0.5 text-[10px] font-semibold">Scroll</span>}
                          </td>
                          <td className="px-4 py-2.5 text-ink-200 font-mono max-w-[140px] truncate">{row.page}</td>
                          <td className="px-4 py-2.5 text-ink-300 max-w-[160px] truncate">{row.label || '—'}</td>
                          <td className="px-4 py-2.5 text-ink-400 whitespace-nowrap">{row.duration != null ? fmtDuration(row.duration) : '—'}</td>
                          <td className="px-4 py-2.5 text-ink-300 whitespace-nowrap">{row.city || '—'}</td>
                          <td className="px-4 py-2.5 text-ink-300 whitespace-nowrap">{row.country || '—'}</td>
                          <td className="px-4 py-2.5 text-ink-500 font-mono">{row.session}…</td>
                        </tr>
                      )) : (
                        <tr><td colSpan={8} className="px-4 py-6 text-ink-500">No activity yet.</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

              </div>
            )}

          </Container>
        </section>
      </ProtectedDashboard>
    </PagePose>
  );
}

import { createHash, randomBytes, timingSafeEqual } from 'node:crypto';
import fs from 'node:fs/promises';
import http from 'node:http';
import net from 'node:net';
import path from 'node:path';
import tls from 'node:tls';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.join(__dirname, 'dist');
const isDev = process.env.NODE_ENV !== 'production';
const port = Number(process.env.PORT || (isDev ? 3001 : 5173));

const smtpConfig = {
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: Number(process.env.SMTP_PORT || 465),
  secure: String(process.env.SMTP_SECURE || 'true').toLowerCase() !== 'false',
  user: process.env.SMTP_USER || '',
  pass: process.env.SMTP_PASS || '',
  from: process.env.MAIL_FROM || process.env.SMTP_USER || '',
  to: process.env.MAIL_TO || 'tiaan374@gmail.com',
  to2: process.env.MAIL_TO_2 || '',
};

// ─── Dashboard auth config ────────────────────────────────────────────────────
// Server-only secrets — never bundled to the client (unlike the old VITE_DASHBOARD_PASS).
const dashboardConfig = {
  pass: process.env.DASHBOARD_PASS || '',
  supabaseUrl: process.env.VITE_SUPABASE_URL || '',
  serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || '',
};
const DASHBOARD_COOKIE = '_gym_dash_session';
const DASHBOARD_SESSION_TTL_MS = 12 * 60 * 60 * 1000;
const dashboardSessions = new Map(); // token -> expiresAt

// Simple in-memory rate limiter: max 10 requests per IP per 10 minutes.
const rateLimitMap = new Map();
const RATE_LIMIT_MAX = 10;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;

function isRateLimited(ip) {
  const now = Date.now();
  const entry = rateLimitMap.get(ip) || { count: 0, resetAt: now + RATE_LIMIT_WINDOW_MS };
  if (now > entry.resetAt) {
    entry.count = 0;
    entry.resetAt = now + RATE_LIMIT_WINDOW_MS;
  }
  entry.count += 1;
  rateLimitMap.set(ip, entry);
  return entry.count > RATE_LIMIT_MAX;
}

const server = http.createServer(async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', isDev ? 'http://localhost:5173' : 'https://bossiesgym.co.za');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  try {
    if (req.method === 'POST' && req.url === '/api/send-agreement') {
      const ip = req.socket.remoteAddress || 'unknown';
      if (isRateLimited(ip)) {
        sendJson(res, 429, { ok: false, error: 'Too many requests — please try again later.' });
        return;
      }
      await handleSendAgreement(req, res);
      return;
    }

    if (req.method === 'POST' && req.url === '/api/send-enquiry') {
      const ip = req.socket.remoteAddress || 'unknown';
      if (isRateLimited(ip)) {
        sendJson(res, 429, { ok: false, error: 'Too many requests — please try again later.' });
        return;
      }
      await handleSendEnquiry(req, res);
      return;
    }

    if (req.method === 'GET' && req.url === '/api/geo') {
      await handleGeo(req, res);
      return;
    }

    if (req.method === 'POST' && req.url === '/api/dashboard/login') {
      const ip = req.socket.remoteAddress || 'unknown';
      if (isRateLimited(ip)) {
        sendJson(res, 429, { ok: false, error: 'Too many attempts — please try again later.' });
        return;
      }
      await handleDashboardLogin(req, res);
      return;
    }

    if (req.method === 'POST' && req.url === '/api/dashboard/logout') {
      handleDashboardLogout(req, res);
      return;
    }

    if (req.method === 'GET' && req.url === '/api/dashboard/session') {
      const ok = requireDashboardSession(req);
      sendJson(res, ok ? 200 : 401, { ok });
      return;
    }

    if (req.method === 'GET' && req.url?.startsWith('/api/dashboard/data')) {
      if (!requireDashboardSession(req)) {
        sendJson(res, 401, { ok: false, error: 'Not authenticated' });
        return;
      }
      await handleDashboardData(req, res);
      return;
    }

    if (isDev) {
      sendJson(res, 404, { ok: false, error: 'Not found' });
      return;
    }

    if (req.method !== 'GET' && req.method !== 'HEAD') {
      sendJson(res, 405, { ok: false, error: 'Method not allowed' });
      return;
    }

    await serveStatic(req, res);
  } catch (error) {
    console.error(error);
    sendJson(res, 500, { ok: false, error: 'Unexpected server error' });
  }
});

server.listen(port, '0.0.0.0', () => {
  console.log(
    isDev
      ? `API server running on http://localhost:${port} (dev mode)`
      : `Bossie's Gym site listening on http://0.0.0.0:${port}`,
  );
});

// ---------------------------------------------------------------------------
// Handlers
// ---------------------------------------------------------------------------

// Simple geo cache — keyed by IP, entries expire after 24 h.
const geoCache = new Map();

async function handleGeo(req, res) {
  // Nginx sets X-Real-IP to the visitor's public IP; fall back to socket addr.
  const raw =
    req.headers['x-real-ip'] ||
    (req.headers['x-forwarded-for'] || '').split(',')[0].trim() ||
    req.socket.remoteAddress ||
    '';
  // Strip IPv4-mapped IPv6 prefix (::ffff:1.2.3.4 → 1.2.3.4)
  const ip = raw.replace(/^::ffff:/, '');

  if (geoCache.has(ip)) {
    const { data, cachedAt } = geoCache.get(ip);
    if (Date.now() - cachedAt < 86_400_000) {
      sendJson(res, 200, data);
      return;
    }
    geoCache.delete(ip);
  }

  try {
    // ip-api.com — free, no API key, 45 req/min, HTTP is fine server-side.
    const r = await fetch(`http://ip-api.com/json/${ip}?fields=status,city,country`);
    const d = await r.json();
    const data = {
      city: d.status === 'success' ? (d.city || null) : null,
      country: d.status === 'success' ? (d.country || null) : null,
    };
    geoCache.set(ip, { data, cachedAt: Date.now() });
    sendJson(res, 200, data);
  } catch (err) {
    sendJson(res, 200, { city: null, country: null });
  }
}

// ─── Dashboard auth + analytics proxy ─────────────────────────────────────────

function safeCompare(a, b) {
  const ah = createHash('sha256').update(String(a)).digest();
  const bh = createHash('sha256').update(String(b)).digest();
  return timingSafeEqual(ah, bh);
}

function parseCookies(req) {
  const header = req.headers.cookie || '';
  return header.split(';').reduce((acc, pair) => {
    const idx = pair.indexOf('=');
    if (idx === -1) return acc;
    acc[pair.slice(0, idx).trim()] = decodeURIComponent(pair.slice(idx + 1).trim());
    return acc;
  }, {});
}

function dashboardCookieHeader(token, maxAgeSeconds) {
  const parts = [
    `${DASHBOARD_COOKIE}=${token}`,
    'Path=/',
    'HttpOnly',
    'SameSite=Strict',
    `Max-Age=${maxAgeSeconds}`,
  ];
  if (!isDev) parts.push('Secure');
  return parts.join('; ');
}

function requireDashboardSession(req) {
  const token = parseCookies(req)[DASHBOARD_COOKIE];
  if (!token) return false;
  const expiresAt = dashboardSessions.get(token);
  if (!expiresAt) return false;
  if (Date.now() > expiresAt) {
    dashboardSessions.delete(token);
    return false;
  }
  return true;
}

async function handleDashboardLogin(req, res) {
  if (!dashboardConfig.pass) {
    sendJson(res, 500, { ok: false, error: 'Dashboard password not configured.' });
    return;
  }

  const body = await readJsonBody(req);
  const submitted = String(body.password || '');

  if (!submitted || !safeCompare(submitted, dashboardConfig.pass)) {
    sendJson(res, 401, { ok: false, error: 'Incorrect passphrase.' });
    return;
  }

  const token = randomBytes(32).toString('hex');
  dashboardSessions.set(token, Date.now() + DASHBOARD_SESSION_TTL_MS);
  res.setHeader('Set-Cookie', dashboardCookieHeader(token, DASHBOARD_SESSION_TTL_MS / 1000));
  sendJson(res, 200, { ok: true });
}

function handleDashboardLogout(req, res) {
  const token = parseCookies(req)[DASHBOARD_COOKIE];
  if (token) dashboardSessions.delete(token);
  res.setHeader('Set-Cookie', dashboardCookieHeader('', 0));
  sendJson(res, 200, { ok: true });
}

async function fetchAnalyticsTable(table, dateColumn, sinceIso) {
  const url = `${dashboardConfig.supabaseUrl}/rest/v1/${table}?select=*&${dateColumn}=gte.${encodeURIComponent(sinceIso)}`;
  const r = await fetch(url, {
    headers: {
      apikey: dashboardConfig.serviceRoleKey,
      Authorization: `Bearer ${dashboardConfig.serviceRoleKey}`,
    },
  });
  if (!r.ok) throw new Error(`Supabase ${table} fetch failed: ${r.status}`);
  return r.json();
}

async function handleDashboardData(req, res) {
  if (!dashboardConfig.supabaseUrl || !dashboardConfig.serviceRoleKey) {
    sendJson(res, 500, { ok: false, error: 'Analytics backend is not configured.' });
    return;
  }

  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const start = url.searchParams.get('start') || new Date(Date.now() - 30 * 86_400_000).toISOString();

  const [views, events] = await Promise.all([
    fetchAnalyticsTable('page_views', 'entered_at', start),
    fetchAnalyticsTable('events', 'created_at', start),
  ]);

  sendJson(res, 200, { views, events });
}

async function handleSendAgreement(req, res) {
  if (!smtpConfig.user || !smtpConfig.pass || !smtpConfig.from) {
    sendJson(res, 500, {
      ok: false,
      error: 'SMTP is not configured. Set SMTP_USER, SMTP_PASS, and MAIL_FROM in .env.',
    });
    return;
  }

  const body = await readJsonBody(req);
  const csv = String(body.csv || '').trim();
  const memberName = sanitize(body.memberName || 'Member');
  const memberEmail = sanitize(body.memberEmail || '');
  const formData = body.formData && typeof body.formData === 'object' ? body.formData : {};

  if (!csv || csv.length > 60_000) {
    sendJson(res, 400, { ok: false, error: 'CSV is missing or too large.' });
    return;
  }

  const filename = `bossies-gym-membership-agreement-${slugify(memberName)}.csv`;
  const subject = `Membership agreement — ${memberName}`;

  const message = buildMime({
    from: smtpConfig.from,
    to: smtpConfig.to,
    to2: smtpConfig.to2,
    replyTo: memberEmail,
    subject,
    text: buildAgreementText(formData, memberName, memberEmail),
    html: buildAgreementHtml(formData, memberName, memberEmail),
    attachments: [{ filename, content: csv, contentType: 'text/csv; charset=utf-8' }],
  });

  await sendSmtpMail(smtpConfig, message);
  sendJson(res, 200, { ok: true });
}

async function handleSendEnquiry(req, res) {
  if (!smtpConfig.user || !smtpConfig.pass || !smtpConfig.from) {
    sendJson(res, 500, {
      ok: false,
      error: 'SMTP is not configured. Set SMTP_USER, SMTP_PASS, and MAIL_FROM in .env.',
    });
    return;
  }

  const body = await readJsonBody(req);

  if (body.website) {
    sendJson(res, 400, { ok: false, error: 'Bad request.' });
    return;
  }

  const name = sanitize(body.name || 'Website visitor');
  const email = sanitize(body.email || '');
  const phone = sanitize(body.phone || '');
  const message = sanitize(body.message || '');

  if (!name || !email || !message) {
    sendJson(res, 400, { ok: false, error: 'name, email and message are required.' });
    return;
  }

  const subject = `Website enquiry — ${name}`;
  const mime = buildMime({
    from: smtpConfig.from,
    to: smtpConfig.to,
    to2: smtpConfig.to2,
    replyTo: email,
    subject,
    text: `Name: ${name}\nPhone: ${phone || 'Not provided'}\nEmail: ${email}\n\n${message}`,
    html: buildEnquiryHtml({ name, email, phone, message }),
    attachments: [],
  });

  await sendSmtpMail(smtpConfig, mime);
  sendJson(res, 200, { ok: true });
}

// ---------------------------------------------------------------------------
// Email template builders
// ---------------------------------------------------------------------------

function buildAgreementText(fd, memberName, memberEmail) {
  const lines = [
    `Bossie's Gym — Membership Agreement`,
    ``,
    `Member: ${memberName}`,
    `Email:  ${memberEmail || 'Not provided'}`,
    ``,
    `— Plan —`,
    `Plan:  ${fd.planLabel || ''}`,
    `Rate:  ${fd.priceLine || ''}`,
    `Terms: ${fd.termsLine || ''}`,
    `Start: ${fd.startDate || ''}`,
    ``,
    `— Member Details —`,
    `Phone:   ${fd.phone || ''}`,
    `ID:      ${fd.idNumber || 'Not provided'}`,
    `DOB:     ${fd.birthDate || 'Not provided'}`,
    `Address: ${fd.address || 'Not provided'}`,
    ``,
    `— Emergency Contact —`,
    `Name:  ${fd.emergencyName || ''}`,
    `Phone: ${fd.emergencyPhone || ''}`,
    ``,
    `— Health Notes —`,
    `Flags: ${Array.isArray(fd.healthFlags) && fd.healthFlags.length ? fd.healthFlags.join(', ') : 'None selected'}`,
    `Goals: ${fd.goals || 'Not provided'}`,
    `Medical: ${fd.medicalNotes || 'None'}`,
    ``,
    `— Consents —`,
    `Information accurate: ${fd.consentAccuracy ? 'Yes' : 'No'}`,
    `Health disclosure:    ${fd.consentHealth ? 'Yes' : 'No'}`,
    `Plan terms:           ${fd.consentTerms ? 'Yes' : 'No'}`,
    `Contact consent:      ${fd.consentContact ? 'Yes' : 'No'}`,
    ``,
    `— Signature —`,
    `Signed by: ${fd.signatureName || ''}`,
    `Date:      ${fd.signatureDate || ''}`,
    ``,
    `A CSV copy is attached.`,
  ];
  return lines.join('\r\n');
}

function buildAgreementHtml(fd, memberName, memberEmail) {
  const flags =
    Array.isArray(fd.healthFlags) && fd.healthFlags.length
      ? fd.healthFlags.map((f) => `<li style="margin:3px 0">${esc(f)}</li>`).join('')
      : '<li style="margin:3px 0;color:#9ca3af">None selected</li>';

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><title>Membership Agreement</title></head>
<body style="margin:0;padding:0;background:#0a0c12;font-family:Inter,Arial,sans-serif;color:#e5e7eb">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0c12;padding:32px 16px">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%">

  <!-- Header -->
  <tr><td style="background:#111827;border-radius:16px 16px 0 0;padding:32px 36px;border-bottom:2px solid #dc2b38">
    <p style="margin:0;font-size:11px;font-weight:700;letter-spacing:0.2em;text-transform:uppercase;color:#dc2b38">Bossie's Gym</p>
    <h1 style="margin:8px 0 0;font-size:24px;font-weight:700;color:#ffffff">Membership Agreement Received</h1>
    <p style="margin:8px 0 0;font-size:14px;color:#9ca3af">A completed membership agreement was submitted through the website.</p>
  </td></tr>

  <!-- Member Summary -->
  <tr><td style="background:#111827;padding:28px 36px 0">
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#1f2937;border-radius:12px;overflow:hidden">
      <tr>
        <td style="padding:16px 20px;border-right:1px solid #374151">
          <p style="margin:0;font-size:11px;color:#6b7280;font-weight:600;text-transform:uppercase;letter-spacing:0.15em">Member</p>
          <p style="margin:4px 0 0;font-size:15px;color:#fff;font-weight:600">${esc(memberName)}</p>
        </td>
        <td style="padding:16px 20px;border-right:1px solid #374151">
          <p style="margin:0;font-size:11px;color:#6b7280;font-weight:600;text-transform:uppercase;letter-spacing:0.15em">Plan</p>
          <p style="margin:4px 0 0;font-size:15px;color:#fff;font-weight:600">${esc(fd.planLabel || '')}</p>
        </td>
        <td style="padding:16px 20px">
          <p style="margin:0;font-size:11px;color:#6b7280;font-weight:600;text-transform:uppercase;letter-spacing:0.15em">Rate</p>
          <p style="margin:4px 0 0;font-size:15px;color:#dc2b38;font-weight:700">${esc(fd.priceLine || '')}</p>
        </td>
      </tr>
    </table>
  </td></tr>

  <!-- Plan Details -->
  <tr><td style="background:#111827;padding:24px 36px 0">
    ${htmlSection('Plan Details', `
      ${htmlRow('Start date', fd.startDate || '')}
      ${htmlRow('Terms', fd.termsLine || '')}
    `)}
  </td></tr>

  <!-- Member Details -->
  <tr><td style="background:#111827;padding:20px 36px 0">
    ${htmlSection('Member Details', `
      ${htmlRow('Email', memberEmail || 'Not provided')}
      ${htmlRow('Phone', fd.phone || '')}
      ${htmlRow('ID / Passport', fd.idNumber || 'Not provided')}
      ${htmlRow('Date of birth', fd.birthDate || 'Not provided')}
      ${htmlRow('Address', fd.address || 'Not provided')}
    `)}
  </td></tr>

  <!-- Emergency Contact -->
  <tr><td style="background:#111827;padding:20px 36px 0">
    ${htmlSection('Emergency Contact', `
      ${htmlRow('Name', fd.emergencyName || '')}
      ${htmlRow('Phone', fd.emergencyPhone || '')}
    `)}
  </td></tr>

  <!-- Health Notes -->
  <tr><td style="background:#111827;padding:20px 36px 0">
    ${htmlSection('Health & Training Notes', `
      <p style="margin:0 0 8px;font-size:12px;font-weight:600;color:#6b7280;text-transform:uppercase;letter-spacing:0.12em">Health flags</p>
      <ul style="margin:0 0 16px;padding-left:20px;font-size:14px;color:#d1d5db">${flags}</ul>
      ${htmlRow('Training goals', fd.goals || 'Not provided')}
      ${htmlRow('Medical notes', fd.medicalNotes || 'None')}
    `)}
  </td></tr>

  <!-- Consents -->
  <tr><td style="background:#111827;padding:20px 36px 0">
    ${htmlSection('Consents', `
      ${htmlRow('Information accurate', fd.consentAccuracy ? '✓ Yes' : '✗ No')}
      ${htmlRow('Health disclosure', fd.consentHealth ? '✓ Yes' : '✗ No')}
      ${htmlRow('Plan terms', fd.consentTerms ? '✓ Yes' : '✗ No')}
      ${htmlRow('Contact consent', fd.consentContact ? '✓ Yes' : '✗ No')}
    `)}
  </td></tr>

  <!-- Signature -->
  <tr><td style="background:#111827;padding:20px 36px 0">
    ${htmlSection('Signature', `
      ${htmlRow('Signed by', fd.signatureName || '')}
      ${htmlRow('Signature date', fd.signatureDate || '')}
    `)}
  </td></tr>

  <!-- Footer -->
  <tr><td style="background:#0d1117;border-radius:0 0 16px 16px;padding:24px 36px;border-top:1px solid #1f2937;margin-top:24px">
    <p style="margin:0;font-size:13px;color:#6b7280">A full CSV copy of this agreement is attached. Reply to this email to contact the member directly.</p>
    <p style="margin:8px 0 0;font-size:12px;color:#4b5563">Bossie's Gym &amp; Personal Training Studio · Hennopspark, Centurion</p>
  </td></tr>

</table>
</td></tr>
</table>
</body>
</html>`;
}

function buildEnquiryHtml({ name, email, phone, message }) {
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><title>Website Enquiry</title></head>
<body style="margin:0;padding:0;background:#0a0c12;font-family:Inter,Arial,sans-serif;color:#e5e7eb">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0c12;padding:32px 16px">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%">

  <!-- Header -->
  <tr><td style="background:#111827;border-radius:16px 16px 0 0;padding:32px 36px;border-bottom:2px solid #dc2b38">
    <p style="margin:0;font-size:11px;font-weight:700;letter-spacing:0.2em;text-transform:uppercase;color:#dc2b38">Bossie's Gym</p>
    <h1 style="margin:8px 0 0;font-size:24px;font-weight:700;color:#ffffff">New Website Enquiry</h1>
    <p style="margin:8px 0 0;font-size:14px;color:#9ca3af">Someone sent you a message through the contact form.</p>
  </td></tr>

  <!-- Sender -->
  <tr><td style="background:#111827;padding:28px 36px 0">
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#1f2937;border-radius:12px;overflow:hidden">
      <tr>
        <td style="padding:16px 20px;border-right:1px solid #374151">
          <p style="margin:0;font-size:11px;color:#6b7280;font-weight:600;text-transform:uppercase;letter-spacing:0.15em">From</p>
          <p style="margin:4px 0 0;font-size:15px;color:#fff;font-weight:600">${esc(name)}</p>
        </td>
        <td style="padding:16px 20px;border-right:1px solid #374151">
          <p style="margin:0;font-size:11px;color:#6b7280;font-weight:600;text-transform:uppercase;letter-spacing:0.15em">Email</p>
          <p style="margin:4px 0 0;font-size:15px;color:#dc2b38;font-weight:600">${esc(email)}</p>
        </td>
        <td style="padding:16px 20px">
          <p style="margin:0;font-size:11px;color:#6b7280;font-weight:600;text-transform:uppercase;letter-spacing:0.15em">Phone</p>
          <p style="margin:4px 0 0;font-size:15px;color:#fff;font-weight:600">${esc(phone || 'Not provided')}</p>
        </td>
      </tr>
    </table>
  </td></tr>

  <!-- Message -->
  <tr><td style="background:#111827;padding:20px 36px">
    ${htmlSection('Message', `
      <p style="margin:0;font-size:14px;color:#d1d5db;white-space:pre-wrap;line-height:1.7">${esc(message)}</p>
    `)}
  </td></tr>

  <!-- Footer -->
  <tr><td style="background:#0d1117;border-radius:0 0 16px 16px;padding:24px 36px;border-top:1px solid #1f2937">
    <p style="margin:0;font-size:13px;color:#6b7280">Reply to this email to respond directly to ${esc(name)}.</p>
    <p style="margin:8px 0 0;font-size:12px;color:#4b5563">Bossie's Gym &amp; Personal Training Studio · Hennopspark, Centurion</p>
  </td></tr>

</table>
</td></tr>
</table>
</body>
</html>`;
}

function htmlSection(title, content) {
  return `<div style="background:#1a2030;border-radius:12px;padding:20px 24px;margin-bottom:4px">
    <p style="margin:0 0 14px;font-size:11px;font-weight:700;letter-spacing:0.2em;text-transform:uppercase;color:#dc2b38">${esc(title)}</p>
    ${content}
  </div>`;
}

function htmlRow(label, value) {
  return `<div style="display:flex;gap:16px;margin-bottom:10px;flex-wrap:wrap">
    <span style="font-size:12px;color:#6b7280;min-width:130px;flex-shrink:0">${esc(label)}</span>
    <span style="font-size:14px;color:#d1d5db;flex:1">${esc(String(value || ''))}</span>
  </div>`;
}

// ---------------------------------------------------------------------------
// MIME builder
// ---------------------------------------------------------------------------

function buildMime({ from, to, to2, replyTo, subject, text, html, attachments }) {
  const outer = `bossies-outer-${randomBytes(8).toString('hex')}`;
  const inner = `bossies-inner-${randomBytes(8).toString('hex')}`;

  const toHeader = to2
    ? `${formatAddress(to)}, ${formatAddress(to2)}`
    : formatAddress(to);

  const headers = [
    `From: ${formatAddress(from)}`,
    `To: ${toHeader}`,
    replyTo ? `Reply-To: ${formatAddress(replyTo)}` : '',
    `Subject: ${encodeHeader(subject)}`,
    'MIME-Version: 1.0',
    `Content-Type: multipart/mixed; boundary="${outer}"`,
  ].filter(Boolean);

  const parts = [
    ...headers,
    '',
    `--${outer}`,
    `Content-Type: multipart/alternative; boundary="${inner}"`,
    '',
    `--${inner}`,
    'Content-Type: text/plain; charset=utf-8',
    'Content-Transfer-Encoding: 7bit',
    '',
    text,
    `--${inner}`,
    'Content-Type: text/html; charset=utf-8',
    'Content-Transfer-Encoding: quoted-printable',
    '',
    quotedPrintable(html),
    `--${inner}--`,
  ];

  for (const att of attachments) {
    const b64 = Buffer.from(att.content, 'utf8').toString('base64').match(/.{1,76}/g).join('\r\n');
    parts.push(
      `--${outer}`,
      `Content-Type: ${att.contentType}; name="${att.filename}"`,
      'Content-Transfer-Encoding: base64',
      `Content-Disposition: attachment; filename="${att.filename}"`,
      '',
      b64,
    );
  }

  parts.push(`--${outer}--`, '');
  return parts.join('\r\n');
}

// ---------------------------------------------------------------------------
// Static file server (production only)
// ---------------------------------------------------------------------------

async function serveStatic(req, res) {
  const url = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`);
  const cleanPath = decodeURIComponent(url.pathname).replace(/^\/+/, '');
  const requestedPath = path.normalize(cleanPath || 'index.html');
  const filePath = path.join(distDir, requestedPath);

  if (!filePath.startsWith(distDir)) {
    sendJson(res, 403, { ok: false, error: 'Forbidden' });
    return;
  }

  try {
    const stat = await fs.stat(filePath);
    if (stat.isFile()) {
      res.writeHead(200, {
        'Content-Type': contentType(filePath),
        'Cache-Control': filePath.includes(`${path.sep}assets${path.sep}`)
          ? 'public, max-age=31536000, immutable'
          : 'no-cache',
        ...SECURITY_HEADERS,
        'Content-Security-Policy': CSP,
      });
      if (req.method === 'HEAD') { res.end(); return; }
      res.end(await fs.readFile(filePath));
      return;
    }
  } catch {
    // Fall through to SPA entry point.
  }

  const indexPath = path.join(distDir, 'index.html');
  res.writeHead(200, {
    'Content-Type': 'text/html; charset=utf-8',
    'Cache-Control': 'no-cache',
    ...SECURITY_HEADERS,
    'Content-Security-Policy': CSP,
  });
  if (req.method === 'HEAD') { res.end(); return; }
  res.end(await fs.readFile(indexPath));
}

// ---------------------------------------------------------------------------
// SMTP
// ---------------------------------------------------------------------------

async function sendSmtpMail(config, message) {
  const client = await SmtpClient.connect(config);
  try {
    await client.expect(220);
    await client.command(`EHLO ${hostname()}`, 250);

    if (!config.secure) {
      await client.command('STARTTLS', 220);
      await client.upgradeToTls(config.host);
      await client.command(`EHLO ${hostname()}`, 250);
    }

    await client.command('AUTH LOGIN', 334);
    await client.command(Buffer.from(config.user).toString('base64'), 334);
    await client.command(Buffer.from(config.pass).toString('base64'), 235);
    await client.command(`MAIL FROM:<${config.from}>`, 250);
    await client.command(`RCPT TO:<${config.to}>`, 250);
    if (config.to2) await client.command(`RCPT TO:<${config.to2}>`, 250);
    await client.command('DATA', 354);
    await client.command(`${dotStuff(message)}\r\n.`, 250);
    await client.command('QUIT', 221);
  } finally {
    client.close();
  }
}

class SmtpClient {
  static connect(config) {
    return new Promise((resolve, reject) => {
      const socket = config.secure
        ? tls.connect(config.port, config.host, { servername: config.host })
        : net.connect(config.port, config.host);
      socket.setTimeout(15_000);
      socket.once('timeout', () => { socket.destroy(); reject(new Error('SMTP connection timed out')); });
      const client = new SmtpClient(socket);
      socket.once(config.secure ? 'secureConnect' : 'connect', () => resolve(client));
      socket.once('error', reject);
    });
  }

  constructor(socket) {
    this.socket = socket;
    this.buffer = '';
  }

  upgradeToTls(host) {
    return new Promise((resolve, reject) => {
      this.socket = tls.connect({ socket: this.socket, servername: host });
      this.buffer = '';
      this.socket.once('secureConnect', resolve);
      this.socket.once('error', reject);
    });
  }

  command(line, expected) {
    this.socket.write(`${line}\r\n`);
    return this.expect(expected);
  }

  expect(expected) {
    return new Promise((resolve, reject) => {
      const onData = (chunk) => {
        this.buffer += chunk.toString('utf8');
        const lines = this.buffer.split(/\r?\n/).filter(Boolean);
        const last = lines[lines.length - 1];
        if (!last || !/^\d{3} /.test(last)) return;
        this.socket.off('data', onData);
        this.socket.off('error', onError);
        const code = Number(last.slice(0, 3));
        const body = this.buffer;
        this.buffer = '';
        if (code === expected) resolve(body);
        else reject(new Error(`SMTP expected ${expected}, got ${code}: ${body}`));
      };
      const onError = (error) => {
        this.socket.off('data', onData);
        reject(error);
      };
      this.socket.on('data', onData);
      this.socket.once('error', onError);
    });
  }

  close() { this.socket.end(); }
}

// ---------------------------------------------------------------------------
// Utilities
// ---------------------------------------------------------------------------

function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    let raw = '';
    let done = false;
    req.setEncoding('utf8');
    req.on('data', (chunk) => {
      if (done) return;
      raw += chunk;
      if (raw.length > 100_000) {
        done = true;
        reject(new Error('Request body too large'));
        req.destroy();
      }
    });
    req.on('end', () => {
      if (done) return;
      done = true;
      try { resolve(JSON.parse(raw || '{}')); }
      catch { reject(new Error('Invalid JSON body')); }
    });
    req.on('error', (err) => {
      if (done) return;
      done = true;
      reject(err);
    });
  });
}

const SECURITY_HEADERS = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
};

const CSP = [
  "default-src 'self'",
  "script-src 'self' https://www.googletagmanager.com https://www.google-analytics.com 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com",
  "img-src 'self' data: https:",
  "connect-src 'self' https://gnsrwzmzaicxceqgcstd.supabase.co https://www.google-analytics.com https://analytics.google.com https://region1.google-analytics.com https://region1.analytics.google.com",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
].join('; ');

function sendJson(res, status, payload) {
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    ...SECURITY_HEADERS,
  });
  res.end(JSON.stringify(payload));
}

function sanitize(value) {
  return String(value || '').replace(/[\r\n]/g, ' ').trim().slice(0, 2000);
}

function esc(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function contentType(filePath) {
  const ext = path.extname(filePath);
  return (
    {
      '.html': 'text/html; charset=utf-8',
      '.js': 'text/javascript; charset=utf-8',
      '.css': 'text/css; charset=utf-8',
      '.svg': 'image/svg+xml',
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.webmanifest': 'application/manifest+json',
      '.json': 'application/json; charset=utf-8',
    }[ext] || 'application/octet-stream'
  );
}

function dotStuff(value) {
  return value.replace(/^\./gm, '..');
}

function encodeHeader(value) {
  return /[^\x20-\x7E]/.test(value)
    ? `=?UTF-8?B?${Buffer.from(value, 'utf8').toString('base64')}?=`
    : value;
}

function formatAddress(value) {
  return String(value).replace(/[\r\n]/g, '');
}

function hostname() {
  return process.env.SMTP_EHLO_HOST || 'bossiesgym.co.za';
}

function slugify(value) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'member';
}

function quotedPrintable(str) {
  let out = '';
  for (const ch of str) {
    const code = ch.codePointAt(0);
    if (code > 127 || (code < 32 && code !== 9 && code !== 10 && code !== 13)) {
      const bytes = Buffer.from(ch, 'utf8');
      for (const b of bytes) out += `=${b.toString(16).toUpperCase().padStart(2, '0')}`;
    } else {
      out += ch;
    }
  }
  // Soft-wrap at 75 chars
  const lines = [];
  const raw = out.split('\n');
  for (const line of raw) {
    let remaining = line;
    while (remaining.length > 75) {
      let cut = 75;
      while (cut > 0 && remaining[cut - 1] === '=') cut--;
      if (cut === 0) cut = 75;
      lines.push(remaining.slice(0, cut) + '=');
      remaining = remaining.slice(cut);
    }
    lines.push(remaining);
  }
  return lines.join('\r\n');
}

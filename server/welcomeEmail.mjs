// Welcome email — sent once a new member completes the online membership
// agreement at /join (/onboarding). Fires from inside handleSendAgreement in
// server.mjs, after the existing CSV notification + Supabase insert succeed.
//
// Hard rule: a failure here must never break the agreement submission the
// member is actually waiting on. sendWelcomeEmail() always resolves — it
// never throws — so the caller can await it without a try/catch of its own.
//
// Content discipline: every business fact quoted here (address, hours, phone)
// must come from src/lib/site.js, the site's single source of truth — never
// hardcoded or invented locally.

function esc(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function formatHours(site) {
  return site.hours.map((row) => `${row.day}: ${row.display}`).join('\n');
}

function formatHoursHtml(site) {
  return site.hours
    .map(
      (row) =>
        `<div style="display:flex;justify-content:space-between;gap:16px;padding:4px 0">
          <span style="color:#9ca3af">${esc(row.day)}</span>
          <span style="color:#e5e7eb">${esc(row.display)}</span>
        </div>`,
    )
    .join('');
}

export function buildWelcomeText(memberName, formData, site) {
  const lines = [
    `Hi ${memberName},`,
    '',
    `Welcome to ${site.name} — we're glad to have you.`,
    '',
    `Membership: ${formData.planLabel || 'Confirmed'}`,
    formData.priceLine ? `Rate: ${formData.priceLine}` : null,
    formData.startDate ? `Start date: ${formData.startDate}` : null,
    '',
    'Find us at:',
    `${site.location.line1}, ${site.location.line2}, ${site.location.city} ${site.location.postalCode}`,
    '',
    'Opening hours:',
    formatHours(site),
    '',
    `Any questions before your first visit? Reply to this email, call ${site.phone.display}, or WhatsApp us.`,
    '',
    `— ${site.owner} and the ${site.name} team`,
  ].filter((line) => line !== null);
  return lines.join('\n');
}

export function buildWelcomeHtml(memberName, formData, site) {
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><title>Welcome to ${esc(site.name)}</title></head>
<body style="margin:0;padding:0;background:#0a0c12;font-family:Inter,Arial,sans-serif;color:#e5e7eb">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0c12;padding:32px 16px">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%">

  <!-- Header -->
  <tr><td style="background:#111827;border-radius:16px 16px 0 0;padding:32px 36px;border-bottom:2px solid #dc2b38">
    <p style="margin:0;font-size:11px;font-weight:700;letter-spacing:0.2em;text-transform:uppercase;color:#dc2b38">${esc(site.name)}</p>
    <h1 style="margin:8px 0 0;font-size:24px;font-weight:700;color:#ffffff">Welcome, ${esc(memberName)}!</h1>
  </td></tr>

  <!-- Membership -->
  <tr><td style="background:#111827;padding:28px 36px 0">
    <div style="background:#1a2030;border-radius:12px;padding:20px 24px;margin-bottom:16px">
      <p style="margin:0 0 14px;font-size:11px;font-weight:700;letter-spacing:0.2em;text-transform:uppercase;color:#dc2b38">Your membership</p>
      <p style="margin:0 0 6px;font-size:15px;color:#fff;font-weight:600">${esc(formData.planLabel || 'Confirmed')}</p>
      ${formData.priceLine ? `<p style="margin:0 0 6px;font-size:14px;color:#d1d5db">${esc(formData.priceLine)}</p>` : ''}
      ${formData.startDate ? `<p style="margin:0;font-size:13px;color:#9ca3af">Start date: ${esc(formData.startDate)}</p>` : ''}
    </div>
    <div style="background:#1a2030;border-radius:12px;padding:20px 24px;margin-bottom:4px">
      <p style="margin:0 0 14px;font-size:11px;font-weight:700;letter-spacing:0.2em;text-transform:uppercase;color:#dc2b38">Find us</p>
      <p style="margin:0 0 12px;font-size:14px;color:#d1d5db">${esc(site.location.line1)}, ${esc(site.location.line2)}, ${esc(site.location.city)} ${esc(site.location.postalCode)}</p>
      ${formatHoursHtml(site)}
    </div>
  </td></tr>

  <!-- Footer -->
  <tr><td style="background:#0d1117;border-radius:0 0 16px 16px;padding:24px 36px;border-top:1px solid #1f2937;margin-top:24px">
    <p style="margin:0;font-size:13px;color:#6b7280">Questions before your first visit? Reply to this email, call ${esc(site.phone.display)}, or WhatsApp us.</p>
    <p style="margin:8px 0 0;font-size:12px;color:#4b5563">${esc(site.fullName)} · ${esc(site.location.city)}</p>
  </td></tr>

</table>
</td></tr>
</table>
</body>
</html>`;
}

/**
 * Sends the welcome email. Never throws — a send failure is caught and
 * logged so it can never break the agreement-submission response the caller
 * has already committed to returning.
 *
 * @param {{memberName: string, memberEmail: string, formData: object, smtpConfig: object, site: object}} args
 * @param {{buildMime: Function, sendSmtpMail: Function}} deps injectable for tests
 * @returns {Promise<{sent: boolean, error?: string}>}
 */
export async function sendWelcomeEmail(
  { memberName, memberEmail, formData, smtpConfig, site },
  deps,
) {
  const { buildMime, sendSmtpMail } = deps;
  if (!memberEmail) return { sent: false, error: 'No member email provided.' };

  try {
    const mime = buildMime({
      from: smtpConfig.from,
      to: memberEmail,
      replyTo: smtpConfig.to,
      subject: `Welcome to ${site.name}, ${memberName}!`,
      text: buildWelcomeText(memberName, formData, site),
      html: buildWelcomeHtml(memberName, formData, site),
      attachments: [],
    });
    await sendSmtpMail(smtpConfig, mime);
    return { sent: true };
  } catch (error) {
    console.error('Welcome email send failed:', error);
    return { sent: false, error: error?.message || 'Unknown error' };
  }
}

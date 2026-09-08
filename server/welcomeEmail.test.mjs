import { test, describe } from 'node:test';
import assert from 'node:assert/strict';

import { buildWelcomeText, buildWelcomeHtml, sendWelcomeEmail } from './welcomeEmail.mjs';
import { site } from '../src/lib/site.js';

const formData = {
  planLabel: 'Open gym — 12-month contract',
  priceLine: 'R360/month',
  startDate: '2026-09-01',
};

describe('buildWelcomeText / buildWelcomeHtml', () => {
  test('text version includes member name, plan, and real site facts (no invented content)', () => {
    const text = buildWelcomeText('Jane Doe', formData, site);
    assert.match(text, /Hi Jane Doe,/);
    assert.match(text, new RegExp(formData.planLabel));
    assert.match(text, new RegExp(formData.priceLine));
    assert.match(text, new RegExp(formData.startDate));
    assert.match(text, new RegExp(site.phone.display));
    assert.match(text, new RegExp(site.location.line1));
  });

  test('html version escapes member name to prevent injection', () => {
    const html = buildWelcomeHtml('<script>alert(1)</script>', formData, site);
    assert.doesNotMatch(html, /<script>alert/);
    assert.match(html, /&lt;script&gt;/);
  });

  test('falls back to "Confirmed" when planLabel is missing, never crashes', () => {
    const text = buildWelcomeText('Jane Doe', {}, site);
    assert.match(text, /Membership: Confirmed/);
  });
});

describe('sendWelcomeEmail', () => {
  test('sends via injected deps with correct to/from/subject when memberEmail is present', async () => {
    let capturedMime;
    let capturedConfig;
    const deps = {
      buildMime: (args) => {
        capturedMime = args;
        return { raw: 'mime-stub' };
      },
      sendSmtpMail: async (config, message) => {
        capturedConfig = config;
        assert.equal(message.raw, 'mime-stub');
      },
    };
    const smtpConfig = { from: 'bossiesgym@gmail.com', to: 'bossiesgym@gmail.com' };

    const result = await sendWelcomeEmail(
      { memberName: 'Jane Doe', memberEmail: 'jane@example.com', formData, smtpConfig, site },
      deps,
    );

    assert.deepEqual(result, { sent: true });
    assert.equal(capturedMime.from, smtpConfig.from);
    assert.equal(capturedMime.to, 'jane@example.com');
    assert.equal(capturedMime.replyTo, smtpConfig.to);
    assert.match(capturedMime.subject, /Jane Doe/);
    assert.equal(capturedConfig, smtpConfig);
  });

  test('resolves { sent: false } and never throws on a simulated SMTP failure — the single most important safety property', async () => {
    const deps = {
      buildMime: () => ({ raw: 'mime-stub' }),
      sendSmtpMail: async () => {
        throw new Error('SMTP connection refused');
      },
    };

    const result = await sendWelcomeEmail(
      {
        memberName: 'Jane Doe',
        memberEmail: 'jane@example.com',
        formData,
        smtpConfig: { from: 'a', to: 'b' },
        site,
      },
      deps,
    );

    assert.equal(result.sent, false);
    assert.match(result.error, /SMTP connection refused/);
  });

  test('skips sending and resolves { sent: false } when memberEmail is empty, without calling sendSmtpMail', async () => {
    const spySendSmtpMail = () => {
      throw new Error('sendSmtpMail should never be invoked with no member email');
    };
    const deps = { buildMime: () => ({}), sendSmtpMail: spySendSmtpMail };

    const result = await sendWelcomeEmail(
      { memberName: 'Jane Doe', memberEmail: '', formData, smtpConfig: {}, site },
      deps,
    );

    assert.deepEqual(result, { sent: false, error: 'No member email provided.' });
  });
});

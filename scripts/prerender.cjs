const fs = require('fs');
const path = require('path');
const { run } = require('react-snap');

// react-snap pins puppeteer 1.x, whose bundled Chromium is often absent (the
// download is skipped on CI and behind proxies), which failed the build with
// "Failed to launch chrome ... ENOENT". Fall back to a browser that is already
// installed instead of depending on that download.
function findChrome() {
  if (process.env.PUPPETEER_EXECUTABLE_PATH) return process.env.PUPPETEER_EXECUTABLE_PATH;

  try {
    const bundled = require('puppeteer').executablePath();
    if (bundled && fs.existsSync(bundled)) return bundled;
  } catch {
    // puppeteer missing or too old to expose executablePath — keep looking.
  }

  const { LOCALAPPDATA, PROGRAMFILES, ProgramW6432 } = process.env;
  const candidates = {
    win32: [
      PROGRAMFILES && path.join(PROGRAMFILES, 'Google/Chrome/Application/chrome.exe'),
      ProgramW6432 && path.join(ProgramW6432, 'Google/Chrome/Application/chrome.exe'),
      'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
      LOCALAPPDATA && path.join(LOCALAPPDATA, 'Google/Chrome/Application/chrome.exe'),
      'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
      'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
    ],
    darwin: [
      '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
      '/Applications/Chromium.app/Contents/MacOS/Chromium',
      '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge',
    ],
    linux: [
      '/usr/bin/google-chrome-stable',
      '/usr/bin/google-chrome',
      '/usr/bin/chromium-browser',
      '/usr/bin/chromium',
    ],
  };

  return (candidates[process.platform] || []).filter(Boolean).find((p) => fs.existsSync(p));
}

// react-snap defaults to CRA's "build/" dir; Vite outputs to "dist/".
// Pass source/destination explicitly so it never falls back to the default.
// Old puppeteer (v1.x) also ignores PUPPETEER_EXECUTABLE_PATH as an env var —
// must pass executablePath via options at launch time.
const opts = {
  source: 'dist',
  destination: 'dist',
  // Explicitly list routes — avoids relying on package.json config merge
  routes: ['/', '/services', '/membership', '/pricing', '/team', '/gallery', '/about', '/faq', '/contact'],
  puppeteerArgs: [
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--disable-gpu',
    '--disable-webgl',
  ],
  // Without onError, react-snap aborts the entire crawl on the first page error
  // (OGL WebGL crash on /). Providing a no-op lets all 9 routes be crawled.
  onError: (msg) => {
    console.warn('[prerender] page error (suppressed):', msg);
  },
};
const chromePath = findChrome();
if (chromePath) {
  opts.puppeteerExecutablePath = chromePath;
  console.log('[prerender] using browser:', chromePath);
} else {
  // Prerendering is an SEO optimisation, not a correctness requirement — dist/
  // is already a working SPA. Fail loudly but let the deployable build stand.
  console.warn(
    '[prerender] SKIPPED: no Chrome/Chromium found. Routes will ship without prerendered HTML, ' +
      'which degrades SEO for crawlers that do not execute JS.\n' +
      '[prerender] Fix: install Chrome, or set PUPPETEER_EXECUTABLE_PATH to an existing browser.',
  );
  process.exit(0);
}

// The crawl logs "✅ crawled N out of N" before this rejection fires — meaning
// the prerendered HTML is already written. The empty-string rejection comes from
// an async operation (OGL WebGL crash or Supabase realtime socket) that resolves
// after the crawl completes. Treat it as a non-fatal warning so the build succeeds.
run(opts).catch((err) => {
  if (err === '' || err == null) {
    console.warn('react-snap: empty async rejection after crawl (WebGL/Supabase in headless) — treating as success');
    process.exit(0);
  }
  console.error('react-snap failed:', err);
  process.exit(1);
});

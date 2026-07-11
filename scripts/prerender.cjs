const { run } = require('react-snap');

// Old puppeteer (v1.x used by react-snap) ignores PUPPETEER_EXECUTABLE_PATH as
// an env var — it only accepts executablePath at launch time via options.
// This wrapper bridges the env var so Docker builds using system chromium work
// while local dev falls back to puppeteer's own downloaded chromium.
const opts = {};
if (process.env.PUPPETEER_EXECUTABLE_PATH) {
  opts.puppeteerExecutablePath = process.env.PUPPETEER_EXECUTABLE_PATH;
}

run(opts);

const { run } = require('react-snap');

// react-snap defaults to CRA's "build/" dir; Vite outputs to "dist/".
// Pass source/destination explicitly so it never falls back to the default.
// Old puppeteer (v1.x) also ignores PUPPETEER_EXECUTABLE_PATH as an env var —
// must pass executablePath via options at launch time.
const opts = {
  source: 'dist',
  destination: 'dist',
};
if (process.env.PUPPETEER_EXECUTABLE_PATH) {
  opts.puppeteerExecutablePath = process.env.PUPPETEER_EXECUTABLE_PATH;
}

run(opts);

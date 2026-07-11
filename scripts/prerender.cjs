const { run } = require('react-snap');

// react-snap defaults to CRA's "build/" dir; Vite outputs to "dist/".
// Pass source/destination explicitly so it never falls back to the default.
// Old puppeteer (v1.x) also ignores PUPPETEER_EXECUTABLE_PATH as an env var —
// must pass executablePath via options at launch time.
const opts = {
  source: 'dist',
  destination: 'dist',
  puppeteerArgs: [
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--disable-gpu',
    '--disable-webgl',
  ],
};
if (process.env.PUPPETEER_EXECUTABLE_PATH) {
  opts.puppeteerExecutablePath = process.env.PUPPETEER_EXECUTABLE_PATH;
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

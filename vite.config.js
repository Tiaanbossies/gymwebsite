import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Computed once when Vite evaluates this config (build start), not in the
// browser — the literal gets substituted into the bundle at compile time, so
// react-snap's crawl and every later visitor read the exact same baked-in
// string. A `new Date()` call inside a component, by contrast, re-evaluates
// on every render and is exactly the hydration-mismatch pattern already
// fixed in Footer.jsx — don't reintroduce that shape for this value.
const BUILD_DATE = new Date().toLocaleDateString('en-ZA', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
});

export default defineConfig({
  define: {
    __BUILD_DATE__: JSON.stringify(BUILD_DATE),
  },
  plugins: [react()],
  server: {
    port: 5173,
    open: process.env.DOCKER !== 'true',
    proxy: {
      '/api': 'http://localhost:3001',
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        // Split the long-lived vendor code out of the app chunk so a copy
        // change does not invalidate the React/animation runtime in cache.
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-motion': ['framer-motion', 'animejs'],
        },
      },
    },
  },
  preview: {
    port: 5173,
    open: process.env.DOCKER !== 'true',
  },
});

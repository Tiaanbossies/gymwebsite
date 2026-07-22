import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
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

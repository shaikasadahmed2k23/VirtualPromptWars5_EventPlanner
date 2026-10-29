/// <reference types="vitest/config" />
import { fileURLToPath, URL } from 'node:url';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { cspMetaPlugin } from './build/cspMetaPlugin';

const API_DEV_PORT = 8787;
const REACT_CORE = /[\\/]node_modules[\\/](react|react-dom|scheduler|react-router|react-router-dom|@remix-run)[\\/]/;

export default defineConfig({
  plugins: [react(), tailwindcss(), cspMetaPlugin()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@shared': fileURLToPath(new URL('./shared', import.meta.url)),
    },
  },
  server: {
    port: 5173,
    proxy: {
      // Keep the browser's Host header so the API sees dev requests as same-origin
      // (the string shorthand would imply changeOrigin and fail the origin guard).
      '/api': { target: `http://localhost:${String(API_DEV_PORT)}`, changeOrigin: false },
    },
  },
  build: {
    target: 'es2022',
    sourcemap: false,
    rollupOptions: {
      output: {
        // Only the long-lived React core gets a named vendor chunk. Heavy libraries
        // (Recharts, Framer Motion, Zod) are left to Rollup so they ship inside the
        // lazy route chunks that use them, instead of being preloaded on every page.
        manualChunks(id) {
          return REACT_CORE.test(id) ? 'react' : undefined;
        },
      },
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.test.{ts,tsx}', 'shared/**/*.test.ts', 'server/**/*.test.ts', 'build/**/*.test.ts'],
    css: false,
    restoreMocks: true,
    // Full wizard journeys drive many steps through real lazy-loaded routes.
    testTimeout: 30_000,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      include: ['src/lib/**', 'src/features/**/store/**', 'src/features/**/lib/**', 'shared/**', 'server/**'],
      exclude: ['**/*.test.{ts,tsx}', 'server/index.ts', 'src/test/**'],
    },
  },
});

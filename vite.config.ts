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
    css: false,
    restoreMocks: true,
    // Full wizard journeys drive many steps through real lazy-loaded routes.
    testTimeout: 30_000,
    projects: [
      {
        extends: true,
        test: {
          name: 'node',
          environment: 'node',
          setupFiles: [],
          include: [
            'server/**/*.test.ts',
            'tests/**/*.test.ts',
            'shared/**/*.test.ts',
            'build/**/*.test.ts',
            'src/data/**/*.test.ts',
            'src/features/**/*.test.ts',
            'src/lib/{collection,format,helpers}.test.ts',
            'src/styles/**/*.test.ts',
          ],
          exclude: ['src/features/assistant/lib/assistantLib.test.ts'],
        },
      },
      {
        extends: true,
        test: {
          name: 'dom',
          environment: 'jsdom',
          setupFiles: ['./src/test/setup.ts'],
          include: [
            'src/routes/**/*.test.tsx',
            'src/features/assistant/lib/assistantLib.test.ts',
            'src/lib/countdown.test.ts',
            'src/lib/hooks/**/*.test.ts',
            'src/lib/storage.test.ts',
            'src/lib/browserHelpers.test.ts',
          ],
        },
      },
    ],
    coverage: {
      provider: 'v8',
      reporter: ['text-summary', 'html', 'lcov', 'json-summary'],
      // Everything that ships, so the headline number is honest. Entry points and
      // type-only modules have no logic to cover.
      include: ['src/**/*.{ts,tsx}', 'shared/**/*.ts', 'server/**/*.ts'],
      exclude: [
        '**/*.test.{ts,tsx}',
        'src/test/**',
        'server/test/**',
        'src/main.tsx',
        'server/index.ts',
        'src/types/**',
      ],
      // Measured values rounded down (Nov 2026), so CI fails on any regression.
      // Pure logic is held to a higher bar than the overall number.
      thresholds: {
        statements: 97,
        branches: 89,
        functions: 92,
        lines: 97,
        'src/features/*/lib/**': { statements: 99, branches: 92, functions: 96, lines: 99 },
        'shared/**': { statements: 100, branches: 95, functions: 100, lines: 100 },
        'server/services/**': { statements: 99, branches: 90, functions: 93, lines: 99 },
      },
    },
  },
});

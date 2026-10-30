import { existsSync } from 'node:fs';
import path from 'node:path';
import compression from 'compression';
import express, { type Express } from 'express';

const ONE_YEAR_SECONDS = 31_536_000;
const INDEX_FILE = 'index.html';
/**
 * Client-side routes fall back to the SPA so they work on refresh. API paths
 * and anything that looks like a file (has an extension) are excluded, so a
 * missing asset is a 404 rather than an HTML page served as JavaScript.
 */
const SPA_ROUTE = /^(?!\/api(?:\/|$))(?!.*\/[^/]+\.[a-z0-9]+$).*/i;

/**
 * Serves the built SPA from the same origin as the API. Hashed assets are
 * cached for a year; `index.html` is always revalidated so deploys take
 * effect immediately. Returns `false` when no build is present (dev mode).
 */
export function serveSpa(app: Express, staticDir: string): boolean {
  if (!existsSync(path.join(staticDir, INDEX_FILE))) return false;

  app.use(compression());
  app.use(
    express.static(staticDir, {
      index: false,
      setHeaders(res, filePath) {
        const isHashedAsset = filePath.includes(`${path.sep}assets${path.sep}`);
        res.setHeader(
          'Cache-Control',
          isHashedAsset ? `public, max-age=${String(ONE_YEAR_SECONDS)}, immutable` : 'no-cache',
        );
      },
    }),
  );
  app.get(SPA_ROUTE, (_req, res) => {
    res.setHeader('Cache-Control', 'no-cache');
    // `root` keeps dotfile checks to the relative name, so a deploy path containing
    // a dot-folder (e.g. /home/app/.cache/dist) still serves the SPA.
    res.sendFile(INDEX_FILE, { root: staticDir });
  });
  return true;
}

import compression from 'compression';
import express, { type Express } from 'express';
import { LIMITS } from '../shared/limits.js';
import type { ServerConfig } from './config.js';
import type { Logger } from './lib/logger.js';
import { apiNotFound, errorHandler } from './middleware/errors.js';
import { apiRateLimit } from './middleware/rateLimit.js';
import { corsForAllowedOrigins, originGuard, securityHeaders } from './middleware/security.js';
import { createApiRouter } from './routes/ai.js';
import type { AIService } from './services/aiService.js';
import { serveSpa } from './static.js';

/** Dependencies injected into the app (fakes in tests, real ones in `index.ts`). */
export interface AppDeps {
  config: Pick<ServerConfig, 'allowedOrigins' | 'rateLimit' | 'staticDir'>;
  aiService: AIService;
  logger: Logger;
  /** Serve the built SPA from `staticDir` when a build exists (`npm start`, Cloud Run). */
  serveStatic?: boolean;
}

/** Builds the Express application: security → API → SPA → errors. */
export function createApp({ config, aiService, logger, serveStatic = false }: AppDeps): Express {
  const app = express();
  app.disable('x-powered-by');
  // Cloud Run (and most hosts) sit behind one proxy; needed for correct client IPs and protocol.
  app.set('trust proxy', 1);

  app.use(securityHeaders());
  // gzip/brotli-negotiated compression for API JSON and static assets alike.
  app.use(compression());
  app.use(
    '/api',
    originGuard(config.allowedOrigins),
    corsForAllowedOrigins(config.allowedOrigins),
    apiRateLimit(config.rateLimit),
    express.json({ limit: LIMITS.requestBodyBytes }),
    createApiRouter(aiService),
    apiNotFound,
  );

  if (serveStatic) {
    const served = serveSpa(app, config.staticDir);
    logger.info(served ? 'spa_served' : 'spa_build_not_found', { staticDir: config.staticDir });
  }

  app.use(errorHandler(logger));
  return app;
}

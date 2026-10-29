import { createApp } from './app.js';
import { loadConfig } from './config.js';
import { TtlLruCache } from './lib/cache.js';
import { createLogger } from './lib/logger.js';
import { createAIService } from './services/aiService.js';
import { createGeminiClient } from './services/gemini.js';

/** Upper bound for a whole HTTP request, above the AI deadline. */
const REQUEST_TIMEOUT_MS = 30_000;

const config = loadConfig();
const logger = createLogger();

const aiService = createAIService({
  client: config.geminiApiKey ? createGeminiClient(config.geminiApiKey, config.geminiModel) : null,
  model: config.geminiModel,
  timeoutMs: config.aiTimeoutMs,
  cache: new TtlLruCache<unknown>(config.cache),
  logger,
});

// Serves the built SPA whenever one exists; in development Vite serves the UI instead.
const app = createApp({ config, aiService, logger, serveStatic: true });

const server = app.listen(config.port, () => {
  logger.info('server_started', { port: config.port, aiMode: aiService.mode, env: config.nodeEnv });
});
server.requestTimeout = REQUEST_TIMEOUT_MS;

process.on('SIGTERM', () => {
  logger.info('server_stopping');
  server.close(() => process.exit(0));
});

import path from 'node:path';
import { z } from 'zod';
import { AI_SERVER_TIMEOUT_MS } from '../shared/limits.js';

/** Current stable Gemini Flash model (verified against ai.google.dev/gemini-api/docs/models). */
export const DEFAULT_GEMINI_MODEL = 'gemini-3.8-flash';

const DEFAULT_PORT = 8787;
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_REQUESTS = 20;
const CACHE_MAX_ENTRIES = 200;
const CACHE_TTL_MS = 60 * 60 * 1000;

const originList = z
  .string()
  .default('')
  .transform((value) =>
    value
      .split(',')
      .map((origin) => origin.trim())
      .filter(Boolean),
  )
  .pipe(z.array(z.string().url('ALLOWED_ORIGIN must be a comma-separated list of URLs')))
  .transform((origins) => origins.map((origin) => new URL(origin).origin));

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().int().min(1).max(65_535).default(DEFAULT_PORT),
  GEMINI_API_KEY: z
    .string()
    .trim()
    .optional()
    .transform((key) => (key === undefined || key === '' ? null : key)),
  GEMINI_MODEL: z.string().trim().min(1).default(DEFAULT_GEMINI_MODEL),
  ALLOWED_ORIGIN: originList,
  STATIC_DIR: z.string().default('dist'),
});

/** Validated server configuration. */
export interface ServerConfig {
  nodeEnv: 'development' | 'production' | 'test';
  port: number;
  /** `null` runs the API in demo mode. */
  geminiApiKey: string | null;
  geminiModel: string;
  /** Extra origins allowed to call the API cross-origin (same-origin is always allowed). */
  allowedOrigins: string[];
  /** Absolute path of the built SPA served in production. */
  staticDir: string;
  aiTimeoutMs: number;
  rateLimit: { windowMs: number; max: number };
  cache: { maxEntries: number; ttlMs: number };
}

/**
 * Parses and validates environment variables. Throws a readable error listing
 * every invalid variable, so misconfiguration fails fast at startup.
 */
export function loadConfig(env: NodeJS.ProcessEnv = process.env): ServerConfig {
  // `ALLOWED_ORIGINS` (plural) was the documented name before Step 3; accept it as an alias.
  const parsed = envSchema.safeParse({ ...env, ALLOWED_ORIGIN: env.ALLOWED_ORIGIN ?? env.ALLOWED_ORIGINS });
  if (!parsed.success) {
    const problems = parsed.error.issues.map((issue) => `${issue.path.join('.')}: ${issue.message}`).join('; ');
    throw new Error(`Invalid server configuration: ${problems}`);
  }
  const values = parsed.data;
  return {
    nodeEnv: values.NODE_ENV,
    port: values.PORT,
    geminiApiKey: values.GEMINI_API_KEY,
    geminiModel: values.GEMINI_MODEL,
    allowedOrigins: values.ALLOWED_ORIGIN,
    staticDir: path.resolve(process.cwd(), values.STATIC_DIR),
    aiTimeoutMs: AI_SERVER_TIMEOUT_MS,
    rateLimit: { windowMs: RATE_LIMIT_WINDOW_MS, max: RATE_LIMIT_MAX_REQUESTS },
    cache: { maxEntries: CACHE_MAX_ENTRIES, ttlMs: CACHE_TTL_MS },
  };
}

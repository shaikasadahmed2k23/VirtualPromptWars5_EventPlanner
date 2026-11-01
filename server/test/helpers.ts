import type { Express } from 'express';
import type { EventBrief } from '../../shared/ai.js';
import type { AIResponseBody, ApiErrorBody } from '../../shared/api.js';
import { generateDemoPlan } from '../../shared/demo/plan.js';
import { generateDemoThemes } from '../../shared/demo/themes.js';
import { createApp } from '../app.js';
import { TtlLruCache } from '../lib/cache.js';
import { createLogger } from '../lib/logger.js';
import { createAIService } from '../services/aiService.js';
import type { ModelClient, ModelRequest } from '../services/gemini.js';

/** A complete, valid event brief shared by the server tests. */
export const BRIEF: EventBrief = {
  type: 'wedding',
  name: 'Meera & Arjun',
  date: '2030-02-14',
  startTime: '18:00',
  city: 'Jaipur',
  venue: '',
  guestCount: 200,
  budget: 2_500_000,
  currency: 'INR',
  style: 'royal',
  dietary: ['vegetarian'],
  accessibility: '',
  cultural: 'Sangeet the night before',
  notes: '',
};

/** A valid plan, as a well-behaved model would return it. */
export const MODEL_PLAN = {
  ...generateDemoPlan(BRIEF),
  concept: { ...generateDemoPlan(BRIEF).concept, title: 'Live Gemini Plan' },
};
/** Valid themes, as a well-behaved model would return them. */
export const MODEL_THEMES = generateDemoThemes(BRIEF);

/** A fake model client whose responses are scripted per test. */
export interface FakeModel extends ModelClient {
  generateJson: ReturnType<typeof vi.fn<(request: ModelRequest) => Promise<string>>>;
}

/** Model client that answers with `responses` in order (repeating the last); an `Error` entry makes that call reject. */
export function fakeModel(...responses: (string | Error)[]): FakeModel {
  const queue = [...responses];
  return {
    generateJson: vi.fn((_request: ModelRequest) => {
      const next = queue.length > 1 ? queue.shift() : queue[0];
      if (next === undefined) return Promise.reject(new Error('No scripted response'));
      return next instanceof Error ? Promise.reject(next) : Promise.resolve(next);
    }),
  };
}

interface TestAppOptions {
  client?: ModelClient | null;
  rateLimitMax?: number;
  timeoutMs?: number;
  allowedOrigins?: string[];
  staticDir?: string;
  serveStatic?: boolean;
}

const DEFAULT_TEST_TIMEOUT_MS = 2_000;
const DEFAULT_TEST_RATE_LIMIT = 100;

/** Builds the real Express app with injected fakes and a silent logger. */
export function buildTestApp({
  client = null,
  rateLimitMax = DEFAULT_TEST_RATE_LIMIT,
  timeoutMs = DEFAULT_TEST_TIMEOUT_MS,
  allowedOrigins = [],
  staticDir = 'does-not-exist',
  serveStatic = false,
}: TestAppOptions = {}): Express {
  const logger = createLogger({ silent: true });
  const aiService = createAIService({
    client,
    model: 'test-model',
    timeoutMs,
    cache: new TtlLruCache<unknown>({ maxEntries: 10, ttlMs: 60_000 }),
    logger,
  });
  return createApp({
    config: { allowedOrigins, staticDir, rateLimit: { windowMs: 60_000, max: rateLimitMax } },
    aiService,
    logger,
    serveStatic,
  });
}

/** Typed view of an AI success response (supertest types bodies as `any`). */
export function aiBody<T = unknown>(response: { body: unknown }): AIResponseBody<T> {
  return response.body as AIResponseBody<T>;
}

/** Typed view of an error response in the shared error shape. */
export function errorBody(response: { body: unknown }): ApiErrorBody['error'] {
  return (response.body as ApiErrorBody).error;
}

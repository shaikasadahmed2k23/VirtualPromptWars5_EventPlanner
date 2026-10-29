import type { ZodType } from 'zod';
import {
  aiPlanSchema,
  themesResponseSchema,
  type AIPlan,
  type EventBrief,
  type ThemesResponse,
} from '../../shared/ai.js';
import type { AIMode } from '../../shared/api.js';
import { hashValue } from '../../shared/hash.js';
import type { TtlLruCache } from '../lib/cache.js';
import type { Logger } from '../lib/logger.js';
import { demoContent } from './demo.js';
import type { ModelClient } from './gemini.js';
import { PLAN_MODEL_SCHEMA, THEMES_MODEL_SCHEMA } from './modelSchemas.js';
import { buildPlanPrompt, buildRefinePrompt, buildThemesPrompt, SYSTEM_INSTRUCTION } from './prompts.js';
import { parseModelJson, raceAbort } from './modelOutput.js';

/** Result of an AI operation, with provenance. */
export interface AIResult<T> {
  data: T;
  aiMode: AIMode;
  cached: boolean;
}

/** High-level AI operations used by the routes. */
export interface AIService {
  /** `live` when a model client is configured, else `demo`. */
  readonly mode: AIMode;
  plan: (brief: EventBrief) => Promise<AIResult<AIPlan>>;
  refine: (brief: EventBrief, plan: AIPlan, instruction: string) => Promise<AIResult<AIPlan>>;
  themes: (brief: EventBrief) => Promise<AIResult<ThemesResponse>>;
}

interface AIServiceDeps {
  client: ModelClient | null;
  model: string;
  timeoutMs: number;
  cache: TtlLruCache<unknown>;
  logger: Logger;
}

interface StructuredTask<T> {
  kind: 'plan' | 'refine' | 'themes';
  cacheInput: unknown;
  prompt: string;
  schema: ZodType<T>;
  modelSchema: object;
  demo: () => T;
}

/** HTTP status reported by the provider SDK, if any (never the message, which may echo input). */
const providerStatus = (error: unknown): number | null =>
  typeof error === 'object' && error !== null && typeof (error as { status?: unknown }).status === 'number'
    ? (error as { status: number }).status
    : null;

const errorName = (error: unknown): string => (error instanceof Error ? error.name : 'model_error');

const delay = (ms: number) =>
  new Promise<void>((resolve) => {
    setTimeout(resolve, ms);
  });

/** Attempts per request: one call plus one retry (malformed output or a transient error). */
const MAX_ATTEMPTS = 2;

/** Provider statuses worth one more try: rate limiting and temporary overload. */
const RETRYABLE_STATUSES: ReadonlySet<number> = new Set([429, 500, 503]);

/** Pause before retrying a transient provider error. */
const RETRY_BACKOFF_MS = 600;

/**
 * Orchestrates every AI request: cache → Gemini (structured output) → shared
 * Zod validation → one retry on malformed output or a transient provider error
 * → demo fallback on any other failure or the deadline. Only validated live
 * responses are cached.
 */
export function createAIService({ client, model, timeoutMs, cache, logger }: AIServiceDeps): AIService {
  async function run<T>(task: StructuredTask<T>): Promise<AIResult<T>> {
    const demo = (reason: string, status: number | null = null): AIResult<T> => {
      logger.warn('ai_demo_fallback', { kind: task.kind, reason, status });
      return { data: task.demo(), aiMode: 'demo', cached: false };
    };
    if (!client) return { data: task.demo(), aiMode: 'demo', cached: false };

    const key = hashValue({ kind: task.kind, model, input: task.cacheInput });
    const hit = task.schema.safeParse(cache.get(key));
    if (hit.success) return { data: hit.data, aiMode: 'live', cached: true };

    const signal = AbortSignal.timeout(timeoutMs);
    for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt += 1) {
      let raw: string;
      try {
        const request = {
          systemInstruction: SYSTEM_INSTRUCTION,
          prompt: task.prompt,
          responseSchema: task.modelSchema,
          signal,
        };
        raw = await raceAbort(client.generateJson(request), signal);
      } catch (error: unknown) {
        if (signal.aborted) return demo('timeout');
        const status = providerStatus(error);
        if (status !== null && RETRYABLE_STATUSES.has(status) && attempt < MAX_ATTEMPTS) {
          logger.warn('ai_transient_error', { kind: task.kind, attempt, status });
          await delay(RETRY_BACKOFF_MS);
          continue;
        }
        return demo(errorName(error), status);
      }
      const parsed = parseModelJson(raw, task.schema);
      if (parsed.success) {
        cache.set(key, parsed.data);
        return { data: parsed.data, aiMode: 'live', cached: false };
      }
      logger.warn('ai_malformed_output', { kind: task.kind, attempt });
    }
    return demo('malformed_output');
  }

  return {
    mode: client ? 'live' : 'demo',
    plan: (brief) =>
      run({
        kind: 'plan',
        cacheInput: brief,
        prompt: buildPlanPrompt(brief),
        schema: aiPlanSchema,
        modelSchema: PLAN_MODEL_SCHEMA,
        demo: () => demoContent.plan(brief),
      }),
    refine: (brief, plan, instruction) =>
      run({
        kind: 'refine',
        cacheInput: { brief, plan, instruction },
        prompt: buildRefinePrompt(brief, plan, instruction),
        schema: aiPlanSchema,
        modelSchema: PLAN_MODEL_SCHEMA,
        demo: () => demoContent.refine(brief, instruction),
      }),
    themes: (brief) =>
      run({
        kind: 'themes',
        cacheInput: brief,
        prompt: buildThemesPrompt(brief),
        schema: themesResponseSchema,
        modelSchema: THEMES_MODEL_SCHEMA,
        demo: () => demoContent.themes(brief),
      }),
  };
}

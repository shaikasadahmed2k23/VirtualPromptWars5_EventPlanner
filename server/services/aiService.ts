import type { AIPlan, EventBrief, ThemesResponse } from '../../shared/ai.js';
import type { AIMode } from '../../shared/api.js';
import { hashValue } from '../../shared/hash.js';
import type { TtlLruCache } from '../lib/cache.js';
import { HTTP_STATUS, statusOf } from '../lib/errors.js';
import type { Logger } from '../lib/logger.js';
import { planTask, refineTask, type StructuredTask, themesTask } from './aiTasks.js';
import type { ModelClient } from './gemini.js';
import { parseModelJson, raceAbort } from './modelOutput.js';
import { SYSTEM_INSTRUCTION } from './prompts.js';

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

/** What one model call produced: valid data, a reason to try again, or a reason to give up. */
type AttemptOutcome<T> =
  | { type: 'success'; data: T }
  | { type: 'retry'; event: 'ai_transient_error' | 'ai_malformed_output'; reason: string; status: number | null }
  | { type: 'fail'; reason: string; status: number | null };

const errorName = (error: unknown): string => (error instanceof Error ? error.name : 'model_error');

const delay = (ms: number) =>
  new Promise<void>((resolve) => {
    setTimeout(resolve, ms);
  });

/** Attempts per request: one call plus one retry (malformed output or a transient error). */
const MAX_ATTEMPTS = 2;

/** Provider statuses worth one more try: rate limiting and temporary overload. */
const RETRYABLE_STATUSES: ReadonlySet<number> = new Set([
  HTTP_STATUS.tooManyRequests,
  HTTP_STATUS.internalError,
  HTTP_STATUS.serviceUnavailable,
]);

/** Pause before retrying a transient provider error. */
const RETRY_BACKOFF_MS = 600;

/** One structured-output call, classified. Never throws. */
async function attemptOnce<T>(
  client: ModelClient,
  task: StructuredTask<T>,
  signal: AbortSignal,
): Promise<AttemptOutcome<T>> {
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
    if (signal.aborted) return { type: 'fail', reason: 'timeout', status: null };
    const status = statusOf(error);
    if (status !== null && RETRYABLE_STATUSES.has(status))
      return { type: 'retry', event: 'ai_transient_error', reason: errorName(error), status };
    return { type: 'fail', reason: errorName(error), status };
  }
  const parsed = parseModelJson(raw, task.schema);
  return parsed.success
    ? { type: 'success', data: parsed.data }
    : { type: 'retry', event: 'ai_malformed_output', reason: 'malformed_output', status: null };
}

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
    let lastFailure: { reason: string; status: number | null } = { reason: 'malformed_output', status: null };
    for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt += 1) {
      const outcome = await attemptOnce(client, task, signal);
      if (outcome.type === 'success') {
        cache.set(key, outcome.data);
        return { data: outcome.data, aiMode: 'live', cached: false };
      }
      if (outcome.type === 'fail') return demo(outcome.reason, outcome.status);
      lastFailure = outcome;
      logger.warn(outcome.event, { kind: task.kind, attempt, status: outcome.status });
      if (outcome.event === 'ai_transient_error' && attempt < MAX_ATTEMPTS) await delay(RETRY_BACKOFF_MS);
    }
    return demo(lastFailure.reason, lastFailure.status);
  }

  return {
    mode: client ? 'live' : 'demo',
    plan: (brief) => run(planTask(brief)),
    refine: (brief, plan, instruction) => run(refineTask(brief, plan, instruction)),
    themes: (brief) => run(themesTask(brief)),
  };
}

import type { ZodType } from 'zod';
import { type AIPlan, aiPlanSchema, type EventBrief, type ThemesResponse, themesResponseSchema } from '@shared/ai';
import { type AIMode, API_ROUTES } from '@shared/api';
import { generateDemoPlan } from '@shared/demo/plan';
import { generateDemoThemes } from '@shared/demo/themes';
import { ApiClientError, type ClientErrorCode, postAI } from '@/lib/apiClient';
import { aiCacheKey, readCachedResponse, writeCachedResponse } from './responseCache';

/** An AI result and where it came from. */
export interface AIOutcome<T> {
  data: T;
  aiMode: AIMode;
}

interface RequestOptions {
  signal?: AbortSignal;
  /** Skip the client cache (e.g. "Regenerate"). */
  force?: boolean;
}

/**
 * Failures where the server itself is unavailable (offline, static-only
 * hosting, a broken deploy). The app stays fully usable by generating demo
 * content locally. Rate limits, validation errors and timeouts are surfaced
 * to the user instead, with a retry.
 */
const CLIENT_FALLBACK_CODES: ReadonlySet<ClientErrorCode> = new Set([
  'NETWORK_ERROR',
  'BAD_RESPONSE',
  'NOT_FOUND',
  'INTERNAL_ERROR',
]);

/** One AI endpoint call: what to send, how to validate it, and the local demo equivalent. */
interface AIRequestSpec<T> {
  /** Cache namespace. */
  kind: string;
  path: string;
  body: unknown;
  schema: ZodType<T>;
  demo: () => T;
}

async function requestWithFallback<T>(
  { kind, path, body, schema, demo }: AIRequestSpec<T>,
  { signal, force = false }: RequestOptions,
): Promise<AIOutcome<T>> {
  const key = aiCacheKey(kind, body);
  const cached = force ? undefined : readCachedResponse(key, schema);
  if (cached) return { data: cached, aiMode: 'live' };

  try {
    const { data, meta } = await postAI(path, body, { schema, ...(signal ? { signal } : {}) });
    if (meta.aiMode === 'live') writeCachedResponse(key, data);
    return { data, aiMode: meta.aiMode };
  } catch (error: unknown) {
    if (error instanceof ApiClientError && CLIENT_FALLBACK_CODES.has(error.code)) {
      return { data: demo(), aiMode: 'demo' };
    }
    throw error;
  }
}

/** Generates a full plan for the event. */
export function requestPlan(brief: EventBrief, options: RequestOptions = {}): Promise<AIOutcome<AIPlan>> {
  return requestWithFallback(
    { kind: 'plan', path: API_ROUTES.plan, body: { brief }, schema: aiPlanSchema, demo: () => generateDemoPlan(brief) },
    options,
  );
}

/** Revises an existing plan according to one instruction. */
export function requestRefinedPlan(
  brief: EventBrief,
  plan: AIPlan,
  instruction: string,
  options: RequestOptions = {},
): Promise<AIOutcome<AIPlan>> {
  return requestWithFallback(
    {
      kind: 'refine',
      path: API_ROUTES.refine,
      body: { brief, plan, instruction },
      schema: aiPlanSchema,
      demo: () => generateDemoPlan(brief, [instruction]),
    },
    options,
  );
}

/** Generates three theme options for the event. */
export function requestThemes(brief: EventBrief, options: RequestOptions = {}): Promise<AIOutcome<ThemesResponse>> {
  return requestWithFallback(
    {
      kind: 'themes',
      path: API_ROUTES.themes,
      body: { brief },
      schema: themesResponseSchema,
      demo: () => generateDemoThemes(brief),
    },
    options,
  );
}

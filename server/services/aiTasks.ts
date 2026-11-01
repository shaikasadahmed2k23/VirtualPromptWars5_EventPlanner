import type { ZodType } from 'zod';
import {
  type AIPlan,
  aiPlanSchema,
  type EventBrief,
  type ThemesResponse,
  themesResponseSchema,
} from '../../shared/ai.js';
import { demoContent } from './demo.js';
import { PLAN_MODEL_SCHEMA, THEMES_MODEL_SCHEMA } from './modelSchemas.js';
import { buildPlanPrompt, buildRefinePrompt, buildThemesPrompt } from './prompts.js';

/** Everything the AI service needs to run one kind of request, independent of how it runs it. */
export interface StructuredTask<T> {
  kind: 'plan' | 'refine' | 'themes';
  /** Identifies the request for caching (hashed with the kind and model). */
  cacheInput: unknown;
  prompt: string;
  /** Validates the model's JSON; the same schema the client uses. */
  schema: ZodType<T>;
  /** Structured-output JSON schema sent to Gemini. */
  modelSchema: object;
  /** Deterministic fallback built from the same input. */
  demo: () => T;
}

/** A full plan from the brief. */
export function planTask(brief: EventBrief): StructuredTask<AIPlan> {
  return {
    kind: 'plan',
    cacheInput: brief,
    prompt: buildPlanPrompt(brief),
    schema: aiPlanSchema,
    modelSchema: PLAN_MODEL_SCHEMA,
    demo: () => demoContent.plan(brief),
  };
}

/** The current plan revised by one instruction. */
export function refineTask(brief: EventBrief, plan: AIPlan, instruction: string): StructuredTask<AIPlan> {
  return {
    kind: 'refine',
    cacheInput: { brief, plan, instruction },
    prompt: buildRefinePrompt(brief, plan, instruction),
    schema: aiPlanSchema,
    modelSchema: PLAN_MODEL_SCHEMA,
    demo: () => demoContent.refine(brief, instruction),
  };
}

/** Three theme options for the brief. */
export function themesTask(brief: EventBrief): StructuredTask<ThemesResponse> {
  return {
    kind: 'themes',
    cacheInput: brief,
    prompt: buildThemesPrompt(brief),
    schema: themesResponseSchema,
    modelSchema: THEMES_MODEL_SCHEMA,
    demo: () => demoContent.themes(brief),
  };
}

import type { ZodType } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';
import { aiPlanSchema, themesResponseSchema } from '../../shared/ai.js';

/**
 * Keywords removed from the schema sent to Gemini. Some are unsupported;
 * the rest (array lengths, numeric bounds, string formats) make the
 * constrained decoder too complex ("too many states for serving") once
 * nested. The model schema therefore carries only the *shape*: types,
 * properties, required fields and enums. Every count and range is still
 * enforced by the shared Zod schema when the response is validated, with
 * retry-then-fallback on failure, and the prompt states the expected counts.
 */
const STRIPPED_KEYWORDS = new Set([
  '$schema',
  'additionalProperties',
  'default',
  'pattern',
  'minLength',
  'maxLength',
  'minItems',
  'maxItems',
  'minimum',
  'maximum',
  'exclusiveMinimum',
  'exclusiveMaximum',
]);

function sanitise(node: unknown): unknown {
  if (Array.isArray(node)) return node.map(sanitise);
  if (typeof node !== 'object' || node === null) return node;
  return Object.fromEntries(
    Object.entries(node)
      .filter(([key]) => !STRIPPED_KEYWORDS.has(key))
      .map(([key, value]) => [key, sanitise(value)]),
  );
}

/** Converts a shared Zod schema into the JSON Schema sent to Gemini. */
function toModelSchema(schema: ZodType<unknown>): object {
  return sanitise(zodToJsonSchema(schema, { $refStrategy: 'none', target: 'jsonSchema7' })) as object;
}

/** Structured-output schemas, derived once at startup from the same Zod schemas used for validation. */
export const PLAN_MODEL_SCHEMA = toModelSchema(aiPlanSchema);
export const THEMES_MODEL_SCHEMA = toModelSchema(themesResponseSchema);

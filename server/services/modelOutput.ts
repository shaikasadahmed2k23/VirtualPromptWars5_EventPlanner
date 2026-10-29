import type { ZodType } from 'zod';

const CODE_FENCE = /^```(?:json)?\s*([\s\S]*?)\s*```$/;

/** Result of parsing model text against a schema. */
export type ParseResult<T> = { success: true; data: T } | { success: false };

/**
 * Parses raw model text as JSON (tolerating a stray markdown code fence) and
 * validates it with the shared Zod schema. Never throws.
 */
export function parseModelJson<T>(raw: string, schema: ZodType<T>): ParseResult<T> {
  const trimmed = raw.trim();
  const json = CODE_FENCE.exec(trimmed)?.[1] ?? trimmed;
  let value: unknown;
  try {
    value = JSON.parse(json);
  } catch (error: unknown) {
    if (error instanceof SyntaxError) return { success: false };
    throw error;
  }
  const result = schema.safeParse(value);
  return result.success ? { success: true, data: result.data } : { success: false };
}

/**
 * Rejects as soon as `signal` aborts, even if the underlying promise ignores
 * the signal, so a hung provider call can never exceed the deadline.
 */
export function raceAbort<T>(promise: Promise<T>, signal: AbortSignal): Promise<T> {
  if (signal.aborted) return Promise.reject(signal.reason as Error);
  return new Promise<T>((resolve, reject) => {
    const onAbort = () => {
      reject(signal.reason as Error);
    };
    signal.addEventListener('abort', onAbort, { once: true });
    promise.then(
      (value) => {
        signal.removeEventListener('abort', onAbort);
        resolve(value);
      },
      (error: unknown) => {
        signal.removeEventListener('abort', onAbort);
        reject(error instanceof Error ? error : new Error(String(error)));
      },
    );
  });
}

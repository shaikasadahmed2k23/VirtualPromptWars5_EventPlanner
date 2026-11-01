import { z, type ZodType } from 'zod';
import { type AIResponseMeta, API_ERROR_CODES, type ApiErrorCode } from '@shared/api';
import { AI_REQUEST_TIMEOUT_MS } from './constants';

/** Error codes the client can raise: the server's plus transport-level failures. */
export type ClientErrorCode = ApiErrorCode | 'NETWORK_ERROR' | 'TIMEOUT' | 'BAD_RESPONSE' | 'ABORTED';

/** A failed API call, with a machine-readable code and a user-safe message. */
export class ApiClientError extends Error {
  constructor(
    readonly code: ClientErrorCode,
    message: string,
    readonly status: number | null = null,
  ) {
    super(message);
    this.name = 'ApiClientError';
  }
}

const apiErrorBodySchema = z.object({
  error: z.object({ code: z.enum(API_ERROR_CODES), message: z.string() }),
});

const aiMetaSchema = z.object({
  aiMode: z.enum(['live', 'demo']),
  cached: z.boolean(),
  generatedAt: z.string(),
});

const envelopeSchema = z.object({ data: z.unknown(), meta: aiMetaSchema });

interface PostOptions<T> {
  /** Validates the `data` payload (the shared Zod schema for this endpoint). */
  schema: ZodType<T>;
  /** Cancels the request (e.g. when the user leaves the page). */
  signal?: AbortSignal;
  timeoutMs?: number;
}

async function readJson(response: Response): Promise<unknown> {
  try {
    return (await response.json()) as unknown;
  } catch (error: unknown) {
    if (error instanceof SyntaxError) return null;
    throw error;
  }
}

/** Sends the request, turning transport failures (cancel, deadline, offline) into typed client errors. */
async function sendJson(
  path: string,
  body: unknown,
  { signal, timeoutMs }: { signal: AbortSignal | undefined; timeoutMs: number },
): Promise<Response> {
  const timeout = AbortSignal.timeout(timeoutMs);
  try {
    return await fetch(path, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(body),
      credentials: 'same-origin',
      signal: signal ? AbortSignal.any([signal, timeout]) : timeout,
    });
  } catch (error: unknown) {
    if (signal?.aborted) throw new ApiClientError('ABORTED', 'The request was cancelled.');
    if (timeout.aborted) throw new ApiClientError('TIMEOUT', 'The planner took too long to respond.');
    throw new ApiClientError('NETWORK_ERROR', error instanceof Error ? error.message : 'Network request failed.');
  }
}

/**
 * POSTs JSON to an AI endpoint and returns the validated payload and metadata.
 * Never trusts the response: both the envelope and `data` are schema-checked.
 */
export async function postAI<T>(
  path: string,
  body: unknown,
  { schema, signal, timeoutMs = AI_REQUEST_TIMEOUT_MS }: PostOptions<T>,
): Promise<{ data: T; meta: AIResponseMeta }> {
  const response = await sendJson(path, body, { signal, timeoutMs });
  const payload = await readJson(response);
  if (!response.ok) {
    const parsed = apiErrorBodySchema.safeParse(payload);
    throw parsed.success
      ? new ApiClientError(parsed.data.error.code, parsed.data.error.message, response.status)
      : new ApiClientError('BAD_RESPONSE', `Unexpected response (${String(response.status)}).`, response.status);
  }

  const envelope = envelopeSchema.safeParse(payload);
  const data = envelope.success ? schema.safeParse(envelope.data.data) : null;
  if (!envelope.success || !data?.success) {
    throw new ApiClientError('BAD_RESPONSE', 'The planner returned an unexpected response.', response.status);
  }
  return { data: data.data, meta: envelope.data.meta };
}

const FRIENDLY_MESSAGES: Partial<Record<ClientErrorCode, string>> = {
  RATE_LIMITED: 'You’ve made a lot of requests in a short time. Please wait a minute and try again.',
  TIMEOUT: 'The planner is taking longer than usual. Please try again.',
  VALIDATION_ERROR: 'Some event details are missing or too long. Check the event, then try again.',
  PAYLOAD_TOO_LARGE: 'This request is too large. Try a shorter instruction.',
};

/** User-facing message for any error thrown by the API client. */
export function describeApiError(error: unknown): string {
  if (error instanceof ApiClientError) return FRIENDLY_MESSAGES[error.code] ?? error.message;
  return 'Something went wrong while contacting the planner. Please try again.';
}

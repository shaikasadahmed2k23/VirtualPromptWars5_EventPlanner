/**
 * HTTP contract between the SPA and the Express AI proxy.
 * Every error response uses {@link ApiErrorBody}; no stack traces are ever sent.
 */

/** Machine-readable error codes returned by the API. */
export const API_ERROR_CODES = [
  'VALIDATION_ERROR',
  'PAYLOAD_TOO_LARGE',
  'FORBIDDEN_ORIGIN',
  'RATE_LIMITED',
  'NOT_FOUND',
  'INTERNAL_ERROR',
] as const;
export type ApiErrorCode = (typeof API_ERROR_CODES)[number];

/** Consistent JSON error shape. */
export interface ApiErrorBody {
  error: {
    code: ApiErrorCode;
    message: string;
    /** Field-level validation issues, when `code` is `VALIDATION_ERROR`. */
    issues?: { path: string; message: string }[];
  };
}

/**
 * Where AI content came from: `live` from Gemini, or `demo` from the
 * input-aware offline generators (no key configured, or Gemini failed).
 */
export type AIMode = 'live' | 'demo';

/** Metadata attached to every AI response. */
export interface AIResponseMeta {
  aiMode: AIMode;
  /** True when served from the server's response cache. */
  cached: boolean;
  generatedAt: string;
}

/** Successful AI response envelope. */
export interface AIResponseBody<T> {
  data: T;
  meta: AIResponseMeta;
}

/** `GET /api/health` payload. Deliberately reveals nothing beyond the mode. */
export interface HealthBody {
  status: 'ok';
  aiMode: AIMode;
}

/** Route paths exposed by the proxy. */
export const API_ROUTES = {
  health: '/api/health',
  plan: '/api/plan',
  refine: '/api/plan/refine',
  themes: '/api/themes',
} as const;

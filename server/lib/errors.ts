import type { Response } from 'express';
import type { ApiErrorBody, ApiErrorCode } from '../../shared/api.js';

type Issues = NonNullable<ApiErrorBody['error']['issues']>;

/** HTTP statuses the API answers with, by meaning. */
export const HTTP_STATUS = {
  badRequest: 400,
  forbidden: 403,
  notFound: 404,
  payloadTooLarge: 413,
  tooManyRequests: 429,
  internalError: 500,
  serviceUnavailable: 503,
} as const;

/** An error that maps directly onto an HTTP response in the shared error shape. */
export class ApiError extends Error {
  constructor(
    readonly status: number,
    readonly code: ApiErrorCode,
    message: string,
    readonly issues?: Issues,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/** Sends `{ error: { code, message, issues? } }` with the error's status. Every API error response goes through here. */
export function sendError(res: Response, error: ApiError): void {
  const { status, code, message, issues } = error;
  const body: ApiErrorBody = { error: { code, message, ...(issues ? { issues } : {}) } };
  res.status(status).json(body);
}

/** Numeric `status` carried by HTTP-ish errors (provider SDK, `send`), if any. Never reads the message, which may echo input. */
export function statusOf(error: unknown): number | null {
  if (typeof error !== 'object' || error === null || !('status' in error)) return null;
  return typeof error.status === 'number' ? error.status : null;
}

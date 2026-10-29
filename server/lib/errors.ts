import type { Response } from 'express';
import type { ApiErrorBody, ApiErrorCode } from '../../shared/api.js';

type Issues = NonNullable<ApiErrorBody['error']['issues']>;

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

/** Sends `{ error: { code, message, issues? } }` with the given status. */
export function sendError(res: Response, status: number, code: ApiErrorCode, message: string, issues?: Issues): void {
  const body: ApiErrorBody = { error: { code, message, ...(issues ? { issues } : {}) } };
  res.status(status).json(body);
}

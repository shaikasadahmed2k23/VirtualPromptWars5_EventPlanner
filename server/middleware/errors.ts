import type { ErrorRequestHandler, RequestHandler } from 'express';
import { ApiError, HTTP_STATUS, sendError, statusOf } from '../lib/errors.js';
import type { Logger } from '../lib/logger.js';

/** Body-parser failure types that are the client's fault, mapped to the error they should see. */
const BODY_PARSER_ERRORS: ReadonlyMap<string, ApiError> = new Map([
  [
    'entity.too.large',
    new ApiError(HTTP_STATUS.payloadTooLarge, 'PAYLOAD_TOO_LARGE', 'The request body is too large.'),
  ],
  [
    'entity.parse.failed',
    new ApiError(HTTP_STATUS.badRequest, 'VALIDATION_ERROR', 'The request body is not valid JSON.'),
  ],
]);

const NOT_FOUND = new ApiError(HTTP_STATUS.notFound, 'NOT_FOUND', 'Not found.');
const INTERNAL_ERROR = new ApiError(
  HTTP_STATUS.internalError,
  'INTERNAL_ERROR',
  'Something went wrong. Please try again.',
);

/** Express's JSON body parser tags its errors with a string `type`. */
function bodyParserErrorType(error: unknown): string | null {
  if (typeof error !== 'object' || error === null || !('type' in error)) return null;
  return typeof error.type === 'string' ? error.type : null;
}

/** Maps a thrown value to the client-facing error, or `null` when it is unexpected. */
function toApiError(error: unknown): ApiError | null {
  if (error instanceof ApiError) return error;
  const parserType = bodyParserErrorType(error);
  const parserError = parserType === null ? undefined : BODY_PARSER_ERRORS.get(parserType);
  if (parserError) return parserError;
  return statusOf(error) === HTTP_STATUS.notFound ? NOT_FOUND : null;
}

/** 404 for unknown API routes, in the shared error shape. */
export const apiNotFound: RequestHandler = (_req, res) => {
  sendError(res, new ApiError(HTTP_STATUS.notFound, 'NOT_FOUND', 'No such API endpoint.'));
};

/**
 * Final error handler: maps known errors to the shared error shape and
 * hides everything else behind a generic 500. Stack traces never leave the server.
 */
export function errorHandler(logger: Logger): ErrorRequestHandler {
  return (error: unknown, _req, res, _next) => {
    const known = toApiError(error);
    if (known) {
      sendError(res, known);
      return;
    }
    logger.error('unhandled_error', { name: error instanceof Error ? error.name : 'unknown' });
    sendError(res, INTERNAL_ERROR);
  };
}

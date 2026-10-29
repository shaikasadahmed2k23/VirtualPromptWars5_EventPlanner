import type { ErrorRequestHandler, RequestHandler } from 'express';
import { ApiError, sendError } from '../lib/errors.js';
import type { Logger } from '../lib/logger.js';

/** Lower-level HTTP errors (e.g. from `send`) carry a numeric status. */
const httpStatusOf = (error: unknown): number | null =>
  typeof error === 'object' && error !== null && typeof (error as { status?: unknown }).status === 'number'
    ? (error as { status: number }).status
    : null;

/** Error shape produced by Express's built-in JSON body parser. */
interface BodyParserError {
  type: string;
}

const isBodyParserError = (error: unknown): error is BodyParserError =>
  typeof error === 'object' && error !== null && typeof (error as { type?: unknown }).type === 'string';

/** 404 for unknown API routes, in the shared error shape. */
export const apiNotFound: RequestHandler = (_req, res) => {
  sendError(res, 404, 'NOT_FOUND', 'No such API endpoint.');
};

/**
 * Final error handler: maps known errors to the shared error shape and
 * hides everything else behind a generic 500. Stack traces never leave the server.
 */
export function errorHandler(logger: Logger): ErrorRequestHandler {
  return (error: unknown, _req, res, _next) => {
    if (error instanceof ApiError) {
      sendError(res, error.status, error.code, error.message, error.issues);
      return;
    }
    if (isBodyParserError(error) && error.type === 'entity.too.large') {
      sendError(res, 413, 'PAYLOAD_TOO_LARGE', 'The request body is too large.');
      return;
    }
    if (isBodyParserError(error) && error.type === 'entity.parse.failed') {
      sendError(res, 400, 'VALIDATION_ERROR', 'The request body is not valid JSON.');
      return;
    }
    if (httpStatusOf(error) === 404) {
      sendError(res, 404, 'NOT_FOUND', 'Not found.');
      return;
    }
    logger.error('unhandled_error', { name: error instanceof Error ? error.name : 'unknown' });
    sendError(res, 500, 'INTERNAL_ERROR', 'Something went wrong. Please try again.');
  };
}

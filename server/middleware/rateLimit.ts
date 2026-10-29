import type { RequestHandler } from 'express';
import { rateLimit } from 'express-rate-limit';
import { sendError } from '../lib/errors.js';

/** Per-IP request limit for the API, answered in the shared error shape. */
export function apiRateLimit({ windowMs, max }: { windowMs: number; max: number }): RequestHandler {
  return rateLimit({
    windowMs,
    limit: max,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    handler: (_req, res) => {
      sendError(res, 429, 'RATE_LIMITED', 'Too many requests. Please wait a minute and try again.');
    },
  });
}

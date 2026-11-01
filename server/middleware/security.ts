import cors from 'cors';
import type { Request, RequestHandler } from 'express';
import helmet from 'helmet';
import { CSP_DIRECTIVES } from '../../shared/csp.js';
import { ApiError, HTTP_STATUS, sendError } from '../lib/errors.js';

/** How long browsers may cache a CORS preflight answer. */
const CORS_MAX_AGE_SECONDS = 600;

const FORBIDDEN_ORIGIN = new ApiError(
  HTTP_STATUS.forbidden,
  'FORBIDDEN_ORIGIN',
  'This origin is not allowed to call the API.',
);

/** Security headers via helmet, enforcing the CSP shared with the SPA build. */
export function securityHeaders(): RequestHandler {
  const directives = Object.fromEntries(Object.entries(CSP_DIRECTIVES).map(([name, sources]) => [name, [...sources]]));
  return helmet({
    contentSecurityPolicy: { useDefaults: false, directives },
    referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
  });
}

const ownOrigin = (req: Request): string => `${req.protocol}://${req.get('host') ?? ''}`;

/**
 * Rejects cross-origin API calls unless the origin is explicitly allowed.
 * Requests without an `Origin` header (curl, server-to-server) and
 * same-origin requests from the bundled SPA pass through.
 */
export function originGuard(allowedOrigins: readonly string[]): RequestHandler {
  return (req, res, next) => {
    const origin = req.get('origin');
    if (!origin || origin === ownOrigin(req) || allowedOrigins.includes(origin)) {
      next();
      return;
    }
    sendError(res, FORBIDDEN_ORIGIN);
  };
}

/** CORS headers for the explicitly allowed origins only. */
export function corsForAllowedOrigins(allowedOrigins: readonly string[]): RequestHandler {
  return cors({ origin: [...allowedOrigins], methods: ['GET', 'POST'], maxAge: CORS_MAX_AGE_SECONDS });
}

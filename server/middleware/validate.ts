import type { Request, RequestHandler, Response } from 'express';
import type { z, ZodTypeAny } from 'zod';
import { ApiError } from '../lib/errors.js';

/**
 * Wraps a route handler so it only runs with a body that passed `schema`.
 * Invalid bodies become a 400 `VALIDATION_ERROR` listing each field issue.
 */
export function withValidatedBody<S extends ZodTypeAny>(
  schema: S,
  handler: (body: z.output<S>, req: Request, res: Response) => Promise<void>,
): RequestHandler {
  return async (req, res) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const issues = result.error.issues.map((issue) => ({ path: issue.path.join('.'), message: issue.message }));
      throw new ApiError(400, 'VALIDATION_ERROR', 'The request body is invalid.', issues);
    }
    await handler(result.data as z.output<S>, req, res);
  };
}

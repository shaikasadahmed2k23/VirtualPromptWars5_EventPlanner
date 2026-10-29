import { Router, type Response } from 'express';
import { planRequestSchema, refineRequestSchema, themesRequestSchema } from '../../shared/ai.js';
import { API_ROUTES, type AIResponseBody, type HealthBody } from '../../shared/api.js';
import { withValidatedBody } from '../middleware/validate.js';
import type { AIResult, AIService } from '../services/aiService.js';

const API_PREFIX = '/api';
/** Route paths relative to the `/api` mount point, derived from the shared contract. */
const relative = (route: string) => route.slice(API_PREFIX.length);

function sendResult<T>(res: Response, result: AIResult<T>): void {
  const body: AIResponseBody<T> = {
    data: result.data,
    meta: { aiMode: result.aiMode, cached: result.cached, generatedAt: new Date().toISOString() },
  };
  res.json(body);
}

/** Health check and AI endpoints, mounted at `/api`. */
export function createApiRouter(service: AIService): Router {
  const router = Router();

  router.get(relative(API_ROUTES.health), (_req, res) => {
    const body: HealthBody = { status: 'ok', aiMode: service.mode };
    res.json(body);
  });

  router.post(
    relative(API_ROUTES.plan),
    withValidatedBody(planRequestSchema, async ({ brief }, _req, res) => {
      sendResult(res, await service.plan(brief));
    }),
  );

  router.post(
    relative(API_ROUTES.refine),
    withValidatedBody(refineRequestSchema, async ({ brief, plan, instruction }, _req, res) => {
      sendResult(res, await service.refine(brief, plan, instruction));
    }),
  );

  router.post(
    relative(API_ROUTES.themes),
    withValidatedBody(themesRequestSchema, async ({ brief }, _req, res) => {
      sendResult(res, await service.themes(brief));
    }),
  );

  return router;
}

import { aiPlanSchema } from '@shared/ai';
import { generateDemoPlan } from '@shared/demo/plan';
import { createSeedEvent, createSeedPlan } from '@/data/seed';
import { migrateEventsV1 } from '@/features/events/store/migrations';
import { ApiClientError, describeApiError, postAI } from '@/lib/apiClient';
import { STORAGE_KEYS } from '@/lib/constants';
import { aiResponse, jsonResponse, mockFetch } from '@/test/mockFetch';
import { migrateAssistantV1 } from '../store/migrations';
import { requestPlan } from './aiRequests';
import { budgetFromAllocation, budgetFromIdea, taskFromIdea, taskFromSuggestion } from './planActions';
import { aiCacheKey, clearResponseCache, readCachedResponse, writeCachedResponse } from './responseCache';
import { toEventBrief } from './toEventBrief';

const event = createSeedEvent();
const plan = createSeedPlan().plan;
const TODAY = '2026-10-29';

beforeEach(() => {
  clearResponseCache();
});

describe('plan actions', () => {
  it('schedules suggested tasks by months before the event, never in the past', () => {
    const task = taskFromSuggestion(
      { title: 'Book DJ', category: 'vendors', priority: 'high', monthsBefore: 2 },
      event,
      TODAY,
    );
    expect(task).toMatchObject({ dueDate: '2026-12-13', priority: 'high', category: 'vendors' });
    const late = taskFromSuggestion(
      { title: 'Book venue', category: 'venue', priority: 'high', monthsBefore: 12 },
      event,
      TODAY,
    );
    expect(late.dueDate).toBe(TODAY);
  });

  it('gives ideas a category-appropriate lead time', () => {
    expect(taskFromIdea('Lanterns', 'Hand-painted', 'decor', event, TODAY)).toMatchObject({
      dueDate: '2026-12-30',
      notes: 'Hand-painted',
    });
  });

  it('splits a category’s share of the budget across its ideas', () => {
    const line = budgetFromIdea('Lanterns', 'decor', 4, plan, event);
    // Seed plan allocates 12% to décor: 18L × 12% ÷ 4 ideas.
    expect(line).toMatchObject({ category: 'decor', estimated: 54_000, actual: 0, paid: false });
  });

  it('turns an allocation row into a named budget line', () => {
    expect(budgetFromAllocation({ category: 'venue', percent: 29, note: 'Venue hire.' }, event)).toMatchObject({
      name: 'Venue (AI allocation)',
      estimated: 522_000,
    });
  });
});

describe('apiClient', () => {
  it('returns validated data and metadata', async () => {
    mockFetch(aiResponse(plan));
    const result = await postAI('/api/plan', {}, { schema: aiPlanSchema });
    expect(result.meta.aiMode).toBe('live');
    expect(result.data.concept.title).toBe(plan.concept.title);
  });

  it('maps the shared error shape to a typed error', async () => {
    mockFetch(jsonResponse({ error: { code: 'RATE_LIMITED', message: 'Slow down' } }, 429));
    const failure = postAI('/api/plan', {}, { schema: aiPlanSchema });
    await expect(failure).rejects.toMatchObject({ code: 'RATE_LIMITED', status: 429 });
    expect(describeApiError(new ApiClientError('RATE_LIMITED', 'x'))).toMatch(/wait a minute/);
  });

  it('rejects responses that do not match the schema', async () => {
    mockFetch(aiResponse({ concept: 'not a plan' }));
    await expect(postAI('/api/plan', {}, { schema: aiPlanSchema })).rejects.toMatchObject({ code: 'BAD_RESPONSE' });
  });

  it('reports network failures and cancellation distinctly', async () => {
    mockFetch(new TypeError('Failed to fetch'));
    await expect(postAI('/api/plan', {}, { schema: aiPlanSchema })).rejects.toMatchObject({ code: 'NETWORK_ERROR' });

    const controller = new AbortController();
    controller.abort();
    mockFetch(new DOMException('Aborted', 'AbortError'));
    const cancelled = postAI('/api/plan', {}, { schema: aiPlanSchema, signal: controller.signal });
    await expect(cancelled).rejects.toMatchObject({ code: 'ABORTED' });
  });
});

describe('requestPlan', () => {
  const brief = toEventBrief(event);

  it('falls back to input-aware demo content when the server is unreachable', async () => {
    mockFetch(new TypeError('Failed to fetch'));
    const outcome = await requestPlan(brief);
    expect(outcome.aiMode).toBe('demo');
    expect(outcome.data).toEqual(generateDemoPlan(brief));
  });

  it('caches live responses by input hash and can bypass the cache', async () => {
    const fetchSpy = mockFetch(aiResponse(plan));
    await requestPlan(brief);
    await requestPlan(brief);
    expect(fetchSpy).toHaveBeenCalledTimes(1);
    await requestPlan(brief, { force: true });
    expect(fetchSpy).toHaveBeenCalledTimes(2);
  });

  it('surfaces rate limits instead of hiding them behind demo content', async () => {
    mockFetch(jsonResponse({ error: { code: 'RATE_LIMITED', message: 'Slow down' } }, 429));
    await expect(requestPlan(brief)).rejects.toBeInstanceOf(ApiClientError);
  });
});

describe('responseCache', () => {
  it('re-validates stored entries and keeps the newest first', () => {
    writeCachedResponse('a', plan);
    writeCachedResponse('b', { not: 'a plan' });
    expect(readCachedResponse('a', aiPlanSchema)?.concept.title).toBe(plan.concept.title);
    expect(readCachedResponse('b', aiPlanSchema)).toBeUndefined();
    expect(window.localStorage.getItem(STORAGE_KEYS.aiCache)).toContain('"key":"a"');
  });

  it('builds order-independent keys', () => {
    expect(aiCacheKey('plan', { a: 1, b: 2 })).toBe(aiCacheKey('plan', { b: 2, a: 1 }));
    expect(aiCacheKey('plan', { a: 1 })).not.toBe(aiCacheKey('themes', { a: 1 }));
  });
});

describe('store migrations', () => {
  it('upgrades v1 assistant plans to the v2 shape', () => {
    const v1 = { plans: { e1: { eventId: 'e1', plan, source: 'gemini', refinements: [], generatedAt: '2026-01-01' } } };
    const v2 = migrateAssistantV1(v1) as { plans: Record<string, Record<string, unknown>>; history: object };
    expect(v2.plans.e1).toMatchObject({ aiMode: 'live', savedAt: '2026-01-01', id: 'plan-migrated-e1' });
    expect(v2.plans.e1).not.toHaveProperty('source');
    expect(v2.history).toEqual({});
    expect(migrateAssistantV1('garbage')).toEqual({ plans: {}, history: {}, themes: {} });
  });

  it('adds keywords to v1 saved themes', () => {
    const v2 = migrateEventsV1({ events: [{ id: 'e1', theme: { name: 'X', mood: 'regal' } }] }) as {
      events: { theme: { keywords: string[] } }[];
    };
    expect(v2.events[0]?.theme.keywords).toEqual(['regal']);
  });
});

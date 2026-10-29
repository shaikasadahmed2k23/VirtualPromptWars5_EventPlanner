import type { AIMode } from '@shared/api';

/** A JSON `Response`, as the API would send it. */
export function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });
}

/** A successful AI response envelope. */
export function aiResponse(data: unknown, aiMode: AIMode = 'live'): Response {
  return jsonResponse({ data, meta: { aiMode, cached: false, generatedAt: new Date().toISOString() } });
}

/**
 * Replaces `fetch` with a queue of scripted results (the last one repeats).
 * An `Error` entry simulates a network failure.
 */
export function mockFetch(...results: (Response | Error)[]) {
  const queue = [...results];
  return vi.spyOn(globalThis, 'fetch').mockImplementation(() => {
    const next = queue.length > 1 ? queue.shift() : queue[0];
    if (!next) return Promise.reject(new Error('No scripted fetch response'));
    if (next instanceof Error) return Promise.reject(next);
    return Promise.resolve(next.clone());
  });
}

/** Parsed JSON body of the n-th call to a mocked `fetch`. */
export function requestBody(spy: ReturnType<typeof mockFetch>, call = 0): unknown {
  const init = spy.mock.calls[call]?.[1];
  return typeof init?.body === 'string' ? (JSON.parse(init.body) as unknown) : undefined;
}

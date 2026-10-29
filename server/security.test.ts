// @vitest-environment node
import { mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import request from 'supertest';
import { DEFAULT_GEMINI_MODEL, loadConfig } from './config.js';
import { TtlLruCache } from './lib/cache.js';
import { BRIEF, buildTestApp, errorBody } from './test/helpers.js';

describe('rate limiting', () => {
  it('answers 429 in the shared error shape once the limit is reached', async () => {
    const app = buildTestApp({ rateLimitMax: 2 });
    await request(app).get('/api/health').expect(200);
    await request(app).get('/api/health').expect(200);
    const response = await request(app).post('/api/plan').send({ brief: BRIEF }).expect(429);
    expect(errorBody(response).code).toBe('RATE_LIMITED');
    expect(response.headers).toHaveProperty('retry-after');
  });
});

describe('origin policy', () => {
  it('blocks unknown cross-origin callers', async () => {
    const response = await request(buildTestApp())
      .post('/api/plan')
      .set('Origin', 'https://evil.example')
      .send({ brief: BRIEF })
      .expect(403);
    expect(errorBody(response).code).toBe('FORBIDDEN_ORIGIN');
  });

  it('treats a request as same-origin when Origin matches the Host it was sent to', async () => {
    await request(buildTestApp())
      .get('/api/health')
      .set('Host', 'localhost:5173')
      .set('Origin', 'http://localhost:5173')
      .expect(200);
  });

  it('allows configured origins with CORS headers', async () => {
    const response = await request(buildTestApp({ allowedOrigins: ['https://utsav.example'] }))
      .get('/api/health')
      .set('Origin', 'https://utsav.example')
      .expect(200);
    expect(response.headers['access-control-allow-origin']).toBe('https://utsav.example');
  });
});

describe('security headers', () => {
  it('sends the shared CSP and hides the framework', async () => {
    const response = await request(buildTestApp()).get('/api/health');
    expect(response.headers['content-security-policy']).toContain('img-src');
    expect(response.headers['content-security-policy']).toContain('https://images.unsplash.com');
    expect(response.headers['content-security-policy']).toContain("frame-ancestors 'none'");
    expect(response.headers['x-content-type-options']).toBe('nosniff');
    expect(response.headers).not.toHaveProperty('x-powered-by');
  });

  it('returns JSON 404s for unknown API routes', async () => {
    const response = await request(buildTestApp()).get('/api/nope').expect(404);
    expect(errorBody(response).code).toBe('NOT_FOUND');
  });
});

describe('SPA hosting', () => {
  it('serves index.html for client routes (even under a dot-folder) but never for /api', async () => {
    const dir = mkdtempSync(path.join(tmpdir(), '.utsav-spa-'));
    writeFileSync(path.join(dir, 'index.html'), '<!doctype html><title>Utsav</title>');
    const app = buildTestApp({ staticDir: dir, serveStatic: true });

    const page = await request(app).get('/events/abc/budget').expect(200);
    expect(page.text).toContain('<title>Utsav</title>');
    expect(page.headers['cache-control']).toBe('no-cache');
    await request(app).get('/api/unknown').expect(404);
    await request(app).get('/assets/missing-chunk.js').expect(404);
  });
});

describe('loadConfig', () => {
  it('applies safe defaults and demo mode without a key', () => {
    const config = loadConfig({});
    expect(config).toMatchObject({
      port: 8787,
      geminiApiKey: null,
      geminiModel: DEFAULT_GEMINI_MODEL,
      allowedOrigins: [],
    });
  });

  it('normalises allowed origins and rejects invalid ones', () => {
    expect(loadConfig({ ALLOWED_ORIGIN: 'http://localhost:5173/, https://a.example' }).allowedOrigins).toEqual([
      'http://localhost:5173',
      'https://a.example',
    ]);
    expect(loadConfig({ ALLOWED_ORIGINS: 'https://legacy.example' }).allowedOrigins).toEqual([
      'https://legacy.example',
    ]);
    expect(() => loadConfig({ ALLOWED_ORIGIN: 'not a url' })).toThrow(/ALLOWED_ORIGIN/);
    expect(() => loadConfig({ PORT: 'abc' })).toThrow(/PORT/);
  });
});

describe('TtlLruCache', () => {
  it('expires entries after the TTL', () => {
    let now = 0;
    const cache = new TtlLruCache<string>({ maxEntries: 5, ttlMs: 100, now: () => now });
    cache.set('a', 'value');
    now = 99;
    expect(cache.get('a')).toBe('value');
    now = 200;
    expect(cache.get('a')).toBeUndefined();
  });

  it('evicts the least recently used entry when full', () => {
    const cache = new TtlLruCache<number>({ maxEntries: 2, ttlMs: 1_000 });
    cache.set('a', 1);
    cache.set('b', 2);
    cache.get('a');
    cache.set('c', 3);
    expect(cache.get('b')).toBeUndefined();
    expect(cache.get('a')).toBe(1);
    expect(cache.size).toBe(2);
  });
});

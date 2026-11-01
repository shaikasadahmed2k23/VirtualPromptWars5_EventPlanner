import { z, type ZodType } from 'zod';
import { hashValue } from '@shared/hash';
import { AI_CACHE_MAX_ENTRIES, STORAGE_KEYS } from '@/lib/constants';
import { logger } from '@/lib/logger';
import { safeLocalStorage } from '@/lib/storage';

const entrySchema = z.object({ key: z.string(), value: z.unknown() });
const storedSchema = z.array(entrySchema);
type Entry = z.infer<typeof entrySchema>;

let memory: Entry[] | null = null;

function load(): Entry[] {
  if (memory) return memory;
  const raw = safeLocalStorage.getItem(STORAGE_KEYS.aiCache);
  let parsed: unknown = [];
  try {
    parsed = raw ? (JSON.parse(raw) as unknown) : [];
  } catch (error: unknown) {
    logger.warn('Discarding unreadable AI cache', error);
  }
  const result = storedSchema.safeParse(parsed);
  memory = result.success ? result.data : [];
  return memory;
}

function persist(entries: Entry[]): void {
  memory = entries;
  safeLocalStorage.setItem(STORAGE_KEYS.aiCache, JSON.stringify(entries));
}

/** Cache key for an AI request: a stable hash of the operation and its inputs. */
export function aiCacheKey(kind: string, input: unknown): string {
  return hashValue({ kind, input });
}

/**
 * Reads a cached AI response. Values come from localStorage, so they are
 * re-validated with the shared schema before use.
 */
export function readCachedResponse<T>(key: string, schema: ZodType<T>): T | undefined {
  const entries = load();
  const entry = entries.find((candidate) => candidate.key === key);
  if (!entry) return undefined;
  const result = schema.safeParse(entry.value);
  if (!result.success) return undefined;
  persist([entry, ...entries.filter((candidate) => candidate !== entry)]);
  return result.data;
}

/** Stores a response (most recent first), keeping at most {@link AI_CACHE_MAX_ENTRIES}. */
export function writeCachedResponse(key: string, value: unknown): void {
  const entries = load().filter((entry) => entry.key !== key);
  persist([{ key, value }, ...entries].slice(0, AI_CACHE_MAX_ENTRIES));
}

/** Clears the in-memory and stored cache (used by "Reset demo data" and tests). */
export function clearResponseCache(): void {
  memory = null;
  safeLocalStorage.removeItem(STORAGE_KEYS.aiCache);
}

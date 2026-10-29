interface Entry<V> {
  value: V;
  expiresAt: number;
}

/** Options for {@link TtlLruCache}. */
export interface CacheOptions {
  maxEntries: number;
  ttlMs: number;
  /** Injectable clock for tests. */
  now?: () => number;
}

/**
 * In-memory cache with a time-to-live and least-recently-used eviction.
 * A `Map` preserves insertion order, so re-inserting on read keeps the most
 * recently used keys at the end and the eviction candidate at the front.
 */
export class TtlLruCache<V> {
  private readonly entries = new Map<string, Entry<V>>();
  private readonly maxEntries: number;
  private readonly ttlMs: number;
  private readonly now: () => number;

  constructor({ maxEntries, ttlMs, now = Date.now }: CacheOptions) {
    this.maxEntries = maxEntries;
    this.ttlMs = ttlMs;
    this.now = now;
  }

  /** Returns the value for `key`, or `undefined` if missing or expired. */
  get(key: string): V | undefined {
    const entry = this.entries.get(key);
    if (!entry) return undefined;
    this.entries.delete(key);
    if (entry.expiresAt <= this.now()) return undefined;
    this.entries.set(key, entry);
    return entry.value;
  }

  /** Stores `value`, evicting the least recently used entry when full. */
  set(key: string, value: V): void {
    this.entries.delete(key);
    this.entries.set(key, { value, expiresAt: this.now() + this.ttlMs });
    while (this.entries.size > this.maxEntries) {
      const oldest = this.entries.keys().next();
      if (oldest.done) break;
      this.entries.delete(oldest.value);
    }
  }

  get size(): number {
    return this.entries.size;
  }
}

/**
 * Deterministic hashing for cache keys, usable in both Node and the browser
 * (synchronous, no Web Crypto). Not for security purposes.
 */

const isPlainObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

/** JSON serialisation with sorted object keys, so equal inputs hash equally. */
function stableStringify(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(stableStringify).join(',')}]`;
  if (isPlainObject(value)) {
    const entries = Object.keys(value)
      .sort()
      .filter((key) => value[key] !== undefined)
      .map((key) => `${JSON.stringify(key)}:${stableStringify(value[key])}`);
    return `{${entries.join(',')}}`;
  }
  // JSON.stringify returns undefined for undefined and functions; normalise to null.
  return value === undefined || typeof value === 'function' ? 'null' : JSON.stringify(value);
}

const SEED_A = 0xdeadbeef;
const SEED_B = 0x41c6ce57;
const MIX_A = 2654435761;
const MIX_B = 1597334677;
const MIX_C = 2246822507;
const MIX_D = 3266489909;
const HIGH_BITS = 2097151;
const SHIFT_32 = 4294967296;
const HEX_RADIX = 16;

/** cyrb53: a fast 53-bit string hash with good distribution, returned as hex. */
function hashString(input: string): string {
  let h1 = SEED_A;
  let h2 = SEED_B;
  for (let index = 0; index < input.length; index += 1) {
    const code = input.charCodeAt(index);
    h1 = Math.imul(h1 ^ code, MIX_A);
    h2 = Math.imul(h2 ^ code, MIX_B);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), MIX_C) ^ Math.imul(h2 ^ (h2 >>> 13), MIX_D);
  h2 = Math.imul(h2 ^ (h2 >>> 16), MIX_C) ^ Math.imul(h1 ^ (h1 >>> 13), MIX_D);
  return (SHIFT_32 * (HIGH_BITS & h2) + (h1 >>> 0)).toString(HEX_RADIX);
}

/** Hash of any JSON-compatible value, independent of object key order. */
export function hashValue(value: unknown): string {
  return hashString(stableStringify(value));
}

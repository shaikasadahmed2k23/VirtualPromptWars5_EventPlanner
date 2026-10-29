/**
 * Creates a collision-resistant identifier with a readable prefix,
 * e.g. `task-3f2a…`. Uses the Web Crypto API available in all target browsers.
 */
export function createId(prefix: string): string {
  return `${prefix}-${crypto.randomUUID()}`;
}

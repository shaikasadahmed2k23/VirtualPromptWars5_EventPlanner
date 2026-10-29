/**
 * Content-Security-Policy shared by the Express server (HTTP header via helmet)
 * and the production HTML build (meta tag). Keeping one definition guarantees
 * both delivery paths enforce the same policy.
 */
export const CSP_DIRECTIVES = {
  'default-src': ["'self'"],
  'script-src': ["'self'"],
  // Recharts and Framer Motion set inline `style` attributes at runtime.
  'style-src': ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
  'font-src': ["'self'", 'https://fonts.gstatic.com'],
  'img-src': ["'self'", 'data:', 'https://images.unsplash.com'],
  'connect-src': ["'self'"],
  'object-src': ["'none'"],
  'base-uri': ["'self'"],
  'form-action': ["'self'"],
  'frame-ancestors': ["'none'"],
} as const satisfies Record<string, readonly string[]>;

/** Directives that browsers ignore when delivered through a `<meta>` tag. */
const HEADER_ONLY_DIRECTIVES = new Set<string>(['frame-ancestors']);

/**
 * Serialises {@link CSP_DIRECTIVES} into a policy string suitable for a
 * `<meta http-equiv="Content-Security-Policy">` tag.
 */
export function serializeCspForMeta(): string {
  return Object.entries(CSP_DIRECTIVES)
    .filter(([directive]) => !HEADER_ONLY_DIRECTIVES.has(directive))
    .map(([directive, sources]) => `${directive} ${sources.join(' ')}`)
    .join('; ');
}

/**
 * Minimal diagnostics channel. Warnings surface in development only, so
 * production users never see console noise and nothing sensitive is logged.
 */
export const logger = {
  warn(message: string, error?: unknown): void {
    if (import.meta.env.DEV) {
      // eslint-disable-next-line no-console -- dev-only diagnostics channel
      console.warn(`[utsav] ${message}`, error);
    }
  },
};

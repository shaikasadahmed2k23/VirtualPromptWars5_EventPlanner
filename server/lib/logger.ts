/** Structured log fields. Never include request bodies, prompts or secrets. */
export type LogFields = Record<string, string | number | boolean | null>;

/** Minimal structured logger interface used across the server. */
export interface Logger {
  info: (event: string, fields?: LogFields) => void;
  warn: (event: string, fields?: LogFields) => void;
  error: (event: string, fields?: LogFields) => void;
}

/**
 * JSON-lines logger (one object per line), which Cloud Run and most log
 * collectors parse natively. Pass `silent` in tests.
 */
export function createLogger({ silent = false }: { silent?: boolean } = {}): Logger {
  const write = (severity: 'INFO' | 'WARNING' | 'ERROR', event: string, fields: LogFields = {}) => {
    if (silent) return;
    const line = JSON.stringify({ severity, event, time: new Date().toISOString(), ...fields });
    // eslint-disable-next-line no-console -- the logger is the single sanctioned console sink
    (severity === 'INFO' ? console.log : console.error)(line);
  };
  return {
    info: (event, fields) => {
      write('INFO', event, fields);
    },
    warn: (event, fields) => {
      write('WARNING', event, fields);
    },
    error: (event, fields) => {
      write('ERROR', event, fields);
    },
  };
}

import { useEffect, useState } from 'react';
import { SEARCH_DEBOUNCE_MS } from '../constants';

/** Returns `value` once it has stopped changing for `delayMs` (search inputs). */
export function useDebouncedValue<T>(value: T, delayMs: number = SEARCH_DEBOUNCE_MS): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebounced(value);
    }, delayMs);
    return () => {
      window.clearTimeout(timer);
    };
  }, [value, delayMs]);

  return debounced;
}

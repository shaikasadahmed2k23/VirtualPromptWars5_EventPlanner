import { useEffect, useRef, type RefObject } from 'react';

/**
 * Returns a ref whose element receives focus on mount when `enabled` is true.
 * Used to move focus to a new step's heading so screen readers announce it.
 * The element should have `tabIndex={-1}` if it is not natively focusable.
 */
export function useFocusOnMount<T extends HTMLElement>(enabled: boolean): RefObject<T> {
  const ref = useRef<T>(null);
  useEffect(() => {
    if (enabled) ref.current?.focus();
  }, [enabled]);
  return ref;
}

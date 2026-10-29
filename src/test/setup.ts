import '@testing-library/jest-dom/vitest';
import { act, configure } from '@testing-library/react';
import { toast } from 'sonner';

// Lazy route chunks are transformed on first import; under a parallel run this can
// take several seconds, so allow well beyond the 1s default (but below testTimeout).
const ASYNC_UTIL_TIMEOUT_MS = 15_000;
configure({ asyncUtilTimeout: ASYNC_UTIL_TIMEOUT_MS });

if (typeof window !== 'undefined') {
  // jsdom lacks matchMedia; components that respect `prefers-reduced-motion` query it.
  if (!('matchMedia' in window)) {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: (query: string): Partial<MediaQueryList> => ({
        matches: false,
        media: query,
        onchange: null,
        addEventListener: () => undefined,
        removeEventListener: () => undefined,
        dispatchEvent: () => false,
      }),
    });
  }
  // jsdom does not implement scrolling; route focus management calls it.
  window.scrollTo = () => undefined;
  // jsdom has no canvas; axe-core probes it and handles a null context.
  HTMLCanvasElement.prototype.getContext = () => null;
}

afterEach(() => {
  // Toasts live in a global queue; clear them so one test cannot update the next.
  act(() => {
    toast.dismiss();
  });
  if (typeof window !== 'undefined') window.localStorage.clear();
});

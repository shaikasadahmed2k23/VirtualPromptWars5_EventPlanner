import { type RefObject, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Moves focus to the main landmark after client-side navigation so keyboard
 * and screen-reader users start at the new page's content. Skips the initial
 * load, where the browser's default focus order applies.
 */
export function useRouteFocus(mainRef: RefObject<HTMLElement | null>): void {
  const { pathname } = useLocation();
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    mainRef.current?.focus({ preventScroll: true });
    window.scrollTo({ top: 0 });
  }, [pathname, mainRef]);
}

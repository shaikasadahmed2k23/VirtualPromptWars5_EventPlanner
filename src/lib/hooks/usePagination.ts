import { useMemo, useState } from 'react';

export interface Pagination<T> {
  /** Items on the current page. */
  pageItems: T[];
  /** 1-based current page, always within `1..pageCount`. */
  page: number;
  pageCount: number;
  setPage: (page: number) => void;
}

/**
 * Client-side pagination. Returns to page 1 whenever `resetKey` changes (e.g.
 * a filter changed) and clamps the page when the list shrinks, both during
 * render so there is no extra effect-driven re-render.
 */
export function usePagination<T>(items: readonly T[], pageSize: number, resetKey: string): Pagination<T> {
  const [requestedPage, setPage] = useState(1);
  const [lastResetKey, setLastResetKey] = useState(resetKey);
  if (resetKey !== lastResetKey) {
    setLastResetKey(resetKey);
    setPage(1);
  }

  const pageCount = Math.max(1, Math.ceil(items.length / pageSize));
  const page = Math.min(requestedPage, pageCount);
  const pageItems = useMemo(() => items.slice((page - 1) * pageSize, page * pageSize), [items, page, pageSize]);

  return { pageItems, page, pageCount, setPage };
}

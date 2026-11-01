import { useCallback, useMemo, useState } from 'react';
import { useDebouncedValue } from './useDebouncedValue';

/** Every filter set has a free-text search; the rest is feature specific. */
export interface SearchableFilters {
  search: string;
}

/** A controlled value plus its change handler, ready to spread onto a filter control. */
export interface FilterBinding<V> {
  value: V;
  onChange: (value: V) => void;
}

export interface ListFilters<T, F extends SearchableFilters> {
  /** Current control values (search is the raw, undebounced input). */
  filters: F;
  setFilter: <K extends keyof F>(key: K, value: F[K]) => void;
  /** `{ value, onChange }` for one filter, e.g. `<FilterSelect {...bind('city')} />`. */
  bind: <K extends keyof F>(key: K) => FilterBinding<F[K]>;
  /** Restores the initial filters. */
  clear: () => void;
  /** True when any control differs from its initial value. */
  isFiltered: boolean;
  /** Items after filtering and sorting (search is debounced). */
  results: T[];
  /** Changes whenever the applied filters change; use to reset pagination or selection. */
  resultsKey: string;
}

/**
 * Shared state for searchable, filterable lists (tasks, guests, vendors). The
 * filtering itself is a pure function from the feature's `lib/`, so it stays
 * unit-testable; this hook only adds state, debouncing and memoisation.
 * `apply` and `initial` must be stable (module-level) references.
 */
export function useListFilters<T, F extends SearchableFilters>(
  items: readonly T[],
  initial: F,
  apply: (items: readonly T[], filters: F) => T[],
): ListFilters<T, F> {
  const [filters, setFilters] = useState<F>(initial);
  const search = useDebouncedValue(filters.search);
  const applied = useMemo<F>(() => ({ ...filters, search }), [filters, search]);
  const results = useMemo(() => apply(items, applied), [apply, items, applied]);

  const setFilter = useCallback(<K extends keyof F>(key: K, value: F[K]) => {
    setFilters((current) => ({ ...current, [key]: value }));
  }, []);
  const bind = useCallback(
    <K extends keyof F>(key: K): FilterBinding<F[K]> => ({
      value: filters[key],
      onChange: (value) => {
        setFilter(key, value);
      },
    }),
    [filters, setFilter],
  );
  const clear = useCallback(() => {
    setFilters(initial);
  }, [initial]);

  const isFiltered = (Object.keys(initial) as (keyof F)[]).some((key) => filters[key] !== initial[key]);

  return { filters, setFilter, bind, clear, isFiltered, results, resultsKey: JSON.stringify(applied) };
}

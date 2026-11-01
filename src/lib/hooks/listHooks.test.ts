import { act, renderHook } from '@testing-library/react';
import { SEARCH_DEBOUNCE_MS } from '../constants';
import { useListFilters } from './useListFilters';
import { usePagination } from './usePagination';
import { useSelection } from './useSelection';

interface Item {
  name: string;
  size: number;
}
interface ItemFilters {
  search: string;
  minSize: number;
}

const ITEMS: Item[] = [
  { name: 'Marigold', size: 3 },
  { name: 'Jasmine', size: 1 },
  { name: 'Mogra', size: 2 },
];
const INITIAL: ItemFilters = { search: '', minSize: 0 };
const applyFilters = (items: readonly Item[], filters: ItemFilters) =>
  items.filter(
    (item) => item.name.toLowerCase().includes(filters.search.toLowerCase()) && item.size >= filters.minSize,
  );

describe('useListFilters', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it('binds a filter to a { value, onChange } pair for controls', () => {
    const { result } = renderHook(() => useListFilters(ITEMS, INITIAL, applyFilters));
    expect(result.current.bind('minSize').value).toBe(0);

    act(() => {
      result.current.bind('minSize').onChange(3);
    });
    expect(result.current.bind('minSize').value).toBe(3);
    expect(result.current.results.map((item) => item.name)).toEqual(['Marigold']);
  });

  it('applies select filters immediately and debounces search', () => {
    const { result } = renderHook(() => useListFilters(ITEMS, INITIAL, applyFilters));
    expect(result.current.isFiltered).toBe(false);

    act(() => {
      result.current.setFilter('minSize', 2);
    });
    expect(result.current.results.map((item) => item.name)).toEqual(['Marigold', 'Mogra']);

    act(() => {
      result.current.setFilter('search', 'mog');
    });
    expect(result.current.filters.search).toBe('mog');
    expect(result.current.results).toHaveLength(2);
    act(() => {
      vi.advanceTimersByTime(SEARCH_DEBOUNCE_MS);
    });
    expect(result.current.results.map((item) => item.name)).toEqual(['Mogra']);
    expect(result.current.isFiltered).toBe(true);

    const keyBeforeClear = result.current.resultsKey;
    act(() => {
      result.current.clear();
    });
    act(() => {
      vi.advanceTimersByTime(SEARCH_DEBOUNCE_MS);
    });
    expect(result.current.results).toHaveLength(3);
    expect(result.current.resultsKey).not.toBe(keyBeforeClear);
  });
});

describe('usePagination', () => {
  const numbers = Array.from({ length: 23 }, (_, index) => index);

  it('slices pages, clamps when the list shrinks and resets on a new key', () => {
    const { result, rerender } = renderHook(({ items, key }) => usePagination(items, 10, key), {
      initialProps: { items: numbers, key: 'a' },
    });
    expect(result.current.pageCount).toBe(3);
    act(() => {
      result.current.setPage(3);
    });
    expect(result.current.pageItems).toEqual([20, 21, 22]);

    rerender({ items: numbers.slice(0, 12), key: 'a' });
    expect(result.current.page).toBe(2);

    rerender({ items: numbers, key: 'b' });
    expect(result.current.page).toBe(1);
  });
});

describe('useSelection', () => {
  it('toggles ids, selects many and clears when the reset key changes', () => {
    const { result, rerender } = renderHook(({ key }) => useSelection(key), { initialProps: { key: 'a' } });
    act(() => {
      result.current.setMany(['x', 'y'], true);
      result.current.toggle('y', false);
    });
    expect([...result.current.selected]).toEqual(['x']);

    rerender({ key: 'b' });
    expect(result.current.selected.size).toBe(0);
  });
});

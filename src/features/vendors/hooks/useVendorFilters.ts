import { useEffect, useMemo, useState } from 'react';
import { SEARCH_DEBOUNCE_MS } from '@/lib/constants';
import type { Vendor } from '@/types';
import { filterVendors, type VendorFilters } from '../lib/vendorFilters';

/** Manages debounced directory search and filter state. */
export function useVendorFilters(vendors: readonly Vendor[]) {
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [category, setCategory] = useState<VendorFilters['category']>('all');
  const [city, setCity] = useState('all');
  const [priceTier, setPriceTier] = useState<VendorFilters['priceTier']>('all');
  const [minRating, setMinRating] = useState(0);
  const [sort, setSort] = useState<VendorFilters['sort']>('rating');
  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedSearch(search), SEARCH_DEBOUNCE_MS);
    return () => window.clearTimeout(timer);
  }, [search]);
  const filteredVendors = useMemo(
    () => filterVendors(vendors, { search: debouncedSearch, category, city, priceTier, minRating, sort }),
    [vendors, debouncedSearch, category, city, priceTier, minRating, sort],
  );
  const clear = () => { setSearch(''); setDebouncedSearch(''); setCategory('all'); setCity('all'); setPriceTier('all'); setMinRating(0); setSort('rating'); };
  return { search, category, city, priceTier, minRating, sort, filteredVendors, setSearch, setCategory, setCity, setPriceTier, setMinRating, setSort, clear };
}

export type VendorFiltersState = ReturnType<typeof useVendorFilters>;

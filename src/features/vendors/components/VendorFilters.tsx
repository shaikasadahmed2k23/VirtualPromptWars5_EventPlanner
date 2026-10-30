import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FilterPanel, FilterSelect, SearchField } from '@/components/ui/filter-controls';
import type { ListFilters } from '@/lib/hooks/useListFilters';
import type { Vendor } from '@/types';
import { VENDOR_FILTER_OPTIONS, type VendorFilters as VendorFilterValues } from '../lib/vendorFilters';

/** Search, filter and sort controls for the vendor directory. */
export function VendorFilters({
  filters,
  setFilter,
  isFiltered,
  clear,
}: Pick<ListFilters<Vendor, VendorFilterValues>, 'filters' | 'setFilter' | 'isFiltered' | 'clear'>) {
  return (
    <div className="space-y-3">
      <FilterPanel label="Filter vendors" className="lg:grid-cols-6">
        <SearchField
          label="Search vendors"
          placeholder="Search by name, city or service"
          className="sm:col-span-2 lg:col-span-6"
          value={filters.search}
          onChange={(value) => {
            setFilter('search', value);
          }}
        />
        <FilterSelect
          label="Category"
          value={filters.category}
          options={VENDOR_FILTER_OPTIONS.category}
          onChange={(value) => {
            setFilter('category', value);
          }}
        />
        <FilterSelect
          label="City"
          value={filters.city}
          options={VENDOR_FILTER_OPTIONS.city}
          onChange={(value) => {
            setFilter('city', value);
          }}
        />
        <FilterSelect
          label="Price"
          value={filters.priceTier}
          options={VENDOR_FILTER_OPTIONS.priceTier}
          onChange={(value) => {
            setFilter('priceTier', value);
          }}
        />
        <FilterSelect
          label="Minimum rating"
          value={filters.minRating}
          options={VENDOR_FILTER_OPTIONS.minRating}
          onChange={(value) => {
            setFilter('minRating', value);
          }}
        />
        <FilterSelect
          label="Sort by"
          className="lg:col-span-2"
          value={filters.sort}
          options={VENDOR_FILTER_OPTIONS.sort}
          onChange={(value) => {
            setFilter('sort', value);
          }}
        />
      </FilterPanel>
      {isFiltered ? (
        <Button variant="link" size="sm" onClick={clear}>
          <X aria-hidden="true" />
          Clear filters
        </Button>
      ) : null}
    </div>
  );
}

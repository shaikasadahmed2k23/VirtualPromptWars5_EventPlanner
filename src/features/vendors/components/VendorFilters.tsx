import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FilterPanel, FilterSelect, SearchField } from '@/components/ui/filter-controls';
import type { ListFilters } from '@/lib/hooks/useListFilters';
import type { Vendor } from '@/types';
import { VENDOR_FILTER_OPTIONS, type VendorFilters as VendorFilterValues } from '../lib/vendorFilters';

type VendorFiltersProps = Pick<ListFilters<Vendor, VendorFilterValues>, 'bind' | 'isFiltered' | 'clear'>;

/** Search, filter and sort controls for the vendor directory. */
export function VendorFilters({ bind, isFiltered, clear }: VendorFiltersProps) {
  return (
    <div className="space-y-3">
      <FilterPanel label="Filter vendors" className="lg:grid-cols-6">
        <SearchField
          label="Search vendors"
          placeholder="Search by name, city or service"
          className="sm:col-span-2 lg:col-span-6"
          {...bind('search')}
        />
        <FilterSelect label="Category" options={VENDOR_FILTER_OPTIONS.category} {...bind('category')} />
        <FilterSelect label="City" options={VENDOR_FILTER_OPTIONS.city} {...bind('city')} />
        <FilterSelect label="Price" options={VENDOR_FILTER_OPTIONS.priceTier} {...bind('priceTier')} />
        <FilterSelect label="Minimum rating" options={VENDOR_FILTER_OPTIONS.minRating} {...bind('minRating')} />
        <FilterSelect
          label="Sort by"
          className="lg:col-span-2"
          options={VENDOR_FILTER_OPTIONS.sort}
          {...bind('sort')}
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

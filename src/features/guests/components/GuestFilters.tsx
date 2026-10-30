import { FilterPanel, FilterSelect, SearchField } from '@/components/ui/filter-controls';
import type { ListFilters } from '@/lib/hooks/useListFilters';
import type { Guest } from '@/types';
import { GUEST_FILTER_OPTIONS, type GuestFilterOptions } from '../lib/guestFilters';

type GuestFiltersProps = Pick<ListFilters<Guest, GuestFilterOptions>, 'filters' | 'setFilter'>;

/** Search, filter and sort controls for the guest list. */
export function GuestFilters({ filters, setFilter }: GuestFiltersProps) {
  return (
    <FilterPanel label="Filter guests">
      <SearchField
        label="Search guests"
        placeholder="Search name, email or phone…"
        value={filters.search}
        onChange={(value) => {
          setFilter('search', value);
        }}
      />
      <FilterSelect
        label="RSVP"
        value={filters.rsvp}
        options={GUEST_FILTER_OPTIONS.rsvp}
        onChange={(value) => {
          setFilter('rsvp', value);
        }}
      />
      <FilterSelect
        label="Side / group"
        value={filters.group}
        options={GUEST_FILTER_OPTIONS.group}
        onChange={(value) => {
          setFilter('group', value);
        }}
      />
      <FilterSelect
        label="Dietary"
        value={filters.dietary}
        options={GUEST_FILTER_OPTIONS.dietary}
        onChange={(value) => {
          setFilter('dietary', value);
        }}
      />
      <FilterSelect
        label="Sort by"
        value={filters.sort}
        options={GUEST_FILTER_OPTIONS.sort}
        onChange={(value) => {
          setFilter('sort', value);
        }}
      />
    </FilterPanel>
  );
}

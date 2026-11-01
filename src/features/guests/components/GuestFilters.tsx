import { FilterPanel, FilterSelect, SearchField } from '@/components/ui/filter-controls';
import type { ListFilters } from '@/lib/hooks/useListFilters';
import type { Guest } from '@/types';
import { GUEST_FILTER_OPTIONS, type GuestFilterOptions } from '../lib/guestFilters';

type GuestFiltersProps = Pick<ListFilters<Guest, GuestFilterOptions>, 'bind'>;

/** Search, filter and sort controls for the guest list. */
export function GuestFilters({ bind }: GuestFiltersProps) {
  return (
    <FilterPanel label="Filter guests">
      <SearchField label="Search guests" placeholder="Search name, email or phone…" {...bind('search')} />
      <FilterSelect label="RSVP" options={GUEST_FILTER_OPTIONS.rsvp} {...bind('rsvp')} />
      <FilterSelect label="Side / group" options={GUEST_FILTER_OPTIONS.group} {...bind('group')} />
      <FilterSelect label="Dietary" options={GUEST_FILTER_OPTIONS.dietary} {...bind('dietary')} />
      <FilterSelect label="Sort by" options={GUEST_FILTER_OPTIONS.sort} {...bind('sort')} />
    </FilterPanel>
  );
}

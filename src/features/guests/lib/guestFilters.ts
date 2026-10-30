import type { Guest, GuestDietary, GuestGroup, RsvpStatus } from '@/types';

export type GuestSort = 'name' | 'rsvp';
export type GuestRsvpFilter = RsvpStatus | 'all';
export type GuestGroupFilter = GuestGroup | 'all';
export type GuestDietaryFilter = GuestDietary | 'all';

export interface GuestFilterOptions {
  search: string;
  rsvp: GuestRsvpFilter;
  group: GuestGroupFilter;
  dietary: GuestDietaryFilter;
  sort: GuestSort;
}

const RSVP_ORDER: Record<RsvpStatus, number> = { attending: 0, pending: 1, declined: 2 };

/** Filters and sorts guests without mutating the source list. */
export function filterAndSortGuests(guests: readonly Guest[], options: GuestFilterOptions): Guest[] {
  const search = options.search.trim().toLocaleLowerCase();
  return [...guests]
    .filter((guest) => {
      const searchable = `${guest.name} ${guest.email} ${guest.phone}`.toLocaleLowerCase();
      return (
        (!search || searchable.includes(search)) &&
        (options.rsvp === 'all' || guest.rsvp === options.rsvp) &&
        (options.group === 'all' || guest.group === options.group) &&
        (options.dietary === 'all' || guest.dietary === options.dietary)
      );
    })
    .sort((left, right) => {
      if (options.sort === 'rsvp') {
        return RSVP_ORDER[left.rsvp] - RSVP_ORDER[right.rsvp] || left.name.localeCompare(right.name);
      }
      return left.name.localeCompare(right.name);
    });
}

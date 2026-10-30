import { ALL, toFilterOptions, type All, type FilterOption } from '@/lib/filterOptions';
import { GUEST_DIETARY_LABELS, GUEST_GROUP_LABELS, RSVP_LABELS } from '@/lib/labels';
import {
  GUEST_DIETARY,
  GUEST_GROUPS,
  RSVP_STATUSES,
  type Guest,
  type GuestDietary,
  type GuestGroup,
  type RsvpStatus,
} from '@/types';

export type GuestSort = 'name' | 'rsvp';

export interface GuestFilterOptions {
  search: string;
  rsvp: RsvpStatus | All;
  group: GuestGroup | All;
  dietary: GuestDietary | All;
  sort: GuestSort;
}

/** Filters shown when the guest list first opens. */
export const DEFAULT_GUEST_FILTERS: GuestFilterOptions = {
  search: '',
  rsvp: ALL,
  group: ALL,
  dietary: ALL,
  sort: 'name',
};

/** Options for each guest-list filter control. */
export const GUEST_FILTER_OPTIONS = {
  rsvp: toFilterOptions(RSVP_STATUSES, RSVP_LABELS, 'All RSVPs'),
  group: toFilterOptions(GUEST_GROUPS, GUEST_GROUP_LABELS, 'All groups'),
  dietary: toFilterOptions(GUEST_DIETARY, GUEST_DIETARY_LABELS, 'All dietary needs'),
  sort: [
    { value: 'name', label: 'Name' },
    { value: 'rsvp', label: 'RSVP' },
  ] satisfies FilterOption<GuestSort>[],
};

const RSVP_ORDER: Record<RsvpStatus, number> = { attending: 0, pending: 1, declined: 2 };

/** Filters and sorts guests without mutating the source list. */
export function filterAndSortGuests(guests: readonly Guest[], options: GuestFilterOptions): Guest[] {
  const search = options.search.trim().toLocaleLowerCase();
  return guests
    .filter((guest) => {
      const searchable = `${guest.name} ${guest.email} ${guest.phone}`.toLocaleLowerCase();
      return (
        (!search || searchable.includes(search)) &&
        (options.rsvp === ALL || guest.rsvp === options.rsvp) &&
        (options.group === ALL || guest.group === options.group) &&
        (options.dietary === ALL || guest.dietary === options.dietary)
      );
    })
    .sort((left, right) => {
      if (options.sort === 'rsvp') {
        return RSVP_ORDER[left.rsvp] - RSVP_ORDER[right.rsvp] || left.name.localeCompare(right.name);
      }
      return left.name.localeCompare(right.name);
    });
}

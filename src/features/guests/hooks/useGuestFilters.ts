import { useEffect, useMemo, useState } from 'react';
import type { Guest, GuestDietary, GuestGroup, RsvpStatus } from '@/types';
import {
  filterAndSortGuests,
  type GuestDietaryFilter,
  type GuestGroupFilter,
  type GuestRsvpFilter,
  type GuestSort,
} from '../lib/guestFilters';

const SEARCH_DEBOUNCE_MS = 250;

/** Provides debounced search plus RSVP, group, dietary and sort controls. */
export function useGuestFilters(guests: readonly Guest[]) {
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [rsvp, setRsvp] = useState<GuestRsvpFilter>('all');
  const [group, setGroup] = useState<GuestGroupFilter>('all');
  const [dietary, setDietary] = useState<GuestDietaryFilter>('all');
  const [sort, setSort] = useState<GuestSort>('name');

  useEffect(() => {
    const timer = window.setTimeout(() => setSearch(searchInput), SEARCH_DEBOUNCE_MS);
    return () => window.clearTimeout(timer);
  }, [searchInput]);

  const filteredGuests = useMemo(
    () => filterAndSortGuests(guests, { search, rsvp, group, dietary, sort }),
    [dietary, group, guests, rsvp, search, sort],
  );

  return {
    searchInput,
    setSearchInput,
    rsvp,
    setRsvp: (value: RsvpStatus | 'all') => setRsvp(value),
    group,
    setGroup: (value: GuestGroup | 'all') => setGroup(value),
    dietary,
    setDietary: (value: GuestDietary | 'all') => setDietary(value),
    sort,
    setSort,
    filteredGuests,
  };
}

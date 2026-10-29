import { useMemo } from 'react';
import { filterByEventId } from '@/lib/collection';
import type { Guest, GuestStats, Id } from '@/types';
import { computeGuestStats } from '../lib/guestStats';
import { useGuestStore } from '../store/useGuestStore';

/** The event's guests plus memoised RSVP / headcount statistics. */
export function useGuestStats(eventId: Id): { guests: Guest[]; stats: GuestStats } {
  const allGuests = useGuestStore((state) => state.guests);
  const guests = useMemo(() => filterByEventId(allGuests, eventId), [allGuests, eventId]);
  const stats = useMemo(() => computeGuestStats(guests), [guests]);
  return { guests, stats };
}

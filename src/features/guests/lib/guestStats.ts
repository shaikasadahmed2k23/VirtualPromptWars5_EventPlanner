import { type Guest, GUEST_DIETARY, type GuestDietary, type GuestStats } from '@/types';

/** Computes RSVP counts, headcount (with plus-ones) and dietary needs of attending guests. */
export function computeGuestStats(guests: readonly Guest[]): GuestStats {
  const dietary = Object.fromEntries(GUEST_DIETARY.map((option) => [option, 0])) as Record<GuestDietary, number>;
  const stats: GuestStats = { total: guests.length, attending: 0, pending: 0, declined: 0, headcount: 0, dietary };

  for (const guest of guests) {
    stats[guest.rsvp] += 1;
    if (guest.rsvp === 'attending') {
      const partySize = 1 + guest.plusOnes;
      stats.headcount += partySize;
      dietary[guest.dietary] += partySize;
    }
  }
  return stats;
}

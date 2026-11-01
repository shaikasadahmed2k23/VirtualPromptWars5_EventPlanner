import { describe, expect, it } from 'vitest';
import type { Guest } from '@/types';
import { computeGuestStats } from './guestStats';

const guest = (overrides: Partial<Guest>): Guest => ({
  id: 'guest',
  eventId: 'event',
  name: 'Guest',
  email: '',
  phone: '',
  rsvp: 'attending',
  dietary: 'none',
  plusOnes: 0,
  group: 'friends',
  ...overrides,
});

describe('computeGuestStats', () => {
  it('counts attending plus-ones and dietary headcount', () => {
    const stats = computeGuestStats([
      guest({ id: 'one', plusOnes: 2, dietary: 'vegan' }),
      guest({ id: 'two', rsvp: 'pending', plusOnes: 4, dietary: 'halal' }),
      guest({ id: 'three', rsvp: 'declined', dietary: 'vegetarian' }),
    ]);
    expect(stats).toMatchObject({ total: 3, attending: 1, pending: 1, declined: 1, headcount: 3 });
    expect(stats.dietary.vegan).toBe(3);
  });
});

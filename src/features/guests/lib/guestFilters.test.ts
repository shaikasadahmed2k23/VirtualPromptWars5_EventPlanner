import { describe, expect, it } from 'vitest';
import { filterAndSortGuests } from './guestFilters';
import type { Guest } from '@/types';

const guest = (name: string, rsvp: Guest['rsvp'], group: Guest['group'] = 'friends'): Guest => ({
  id: name,
  eventId: 'event',
  name,
  email: '',
  phone: '',
  rsvp,
  dietary: 'none',
  plusOnes: 0,
  group,
});

describe('guest filters', () => {
  it('filters by group and sorts by RSVP', () => {
    const result = filterAndSortGuests(
      [guest('Zed', 'attending'), guest('Ana', 'pending', 'family'), guest('Bea', 'attending')],
      {
        search: '',
        rsvp: 'all',
        group: 'all',
        dietary: 'all',
        sort: 'rsvp',
      },
    );
    expect(result.map((item) => item.name)).toEqual(['Bea', 'Zed', 'Ana']);
    expect(
      filterAndSortGuests(result, { search: '', rsvp: 'all', group: 'family', dietary: 'all', sort: 'name' }).map(
        (item) => item.name,
      ),
    ).toEqual(['Ana']);
  });
});

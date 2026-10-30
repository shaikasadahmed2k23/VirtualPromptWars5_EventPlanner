import { describe, expect, it } from 'vitest';
import { escapeCsvCell, guestsToCsv } from './guestCsv';
import type { Guest } from '@/types';

const guest: Guest = {
  id: 'guest',
  eventId: 'event',
  name: '=2+2',
  email: 'a,"b@example.com',
  phone: '',
  rsvp: 'pending',
  dietary: 'none',
  plusOnes: 0,
  group: 'friends',
  notes: 'Line one\nLine two',
};

describe('guest CSV export', () => {
  it('escapes CSV syntax and guards formulas', () => {
    expect(escapeCsvCell('=SUM(A1)')).toBe("\"'=SUM(A1)\"");
    const csv = guestsToCsv([guest]);
    expect(csv).toContain("\"'=2+2\"");
    expect(csv).toContain('"a,""b@example.com"');
    expect(csv).toContain('"Line one\nLine two"');
  });
});

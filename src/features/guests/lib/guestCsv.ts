import type { Guest } from '@/types';
import { GUEST_DIETARY_LABELS, GUEST_GROUP_LABELS, RSVP_LABELS } from '@/lib/labels';

const FORMULA_PREFIX = /^[=+\-@\t\r]/;
const CSV_HEADERS = ['Name', 'Email', 'Phone', 'Group', 'RSVP', 'Plus-ones', 'Dietary', 'Notes'];

function safeCsvValue(value: string | number): string {
  const text = String(value);
  const guarded = FORMULA_PREFIX.test(text) ? `'${text}` : text;
  return `"${guarded.replaceAll('"', '""')}"`;
}

/** Escapes a CSV cell and neutralises spreadsheet formula injection prefixes. */
export function escapeCsvCell(value: string | number): string {
  return safeCsvValue(value);
}

/** Builds a UTF-8 CSV export for the supplied guests. */
export function guestsToCsv(guests: readonly Guest[]): string {
  const rows = guests.map((guest) =>
    [
      guest.name,
      guest.email,
      guest.phone,
      GUEST_GROUP_LABELS[guest.group],
      RSVP_LABELS[guest.rsvp],
      guest.plusOnes,
      GUEST_DIETARY_LABELS[guest.dietary],
      guest.notes ?? '',
    ]
      .map(escapeCsvCell)
      .join(','),
  );
  return [CSV_HEADERS.map(escapeCsvCell).join(','), ...rows].join('\r\n');
}

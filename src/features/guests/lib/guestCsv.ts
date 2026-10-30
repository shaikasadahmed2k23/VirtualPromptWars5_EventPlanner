import type { Guest } from '@/types';
import { GUEST_DIETARY_LABELS, GUEST_GROUP_LABELS, RSVP_LABELS } from '@/lib/labels';

/** Leading characters that make spreadsheet apps evaluate a cell as a formula. */
const FORMULA_PREFIX = /^[=+\-@\t\r]/;
const CSV_HEADERS = ['Name', 'Email', 'Phone', 'Group', 'RSVP', 'Plus-ones', 'Dietary', 'Notes'];

/** MIME type for the guest export download. */
export const CSV_MIME_TYPE = 'text/csv;charset=utf-8';

/**
 * Quotes a CSV cell and neutralises formula injection (CWE-1236) by prefixing
 * formula-like values with an apostrophe, so `=HYPERLINK(...)` stays text.
 */
export function escapeCsvCell(value: string | number): string {
  const text = String(value);
  const guarded = FORMULA_PREFIX.test(text) ? `'${text}` : text;
  return `"${guarded.replaceAll('"', '""')}"`;
}

/** Builds a CSV export (CRLF line endings, RFC 4180 quoting) for the supplied guests. */
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

import { addDays, addMonths, differenceInCalendarDays, format, isValid, parseISO } from 'date-fns';
import type { ISODate, ISODateTime } from '@/types';

/** Current timestamp as an ISO-8601 string. */
export function nowISO(): ISODateTime {
  return new Date().toISOString();
}

/** Converts a `Date` to a local `YYYY-MM-DD` calendar date. */
export function toISODate(date: Date): ISODate {
  return format(date, 'yyyy-MM-dd');
}

/** Today's local calendar date as `YYYY-MM-DD`. */
export function todayISO(): ISODate {
  return toISODate(new Date());
}

/**
 * Parses a `YYYY-MM-DD` date as a local calendar date (midnight local time).
 * Returns `null` for malformed input instead of an `Invalid Date`.
 */
export function parseISODate(value: string): Date | null {
  const parsed = parseISO(value);
  return isValid(parsed) ? parsed : null;
}

/** Combines a calendar date and an `HH:MM` time into a local `Date`. */
export function combineDateTime(date: ISODate, time: string): Date | null {
  return parseISODate(`${date}T${time}`);
}

/**
 * Formats a `YYYY-MM-DD` date for display. Falls back to the raw string when
 * it cannot be parsed so the UI never shows "Invalid Date".
 */
export function formatDisplayDate(value: ISODate, pattern = 'd MMM yyyy'): string {
  const parsed = parseISODate(value);
  return parsed ? format(parsed, pattern) : value;
}

/**
 * Whole calendar days from `from` to `to` (negative when `to` is earlier).
 * Returns `0` if either date is malformed.
 */
export function daysBetween(from: ISODate, to: ISODate): number {
  const start = parseISODate(from);
  const end = parseISODate(to);
  return start && end ? differenceInCalendarDays(end, start) : 0;
}

/** Shifts a calendar date by `days` (negative moves backwards). */
export function shiftISODate(date: ISODate, days: number): ISODate {
  const parsed = parseISODate(date);
  return parsed ? toISODate(addDays(parsed, days)) : date;
}

/** Lengths of the `YYYY-MM-DD` and `YYYY-MM` prefixes of an ISO timestamp. */
const ISO_DATE_LENGTH = 10;
const ISO_MONTH_LENGTH = 7;

/** `YYYY-MM` key used to group dates by calendar month. */
export function monthKey(date: ISODate): string {
  return date.slice(0, ISO_MONTH_LENGTH);
}

/** Calendar date part of an ISO timestamp, without any time-zone conversion. */
export function dateOfTimestamp(timestamp: ISODateTime): ISODate {
  return timestamp.slice(0, ISO_DATE_LENGTH);
}

/** Shifts a calendar date by whole `months` (negative moves backwards). */
export function shiftISOMonths(date: ISODate, months: number): ISODate {
  const parsed = parseISODate(date);
  return parsed ? toISODate(addMonths(parsed, months)) : date;
}

/** Clamps a calendar date into `[min, max]` (ISO dates compare lexically). */
export function clampISODate(date: ISODate, min: ISODate, max: ISODate): ISODate {
  if (max < min) return max;
  if (date < min) return min;
  return date > max ? max : date;
}

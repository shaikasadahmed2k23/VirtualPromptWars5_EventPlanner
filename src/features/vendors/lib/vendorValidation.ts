import { z } from 'zod';
import { LIMITS } from '@shared/limits';
import { parseISODate } from '@/lib/dates';

/** Validates the local-only request-a-quote form. */
export const quoteRequestSchema = z.object({
  name: z.string().trim().min(1, 'Name is required.').max(LIMITS.eventNameMax, 'Name is too long.'),
  email: z.string().trim().email('Enter a valid email address.'),
  eventDate: z.string().refine((value) => parseISODate(value) !== null, 'Choose an event date.'),
  guestCount: z
    .number({ invalid_type_error: 'Enter the expected number of guests.' })
    .int('Use a whole number.')
    .min(LIMITS.guestCountMin, 'Enter the expected number of guests.')
    .max(LIMITS.guestCountMax, `At most ${String(LIMITS.guestCountMax)} guests.`),
  message: z.string().trim().min(1, 'Message is required.').max(LIMITS.notesMax, 'Message is too long.'),
});

export type QuoteRequestInput = z.infer<typeof quoteRequestSchema>;

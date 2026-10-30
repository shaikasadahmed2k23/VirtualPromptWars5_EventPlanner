import { z } from 'zod';
import { LIMITS } from '@shared/limits';

/** Validates the local-only request-a-quote form. */
export const quoteRequestSchema = z.object({
  name: z.string().trim().min(1, 'Name is required.').max(LIMITS.eventNameMax),
  email: z.string().trim().email('Enter a valid email address.'),
  eventDate: z.string().min(1, 'Choose an event date.'),
  message: z.string().trim().min(1, 'Message is required.').max(LIMITS.notesMax),
});
export type QuoteRequestInput = z.infer<typeof quoteRequestSchema>;

import { z } from 'zod';
import { GUEST_DIETARY, GUEST_GROUPS, RSVP_STATUSES, type GuestInput } from '@/types';
import { LIMITS } from '@shared/limits';

const PHONE_PATTERN = /^[+0-9()\-\s]*$/;

/** Validates editable guest details against shared input limits. */
export const guestInputSchema = z.object({
  name: z.string().trim().min(1, 'Name is required.').max(LIMITS.eventNameMax, 'Name is too long.'),
  email: z.string().trim().email('Enter a valid email address.').or(z.literal('')),
  phone: z
    .string()
    .trim()
    .max(LIMITS.phoneMax, 'Phone number is too long.')
    .regex(PHONE_PATTERN, 'Enter a valid phone number.'),
  rsvp: z.enum(RSVP_STATUSES),
  dietary: z.enum(GUEST_DIETARY),
  plusOnes: z
    .number({ invalid_type_error: 'Enter a number of plus-ones.' })
    .int('Use a whole number.')
    .min(0, 'Plus-ones cannot be negative.')
    .max(LIMITS.plusOnesMax, `At most ${String(LIMITS.plusOnesMax)} plus-ones per guest.`),
  group: z.enum(GUEST_GROUPS),
  notes: z.string().trim().max(LIMITS.notesMax, 'Notes are too long.').optional(),
}) satisfies z.ZodType<GuestInput>;

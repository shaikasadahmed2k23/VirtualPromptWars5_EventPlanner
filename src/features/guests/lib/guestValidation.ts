import { z } from 'zod';
import { GUEST_DIETARY, GUEST_GROUPS, RSVP_STATUSES, type GuestInput } from '@/types';
import { LIMITS } from '@shared/limits';

const phonePattern = /^[+0-9()\-\s]*$/;

/** Validates editable guest details against shared input limits. */
export const guestInputSchema = z.object({
  name: z.string().trim().min(1, 'Name is required.').max(LIMITS.eventNameMax, 'Name is too long.'),
  email: z.string().trim().email('Enter a valid email address.').or(z.literal('')),
  phone: z.string().trim().max(LIMITS.phoneMax, 'Phone number is too long.').regex(phonePattern, 'Enter a valid phone number.'),
  rsvp: z.enum(RSVP_STATUSES),
  dietary: z.enum(GUEST_DIETARY),
  plusOnes: z.number().int().min(0, 'Plus-ones cannot be negative.').max(LIMITS.guestCountMax, 'Plus-ones exceed the limit.'),
  group: z.enum(GUEST_GROUPS),
  notes: z.string().max(LIMITS.notesMax, 'Notes are too long.').optional(),
}) satisfies z.ZodType<GuestInput>;

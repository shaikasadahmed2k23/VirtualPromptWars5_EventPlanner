import { z } from 'zod';
import { CURRENCIES, DIETARY_OPTIONS, EVENT_STYLES, EVENT_TYPES } from '@shared/domain';
import { LIMITS } from '@shared/limits';
import { todayISO } from '@/lib/dates';
import type { NewEventInput } from '@/types';

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;
const TIME_24H = /^([01]\d|2[0-3]):[0-5]\d$/;
const MIN_NAME_LENGTH = 2;

const choice = <U extends string, T extends Readonly<[U, ...U[]]>>(values: T, message: string) =>
  z.enum(values, { errorMap: () => ({ message }) });

const wholeNumber = (label: string, min: number, max: number) =>
  z
    .number({ invalid_type_error: `Enter the ${label}` })
    .int(`Use a whole number for the ${label}`)
    .min(min, `The ${label} must be at least ${min.toLocaleString('en-IN')}`)
    .max(max, `The ${label} must be at most ${max.toLocaleString('en-IN')}`);

/** Step 1 — what kind of celebration. */
export const typeStepSchema = z.object({
  type: choice(EVENT_TYPES, 'Choose the kind of celebration you are planning'),
});

/** Step 2 — name, date and place. */
export const detailsStepSchema = z.object({
  name: z
    .string()
    .trim()
    .min(MIN_NAME_LENGTH, 'Give your event a name')
    .max(LIMITS.eventNameMax, `Keep the name under ${LIMITS.eventNameMax} characters`),
  date: z
    .string()
    .regex(ISO_DATE, 'Choose a date')
    .refine((date) => date >= todayISO(), 'Choose a date from today onwards'),
  startTime: z.string().regex(TIME_24H, 'Choose a start time'),
  city: z
    .string()
    .trim()
    .min(MIN_NAME_LENGTH, 'Tell us which city')
    .max(LIMITS.cityMax, `Keep the city under ${LIMITS.cityMax} characters`),
  venue: z.string().trim().max(LIMITS.venueMax, `Keep the venue under ${LIMITS.venueMax} characters`),
});

/** Step 3 — guests and money. */
export const guestsBudgetStepSchema = z.object({
  guestCount: wholeNumber('guest count', LIMITS.guestCountMin, LIMITS.guestCountMax),
  budget: wholeNumber('total budget', LIMITS.budgetMin, LIMITS.budgetMax),
  currency: choice(CURRENCIES, 'Choose a currency'),
});

/** Step 4 — overall look and feel. */
export const styleStepSchema = z.object({
  style: choice(EVENT_STYLES, 'Pick the style that feels most like you'),
});

const requirementText = (label: string, max: number) =>
  z.string().trim().max(max, `Keep ${label} under ${max} characters`);

/** Step 5 — special requirements. */
export const requirementsStepSchema = z.object({
  dietary: z.array(z.enum(DIETARY_OPTIONS)).max(LIMITS.dietaryMaxCount),
  accessibility: requirementText('accessibility needs', LIMITS.requirementTextMax),
  cultural: requirementText('cultural traditions', LIMITS.requirementTextMax),
  notes: requirementText('notes', LIMITS.notesMax),
});

/** All wizard answers, validated together before the event is created. */
export const wizardSchema = typeStepSchema
  .merge(detailsStepSchema)
  .merge(guestsBudgetStepSchema)
  .merge(styleStepSchema)
  .merge(requirementsStepSchema);

export type TypeStepValues = z.infer<typeof typeStepSchema>;
export type DetailsStepValues = z.infer<typeof detailsStepSchema>;
export type GuestsBudgetStepValues = z.infer<typeof guestsBudgetStepSchema>;
export type StyleStepValues = z.infer<typeof styleStepSchema>;
export type RequirementsStepValues = z.infer<typeof requirementsStepSchema>;
export type WizardValues = z.infer<typeof wizardSchema>;

/** Partially completed wizard answers, as persisted in the draft. */
export type WizardDraft = Partial<WizardValues>;

/** Maps validated wizard answers onto the event model. */
export function toNewEventInput(values: WizardValues): NewEventInput {
  const { dietary, accessibility, cultural, notes, ...details } = values;
  return { ...details, requirements: { dietary, accessibility, cultural, notes } };
}

/**
 * Converts in-progress form values into a draft patch, dropping unset fields
 * and non-finite numbers (an emptied number input yields `NaN`).
 */
export function toDraftPatch(values: Record<string, unknown>): WizardDraft {
  return Object.fromEntries(
    Object.entries(values).filter(
      ([, value]) => value !== undefined && !(typeof value === 'number' && !Number.isFinite(value)),
    ),
  );
}

/** Form-step schemas in wizard order (the review step has none). */
const FORM_STEP_SCHEMAS = [
  typeStepSchema,
  detailsStepSchema,
  guestsBudgetStepSchema,
  styleStepSchema,
  requirementsStepSchema,
] as const;

/**
 * Index of the first step whose answers in `draft` are missing or invalid,
 * or `null` when the whole draft is ready to submit (e.g. a date that was
 * valid yesterday may now be in the past).
 */
export function firstInvalidStep(draft: WizardDraft): number | null {
  const index = FORM_STEP_SCHEMAS.findIndex((schema) => !schema.safeParse(draft).success);
  return index === -1 ? null : index;
}

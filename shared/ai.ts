import { z } from 'zod';
import {
  BUDGET_CATEGORIES,
  CURRENCIES,
  DIETARY_OPTIONS,
  EVENT_STYLES,
  EVENT_TYPES,
  TASK_CATEGORIES,
  TASK_PRIORITIES,
  THEME_MOODS,
} from './domain.js';
import { LIMITS } from './limits.js';

/** Non-empty trimmed string capped at `max` characters. */
const text = (max: number) => z.string().trim().min(1).max(max);

/** Optional free text: empty strings are allowed, length is capped. */
const optionalText = (max: number) => z.string().trim().max(max).default('');

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;
const TIME_24H = /^([01]\d|2[0-3]):[0-5]\d$/;
const HEX_COLOR = /^#[0-9a-fA-F]{6}$/;

/** Number of theme options the AI returns per request. */
export const THEME_OPTION_COUNT = 3;

/* ------------------------------------------------------------------ */
/* Responses (also sent to Gemini as the structured-output schema)    */
/* ------------------------------------------------------------------ */

/** A complete AI-generated event plan. Validated on the server AND the client. */
export const aiPlanSchema = z.object({
  concept: z.object({
    title: text(120),
    tagline: text(200),
    summary: text(1200),
    highlights: z.array(text(200)).min(3).max(6),
  }),
  decorIdeas: z
    .array(z.object({ title: text(100), description: text(400) }))
    .min(3)
    .max(8),
  menu: z
    .array(z.object({ course: text(60), items: z.array(text(120)).min(1).max(8), note: text(200).optional() }))
    .min(2)
    .max(6),
  activities: z
    .array(z.object({ name: text(100), description: text(300), duration: text(40) }))
    .min(3)
    .max(8),
  schedule: z
    .array(z.object({ time: z.string().regex(TIME_24H, 'Use HH:MM'), title: text(100), description: text(300) }))
    .min(4)
    .max(14),
  suggestedTasks: z
    .array(
      z.object({
        title: text(120),
        category: z.enum(TASK_CATEGORIES),
        priority: z.enum(TASK_PRIORITIES),
        monthsBefore: z.number().int().min(0).max(18),
      }),
    )
    .min(3)
    .max(12),
  budgetAllocation: z
    .array(z.object({ category: z.enum(BUDGET_CATEGORIES), percent: z.number().min(0).max(100), note: text(200) }))
    .min(4)
    .max(8),
});
export type AIPlan = z.infer<typeof aiPlanSchema>;

/** A single AI-suggested theme / mood board. */
export const themeSuggestionSchema = z.object({
  name: text(80),
  story: text(600),
  palette: z.array(z.object({ name: text(40), hex: z.string().regex(HEX_COLOR, 'Use #RRGGBB') })).length(5),
  decor: z.array(text(200)).min(3).max(6),
  mood: z.enum(THEME_MOODS),
  /** Image-search keywords used to build the mood-board gallery. */
  keywords: z.array(text(30)).min(2).max(6),
});
export type ThemeSuggestion = z.infer<typeof themeSuggestionSchema>;

/** Payload of `POST /api/themes`. */
export const themesResponseSchema = z.object({
  themes: z.array(themeSuggestionSchema).length(THEME_OPTION_COUNT),
});
export type ThemesResponse = z.infer<typeof themesResponseSchema>;

/* ------------------------------------------------------------------ */
/* Requests                                                           */
/* ------------------------------------------------------------------ */

/** The subset of an event the AI needs. Sent by the client, validated by the server. */
export const eventBriefSchema = z.object({
  type: z.enum(EVENT_TYPES),
  name: text(LIMITS.eventNameMax),
  date: z.string().regex(ISO_DATE, 'Use YYYY-MM-DD'),
  startTime: z.string().regex(TIME_24H, 'Use HH:MM'),
  city: text(LIMITS.cityMax),
  venue: optionalText(LIMITS.venueMax),
  guestCount: z.number().int().min(LIMITS.guestCountMin).max(LIMITS.guestCountMax),
  budget: z.number().min(LIMITS.budgetMin).max(LIMITS.budgetMax),
  currency: z.enum(CURRENCIES),
  style: z.enum(EVENT_STYLES),
  dietary: z.array(z.enum(DIETARY_OPTIONS)).max(LIMITS.dietaryMaxCount).default([]),
  accessibility: optionalText(LIMITS.requirementTextMax),
  cultural: optionalText(LIMITS.requirementTextMax),
  notes: optionalText(LIMITS.notesMax),
});
export type EventBrief = z.infer<typeof eventBriefSchema>;

/** Body of `POST /api/plan`. */
export const planRequestSchema = z.object({ brief: eventBriefSchema }).strict();
export type PlanRequest = z.input<typeof planRequestSchema>;

/** Body of `POST /api/plan/refine`. */
export const refineRequestSchema = z
  .object({
    brief: eventBriefSchema,
    plan: aiPlanSchema,
    instruction: text(LIMITS.refinementMax),
  })
  .strict();
export type RefineRequest = z.input<typeof refineRequestSchema>;

/** Body of `POST /api/themes`. */
export const themesRequestSchema = z.object({ brief: eventBriefSchema }).strict();
export type ThemesRequest = z.input<typeof themesRequestSchema>;

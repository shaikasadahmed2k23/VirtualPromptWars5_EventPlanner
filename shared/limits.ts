/**
 * Input length and range limits enforced identically by client forms and the
 * server. Caps keep prompts small (cost + prompt-injection surface) and stop
 * oversized payloads early.
 */
export const LIMITS = {
  eventNameMax: 80,
  cityMax: 60,
  venueMax: 100,
  requirementTextMax: 400,
  notesMax: 500,
  refinementMax: 300,
  guestCountMin: 1,
  guestCountMax: 5000,
  budgetMin: 1,
  budgetMax: 1_000_000_000,
  dietaryMaxCount: 6,
  /**
   * Maximum accepted JSON request body for the AI proxy. A refine request
   * carries the current plan, so this leaves headroom above a full plan.
   */
  requestBodyBytes: 16 * 1024,
} as const;

/** Server-side deadline for a Gemini call (both attempts combined). */
export const AI_SERVER_TIMEOUT_MS = 20_000;

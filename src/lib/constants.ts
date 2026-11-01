/** Application-wide constants. No magic numbers elsewhere in the codebase. */

export const APP_NAME = 'Utsav';
export const APP_TAGLINE = 'Your Celebration, Beautifully Planned';

/** Bump when a persisted store shape changes, and add a migration step. */
export const STORE_VERSION = 1;

/** localStorage keys, namespaced to avoid collisions. */
export const STORAGE_KEYS = {
  events: 'utsav:events',
  tasks: 'utsav:tasks',
  budget: 'utsav:budget',
  guests: 'utsav:guests',
  vendors: 'utsav:vendors',
  assistant: 'utsav:assistant',
  aiCache: 'utsav:ai-cache',
  wizardDraft: 'utsav:wizard-draft',
} as const;

/** ID of the seeded demo event shown on first load. */
export const DEMO_EVENT_ID = 'evt-ayesha-rohan';

/**
 * Client-side abort timeout for AI requests. Deliberately above the server's
 * 20s Gemini deadline so the server's demo fallback arrives first.
 */
export const AI_REQUEST_TIMEOUT_MS = 25_000;

/** Earlier AI plan versions kept per event for restore. */
export const PLAN_HISTORY_LIMIT = 3;

/** Maximum AI responses kept in the response cache (LRU). */
export const AI_CACHE_MAX_ENTRIES = 24;

/** Debounce delay for search inputs. */
export const SEARCH_DEBOUNCE_MS = 250;

/** Countdown refresh interval (the display resolves to minutes). */
export const COUNTDOWN_TICK_MS = 60_000;

/** Number of upcoming tasks shown on the dashboard. */
export const UPCOMING_TASKS_LIMIT = 5;

/** Tasks due within this many days are flagged as "due soon". */
export const DUE_SOON_DAYS = 14;

/** Page sizes for paginated lists. */
export const PAGE_SIZE = {
  guests: 25,
  vendors: 9,
} as const;

/** Unsplash image widths requested for responsive `srcset`s. */
export const IMAGE_WIDTHS = [480, 800, 1200, 1600] as const;

/** JPEG quality requested from the Unsplash CDN. */
export const IMAGE_QUALITY = 70;

/** Width ÷ height ratios used across the app, so photo crops stay consistent. */
export const ASPECT = {
  square: 1,
  landscape: 4 / 3,
  portrait: 4 / 5,
  tall: 3 / 4,
  wide: 16 / 10,
  cinema: 16 / 9,
} as const;

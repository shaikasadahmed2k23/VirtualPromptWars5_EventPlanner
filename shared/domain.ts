/**
 * Domain vocabularies shared by the client, the AI proxy and the AI schemas.
 * Each list is the single source of truth for its union type.
 */

/** Kinds of celebration Utsav can plan. */
export const EVENT_TYPES = ['wedding', 'birthday', 'anniversary', 'community'] as const;
export type EventType = (typeof EVENT_TYPES)[number];

/** Overall aesthetic direction chosen in the wizard. */
export const EVENT_STYLES = [
  'traditional',
  'royal',
  'modern',
  'minimal',
  'rustic',
  'garden',
  'bohemian',
  'festive',
] as const;
export type EventStyle = (typeof EVENT_STYLES)[number];

/** Supported ISO-4217 currencies. INR is the default. */
export const CURRENCIES = ['INR', 'USD', 'EUR', 'GBP', 'AED', 'SGD'] as const;
export type CurrencyCode = (typeof CURRENCIES)[number];

/** Fixed budget categories used by the budget planner and AI allocations. */
export const BUDGET_CATEGORIES = [
  'venue',
  'catering',
  'decor',
  'photography',
  'attire',
  'entertainment',
  'invitations',
  'misc',
] as const;
export type BudgetCategory = (typeof BUDGET_CATEGORIES)[number];

/** Checklist task categories. */
export const TASK_CATEGORIES = [
  'venue',
  'catering',
  'decor',
  'attire',
  'guests',
  'vendors',
  'ceremony',
  'logistics',
  'other',
] as const;
export type TaskCategory = (typeof TASK_CATEGORIES)[number];

/** Task priorities, highest first. */
export const TASK_PRIORITIES = ['high', 'medium', 'low'] as const;
export type TaskPriority = (typeof TASK_PRIORITIES)[number];

/** Dietary preferences tracked for guests and catering. */
export const DIETARY_OPTIONS = ['vegetarian', 'non-vegetarian', 'vegan', 'jain', 'gluten-free', 'halal'] as const;
export type DietaryOption = (typeof DIETARY_OPTIONS)[number];

/** Visual moods an AI theme can map to; each mood has a curated photo set. */
export const THEME_MOODS = ['floral', 'regal', 'rustic', 'modern', 'festive', 'garden', 'coastal', 'vintage'] as const;
export type ThemeMood = (typeof THEME_MOODS)[number];

import type { BudgetCategory, EventType } from './domain.js';

/**
 * Typical share of the total budget per category, tuned per event type:
 * weddings lean on venue and catering, community events on entertainment.
 * Each row sums to 1. Used by the starter budget and the demo AI plans.
 */
export const BUDGET_WEIGHTS: Record<EventType, Record<BudgetCategory, number>> = {
  wedding: {
    venue: 0.25,
    catering: 0.3,
    decor: 0.12,
    photography: 0.09,
    attire: 0.1,
    entertainment: 0.06,
    invitations: 0.03,
    misc: 0.05,
  },
  birthday: {
    venue: 0.2,
    catering: 0.35,
    decor: 0.15,
    photography: 0.08,
    attire: 0.02,
    entertainment: 0.12,
    invitations: 0.03,
    misc: 0.05,
  },
  anniversary: {
    venue: 0.25,
    catering: 0.32,
    decor: 0.13,
    photography: 0.1,
    attire: 0.05,
    entertainment: 0.08,
    invitations: 0.02,
    misc: 0.05,
  },
  community: {
    venue: 0.2,
    catering: 0.3,
    decor: 0.1,
    photography: 0.05,
    attire: 0,
    entertainment: 0.2,
    invitations: 0.05,
    misc: 0.1,
  },
};

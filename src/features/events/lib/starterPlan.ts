import { BUDGET_WEIGHTS } from '@shared/budgetWeights';
import { BUDGET_CATEGORIES, type BudgetCategory, type EventType } from '@shared/domain';
import { daysBetween, shiftISODate } from '@/lib/dates';
import { BUDGET_CATEGORY_LABELS } from '@/lib/labels';
import { clamp } from '@/lib/utils';
import type { BudgetItemInput, ISODate, TaskInput } from '@/types';
import { PLANNING_HORIZON_DAYS, TASK_TEMPLATES } from './starterTemplates';

/** Budget lines are rounded down to this unit so they read naturally (e.g. ₹1,25,000). */
const BUDGET_ROUNDING_UNIT = 100;

interface StarterEventShape {
  type: EventType;
  date: ISODate;
  budget: number;
}

/**
 * Builds a starter checklist for a new event. Each template has an ideal lead
 * time for an unhurried timeline; when the event is sooner than the type's
 * planning horizon, lead times are compressed proportionally so every task
 * still lands between `today` and the event date.
 */
export function generateStarterTasks(event: StarterEventShape, today: ISODate): TaskInput[] {
  const daysAvailable = Math.max(daysBetween(today, event.date), 0);
  const scale = clamp(daysAvailable / PLANNING_HORIZON_DAYS[event.type], 0, 1);

  return TASK_TEMPLATES[event.type]
    .map((template) => {
      const leadDays = Math.min(Math.round(template.leadDays * scale), daysAvailable);
      return {
        title: template.title,
        notes: '',
        dueDate: shiftISODate(event.date, -leadDays),
        priority: template.priority,
        category: template.category,
      };
    })
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate));
}

/**
 * Splits the total budget across categories using weights tuned per event
 * type (weddings lean on venue + catering, community events on entertainment).
 * Amounts are rounded down, so the lines never exceed the total.
 */
export function generateStarterBudget(event: StarterEventShape): BudgetItemInput[] {
  const weights = BUDGET_WEIGHTS[event.type];
  return BUDGET_CATEGORIES.filter((category) => weights[category] > 0).map((category: BudgetCategory) => ({
    category,
    name: `${BUDGET_CATEGORY_LABELS[category]} (planned)`,
    estimated: Math.floor((event.budget * weights[category]) / BUDGET_ROUNDING_UNIT) * BUDGET_ROUNDING_UNIT,
    actual: 0,
    paid: false,
    vendorName: '',
  }));
}

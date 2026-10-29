import type { AIPlan } from '@shared/ai';
import { BUDGET_WEIGHTS } from '@shared/budgetWeights';
import { clampISODate, shiftISODate, shiftISOMonths } from '@/lib/dates';
import { BUDGET_CATEGORY_LABELS } from '@/lib/labels';
import type { BudgetCategory, BudgetItemInput, CelebrationEvent, ISODate, TaskCategory, TaskInput } from '@/types';

/** Typical lead time before the event for a task in each category. */
const LEAD_DAYS: Record<TaskCategory, number> = {
  venue: 120,
  vendors: 60,
  decor: 45,
  attire: 60,
  catering: 30,
  ceremony: 30,
  guests: 45,
  logistics: 14,
  other: 21,
};

const PERCENT = 100;
const ROUNDING_UNIT = 100;

type EventShape = Pick<CelebrationEvent, 'date' | 'budget'>;

/** Keeps a deadline between today and the event day. */
const dueBetween = (date: ISODate, event: EventShape, today: ISODate) => clampISODate(date, today, event.date);

const roundAmount = (amount: number) => Math.max(Math.round(amount / ROUNDING_UNIT) * ROUNDING_UNIT, 0);

/** Converts an AI-suggested task into a checklist task with a months-before deadline. */
export function taskFromSuggestion(
  suggestion: AIPlan['suggestedTasks'][number],
  event: EventShape,
  today: ISODate,
): TaskInput {
  return {
    title: suggestion.title,
    notes: 'Suggested by the AI planner.',
    dueDate: dueBetween(shiftISOMonths(event.date, -suggestion.monthsBefore), event, today),
    priority: suggestion.priority,
    category: suggestion.category,
  };
}

/** Converts any plan idea (décor, menu course, activity) into a task due a sensible lead time before the event. */
export function taskFromIdea(
  title: string,
  description: string,
  category: TaskCategory,
  event: EventShape,
  today: ISODate,
): TaskInput {
  return {
    title,
    notes: description,
    dueDate: dueBetween(shiftISODate(event.date, -LEAD_DAYS[category]), event, today),
    priority: 'medium',
    category,
  };
}

/** Share of the total budget the plan gives a category, falling back to typical weights. */
function categoryShare(plan: AIPlan, category: BudgetCategory, event: CelebrationEvent): number {
  const allocated = plan.budgetAllocation.find((line) => line.category === category);
  return allocated ? allocated.percent / PERCENT : BUDGET_WEIGHTS[event.type][category];
}

/** Amount in the event currency for a percentage of the total budget, rounded for display. */
export function allocationAmount(event: EventShape, percent: number): number {
  return roundAmount((event.budget * percent) / PERCENT);
}

/** Budget line for an AI allocation row (percentage of the total budget). */
export function budgetFromAllocation(line: AIPlan['budgetAllocation'][number], event: EventShape): BudgetItemInput {
  return {
    category: line.category,
    name: `${BUDGET_CATEGORY_LABELS[line.category]} (AI allocation)`,
    estimated: allocationAmount(event, line.percent),
    actual: 0,
    paid: false,
    vendorName: '',
  };
}

/**
 * Budget line for a single idea: the category's share of the budget split
 * evenly across the plan's ideas in that category.
 */
export function budgetFromIdea(
  name: string,
  category: BudgetCategory,
  ideasInCategory: number,
  plan: AIPlan,
  event: CelebrationEvent,
): BudgetItemInput {
  const share = categoryShare(plan, category, event) / Math.max(ideasInCategory, 1);
  return { category, name, estimated: roundAmount(event.budget * share), actual: 0, paid: false, vendorName: '' };
}

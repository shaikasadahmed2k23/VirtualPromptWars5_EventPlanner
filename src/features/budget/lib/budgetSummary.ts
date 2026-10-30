import { BUDGET_CATEGORIES } from '@shared/domain';
import type { BudgetCategory, BudgetItem, BudgetSummary, CategoryTotal } from '@/types';

const ratio = (part: number, whole: number): number => (whole > 0 ? part / whole : 0);

/** Aggregates budget lines into totals, forecasts and per-category sums. */
export function computeBudgetSummary(items: readonly BudgetItem[], totalBudget: number): BudgetSummary {
  const byCategory = new Map<CategoryTotal['category'], CategoryTotal>(
    BUDGET_CATEGORIES.map((category) => [category, { category, estimated: 0, actual: 0 }]),
  );

  let estimated = 0;
  let actual = 0;
  let paid = 0;
  let committed = 0;

  for (const item of items) {
    estimated += item.estimated;
    actual += item.actual;
    committed += Math.max(item.estimated, item.actual);
    if (item.paid) paid += item.actual;

    const bucket = byCategory.get(item.category);
    if (bucket) {
      bucket.estimated += item.estimated;
      bucket.actual += item.actual;
    }
  }

  return {
    totalBudget,
    estimated,
    actual,
    paid,
    committed,
    remaining: totalBudget - committed,
    spentRatio: ratio(actual, totalBudget),
    committedRatio: ratio(committed, totalBudget),
    isOverBudget: committed > totalBudget,
    byCategory: [...byCategory.values()],
  };
}

/** Buckets budget lines by category (every category present, in display order). */
export function groupItemsByCategory(items: readonly BudgetItem[]): Record<BudgetCategory, BudgetItem[]> {
  const groups = Object.fromEntries(BUDGET_CATEGORIES.map((category) => [category, [] as BudgetItem[]]));
  for (const item of items) groups[item.category]?.push(item);
  return groups as Record<BudgetCategory, BudgetItem[]>;
}

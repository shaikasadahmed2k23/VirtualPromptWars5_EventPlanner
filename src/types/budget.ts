import type { BudgetCategory } from '@shared/domain';
import type { Id } from './common';

export type { BudgetCategory };

/** A single expense line in an event budget. Amounts are in the event currency. */
export interface BudgetItem {
  id: Id;
  eventId: Id;
  category: BudgetCategory;
  name: string;
  estimated: number;
  /** Actual cost so far; `0` when not yet known. */
  actual: number;
  paid: boolean;
  vendorName: string;
}

/** Editable budget item fields. */
export type BudgetItemInput = Omit<BudgetItem, 'id' | 'eventId'>;

/** Aggregated totals for one category. */
export interface CategoryTotal {
  category: BudgetCategory;
  estimated: number;
  actual: number;
}

/** Derived budget overview for an event. */
export interface BudgetSummary {
  totalBudget: number;
  estimated: number;
  /** Money actually spent so far (sum of `actual`). */
  actual: number;
  /** Portion of `actual` already paid. */
  paid: number;
  /** Sum over lines of `max(estimated, actual)`: the best forecast of final spend. */
  committed: number;
  /** `totalBudget - committed`; negative means the plan is over budget. */
  remaining: number;
  /** `actual / totalBudget` (may exceed 1). */
  spentRatio: number;
  /** `committed / totalBudget` (may exceed 1). */
  committedRatio: number;
  isOverBudget: boolean;
  /** Totals per category, in canonical category order, including empty categories. */
  byCategory: CategoryTotal[];
}

import { BUDGET_CATEGORY_LABELS } from '@/lib/labels';
import type { BudgetCategory, BudgetSummary } from '@/types';

/** One category's figures, shaped for the charts and their table alternative. */
export interface BudgetChartRow {
  category: BudgetCategory;
  label: string;
  estimated: number;
  actual: number;
  /**
   * Expected final spend: the actual amount once it exceeds the estimate,
   * otherwise the estimate (same rule as the budget summary's "committed").
   */
  forecast: number;
}

/** Maps category totals to labelled chart rows, skipping empty categories. */
export function toBudgetChartData(summary: BudgetSummary): BudgetChartRow[] {
  return summary.byCategory
    .filter((row) => row.estimated > 0 || row.actual > 0)
    .map((row) => ({
      category: row.category,
      label: BUDGET_CATEGORY_LABELS[row.category],
      estimated: row.estimated,
      actual: row.actual,
      forecast: Math.max(row.estimated, row.actual),
    }));
}

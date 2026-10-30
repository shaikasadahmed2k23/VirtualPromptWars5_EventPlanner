import type { BudgetSummary } from '@/types';
import { BUDGET_CATEGORY_LABELS } from '@/lib/labels';

export interface BudgetChartRow {
  category: string;
  label: string;
  estimated: number;
  actual: number;
  fill?: string;
}

/** Maps canonical category totals to labels and chart-friendly values. */
export function toBudgetChartData(summary: BudgetSummary): BudgetChartRow[] {
  return summary.byCategory
    .filter((row) => row.estimated > 0 || row.actual > 0)
    .map((row) => ({
      category: row.category,
      label: BUDGET_CATEGORY_LABELS[row.category],
      estimated: row.estimated,
      actual: row.actual > 0 ? row.actual : row.estimated,
    }));
}

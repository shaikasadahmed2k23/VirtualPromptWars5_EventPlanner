import { useMemo } from 'react';
import { filterByEventId } from '@/lib/collection';
import type { BudgetCategory, BudgetItem, BudgetSummary, CelebrationEvent } from '@/types';
import { type BudgetChartRow, toBudgetChartData } from '../lib/budgetChartData';
import { computeBudgetSummary, groupItemsByCategory } from '../lib/budgetSummary';
import { useBudgetStore } from '../store/useBudgetStore';

export interface BudgetView {
  items: BudgetItem[];
  itemsByCategory: Record<BudgetCategory, BudgetItem[]>;
  summary: BudgetSummary;
  chartRows: BudgetChartRow[];
}

/** The event's budget lines plus memoised summary, per-category groups and chart rows. */
export function useBudgetSummary(event: Pick<CelebrationEvent, 'id' | 'budget'>): BudgetView {
  const allItems = useBudgetStore((state) => state.items);
  const items = useMemo(() => filterByEventId(allItems, event.id), [allItems, event.id]);
  const summary = useMemo(() => computeBudgetSummary(items, event.budget), [items, event.budget]);
  const itemsByCategory = useMemo(() => groupItemsByCategory(items), [items]);
  const chartRows = useMemo(() => toBudgetChartData(summary), [summary]);
  return { items, itemsByCategory, summary, chartRows };
}

import { useMemo } from 'react';
import { filterByEventId } from '@/lib/collection';
import type { BudgetItem, BudgetSummary, CelebrationEvent } from '@/types';
import { computeBudgetSummary } from '../lib/budgetSummary';
import { useBudgetStore } from '../store/useBudgetStore';

/** The event's budget lines plus their memoised summary. */
export function useBudgetSummary(event: Pick<CelebrationEvent, 'id' | 'budget'>): {
  items: BudgetItem[];
  summary: BudgetSummary;
} {
  const allItems = useBudgetStore((state) => state.items);
  const items = useMemo(() => filterByEventId(allItems, event.id), [allItems, event.id]);
  const summary = useMemo(() => computeBudgetSummary(items, event.budget), [items, event.budget]);
  return { items, summary };
}

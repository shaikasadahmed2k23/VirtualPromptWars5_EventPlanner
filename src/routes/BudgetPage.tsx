import { lazy, Suspense, useId } from 'react';
import { BUDGET_CATEGORIES } from '@shared/domain';
import { PageHeader } from '@/components/ui/headings';
import { Skeleton } from '@/components/ui/states';
import { BudgetCategoryCard } from '@/features/budget/components/BudgetCategoryCard';
import { BudgetEntryForm } from '@/features/budget/components/BudgetEntryForm';
import { BudgetSummaryPanel } from '@/features/budget/components/BudgetSummaryPanel';
import { useBudgetSummary } from '@/features/budget/hooks/useBudgetSummary';
import { useBudgetStore } from '@/features/budget/store/useBudgetStore';
import { useCurrentEvent } from '@/features/events/hooks/useCurrentEvent';
import { useDeleteWithUndo } from '@/lib/hooks/useDeleteWithUndo';
import { useDocumentTitle } from '@/lib/hooks/useDocumentTitle';
import type { BudgetItem } from '@/types';

/** Recharts is the heaviest dependency; it loads only when the budget page renders. */
const BudgetCharts = lazy(() =>
  import('@/features/budget/components/BudgetCharts').then((module) => ({ default: module.BudgetCharts })),
);

function ChartsSkeleton() {
  return (
    <div className="grid gap-6 xl:grid-cols-2" aria-hidden="true">
      <Skeleton className="h-96" />
      <Skeleton className="h-96" />
    </div>
  );
}

/** Budget for the current event: limit, totals, charts and editable lines per category. */
export default function BudgetPage() {
  const event = useCurrentEvent();
  const { itemsByCategory, summary, chartRows } = useBudgetSummary(event);
  const deleteItem = useBudgetStore((state) => state.deleteItem);
  const linesHeadingId = useId();
  useDocumentTitle(`Budget · ${event.name}`);

  const onDelete = useDeleteWithUndo<BudgetItem>(deleteItem, 'name');

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow={event.name}
        title="Budget"
        description="Track estimated against actual spend across every category."
        actions={<BudgetEntryForm eventId={event.id} />}
      />
      <BudgetSummaryPanel event={event} summary={summary} />
      <Suspense fallback={<ChartsSkeleton />}>
        <BudgetCharts rows={chartRows} currency={event.currency} />
      </Suspense>
      <section aria-labelledby={linesHeadingId} className="space-y-4">
        <div>
          <h2 id={linesHeadingId} className="font-serif text-2xl font-semibold">
            Budget lines
          </h2>
          <p className="mt-1 text-sm text-muted">Update amounts, notes and payment status inline.</p>
        </div>
        {BUDGET_CATEGORIES.map((category) => (
          <BudgetCategoryCard
            key={category}
            category={category}
            items={itemsByCategory[category]}
            onDelete={onDelete}
          />
        ))}
      </section>
    </div>
  );
}

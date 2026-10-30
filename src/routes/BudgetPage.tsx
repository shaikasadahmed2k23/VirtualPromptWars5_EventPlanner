import { lazy, Suspense } from 'react';
import { toast } from 'sonner';
import { BUDGET_CATEGORIES } from '@shared/domain';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EmptyState, Skeleton } from '@/components/ui/states';
import { PageHeader } from '@/components/ui/headings';
import { Wallet } from 'lucide-react';
import { BudgetEntryForm } from '@/features/budget/components/BudgetEntryForm';
import { BudgetEntryRow } from '@/features/budget/components/BudgetEntryRow';
import { BudgetSummaryPanel } from '@/features/budget/components/BudgetSummaryPanel';
import { useBudgetSummary } from '@/features/budget/hooks/useBudgetSummary';
import { useCurrentEvent } from '@/features/events/hooks/useCurrentEvent';
import { BUDGET_CATEGORY_LABELS } from '@/lib/labels';
import { useDocumentTitle } from '@/lib/hooks/useDocumentTitle';
import { useBudgetStore } from '@/features/budget/store/useBudgetStore';
import type { BudgetItem } from '@/types';
import { toBudgetChartData } from '@/features/budget/lib/budgetChartData';

const BudgetCharts = lazy(() =>
  import('@/features/budget/components/BudgetCharts').then((module) => ({ default: module.BudgetCharts })),
);

/** Budget for the current event. */
export default function BudgetPage() {
  const event = useCurrentEvent();
  const { items, summary } = useBudgetSummary(event);
  const addItem = useBudgetStore((state) => state.addItem);
  const deleteItem = useBudgetStore((state) => state.deleteItem);
  useDocumentTitle(`Budget · ${event.name}`);

  const removeItem = (item: BudgetItem) => {
    deleteItem(item.id);
    const { id: _id, eventId: _eventId, ...input } = item;
    toast.success(`Removed “${item.name}”`, {
      action: { label: 'Undo', onClick: () => addItem(event.id, input) },
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow={event.name}
        title="Budget"
        description="Track estimated against actual spend across every category."
        actions={<BudgetEntryForm eventId={event.id} />}
      />
      <BudgetSummaryPanel event={event} summary={summary} />
      <Suspense fallback={<div className="grid gap-6 xl:grid-cols-2"><Skeleton className="h-96" /><Skeleton className="h-96" /></div>}>
        <BudgetCharts rows={toBudgetChartData(summary)} currency={event.currency} />
      </Suspense>
      <section aria-labelledby="budget-lines-heading" className="space-y-4">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 id="budget-lines-heading" className="font-serif text-2xl font-semibold">Budget lines</h2>
            <p className="mt-1 text-sm text-muted">Update amounts, notes and payment status inline.</p>
          </div>
        </div>
        {BUDGET_CATEGORIES.map((category) => {
          const categoryItems = items.filter((item) => item.category === category);
          return (
            <Card key={category}>
              <CardHeader>
                <CardTitle>{BUDGET_CATEGORY_LABELS[category]}</CardTitle>
              </CardHeader>
              <CardContent>
                {categoryItems.length === 0 ? (
                  <EmptyState
                    icon={Wallet}
                    title={`No ${BUDGET_CATEGORY_LABELS[category].toLowerCase()} lines`}
                    description="Add an expense to start tracking this category."
                  />
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[760px] text-left text-sm">
                      <caption className="sr-only">{BUDGET_CATEGORY_LABELS[category]} budget lines</caption>
                      <thead className="text-muted">
                        <tr>
                          <th className="pb-2 pr-3 font-medium">Expense</th>
                          <th className="pb-2 pr-3 font-medium">Estimated</th>
                          <th className="pb-2 pr-3 font-medium">Actual</th>
                          <th className="pb-2 pr-3 text-center font-medium">Paid</th>
                          <th className="pb-2 text-right font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {categoryItems.map((item) => (
                          <BudgetEntryRow key={item.id} item={item} currency={event.currency} onDelete={removeItem} />
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </section>
    </div>
  );
}

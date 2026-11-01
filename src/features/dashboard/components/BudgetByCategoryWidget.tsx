import { AlertTriangle, Wallet } from 'lucide-react';
import { Link } from 'react-router-dom';
import { paths } from '@/app/navigation';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/states';
import { WidgetCard } from '@/components/ui/widget-card';
import { useBudgetSummary } from '@/features/budget/hooks/useBudgetSummary';
import { formatCurrency, PERCENT } from '@/lib/format';
import { BUDGET_CATEGORY_LABELS } from '@/lib/labels';
import type { CategoryTotal, CelebrationEvent } from '@/types';

interface CategoryBarProps {
  row: CategoryTotal;
  /** The largest amount across rows, so every bar shares one scale. */
  scale: number;
  money: (amount: number) => string;
}

/** One category: a text label (the accessible value) over decorative estimated/actual bars. */
function CategoryBar({ row, scale, money }: CategoryBarProps) {
  return (
    <li>
      <div className="flex items-baseline justify-between gap-3 text-sm">
        <span className="font-medium">{BUDGET_CATEGORY_LABELS[row.category]}</span>
        <span className="text-muted">
          {money(row.actual)} spent <span aria-hidden="true">/</span>
          <span className="sr-only">of</span> {money(row.estimated)}
        </span>
      </div>
      <div className="relative mt-1.5 h-2 rounded-full bg-ivory-deep" aria-hidden="true">
        <div
          className="absolute inset-y-0 left-0 rounded-full bg-blush"
          style={{ width: `${(row.estimated / scale) * PERCENT}%` }}
        />
        <div
          className={`absolute inset-y-0 left-0 rounded-full ${row.actual > row.estimated ? 'bg-danger' : 'bg-rose-ink'}`}
          style={{ width: `${(row.actual / scale) * PERCENT}%` }}
        />
      </div>
    </li>
  );
}

/** Estimated vs actual spend per category as accessible text-labelled bars. */
export function BudgetByCategoryWidget({ event, isLoading }: { event: CelebrationEvent; isLoading: boolean }) {
  const { summary } = useBudgetSummary(event);
  const rows = summary.byCategory.filter((row) => row.estimated > 0 || row.actual > 0);
  const scale = Math.max(...rows.map((row) => Math.max(row.estimated, row.actual)), 1);
  const money = (amount: number) => formatCurrency(amount, event.currency);

  return (
    <WidgetCard
      title="Budget by category"
      description={`${money(summary.committed)} committed of ${money(event.budget)}`}
      isLoading={isLoading}
      action={
        <Button asChild variant="link" size="sm">
          <Link to={paths.budget(event.id)}>Open budget</Link>
        </Button>
      }
    >
      {summary.isOverBudget ? (
        <p role="status" className="mb-4 flex items-start gap-2 rounded-xl bg-danger-soft p-3 text-sm text-danger">
          <AlertTriangle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          Over budget by {money(-summary.remaining)}. Review your largest categories.
        </p>
      ) : null}
      {rows.length === 0 ? (
        <EmptyState
          icon={Wallet}
          title="No budget lines yet"
          description="Add expenses to see where your money is going."
          action={
            <Button asChild size="sm">
              <Link to={paths.budget(event.id)}>Add an expense</Link>
            </Button>
          }
        />
      ) : (
        <ul className="space-y-3">
          {rows.map((row) => (
            <CategoryBar key={row.category} row={row} scale={scale} money={money} />
          ))}
        </ul>
      )}
    </WidgetCard>
  );
}

import { AlertTriangle, Banknote, Calculator, CircleDollarSign, WalletCards } from 'lucide-react';
import { useState } from 'react';
import { LIMITS } from '@shared/limits';
import { Card } from '@/components/ui/card';
import { Field } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { ProgressRing } from '@/components/ui/progress-ring';
import { StatCard } from '@/components/ui/stat-card';
import { formatCurrency, formatPercent } from '@/lib/format';
import { useEventStore } from '@/features/events/store/useEventStore';
import type { BudgetSummary } from '@/types';
import type { CelebrationEvent } from '@/types';

interface BudgetSummaryPanelProps {
  event: CelebrationEvent;
  summary: BudgetSummary;
}

/** Budget totals and the editable event-level budget limit. */
export function BudgetSummaryPanel({ event, summary }: BudgetSummaryPanelProps) {
  const updateEvent = useEventStore((state) => state.updateEvent);
  const [budgetError, setBudgetError] = useState<string>();
  const money = (amount: number) => formatCurrency(amount, event.currency);
  const saveBudget = (value: string) => {
    const budget = Number(value);
    if (!Number.isFinite(budget) || budget < LIMITS.budgetMin || budget > LIMITS.budgetMax) {
      setBudgetError(`Enter an amount between ${LIMITS.budgetMin} and ${LIMITS.budgetMax.toLocaleString('en-IN')}.`);
      return;
    }
    setBudgetError(undefined);
    updateEvent(event.id, { budget });
  };

  return (
    <div className="space-y-4">
      {summary.isOverBudget ? (
        <div role="alert" className="flex items-start gap-3 rounded-2xl border border-danger/25 bg-danger-soft p-4 text-danger">
          <AlertTriangle className="mt-0.5 size-5 shrink-0" aria-hidden="true" />
          <div>
            <p className="font-semibold">This budget is over its limit.</p>
            <p className="text-sm">You are {money(-summary.remaining)} over budget. Review the largest categories.</p>
          </div>
        </div>
      ) : null}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card className="p-5">
          <Field label="Total budget" error={budgetError}>
            {(props) => (
              <Input
                {...props}
                type="number"
                min={LIMITS.budgetMin}
                max={LIMITS.budgetMax}
                defaultValue={event.budget}
                onBlur={(input) => saveBudget(input.currentTarget.value)}
              />
            )}
          </Field>
        </Card>
        <StatCard label="Estimated total" value={money(summary.estimated)} icon={Calculator} tone="lavender" />
        <StatCard label="Actual total" value={money(summary.actual)} icon={Banknote} tone="gold" />
        <StatCard label="Remaining" value={money(summary.remaining)} icon={CircleDollarSign} tone={summary.isOverBudget ? 'rose' : 'success'} />
      </div>
      <Card className="flex flex-col items-center gap-4 p-5 sm:flex-row">
        <ProgressRing value={summary.committedRatio} label="Budget committed">
          <span className="font-serif text-2xl font-semibold">{formatPercent(summary.committedRatio)}</span>
        </ProgressRing>
        <div>
          <h2 className="font-serif text-xl font-semibold">Budget committed</h2>
          <p className="mt-1 text-sm text-muted">
            {money(summary.committed)} forecast against {money(summary.totalBudget)} total budget.
          </p>
          <p className="mt-2 flex items-center gap-1 text-sm font-medium text-charcoal">
            <WalletCards className="size-4 text-rose-ink" aria-hidden="true" />
            {formatPercent(summary.spentRatio)} used in actual spend
          </p>
        </div>
      </Card>
    </div>
  );
}

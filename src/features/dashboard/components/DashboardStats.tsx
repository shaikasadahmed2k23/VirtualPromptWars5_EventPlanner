import { CalendarClock, CheckCircle2, Users } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { ProgressRing } from '@/components/ui/progress-ring';
import { StatCard } from '@/components/ui/stat-card';
import { Skeleton } from '@/components/ui/states';
import { useBudgetSummary } from '@/features/budget/hooks/useBudgetSummary';
import { useGuestStats } from '@/features/guests/hooks/useGuestStats';
import { useEventTasks } from '@/features/tasks/hooks/useEventTasks';
import { computeTaskProgress } from '@/features/tasks/lib/taskStats';
import { combineDateTime, formatDisplayDate } from '@/lib/dates';
import { formatCurrency, formatPercent, pluralize } from '@/lib/format';
import { useCountdown } from '@/lib/hooks/useCountdown';
import type { CelebrationEvent } from '@/types';

const RING_SIZE = 64;
const RING_STROKE = 7;
const STAT_COUNT = 4;

/** Budget headline: a spent-ratio ring next to the amount spent of the total. */
function BudgetSpentCard({ event }: { event: CelebrationEvent }) {
  const { summary } = useBudgetSummary(event);
  return (
    <Card className="flex items-center gap-4 p-5">
      <ProgressRing value={summary.spentRatio} label="Budget spent" size={RING_SIZE} strokeWidth={RING_STROKE}>
        <span className="text-xs font-semibold">{formatPercent(summary.spentRatio)}</span>
      </ProgressRing>
      <div className="min-w-0">
        <p className="text-sm text-muted">Budget spent</p>
        <p className="truncate font-serif text-2xl font-semibold leading-tight">
          {formatCurrency(summary.actual, event.currency)}
        </p>
        <p className="mt-1 text-xs text-muted">of {formatCurrency(event.budget, event.currency)}</p>
      </div>
    </Card>
  );
}

/** Four headline metrics: budget spent, task progress, RSVPs and days to go. */
export function DashboardStats({ event, isLoading }: { event: CelebrationEvent; isLoading: boolean }) {
  const tasks = useEventTasks(event.id);
  const progress = computeTaskProgress(tasks);
  const { stats } = useGuestStats(event.id);
  // Same source as the hero countdown, so the two numbers always agree.
  const daysToGo = useCountdown(combineDateTime(event.date, event.startTime))?.days ?? 0;

  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-busy="true">
        {Array.from({ length: STAT_COUNT }, (_, key) => (
          <Skeleton key={key} className="h-24" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <BudgetSpentCard event={event} />
      <StatCard
        label="Tasks done"
        value={formatPercent(progress.ratio)}
        icon={CheckCircle2}
        tone="success"
        detail={`${progress.done} of ${pluralize(progress.total, 'task')}`}
      />
      <StatCard
        label="Guests attending"
        value={`${stats.attending} / ${stats.total}`}
        icon={Users}
        tone="lavender"
        detail={`Headcount ${stats.headcount} incl. plus-ones`}
      />
      <StatCard
        label="Days to go"
        value={daysToGo}
        icon={CalendarClock}
        tone="gold"
        detail={formatDisplayDate(event.date, 'd MMM yyyy')}
      />
    </div>
  );
}

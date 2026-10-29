import { CalendarRange, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { paths } from '@/app/navigation';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/states';
import { WidgetCard } from '@/components/ui/widget-card';
import { useEventTasks } from '@/features/tasks/hooks/useEventTasks';
import { groupTasksByMonth } from '@/features/tasks/lib/taskStats';
import { monthKey, todayISO } from '@/lib/dates';
import { cn } from '@/lib/utils';
import type { CelebrationEvent } from '@/types';

/** Month-by-month strip of task progress leading up to the event. */
export function MiniTimelineWidget({ event, isLoading }: { event: CelebrationEvent; isLoading: boolean }) {
  const tasks = useEventTasks(event.id);
  const months = groupTasksByMonth(tasks);
  const currentMonth = monthKey(todayISO());
  const eventMonth = monthKey(event.date);

  return (
    <WidgetCard
      title="Timeline"
      description="Tasks by month"
      isLoading={isLoading}
      action={
        <Button asChild variant="link" size="sm">
          <Link to={paths.tasks(event.id)}>Open timeline</Link>
        </Button>
      }
    >
      {months.length === 0 ? (
        <EmptyState
          icon={CalendarRange}
          title="Your timeline is empty"
          description="Tasks with due dates will appear here, month by month."
        />
      ) : (
        <ol className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {months.map((month) => {
            const percent = month.total > 0 ? Math.round((month.done / month.total) * 100) : 0;
            const isCurrent = month.key === currentMonth;
            return (
              <li
                key={month.key}
                aria-current={isCurrent ? 'date' : undefined}
                className={cn(
                  'rounded-2xl border p-3',
                  isCurrent ? 'border-rose-ink bg-blush-soft/50' : 'border-line bg-ivory',
                )}
              >
                <p className="flex items-center gap-1 text-sm font-semibold">
                  {month.label}
                  {month.key === eventMonth ? (
                    <Heart className="size-3.5 fill-rose text-rose-ink" aria-label="Event month" />
                  ) : null}
                </p>
                <p className="mt-0.5 text-xs text-muted">
                  {month.done}/{month.total} done{isCurrent ? ' · this month' : ''}
                </p>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-ivory-deep" aria-hidden="true">
                  <div className="h-full rounded-full bg-success" style={{ width: `${percent}%` }} />
                </div>
              </li>
            );
          })}
        </ol>
      )}
    </WidgetCard>
  );
}

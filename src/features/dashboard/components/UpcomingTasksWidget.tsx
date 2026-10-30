import { ListChecks, PartyPopper } from 'lucide-react';
import { Link } from 'react-router-dom';
import { notifyWithUndo } from '@/lib/undoToast';
import { paths } from '@/app/navigation';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { EmptyState } from '@/components/ui/states';
import { WidgetCard } from '@/components/ui/widget-card';
import { DueBadge, PriorityBadge } from '@/features/tasks/components/TaskBadges';
import { useEventTasks } from '@/features/tasks/hooks/useEventTasks';
import { isTaskOverdue, selectUpcomingTasks } from '@/features/tasks/lib/taskStats';
import { useTaskStore } from '@/features/tasks/store/useTaskStore';
import { UPCOMING_TASKS_LIMIT } from '@/lib/constants';
import { formatDisplayDate, todayISO } from '@/lib/dates';
import { cn } from '@/lib/utils';
import type { CelebrationEvent, Task } from '@/types';

/** The next open tasks, overdue first, each completable inline (with undo). */
export function UpcomingTasksWidget({ event, isLoading }: { event: CelebrationEvent; isLoading: boolean }) {
  const tasks = useEventTasks(event.id);
  const toggleTask = useTaskStore((state) => state.toggleTask);
  const upcoming = selectUpcomingTasks(tasks, UPCOMING_TASKS_LIMIT);
  const today = todayISO();

  const complete = (task: Task) => {
    toggleTask(task.id);
    notifyWithUndo(`Marked “${task.title}” done`, () => {
      toggleTask(task.id);
    });
  };

  return (
    <WidgetCard
      title="Up next"
      description="Your next five open tasks"
      isLoading={isLoading}
      action={
        <Button asChild variant="link" size="sm">
          <Link to={paths.tasks(event.id)}>View all</Link>
        </Button>
      }
    >
      {tasks.length === 0 ? (
        <EmptyState
          icon={ListChecks}
          title="No tasks yet"
          description="Add your first task or let the AI assistant suggest a checklist."
          action={
            <Button asChild size="sm">
              <Link to={paths.tasks(event.id)}>Add a task</Link>
            </Button>
          }
        />
      ) : upcoming.length === 0 ? (
        <EmptyState icon={PartyPopper} title="All caught up" description="Every task is done. Time to celebrate!" />
      ) : (
        <ul className="divide-y divide-line">
          {upcoming.map((task) => (
            <li
              key={task.id}
              className={cn(
                'flex items-start gap-3 py-3',
                isTaskOverdue(task, today) && '-mx-2 rounded-xl bg-danger-soft/40 px-2',
              )}
            >
              <Checkbox
                id={`upcoming-${task.id}`}
                className="mt-0.5"
                checked={task.done}
                onCheckedChange={() => {
                  complete(task);
                }}
              />
              <div className="min-w-0 flex-1">
                <label htmlFor={`upcoming-${task.id}`} className="cursor-pointer font-medium">
                  {task.title}
                </label>
                <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted">
                  <span>Due {formatDisplayDate(task.dueDate)}</span>
                  <DueBadge task={task} today={today} />
                  <PriorityBadge priority={task.priority} />
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </WidgetCard>
  );
}

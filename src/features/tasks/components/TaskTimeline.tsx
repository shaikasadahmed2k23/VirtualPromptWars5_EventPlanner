import { CalendarDays, CheckCircle2 } from 'lucide-react';
import { useId, useMemo } from 'react';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { TASK_CATEGORY_LABELS } from '@/lib/labels';
import type { ISODate, Task } from '@/types';
import { formatTaskDeadline, groupTasksByTimeline } from '../lib/taskTimeline';
import { PriorityBadge } from './TaskBadges';

interface TaskTimelineProps {
  tasks: readonly Task[];
  eventDate: ISODate;
  onToggle: (task: Task) => void;
}

/** Vertical, keyboard-accessible timeline grouped around the event date. */
export function TaskTimeline({ tasks, eventDate, onToggle }: TaskTimelineProps) {
  const groups = useMemo(() => groupTasksByTimeline(tasks, eventDate), [tasks, eventDate]);
  const idPrefix = useId();
  return (
    <div className="space-y-6">
      {groups.map((bucket, index) => (
        <section key={bucket.group} aria-labelledby={`${idPrefix}-${String(index)}`}>
          <div className="mb-3 flex items-center gap-2">
            <CalendarDays className="size-4 text-rose-ink" aria-hidden="true" />
            <h2 id={`${idPrefix}-${String(index)}`} className="font-serif text-xl font-semibold">
              {bucket.group}
            </h2>
            <Badge>
              {bucket.tasks.length}
              <span className="sr-only"> tasks</span>
            </Badge>
          </div>
          {bucket.tasks.length === 0 ? (
            <p className="border-l-2 border-line py-2 pl-6 text-sm text-muted">No tasks in this window.</p>
          ) : (
            <ol className="relative space-y-3 border-l-2 border-blush pl-6">
              {bucket.tasks.map((task) => (
                <li key={task.id} className="relative rounded-2xl border border-line bg-surface p-4">
                  <span className="absolute -left-[2.05rem] top-5 grid size-6 place-items-center rounded-full bg-blush-soft text-rose-ink">
                    <CheckCircle2 className="size-4" aria-hidden="true" />
                  </span>
                  <div className="flex items-start gap-3">
                    <Checkbox
                      checked={task.done}
                      onCheckedChange={() => onToggle(task)}
                      aria-label={`Mark ${task.title} ${task.done ? 'open' : 'done'}`}
                    />
                    <div className="min-w-0 flex-1">
                      <h3 className={task.done ? 'font-medium text-muted line-through' : 'font-medium'}>
                        {task.title}
                      </h3>
                      <p className="mt-1 text-sm text-muted">
                        {formatTaskDeadline(task.dueDate)} · {TASK_CATEGORY_LABELS[task.category]}
                      </p>
                    </div>
                    <PriorityBadge priority={task.priority} />
                  </div>
                </li>
              ))}
            </ol>
          )}
        </section>
      ))}
    </div>
  );
}

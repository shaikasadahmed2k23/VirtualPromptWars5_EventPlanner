import { AlertTriangle, ListChecks } from 'lucide-react';
import { useId, useMemo } from 'react';
import { EmptyState } from '@/components/ui/states';
import type { ISODate, Task } from '@/types';
import { partitionOverdue } from '../lib/taskFilters';
import { TaskRow } from './TaskRow';

interface TaskListViewProps {
  tasks: readonly Task[];
  today: ISODate;
  onToggle: (task: Task) => void;
  onDelete: (task: Task) => void;
}

/** List view: overdue tasks called out first, then everything else in the chosen order. */
export function TaskListView({ tasks, today, onToggle, onDelete }: TaskListViewProps) {
  const { overdue, upcoming } = useMemo(() => partitionOverdue(tasks, today), [tasks, today]);
  const overdueHeadingId = useId();

  if (tasks.length === 0) {
    return (
      <EmptyState
        icon={ListChecks}
        title="No matching tasks"
        description="Try changing your filters or add a new task."
      />
    );
  }

  const renderRows = (list: readonly Task[]) =>
    list.map((task) => <TaskRow key={task.id} task={task} today={today} onToggle={onToggle} onDelete={onDelete} />);

  return (
    <div className="space-y-6">
      {overdue.length > 0 ? (
        <section
          aria-labelledby={overdueHeadingId}
          className="rounded-2xl border border-danger/25 bg-danger-soft/40 p-4"
        >
          <h2
            id={overdueHeadingId}
            className="mb-3 flex items-center gap-2 font-serif text-xl font-semibold text-danger"
          >
            <AlertTriangle className="size-5" aria-hidden="true" /> Overdue tasks
          </h2>
          <ul className="space-y-3">{renderRows(overdue)}</ul>
        </section>
      ) : null}
      {upcoming.length > 0 ? <ul className="space-y-3">{renderRows(upcoming)}</ul> : null}
    </div>
  );
}

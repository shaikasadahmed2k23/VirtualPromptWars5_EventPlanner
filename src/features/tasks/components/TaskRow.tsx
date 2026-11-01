import { Pencil } from 'lucide-react';
import { memo } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { ConfirmDeleteButton } from '@/components/ui/confirm-dialog';
import { TASK_CATEGORY_LABELS } from '@/lib/labels';
import type { ISODate, Task } from '@/types';
import { formatTaskDeadline } from '../lib/taskTimeline';
import { DueBadge, PriorityBadge } from './TaskBadges';
import { TaskFormDialog } from './TaskFormDialog';

interface TaskRowProps {
  task: Task;
  today: ISODate;
  onToggle: (task: Task) => void;
  onDelete: (task: Task) => void;
}

/** Checklist row with status, edit and delete actions. Memoised: long lists re-render only changed rows. */
export const TaskRow = memo(function TaskRow({ task, today, onToggle, onDelete }: TaskRowProps) {
  return (
    <li className="flex items-start gap-3 rounded-2xl border border-line bg-surface p-4">
      <Checkbox
        checked={task.done}
        onCheckedChange={() => {
          onToggle(task);
        }}
        aria-label={`Mark ${task.title} ${task.done ? 'open' : 'done'}`}
        className="mt-1"
      />
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className={task.done ? 'font-medium text-muted line-through' : 'font-medium'}>{task.title}</h3>
          {task.source === 'ai' ? <Badge tone="lavender">From AI plan</Badge> : null}
          <DueBadge task={task} today={today} />
        </div>
        <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-muted">
          <span>Due {formatTaskDeadline(task.dueDate)}</span>
          <span aria-hidden="true">·</span>
          <PriorityBadge priority={task.priority} />
          <Badge tone="neutral">{TASK_CATEGORY_LABELS[task.category]}</Badge>
        </div>
        {task.notes ? <p className="mt-2 text-sm text-muted">{task.notes}</p> : null}
      </div>
      <div className="flex shrink-0 gap-1">
        <TaskFormDialog
          eventId={task.eventId}
          task={task}
          trigger={
            <Button variant="ghost" size="icon-sm" aria-label={`Edit ${task.title}`}>
              <Pencil aria-hidden="true" />
            </Button>
          }
        />
        <ConfirmDeleteButton
          itemName={task.title}
          title="Delete task?"
          description={`Remove “${task.title}” from this checklist?`}
          confirmLabel="Delete task"
          onConfirm={() => {
            onDelete(task);
          }}
        />
      </div>
    </li>
  );
});

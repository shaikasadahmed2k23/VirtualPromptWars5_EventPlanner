import { Pencil, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { todayISO } from '@/lib/dates';
import { TASK_CATEGORY_LABELS } from '@/lib/labels';
import type { Task } from '@/types';
import { TaskFormDialog } from './TaskFormDialog';
import { formatTaskDeadline } from '../lib/taskTimeline';
import { DueBadge, PriorityBadge } from './TaskBadges';

interface TaskRowProps {
  task: Task;
  eventId: string;
  onToggle: () => void;
  onDelete: () => void;
}

/** Keyboard-accessible task row with status, edit and delete actions. */
export function TaskRow({ task, eventId, onToggle, onDelete }: TaskRowProps) {
  return (
    <li className="flex items-start gap-3 rounded-2xl border border-line bg-surface p-4">
      <Checkbox checked={task.done} onCheckedChange={onToggle} aria-label={`Mark ${task.title} ${task.done ? 'open' : 'done'}`} className="mt-1" />
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className={task.done ? 'font-medium text-muted line-through' : 'font-medium'}>{task.title}</h3>
          {task.source === 'ai' ? <Badge tone="lavender">From AI plan</Badge> : null}
          <DueBadge task={task} today={todayISO()} />
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
          eventId={eventId}
          task={task}
          trigger={<Button variant="ghost" size="icon-sm" aria-label={`Edit ${task.title}`}><Pencil aria-hidden="true" /></Button>}
        />
        <ConfirmDialog
          trigger={<Button variant="ghost" size="icon-sm" aria-label={`Delete ${task.title}`}><Trash2 aria-hidden="true" /></Button>}
          title="Delete task?"
          description={`Remove “${task.title}” from this checklist?`}
          confirmLabel="Delete task"
          destructive
          onConfirm={onDelete}
        />
      </div>
    </li>
  );
}

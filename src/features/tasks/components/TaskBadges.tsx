import { AlertTriangle, ArrowDown, ArrowUp, Clock, Minus } from 'lucide-react';
import { Badge, type BadgeTone } from '@/components/ui/badge';
import { DUE_SOON_DAYS } from '@/lib/constants';
import { daysBetween } from '@/lib/dates';
import { TASK_PRIORITY_LABELS } from '@/lib/labels';
import type { ISODate, Task, TaskPriority } from '@/types';
import { isTaskOverdue } from '../lib/taskStats';

const PRIORITY_STYLE: Record<TaskPriority, { tone: BadgeTone; icon: typeof ArrowUp }> = {
  high: { tone: 'danger', icon: ArrowUp },
  medium: { tone: 'gold', icon: Minus },
  low: { tone: 'neutral', icon: ArrowDown },
};

/** Priority label with an icon, so colour is never the only signal. */
export function PriorityBadge({ priority }: { priority: TaskPriority }) {
  const { tone, icon: Icon } = PRIORITY_STYLE[priority];
  return (
    <Badge tone={tone}>
      <Icon aria-hidden="true" />
      {TASK_PRIORITY_LABELS[priority]}
      <span className="sr-only"> priority</span>
    </Badge>
  );
}

/** "Overdue" or "Due soon" flag for an open task; renders nothing otherwise. */
export function DueBadge({ task, today }: { task: Pick<Task, 'done' | 'dueDate'>; today: ISODate }) {
  if (isTaskOverdue(task, today)) {
    return (
      <Badge tone="danger">
        <AlertTriangle aria-hidden="true" />
        Overdue
      </Badge>
    );
  }
  if (!task.done && daysBetween(today, task.dueDate) <= DUE_SOON_DAYS) {
    return (
      <Badge tone="warning">
        <Clock aria-hidden="true" />
        Due soon
      </Badge>
    );
  }
  return null;
}

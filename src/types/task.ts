import type { TaskCategory, TaskPriority } from '@shared/domain';
import type { Id, ISODate, ISODateTime } from './common';

export type { TaskCategory, TaskPriority };

/** Where a task came from — typed by the host or added from an AI plan. */
export type TaskSource = 'user' | 'ai';

/** A checklist item tied to an event. */
export interface Task {
  id: Id;
  eventId: Id;
  title: string;
  notes: string;
  dueDate: ISODate;
  priority: TaskPriority;
  category: TaskCategory;
  done: boolean;
  source: TaskSource;
  createdAt: ISODateTime;
}

/** Editable task fields. */
export type TaskInput = Pick<Task, 'title' | 'notes' | 'dueDate' | 'priority' | 'category'>;

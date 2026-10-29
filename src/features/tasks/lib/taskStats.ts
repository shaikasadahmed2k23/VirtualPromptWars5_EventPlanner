import { formatDisplayDate, monthKey } from '@/lib/dates';
import type { ISODate, Task } from '@/types';

/** Completion summary for a set of tasks. */
export interface TaskProgress {
  total: number;
  done: number;
  /** 0–1; `0` when there are no tasks. */
  ratio: number;
}

/** Tasks grouped into one calendar month. */
export interface MonthBucket {
  /** `YYYY-MM`. */
  key: string;
  /** Display label, e.g. "Nov 2026". */
  label: string;
  total: number;
  done: number;
}

/** A task is overdue when it is open and its due date is before `today`. */
export function isTaskOverdue(task: Pick<Task, 'done' | 'dueDate'>, today: ISODate): boolean {
  return !task.done && task.dueDate < today;
}

/** Counts done vs total tasks. */
export function computeTaskProgress(tasks: readonly Task[]): TaskProgress {
  const done = tasks.filter((task) => task.done).length;
  return { total: tasks.length, done, ratio: tasks.length > 0 ? done / tasks.length : 0 };
}

/** The next `limit` open tasks by due date; overdue tasks naturally sort first. */
export function selectUpcomingTasks(tasks: readonly Task[], limit: number): Task[] {
  return tasks
    .filter((task) => !task.done)
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate))
    .slice(0, limit);
}

/** Groups tasks by the calendar month they are due, in chronological order. */
export function groupTasksByMonth(tasks: readonly Task[]): MonthBucket[] {
  const buckets = new Map<string, MonthBucket>();
  for (const task of tasks) {
    const key = monthKey(task.dueDate);
    const bucket = buckets.get(key) ?? {
      key,
      label: formatDisplayDate(`${key}-01`, 'MMM yyyy'),
      total: 0,
      done: 0,
    };
    bucket.total += 1;
    if (task.done) bucket.done += 1;
    buckets.set(key, bucket);
  }
  return [...buckets.values()].sort((a, b) => a.key.localeCompare(b.key));
}

import { ALL, toFilterOptions, type All, type FilterOption } from '@/lib/filterOptions';
import { TASK_CATEGORY_LABELS, TASK_PRIORITY_LABELS } from '@/lib/labels';
import { TASK_CATEGORIES, TASK_PRIORITIES } from '@shared/domain';
import type { ISODate, Task, TaskCategory, TaskPriority } from '@/types';
import { isTaskOverdue } from './taskStats';

export type TaskStatusFilter = All | 'open' | 'done';
export type TaskSort = 'deadline' | 'priority';

export interface TaskFilters {
  search: string;
  status: TaskStatusFilter;
  priority: TaskPriority | All;
  category: TaskCategory | All;
  sort: TaskSort;
}

/** Filters shown when the checklist first opens. */
export const DEFAULT_TASK_FILTERS: TaskFilters = {
  search: '',
  status: ALL,
  priority: ALL,
  category: ALL,
  sort: 'deadline',
};

/** Options for each checklist filter control. */
export const TASK_FILTER_OPTIONS = {
  status: [
    { value: ALL, label: 'All statuses' },
    { value: 'open', label: 'Open' },
    { value: 'done', label: 'Done' },
  ] satisfies FilterOption<TaskStatusFilter>[],
  priority: toFilterOptions(TASK_PRIORITIES, TASK_PRIORITY_LABELS, 'All priorities'),
  category: toFilterOptions(TASK_CATEGORIES, TASK_CATEGORY_LABELS, 'All categories'),
  sort: [
    { value: 'deadline', label: 'Deadline' },
    { value: 'priority', label: 'Priority' },
  ] satisfies FilterOption<TaskSort>[],
};

const PRIORITY_ORDER: Record<TaskPriority, number> = { high: 0, medium: 1, low: 2 };

/** Filters and sorts tasks using the page's current controls, without mutating the input. */
export function filterAndSortTasks(tasks: readonly Task[], filters: TaskFilters): Task[] {
  const query = filters.search.trim().toLocaleLowerCase();
  return tasks
    .filter((task) => {
      const matchesSearch = query.length === 0 || `${task.title} ${task.notes}`.toLocaleLowerCase().includes(query);
      const matchesStatus = filters.status === ALL || (filters.status === 'done' ? task.done : !task.done);
      const matchesPriority = filters.priority === ALL || task.priority === filters.priority;
      const matchesCategory = filters.category === ALL || task.category === filters.category;
      return matchesSearch && matchesStatus && matchesPriority && matchesCategory;
    })
    .sort((a, b) => {
      if (filters.sort === 'priority') {
        return PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority] || a.dueDate.localeCompare(b.dueDate);
      }
      return a.dueDate.localeCompare(b.dueDate) || PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority];
    });
}

/** Splits tasks into overdue and the rest, preserving their order. */
export function partitionOverdue(tasks: readonly Task[], today: ISODate): { overdue: Task[]; upcoming: Task[] } {
  const overdue: Task[] = [];
  const upcoming: Task[] = [];
  for (const task of tasks) {
    if (isTaskOverdue(task, today)) overdue.push(task);
    else upcoming.push(task);
  }
  return { overdue, upcoming };
}

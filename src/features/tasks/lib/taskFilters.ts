import type { Task, TaskCategory, TaskPriority } from '@/types';

export type TaskStatusFilter = 'all' | 'open' | 'done';
export type TaskSort = 'deadline' | 'priority';

export interface TaskFilters {
  search: string;
  status: TaskStatusFilter;
  priority: TaskPriority | 'all';
  category: TaskCategory | 'all';
  sort: TaskSort;
}

const PRIORITY_ORDER: Record<TaskPriority, number> = { high: 0, medium: 1, low: 2 };

/** Filters and sorts tasks using the page's current controls. */
export function filterAndSortTasks(tasks: readonly Task[], filters: TaskFilters): Task[] {
  const query = filters.search.trim().toLocaleLowerCase();
  return tasks
    .filter((task) => {
      const matchesSearch =
        query.length === 0 || `${task.title} ${task.notes}`.toLocaleLowerCase().includes(query);
      const matchesStatus =
        filters.status === 'all' || (filters.status === 'done' ? task.done : !task.done);
      const matchesPriority = filters.priority === 'all' || task.priority === filters.priority;
      const matchesCategory = filters.category === 'all' || task.category === filters.category;
      return matchesSearch && matchesStatus && matchesPriority && matchesCategory;
    })
    .sort((a, b) => {
      if (filters.sort === 'priority') {
        return PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority] || a.dueDate.localeCompare(b.dueDate);
      }
      return a.dueDate.localeCompare(b.dueDate) || PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority];
    });
}

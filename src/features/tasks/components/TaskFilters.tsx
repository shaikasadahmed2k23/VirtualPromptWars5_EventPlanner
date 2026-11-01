import { FilterPanel, FilterSelect, SearchField } from '@/components/ui/filter-controls';
import type { ListFilters } from '@/lib/hooks/useListFilters';
import type { Task } from '@/types';
import { TASK_FILTER_OPTIONS, type TaskFilters as TaskFilterValues } from '../lib/taskFilters';

type TaskFiltersProps = Pick<ListFilters<Task, TaskFilterValues>, 'bind'>;

/** Search, filter and sort controls for the task list. */
export function TaskFilters({ bind }: TaskFiltersProps) {
  return (
    <FilterPanel label="Filter tasks">
      <SearchField label="Search tasks" placeholder="Search tasks…" {...bind('search')} />
      <FilterSelect label="Status" options={TASK_FILTER_OPTIONS.status} {...bind('status')} />
      <FilterSelect label="Priority" options={TASK_FILTER_OPTIONS.priority} {...bind('priority')} />
      <FilterSelect label="Category" options={TASK_FILTER_OPTIONS.category} {...bind('category')} />
      <FilterSelect label="Sort by" options={TASK_FILTER_OPTIONS.sort} {...bind('sort')} />
    </FilterPanel>
  );
}

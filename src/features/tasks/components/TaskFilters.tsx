import { FilterPanel, FilterSelect, SearchField } from '@/components/ui/filter-controls';
import type { ListFilters } from '@/lib/hooks/useListFilters';
import type { Task } from '@/types';
import { TASK_FILTER_OPTIONS, type TaskFilters as TaskFilterValues } from '../lib/taskFilters';

type TaskFiltersProps = Pick<ListFilters<Task, TaskFilterValues>, 'filters' | 'setFilter'>;

/** Search, filter and sort controls for the task list. */
export function TaskFilters({ filters, setFilter }: TaskFiltersProps) {
  return (
    <FilterPanel label="Filter tasks">
      <SearchField
        label="Search tasks"
        placeholder="Search tasks…"
        value={filters.search}
        onChange={(value) => {
          setFilter('search', value);
        }}
      />
      <FilterSelect
        label="Status"
        value={filters.status}
        options={TASK_FILTER_OPTIONS.status}
        onChange={(value) => {
          setFilter('status', value);
        }}
      />
      <FilterSelect
        label="Priority"
        value={filters.priority}
        options={TASK_FILTER_OPTIONS.priority}
        onChange={(value) => {
          setFilter('priority', value);
        }}
      />
      <FilterSelect
        label="Category"
        value={filters.category}
        options={TASK_FILTER_OPTIONS.category}
        onChange={(value) => {
          setFilter('category', value);
        }}
      />
      <FilterSelect
        label="Sort by"
        value={filters.sort}
        options={TASK_FILTER_OPTIONS.sort}
        onChange={(value) => {
          setFilter('sort', value);
        }}
      />
    </FilterPanel>
  );
}

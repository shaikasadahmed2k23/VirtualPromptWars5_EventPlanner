import { Search } from 'lucide-react';
import { TASK_CATEGORIES, TASK_PRIORITIES } from '@shared/domain';
import { Field } from '@/components/ui/field';
import { Input, Select } from '@/components/ui/input';
import { TASK_CATEGORY_LABELS, TASK_PRIORITY_LABELS } from '@/lib/labels';
import type { TaskCategory, TaskPriority } from '@/types';
import type { TaskSort, TaskStatusFilter } from '../lib/taskFilters';

interface TaskFiltersProps {
  searchInput: string;
  setSearchInput: (value: string) => void;
  status: TaskStatusFilter;
  setStatus: (value: TaskStatusFilter) => void;
  priority: TaskPriority | 'all';
  setPriority: (value: TaskPriority | 'all') => void;
  category: TaskCategory | 'all';
  setCategory: (value: TaskCategory | 'all') => void;
  sort: TaskSort;
  setSort: (value: TaskSort) => void;
}

/** Search, filter and sort controls for the task list. */
export function TaskFilters(props: TaskFiltersProps) {
  return (
    <div className="grid gap-3 rounded-2xl border border-line bg-surface p-4 sm:grid-cols-2 lg:grid-cols-5">
      <Field label="Search tasks" hideLabel>
        {(field) => (
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-3 size-4 text-muted" aria-hidden="true" />
            <Input {...field} className="pl-9" placeholder="Search tasks…" value={props.searchInput} onChange={(event) => props.setSearchInput(event.target.value)} />
          </div>
        )}
      </Field>
      <Field label="Status" hideLabel>
        {(field) => (
          <Select {...field} aria-label="Status filter" value={props.status} onChange={(event) => props.setStatus(event.target.value as TaskStatusFilter)}>
            <option value="all">All statuses</option><option value="open">Open</option><option value="done">Done</option>
          </Select>
        )}
      </Field>
      <Field label="Priority" hideLabel>
        {(field) => (
          <Select {...field} aria-label="Priority filter" value={props.priority} onChange={(event) => props.setPriority(event.target.value as TaskPriority | 'all')}>
            <option value="all">All priorities</option>
            {TASK_PRIORITIES.map((priority) => <option key={priority} value={priority}>{TASK_PRIORITY_LABELS[priority]}</option>)}
          </Select>
        )}
      </Field>
      <Field label="Category" hideLabel>
        {(field) => (
          <Select {...field} aria-label="Category filter" value={props.category} onChange={(event) => props.setCategory(event.target.value as TaskCategory | 'all')}>
            <option value="all">All categories</option>
            {TASK_CATEGORIES.map((category) => <option key={category} value={category}>{TASK_CATEGORY_LABELS[category]}</option>)}
          </Select>
        )}
      </Field>
      <Field label="Sort by" hideLabel>
        {(field) => (
          <Select {...field} aria-label="Sort tasks" value={props.sort} onChange={(event) => props.setSort(event.target.value as TaskSort)}>
            <option value="deadline">Deadline</option><option value="priority">Priority</option>
          </Select>
        )}
      </Field>
    </div>
  );
}

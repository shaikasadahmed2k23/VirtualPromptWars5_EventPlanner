import { useEffect, useMemo, useState } from 'react';
import { SEARCH_DEBOUNCE_MS } from '@/lib/constants';
import type { Task, TaskCategory, TaskPriority } from '@/types';
import { filterAndSortTasks, type TaskSort, type TaskStatusFilter } from '../lib/taskFilters';

/** State and derived tasks for the checklist filters, including debounced search. */
export function useTaskFilters(tasks: readonly Task[]) {
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<TaskStatusFilter>('all');
  const [priority, setPriority] = useState<TaskPriority | 'all'>('all');
  const [category, setCategory] = useState<TaskCategory | 'all'>('all');
  const [sort, setSort] = useState<TaskSort>('deadline');

  useEffect(() => {
    const timer = window.setTimeout(() => setSearch(searchInput), SEARCH_DEBOUNCE_MS);
    return () => window.clearTimeout(timer);
  }, [searchInput]);

  const filteredTasks = useMemo(
    () => filterAndSortTasks(tasks, { search, status, priority, category, sort }),
    [tasks, search, status, priority, category, sort],
  );

  return {
    filteredTasks,
    searchInput,
    setSearchInput,
    status,
    setStatus,
    priority,
    setPriority,
    category,
    setCategory,
    sort,
    setSort,
  };
}

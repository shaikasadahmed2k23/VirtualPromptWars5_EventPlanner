import { useMemo } from 'react';
import { filterByEventId } from '@/lib/collection';
import type { Id, Task } from '@/types';
import { useTaskStore } from '../store/useTaskStore';

/** Tasks belonging to `eventId`. Memoised so consumers only re-render when tasks change. */
export function useEventTasks(eventId: Id): Task[] {
  const tasks = useTaskStore((state) => state.tasks);
  return useMemo(() => filterByEventId(tasks, eventId), [tasks, eventId]);
}

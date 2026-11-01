import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { todayISO } from '@/lib/dates';
import { useListFilters } from '@/lib/hooks/useListFilters';
import type { ISODate, Task } from '@/types';
import { useTaskActions } from '../hooks/useTaskActions';
import { DEFAULT_TASK_FILTERS, filterAndSortTasks } from '../lib/taskFilters';
import { TaskFilters } from './TaskFilters';
import { TaskListView } from './TaskListView';
import { TaskTimeline } from './TaskTimeline';

type TaskView = 'list' | 'timeline';

interface TaskWorkspaceProps {
  tasks: readonly Task[];
  eventDate: ISODate;
}

/** Filters plus the list and timeline views of the same filtered tasks, with stable row callbacks. */
export function TaskWorkspace({ tasks, eventDate }: TaskWorkspaceProps) {
  const { toggle, remove } = useTaskActions();
  const [view, setView] = useState<TaskView>('list');
  const { bind, results } = useListFilters(tasks, DEFAULT_TASK_FILTERS, filterAndSortTasks);
  const today = todayISO();

  return (
    <>
      <TaskFilters bind={bind} />
      <Tabs
        value={view}
        onValueChange={(value) => {
          setView(value === 'timeline' ? 'timeline' : 'list');
        }}
      >
        <TabsList aria-label="Task views">
          <TabsTrigger value="list">List view</TabsTrigger>
          <TabsTrigger value="timeline">Timeline view</TabsTrigger>
        </TabsList>
        <TabsContent value="list">
          <TaskListView tasks={results} today={today} onToggle={toggle} onDelete={remove} />
        </TabsContent>
        <TabsContent value="timeline">
          <TaskTimeline tasks={results} eventDate={eventDate} onToggle={toggle} />
        </TabsContent>
      </Tabs>
    </>
  );
}

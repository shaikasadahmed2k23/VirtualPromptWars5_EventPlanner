import { ListChecks, Plus, Sparkles } from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/ui/headings';
import { EmptyState } from '@/components/ui/states';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useCurrentEvent } from '@/features/events/hooks/useCurrentEvent';
import { generateStarterTasks } from '@/features/events/lib/starterPlan';
import { TaskFilters } from '@/features/tasks/components/TaskFilters';
import { TaskFormDialog } from '@/features/tasks/components/TaskFormDialog';
import { TaskListView } from '@/features/tasks/components/TaskListView';
import { TaskProgress } from '@/features/tasks/components/TaskProgress';
import { TaskTimeline } from '@/features/tasks/components/TaskTimeline';
import { useEventTasks } from '@/features/tasks/hooks/useEventTasks';
import { DEFAULT_TASK_FILTERS, filterAndSortTasks } from '@/features/tasks/lib/taskFilters';
import { computeTaskProgress } from '@/features/tasks/lib/taskStats';
import { useTaskStore } from '@/features/tasks/store/useTaskStore';
import { todayISO } from '@/lib/dates';
import { useDocumentTitle } from '@/lib/hooks/useDocumentTitle';
import { useListFilters } from '@/lib/hooks/useListFilters';
import { notifyWithUndo } from '@/lib/undoToast';
import type { Task } from '@/types';

type TaskView = 'list' | 'timeline';

/** Checklist and timeline for the current event. */
export default function TasksPage() {
  const event = useCurrentEvent();
  const tasks = useEventTasks(event.id);
  const addTasks = useTaskStore((state) => state.addTasks);
  const deleteTask = useTaskStore((state) => state.deleteTask);
  const toggleTask = useTaskStore((state) => state.toggleTask);
  const [view, setView] = useState<TaskView>('list');
  const { filters, setFilter, results } = useListFilters(tasks, DEFAULT_TASK_FILTERS, filterAndSortTasks);
  const progress = useMemo(() => computeTaskProgress(tasks), [tasks]);
  const today = todayISO();
  useDocumentTitle(`Tasks · ${event.name}`);

  const onToggle = useCallback(
    (task: Task) => {
      toggleTask(task.id);
    },
    [toggleTask],
  );

  const onDelete = useCallback(
    (task: Task) => {
      notifyWithUndo(`Removed “${task.title}”`, deleteTask(task.id));
    },
    [deleteTask],
  );

  const generateChecklist = () => {
    const created = addTasks(event.id, generateStarterTasks(event, today));
    toast.success(`${String(created.length)} starter tasks added`);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow={event.name}
        title="Checklist & timeline"
        description="Every task from now until the big day, grouped by months before the event."
        actions={
          <TaskFormDialog
            eventId={event.id}
            trigger={
              <Button>
                <Plus aria-hidden="true" />
                Add task
              </Button>
            }
          />
        }
      />
      <TaskProgress progress={progress} />
      {tasks.length === 0 ? (
        <EmptyState
          icon={ListChecks}
          title="Your checklist is empty"
          description="Start with a practical checklist tailored to this celebration."
          action={
            <Button onClick={generateChecklist}>
              <Sparkles aria-hidden="true" />
              Generate starter checklist
            </Button>
          }
        />
      ) : (
        <>
          <TaskFilters filters={filters} setFilter={setFilter} />
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
              <TaskListView tasks={results} today={today} onToggle={onToggle} onDelete={onDelete} />
            </TabsContent>
            <TabsContent value="timeline">
              <TaskTimeline tasks={results} eventDate={event.date} onToggle={onToggle} />
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
}

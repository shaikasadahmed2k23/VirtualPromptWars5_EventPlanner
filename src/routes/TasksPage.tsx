import { AlertTriangle, ListChecks, Sparkles } from 'lucide-react';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/states';
import { PageHeader } from '@/components/ui/headings';
import { useCurrentEvent } from '@/features/events/hooks/useCurrentEvent';
import { generateStarterTasks } from '@/features/events/lib/starterPlan';
import { useEventTasks } from '@/features/tasks/hooks/useEventTasks';
import { useTaskFilters } from '@/features/tasks/hooks/useTaskFilters';
import { TaskFilters } from '@/features/tasks/components/TaskFilters';
import { TaskFormDialog } from '@/features/tasks/components/TaskFormDialog';
import { TaskProgress } from '@/features/tasks/components/TaskProgress';
import { TaskRow } from '@/features/tasks/components/TaskRow';
import { TaskTimeline } from '@/features/tasks/components/TaskTimeline';
import { computeTaskProgress, isTaskOverdue } from '@/features/tasks/lib/taskStats';
import { todayISO } from '@/lib/dates';
import { useDocumentTitle } from '@/lib/hooks/useDocumentTitle';
import { useTaskStore } from '@/features/tasks/store/useTaskStore';

/** Checklist and timeline for the current event. */
export default function TasksPage() {
  const event = useCurrentEvent();
  const tasks = useEventTasks(event.id);
  const addTasks = useTaskStore((state) => state.addTasks);
  const deleteTask = useTaskStore((state) => state.deleteTask);
  const addTask = useTaskStore((state) => state.addTask);
  const toggleTask = useTaskStore((state) => state.toggleTask);
  const [view, setView] = useState('list');
  const filters = useTaskFilters(tasks);
  const progress = useMemo(() => computeTaskProgress(tasks), [tasks]);
  const currentDate = todayISO();
  const overdue = filters.filteredTasks.filter((task) => isTaskOverdue(task, currentDate));
  const upcoming = filters.filteredTasks.filter((task) => !isTaskOverdue(task, currentDate));
  useDocumentTitle(`Tasks · ${event.name}`);

  const removeTask = (taskId: string, title: string) => {
    const task = tasks.find((item) => item.id === taskId);
    if (!task) return;
    deleteTask(taskId);
    const { id: _id, eventId: _eventId, done: _done, source: _source, createdAt: _createdAt, ...input } = task;
    toast.success(`Removed “${title}”`, {
      action: { label: 'Undo', onClick: () => addTask(event.id, input, task.source) },
    });
  };

  const generateChecklist = () => {
    const created = addTasks(event.id, generateStarterTasks(event, currentDate));
    toast.success(`${created.length} starter tasks added`);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow={event.name}
        title="Checklist & timeline"
        description="Every task from now until the big day, grouped by months before the event."
        actions={<TaskFormDialog eventId={event.id} trigger={<Button>Add task</Button>} />}
      />
      <TaskProgress progress={progress} />
      {tasks.length === 0 ? (
        <EmptyState
          icon={ListChecks}
          title="Your checklist is empty"
          description="Start with a practical checklist tailored to this celebration."
          action={<Button onClick={generateChecklist}><Sparkles aria-hidden="true" />Generate starter checklist</Button>}
        />
      ) : (
        <>
          <TaskFilters {...filters} />
          <Tabs value={view} onValueChange={setView}>
            <TabsList aria-label="Task views">
              <TabsTrigger value="list">List view</TabsTrigger>
              <TabsTrigger value="timeline">Timeline view</TabsTrigger>
            </TabsList>
            <TabsContent value="list">
              {overdue.length > 0 ? (
                <section aria-labelledby="overdue-heading" className="mb-6 rounded-2xl border border-danger/25 bg-danger-soft/40 p-4">
                  <h2 id="overdue-heading" className="mb-3 flex items-center gap-2 font-serif text-xl font-semibold text-danger">
                    <AlertTriangle className="size-5" aria-hidden="true" /> Overdue tasks
                  </h2>
                  <ul className="space-y-3">
                    {overdue.map((task) => <TaskRow key={task.id} task={task} eventId={event.id} onToggle={() => toggleTask(task.id)} onDelete={() => removeTask(task.id, task.title)} />)}
                  </ul>
                </section>
              ) : null}
              {upcoming.length > 0 ? (
                <ul className="space-y-3">
                  {upcoming.map((task) => <TaskRow key={task.id} task={task} eventId={event.id} onToggle={() => toggleTask(task.id)} onDelete={() => removeTask(task.id, task.title)} />)}
                </ul>
              ) : overdue.length === 0 ? (
                <EmptyState icon={ListChecks} title="No matching tasks" description="Try changing your filters or add a new task." />
              ) : null}
            </TabsContent>
            <TabsContent value="timeline">
              <TaskTimeline tasks={filters.filteredTasks} eventDate={event.date} onToggle={(task) => toggleTask(task.id)} />
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
}

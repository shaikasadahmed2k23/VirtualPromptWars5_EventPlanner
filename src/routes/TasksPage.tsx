import { ListChecks, Plus, Sparkles } from 'lucide-react';
import { useMemo } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/ui/headings';
import { EmptyState } from '@/components/ui/states';
import { useCurrentEvent } from '@/features/events/hooks/useCurrentEvent';
import { generateStarterTasks } from '@/features/events/lib/starterPlan';
import { TaskFormDialog } from '@/features/tasks/components/TaskFormDialog';
import { TaskProgress } from '@/features/tasks/components/TaskProgress';
import { TaskWorkspace } from '@/features/tasks/components/TaskWorkspace';
import { useEventTasks } from '@/features/tasks/hooks/useEventTasks';
import { computeTaskProgress } from '@/features/tasks/lib/taskStats';
import { useTaskStore } from '@/features/tasks/store/useTaskStore';
import { todayISO } from '@/lib/dates';
import { useDocumentTitle } from '@/lib/hooks/useDocumentTitle';

/** Checklist and timeline for the current event. */
export default function TasksPage() {
  const event = useCurrentEvent();
  const tasks = useEventTasks(event.id);
  const addTasks = useTaskStore((state) => state.addTasks);
  const progress = useMemo(() => computeTaskProgress(tasks), [tasks]);
  useDocumentTitle(`Tasks · ${event.name}`);

  const generateChecklist = () => {
    const created = addTasks(event.id, generateStarterTasks(event, todayISO()));
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
        <TaskWorkspace tasks={tasks} eventDate={event.date} />
      )}
    </div>
  );
}

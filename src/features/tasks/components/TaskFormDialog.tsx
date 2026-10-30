import { useState, type ReactElement } from 'react';
import { TASK_CATEGORIES, TASK_PRIORITIES } from '@shared/domain';
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Field } from '@/components/ui/field';
import { Input, Select, Textarea } from '@/components/ui/input';
import { TASK_CATEGORY_LABELS, TASK_PRIORITY_LABELS } from '@/lib/labels';
import type { Task, TaskInput } from '@/types';
import { taskInputSchema } from '../lib/taskValidation';
import { useTaskStore } from '../store/useTaskStore';

const EMPTY_TASK: TaskInput = {
  title: '',
  notes: '',
  dueDate: '',
  priority: 'medium',
  category: 'other',
};

interface TaskFormDialogProps {
  eventId: string;
  task?: Task;
  trigger: ReactElement;
}

/** Accessible dialog for creating or editing a validated checklist task. */
export function TaskFormDialog({ eventId, task, trigger }: TaskFormDialogProps) {
  const addTask = useTaskStore((state) => state.addTask);
  const updateTask = useTaskStore((state) => state.updateTask);
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<TaskInput>(task ?? EMPTY_TASK);
  const [error, setError] = useState<string>();
  const update = <K extends keyof TaskInput>(key: K, value: TaskInput[K]) =>
    setDraft((current) => ({ ...current, [key]: value }));

  const submit = () => {
    const result = taskInputSchema.safeParse(draft);
    if (!result.success) {
      setError(result.error.issues[0]?.message ?? 'Check the task details.');
      return;
    }
    if (task) updateTask(task.id, result.data);
    else addTask(eventId, result.data);
    setError(undefined);
    setOpen(false);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen);
        if (nextOpen) setDraft(task ?? EMPTY_TASK);
      }}
    >
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent title={task ? 'Edit task' : 'Add task'} description="Keep one clear next step on your checklist.">
        <div className="grid gap-4">
          <Field label="Title" required error={error}>
            {(props) => <Input {...props} value={draft.title} onChange={(event) => update('title', event.target.value)} />}
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Deadline" required>
              {(props) => <Input {...props} type="date" value={draft.dueDate} onChange={(event) => update('dueDate', event.target.value)} />}
            </Field>
            <Field label="Priority" required>
              {(props) => (
                <Select {...props} value={draft.priority} onChange={(event) => update('priority', event.target.value as TaskInput['priority'])}>
                  {TASK_PRIORITIES.map((priority) => (
                    <option key={priority} value={priority}>
                      {TASK_PRIORITY_LABELS[priority]}
                    </option>
                  ))}
                </Select>
              )}
            </Field>
          </div>
          <Field label="Category" required>
            {(props) => (
              <Select {...props} value={draft.category} onChange={(event) => update('category', event.target.value as TaskInput['category'])}>
                {TASK_CATEGORIES.map((category) => (
                  <option key={category} value={category}>
                    {TASK_CATEGORY_LABELS[category]}
                  </option>
                ))}
              </Select>
            )}
          </Field>
          <Field label="Notes">
            {(props) => <Textarea {...props} value={draft.notes} onChange={(event) => update('notes', event.target.value)} />}
          </Field>
          <div className="flex justify-end gap-3">
            <DialogClose asChild><Button variant="secondary">Cancel</Button></DialogClose>
            <Button onClick={submit}>{task ? 'Save task' : 'Add task'}</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

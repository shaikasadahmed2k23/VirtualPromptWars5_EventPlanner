import type { ReactElement } from 'react';
import { TASK_CATEGORIES, TASK_PRIORITIES } from '@shared/domain';
import { Field } from '@/components/ui/field';
import { FormDialog } from '@/components/ui/form-dialog';
import { Input, Select, Textarea } from '@/components/ui/input';
import { useDialogForm } from '@/lib/hooks/useDialogForm';
import { TASK_CATEGORY_LABELS, TASK_PRIORITY_LABELS } from '@/lib/labels';
import type { Id, Task, TaskInput } from '@/types';
import { taskInputSchema } from '../lib/taskValidation';
import { useTaskStore } from '../store/useTaskStore';

const EMPTY_TASK: TaskInput = { title: '', notes: '', dueDate: '', priority: 'medium', category: 'other' };

function toTaskInput({ title, notes, dueDate, priority, category }: Task): TaskInput {
  return { title, notes, dueDate, priority, category };
}

interface TaskFormDialogProps {
  eventId: Id;
  /** Task to edit; omit to create a new one. */
  task?: Task;
  trigger: ReactElement;
}

/** Dialog for creating or editing a validated checklist task. */
export function TaskFormDialog({ eventId, task, trigger }: TaskFormDialogProps) {
  const addTask = useTaskStore((state) => state.addTask);
  const updateTask = useTaskStore((state) => state.updateTask);
  const { form, open, onOpenChange, submitWith } = useDialogForm(taskInputSchema, () =>
    task ? toTaskInput(task) : EMPTY_TASK,
  );
  const {
    register,
    formState: { errors },
  } = form;

  return (
    <FormDialog
      trigger={trigger}
      title={task ? 'Edit task' : 'Add task'}
      description="Keep one clear next step on your checklist."
      submitLabel={task ? 'Save task' : 'Add task'}
      open={open}
      onOpenChange={onOpenChange}
      onSubmit={submitWith((values) => {
        if (task) updateTask(task.id, values);
        else addTask(eventId, values);
      })}
    >
      <Field label="Title" required error={errors.title?.message}>
        {(props) => <Input {...props} {...register('title')} />}
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Deadline" required error={errors.dueDate?.message}>
          {(props) => <Input {...props} type="date" {...register('dueDate')} />}
        </Field>
        <Field label="Priority" required>
          {(props) => (
            <Select {...props} {...register('priority')}>
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
          <Select {...props} {...register('category')}>
            {TASK_CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {TASK_CATEGORY_LABELS[category]}
              </option>
            ))}
          </Select>
        )}
      </Field>
      <Field label="Notes" error={errors.notes?.message}>
        {(props) => <Textarea {...props} {...register('notes')} />}
      </Field>
    </FormDialog>
  );
}

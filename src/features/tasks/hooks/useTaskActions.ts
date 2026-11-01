import { useCallback } from 'react';
import { useDeleteWithUndo } from '@/lib/hooks/useDeleteWithUndo';
import { notifyWithUndo } from '@/lib/undoToast';
import type { Task } from '@/types';
import { useTaskStore } from '../store/useTaskStore';

/** Stable task-row actions, so memoised rows re-render only when their own task changes. */
export interface TaskActions {
  /** Flips done/open silently (checklist and timeline checkboxes). */
  toggle: (task: Task) => void;
  /** Deletes with an Undo toast that restores the task in place. */
  remove: (task: Task) => void;
  /** Marks done with an Undo toast (dashboard quick-complete). */
  completeWithUndo: (task: Task) => void;
}

export function useTaskActions(): TaskActions {
  const toggleTask = useTaskStore((state) => state.toggleTask);
  const deleteTask = useTaskStore((state) => state.deleteTask);
  const remove = useDeleteWithUndo<Task>(deleteTask, 'title');

  const toggle = useCallback(
    (task: Task) => {
      toggleTask(task.id);
    },
    [toggleTask],
  );

  const completeWithUndo = useCallback(
    (task: Task) => {
      toggleTask(task.id);
      notifyWithUndo(`Marked “${task.title}” done`, () => {
        toggleTask(task.id);
      });
    },
    [toggleTask],
  );

  return { toggle, remove, completeWithUndo };
}

import { useCallback } from 'react';
import { useBudgetStore } from '@/features/budget/store/useBudgetStore';
import { useTaskStore } from '@/features/tasks/store/useTaskStore';
import { nowISO } from '@/lib/dates';
import { notifyWithUndo } from '@/lib/undoToast';
import type { BudgetItemInput, CelebrationEvent, TaskInput } from '@/types';
import { useAssistantStore } from '../store/useAssistantStore';

/**
 * One-click actions from the AI plan: add to checklist, add to budget and
 * save the plan. Every action confirms with a toast that offers Undo.
 */
export function usePlanActions(event: CelebrationEvent) {
  const addTask = useTaskStore((state) => state.addTask);
  const deleteTask = useTaskStore((state) => state.deleteTask);
  const addItem = useBudgetStore((state) => state.addItem);
  const deleteItem = useBudgetStore((state) => state.deleteItem);
  const setSavedAt = useAssistantStore((state) => state.setSavedAt);

  const addToChecklist = useCallback(
    (input: TaskInput) => {
      const task = addTask(event.id, input, 'ai');
      notifyWithUndo(`Added “${input.title}” to your checklist`, () => {
        deleteTask(task.id);
      });
    },
    [addTask, deleteTask, event.id],
  );

  const addToBudget = useCallback(
    (input: BudgetItemInput) => {
      const item = addItem(event.id, { ...input, source: 'ai' });
      notifyWithUndo(`Added “${input.name}” to your budget`, () => {
        deleteItem(item.id);
      });
    },
    [addItem, deleteItem, event.id],
  );

  const savePlan = useCallback(() => {
    const previous = useAssistantStore.getState().plans[event.id]?.savedAt ?? null;
    setSavedAt(event.id, nowISO());
    notifyWithUndo(
      'Plan saved to your event',
      () => {
        setSavedAt(event.id, previous);
      },
      'Your dashboard now shows it as your chosen plan.',
    );
  }, [event.id, setSavedAt]);

  return { addToChecklist, addToBudget, savePlan };
}

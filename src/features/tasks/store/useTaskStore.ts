import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { createSeedTasks } from '@/data/seed';
import { removeByEventId, removeById, updateById } from '@/lib/collection';
import { STORAGE_KEYS, STORE_VERSION } from '@/lib/constants';
import { nowISO } from '@/lib/dates';
import { createId } from '@/lib/id';
import { createMigrate, createSafeStorage } from '@/lib/storage';
import type { Id, Task, TaskInput, TaskSource } from '@/types';

interface TaskState {
  tasks: Task[];
}

interface TaskActions {
  addTask: (eventId: Id, input: TaskInput, source?: TaskSource) => Task;
  /** Adds several tasks at once (e.g. from an AI plan). */
  addTasks: (eventId: Id, inputs: readonly TaskInput[], source?: TaskSource) => Task[];
  updateTask: (id: Id, patch: Partial<TaskInput>) => void;
  toggleTask: (id: Id) => void;
  deleteTask: (id: Id) => void;
  removeByEvent: (eventId: Id) => void;
  reset: () => void;
}

export type TaskStore = TaskState & TaskActions;

function buildTask(eventId: Id, input: TaskInput, source: TaskSource): Task {
  return { ...input, id: createId('task'), eventId, done: false, source, createdAt: nowISO() };
}

function createInitialState(): TaskState {
  return { tasks: createSeedTasks() };
}

/** Checklist tasks across all events. */
export const useTaskStore = create<TaskStore>()(
  persist(
    (set) => ({
      ...createInitialState(),

      addTask: (eventId, input, source = 'user') => {
        const task = buildTask(eventId, input, source);
        set((state) => ({ tasks: [...state.tasks, task] }));
        return task;
      },

      addTasks: (eventId, inputs, source = 'user') => {
        const created = inputs.map((input) => buildTask(eventId, input, source));
        set((state) => ({ tasks: [...state.tasks, ...created] }));
        return created;
      },

      updateTask: (id, patch) => {
        set((state) => ({ tasks: updateById(state.tasks, id, patch) }));
      },

      toggleTask: (id) => {
        set((state) => ({
          tasks: state.tasks.map((task) => (task.id === id ? { ...task, done: !task.done } : task)),
        }));
      },

      deleteTask: (id) => {
        set((state) => ({ tasks: removeById(state.tasks, id) }));
      },

      removeByEvent: (eventId) => {
        set((state) => ({ tasks: removeByEventId(state.tasks, eventId) }));
      },

      reset: () => {
        set(createInitialState());
      },
    }),
    {
      name: STORAGE_KEYS.tasks,
      version: STORE_VERSION,
      storage: createSafeStorage<TaskState>(),
      partialize: ({ tasks }) => ({ tasks }),
      migrate: createMigrate<TaskState>(createInitialState),
    },
  ),
);

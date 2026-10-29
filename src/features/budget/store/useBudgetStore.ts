import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { createSeedBudget } from '@/data/seed';
import { removeByEventId, removeById, updateById } from '@/lib/collection';
import { STORAGE_KEYS, STORE_VERSION } from '@/lib/constants';
import { createId } from '@/lib/id';
import { createMigrate, createSafeStorage } from '@/lib/storage';
import type { BudgetItem, BudgetItemInput, Id } from '@/types';

interface BudgetState {
  items: BudgetItem[];
}

interface BudgetActions {
  addItem: (eventId: Id, input: BudgetItemInput) => BudgetItem;
  /** Adds several lines at once (starter budget, AI allocations). */
  addItems: (eventId: Id, inputs: readonly BudgetItemInput[]) => BudgetItem[];
  updateItem: (id: Id, patch: Partial<BudgetItemInput>) => void;
  deleteItem: (id: Id) => void;
  removeByEvent: (eventId: Id) => void;
  reset: () => void;
}

export type BudgetStore = BudgetState & BudgetActions;

function createInitialState(): BudgetState {
  return { items: createSeedBudget() };
}

/** Budget line items across all events. */
export const useBudgetStore = create<BudgetStore>()(
  persist(
    (set) => ({
      ...createInitialState(),

      addItem: (eventId, input) => {
        const item: BudgetItem = { ...input, id: createId('budget'), eventId };
        set((state) => ({ items: [...state.items, item] }));
        return item;
      },

      addItems: (eventId, inputs) => {
        const created = inputs.map((input): BudgetItem => ({ ...input, id: createId('budget'), eventId }));
        set((state) => ({ items: [...state.items, ...created] }));
        return created;
      },

      updateItem: (id, patch) => {
        set((state) => ({ items: updateById(state.items, id, patch) }));
      },

      deleteItem: (id) => {
        set((state) => ({ items: removeById(state.items, id) }));
      },

      removeByEvent: (eventId) => {
        set((state) => ({ items: removeByEventId(state.items, eventId) }));
      },

      reset: () => {
        set(createInitialState());
      },
    }),
    {
      name: STORAGE_KEYS.budget,
      version: STORE_VERSION,
      storage: createSafeStorage<BudgetState>(),
      partialize: ({ items }) => ({ items }),
      migrate: createMigrate<BudgetState>(createInitialState),
    },
  ),
);

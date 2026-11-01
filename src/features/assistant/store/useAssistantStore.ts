import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { createSeedPlan } from '@/data/seed';
import { PLAN_HISTORY_LIMIT, STORAGE_KEYS } from '@/lib/constants';
import { createMigrate, createSafeStorage } from '@/lib/storage';
import type { Id, ISODateTime, StoredPlan, StoredThemes } from '@/types';
import { migrateAssistantV1 } from './migrations';

/** Bumped when plans gained ids, provenance, save state and history. */
const ASSISTANT_STORE_VERSION = 2;

interface AssistantState {
  /** Current AI plan per event id. */
  plans: Record<Id, StoredPlan>;
  /** Up to {@link PLAN_HISTORY_LIMIT} earlier versions per event, newest first. */
  history: Record<Id, StoredPlan[]>;
  /** Latest AI theme suggestions per event id. */
  themes: Record<Id, StoredThemes>;
}

interface AssistantActions {
  /** Makes `plan` current, moving the previous version into history. */
  setPlan: (plan: StoredPlan) => void;
  /** Swaps a historical version back in as current. */
  restorePlan: (eventId: Id, planId: Id) => void;
  /** Marks the current plan as saved (or back to draft with `null`). */
  setSavedAt: (eventId: Id, savedAt: ISODateTime | null) => void;
  setThemes: (themes: StoredThemes) => void;
  removeByEvent: (eventId: Id) => void;
  reset: () => void;
}

export type AssistantStore = AssistantState & AssistantActions;

function createInitialState(): AssistantState {
  const plan = createSeedPlan();
  return { plans: { [plan.eventId]: plan }, history: {}, themes: {} };
}

function omitKey<T>(record: Record<Id, T>, key: Id): Record<Id, T> {
  return Object.fromEntries(Object.entries(record).filter(([id]) => id !== key));
}

const pushHistory = (history: StoredPlan[] = [], previous: StoredPlan | undefined): StoredPlan[] =>
  (previous ? [previous, ...history] : history).slice(0, PLAN_HISTORY_LIMIT);

/** AI-generated plans (with version history) and theme suggestions, persisted per event. */
export const useAssistantStore = create<AssistantStore>()(
  persist(
    (set) => ({
      ...createInitialState(),

      setPlan: (plan) => {
        set((state) => ({
          plans: { ...state.plans, [plan.eventId]: plan },
          history: {
            ...state.history,
            [plan.eventId]: pushHistory(state.history[plan.eventId], state.plans[plan.eventId]),
          },
        }));
      },

      restorePlan: (eventId, planId) => {
        set((state) => {
          const versions = state.history[eventId] ?? [];
          const restored = versions.find((version) => version.id === planId);
          if (!restored) return state;
          const remaining = versions.filter((version) => version.id !== planId);
          return {
            plans: { ...state.plans, [eventId]: restored },
            history: { ...state.history, [eventId]: pushHistory(remaining, state.plans[eventId]) },
          };
        });
      },

      setSavedAt: (eventId, savedAt) => {
        set((state) => {
          const current = state.plans[eventId];
          return current ? { plans: { ...state.plans, [eventId]: { ...current, savedAt } } } : state;
        });
      },

      setThemes: (themes) => {
        set((state) => ({ themes: { ...state.themes, [themes.eventId]: themes } }));
      },

      removeByEvent: (eventId) => {
        set((state) => ({
          plans: omitKey(state.plans, eventId),
          history: omitKey(state.history, eventId),
          themes: omitKey(state.themes, eventId),
        }));
      },

      reset: () => {
        set(createInitialState());
      },
    }),
    {
      name: STORAGE_KEYS.assistant,
      version: ASSISTANT_STORE_VERSION,
      storage: createSafeStorage<AssistantState>(),
      partialize: ({ plans, history, themes }) => ({ plans, history, themes }),
      migrate: createMigrate<AssistantState>(createInitialState, { 1: migrateAssistantV1 }, ASSISTANT_STORE_VERSION),
    },
  ),
);

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { STORAGE_KEYS, STORE_VERSION } from '@/lib/constants';
import { createMigrate, createSafeStorage } from '@/lib/storage';
import { clamp } from '@/lib/utils';
import type { WizardDraft } from '../lib/wizardSchema';
import { REVIEW_STEP_INDEX } from '../lib/wizardSteps';

interface WizardDraftState {
  draft: WizardDraft;
  stepIndex: number;
}

interface WizardDraftActions {
  /** Merges a completed step's values into the draft and moves to `nextIndex`. */
  saveStep: (values: WizardDraft, nextIndex: number) => void;
  /** Merges values without changing step (e.g. a preselected type from the URL). */
  patchDraft: (values: WizardDraft) => void;
  goToStep: (index: number) => void;
  clearDraft: () => void;
}

export type WizardDraftStore = WizardDraftState & WizardDraftActions;

function createInitialState(): WizardDraftState {
  return {
    draft: { currency: 'INR', dietary: [], venue: '', accessibility: '', cultural: '', notes: '' },
    stepIndex: 0,
  };
}

const boundIndex = (index: number) => clamp(index, 0, REVIEW_STEP_INDEX);

/** Wizard answers in progress. Persisted so a refresh never loses input. */
export const useWizardDraftStore = create<WizardDraftStore>()(
  persist(
    (set) => ({
      ...createInitialState(),

      saveStep: (values, nextIndex) => {
        set((state) => ({ draft: { ...state.draft, ...values }, stepIndex: boundIndex(nextIndex) }));
      },

      patchDraft: (values) => {
        set((state) => ({ draft: { ...state.draft, ...values } }));
      },

      goToStep: (index) => {
        set({ stepIndex: boundIndex(index) });
      },

      clearDraft: () => {
        set(createInitialState());
      },
    }),
    {
      name: STORAGE_KEYS.wizardDraft,
      version: STORE_VERSION,
      storage: createSafeStorage<WizardDraftState>(),
      partialize: ({ draft, stepIndex }) => ({ draft, stepIndex }),
      migrate: createMigrate<WizardDraftState>(createInitialState),
    },
  ),
);

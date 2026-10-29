import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { createSeedGuests } from '@/data/seed';
import { removeByEventId, removeById, updateById } from '@/lib/collection';
import { STORAGE_KEYS, STORE_VERSION } from '@/lib/constants';
import { createId } from '@/lib/id';
import { createMigrate, createSafeStorage } from '@/lib/storage';
import type { Guest, GuestInput, Id } from '@/types';

interface GuestState {
  guests: Guest[];
}

interface GuestActions {
  addGuest: (eventId: Id, input: GuestInput) => Guest;
  updateGuest: (id: Id, patch: Partial<GuestInput>) => void;
  deleteGuest: (id: Id) => void;
  removeByEvent: (eventId: Id) => void;
  reset: () => void;
}

export type GuestStore = GuestState & GuestActions;

function createInitialState(): GuestState {
  return { guests: createSeedGuests() };
}

/** Guest lists across all events. */
export const useGuestStore = create<GuestStore>()(
  persist(
    (set) => ({
      ...createInitialState(),

      addGuest: (eventId, input) => {
        const guest: Guest = { ...input, id: createId('guest'), eventId };
        set((state) => ({ guests: [...state.guests, guest] }));
        return guest;
      },

      updateGuest: (id, patch) => {
        set((state) => ({ guests: updateById(state.guests, id, patch) }));
      },

      deleteGuest: (id) => {
        set((state) => ({ guests: removeById(state.guests, id) }));
      },

      removeByEvent: (eventId) => {
        set((state) => ({ guests: removeByEventId(state.guests, eventId) }));
      },

      reset: () => {
        set(createInitialState());
      },
    }),
    {
      name: STORAGE_KEYS.guests,
      version: STORE_VERSION,
      storage: createSafeStorage<GuestState>(),
      partialize: ({ guests }) => ({ guests }),
      migrate: createMigrate<GuestState>(createInitialState),
    },
  ),
);

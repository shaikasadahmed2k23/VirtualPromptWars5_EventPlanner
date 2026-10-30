import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { createSeedGuests } from '@/data/seed';
import { removeByEventId, removeById, restoreAt, updateById } from '@/lib/collection';
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
  /** Applies the same change to several guests in one update (bulk RSVP). */
  updateGuests: (ids: ReadonlySet<Id>, patch: Partial<GuestInput>) => void;
  /** Removes a guest and returns a function that restores them exactly (id, position). */
  deleteGuest: (id: Id) => () => void;
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
    (set, get) => ({
      ...createInitialState(),

      addGuest: (eventId, input) => {
        const guest: Guest = { ...input, id: createId('guest'), eventId };
        set((state) => ({ guests: [...state.guests, guest] }));
        return guest;
      },

      updateGuest: (id, patch) => {
        set((state) => ({ guests: updateById(state.guests, id, patch) }));
      },

      updateGuests: (ids, patch) => {
        set((state) => ({
          guests: state.guests.map((guest) => (ids.has(guest.id) ? { ...guest, ...patch, id: guest.id } : guest)),
        }));
      },

      deleteGuest: (id) => {
        const index = get().guests.findIndex((guest) => guest.id === id);
        const removed = get().guests[index];
        if (!removed) return () => undefined;
        set((state) => ({ guests: removeById(state.guests, id) }));
        return () => {
          set((state) => ({ guests: restoreAt(state.guests, index, removed) }));
        };
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

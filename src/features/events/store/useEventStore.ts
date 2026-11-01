import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { createSeedEvent } from '@/data/seed';
import { removeById, updateById } from '@/lib/collection';
import { STORAGE_KEYS } from '@/lib/constants';
import { nowISO } from '@/lib/dates';
import { createId } from '@/lib/id';
import { createMigrate, createSafeStorage } from '@/lib/storage';
import type { CelebrationEvent, Id, NewEventInput, ThemeSuggestion } from '@/types';
import { migrateEventsV1 } from './migrations';

/** Bumped when saved themes gained image keywords. */
const EVENT_STORE_VERSION = 2;

interface EventState {
  events: CelebrationEvent[];
  activeEventId: Id | null;
}

interface EventActions {
  /** Creates an event, makes it active and returns it. */
  createEvent: (input: NewEventInput) => CelebrationEvent;
  updateEvent: (id: Id, patch: Partial<NewEventInput>) => void;
  /** Removes the event only; use `deleteEventCascade` to also clear related data. */
  deleteEvent: (id: Id) => void;
  setActiveEvent: (id: Id) => void;
  /** Saves an AI theme suggestion onto the event (replacing any previous one). */
  saveTheme: (id: Id, theme: ThemeSuggestion) => void;
  clearTheme: (id: Id) => void;
  reset: () => void;
}

export type EventStore = EventState & EventActions;

function createInitialState(): EventState {
  const seed = createSeedEvent();
  return { events: [seed], activeEventId: seed.id };
}

/** Events the user is planning, plus which one is currently active. */
export const useEventStore = create<EventStore>()(
  persist(
    (set) => ({
      ...createInitialState(),

      createEvent: (input) => {
        const timestamp = nowISO();
        const event: CelebrationEvent = {
          ...input,
          id: createId('evt'),
          theme: null,
          createdAt: timestamp,
          updatedAt: timestamp,
        };
        set((state) => ({ events: [...state.events, event], activeEventId: event.id }));
        return event;
      },

      updateEvent: (id, patch) => {
        set((state) => ({ events: updateById(state.events, id, { ...patch, updatedAt: nowISO() }) }));
      },

      deleteEvent: (id) => {
        set((state) => {
          const events = removeById(state.events, id);
          const activeEventId = state.activeEventId === id ? (events[0]?.id ?? null) : state.activeEventId;
          return { events, activeEventId };
        });
      },

      setActiveEvent: (id) => {
        set({ activeEventId: id });
      },

      saveTheme: (id, theme) => {
        const timestamp = nowISO();
        set((state) => ({
          events: updateById(state.events, id, {
            theme: { ...theme, id: createId('theme'), savedAt: timestamp },
            updatedAt: timestamp,
          }),
        }));
      },

      clearTheme: (id) => {
        set((state) => ({ events: updateById(state.events, id, { theme: null, updatedAt: nowISO() }) }));
      },

      reset: () => {
        set(createInitialState());
      },
    }),
    {
      name: STORAGE_KEYS.events,
      version: EVENT_STORE_VERSION,
      storage: createSafeStorage<EventState>(),
      partialize: ({ events, activeEventId }) => ({ events, activeEventId }),
      migrate: createMigrate<EventState>(createInitialState, { 1: migrateEventsV1 }, EVENT_STORE_VERSION),
    },
  ),
);

/** Selects an event by id, or `undefined` when it does not exist. */
export const selectEventById =
  (id: Id | undefined) =>
  (state: EventStore): CelebrationEvent | undefined =>
    state.events.find((event) => event.id === id);

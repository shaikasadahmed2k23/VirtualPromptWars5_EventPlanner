import { clearResponseCache } from '@/features/assistant/lib/responseCache';
import { useAssistantStore } from '@/features/assistant/store/useAssistantStore';
import { useBudgetStore } from '@/features/budget/store/useBudgetStore';
import { useGuestStore } from '@/features/guests/store/useGuestStore';
import { useTaskStore } from '@/features/tasks/store/useTaskStore';
import { useVendorStore } from '@/features/vendors/store/useVendorStore';
import { useWizardDraftStore } from '@/features/wizard/store/useWizardDraftStore';
import { todayISO } from '@/lib/dates';
import type { CelebrationEvent, Id, NewEventInput } from '@/types';
import { generateStarterBudget, generateStarterTasks } from '../lib/starterPlan';
import { useEventStore } from './useEventStore';

/** Stores holding data scoped to a single event. */
const EVENT_SCOPED_STORES = [useTaskStore, useBudgetStore, useGuestStore, useAssistantStore] as const;

/**
 * Creates an event and seeds it with a starter checklist (scaled to the time
 * remaining) and starter budget lines (split by event type).
 */
export function createEventWithStarterPlan(input: NewEventInput, today: string = todayISO()): CelebrationEvent {
  const event = useEventStore.getState().createEvent(input);
  useTaskStore.getState().addTasks(event.id, generateStarterTasks(event, today));
  useBudgetStore.getState().addItems(event.id, generateStarterBudget(event));
  return event;
}

/** Deletes an event together with its tasks, budget, guests and AI output. */
export function deleteEventCascade(eventId: Id): void {
  for (const store of EVENT_SCOPED_STORES) {
    store.getState().removeByEvent(eventId);
  }
  useEventStore.getState().deleteEvent(eventId);
}

/** Restores every store to the seeded demo state (Settings → "Reset demo data"). */
export function resetDemoData(): void {
  for (const store of [...EVENT_SCOPED_STORES, useVendorStore, useEventStore]) {
    store.getState().reset();
  }
  useWizardDraftStore.getState().clearDraft();
  clearResponseCache();
}

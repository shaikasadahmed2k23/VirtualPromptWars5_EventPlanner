import type { CelebrationEvent } from '@/types';
import { useEventStore } from '../store/useEventStore';

/**
 * The event the user is currently planning, for pages outside an event route
 * (e.g. the vendor directory). `undefined` when no event exists yet.
 */
export function useActiveEvent(): CelebrationEvent | undefined {
  return useEventStore(
    (state) => state.events.find((event) => event.id === state.activeEventId) ?? state.events.at(-1),
  );
}

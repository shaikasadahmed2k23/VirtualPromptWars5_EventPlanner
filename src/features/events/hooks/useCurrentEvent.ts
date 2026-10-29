import { useOutletContext } from 'react-router-dom';
import type { CelebrationEvent } from '@/types';

/** Context provided by `EventLayout` to every `/events/:eventId/*` page. */
export interface EventOutletContext {
  event: CelebrationEvent;
}

/**
 * Returns the event resolved by `EventLayout`. Only valid inside event routes,
 * where the layout guarantees the event exists.
 */
export function useCurrentEvent(): CelebrationEvent {
  return useOutletContext<EventOutletContext>().event;
}

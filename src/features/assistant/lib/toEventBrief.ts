import type { CelebrationEvent, EventBrief } from '@/types';

/** The subset of an event sent to the AI. Only planning-relevant fields leave the browser. */
export function toEventBrief(event: CelebrationEvent): EventBrief {
  return {
    type: event.type,
    name: event.name,
    date: event.date,
    startTime: event.startTime,
    city: event.city,
    venue: event.venue,
    guestCount: event.guestCount,
    budget: event.budget,
    currency: event.currency,
    style: event.style,
    dietary: event.requirements.dietary,
    accessibility: event.requirements.accessibility,
    cultural: event.requirements.cultural,
    notes: event.requirements.notes,
  };
}

import { isRecord } from '@/lib/utils';

/** v1 → v2: saved themes gained image-search `keywords` (seeded from the theme mood). */
export function migrateEventsV1(state: unknown): unknown {
  if (!isRecord(state) || !Array.isArray(state.events)) return state;
  return {
    ...state,
    events: state.events.map((event: unknown) => {
      if (!isRecord(event) || !isRecord(event.theme) || Array.isArray(event.theme.keywords)) return event;
      return {
        ...event,
        theme: { ...event.theme, keywords: [typeof event.theme.mood === 'string' ? event.theme.mood : 'floral'] },
      };
    }),
  };
}

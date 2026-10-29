/**
 * Pure, immutable helpers for id-keyed collections. Shared by every CRUD store
 * so add/update/delete semantics are identical across domains.
 */

interface Identified {
  id: string;
}

interface EventScoped {
  eventId: string;
}

/** Returns a new list with the item matching `id` shallow-merged with `patch`. */
export function updateById<T extends Identified>(list: readonly T[], id: string, patch: NoInfer<Partial<T>>): T[] {
  return list.map((item) => (item.id === id ? { ...item, ...patch, id: item.id } : item));
}

/** Returns a new list without the item matching `id`. */
export function removeById<T extends Identified>(list: readonly T[], id: string): T[] {
  return list.filter((item) => item.id !== id);
}

/** Returns a new list without any items that belong to `eventId`. */
export function removeByEventId<T extends EventScoped>(list: readonly T[], eventId: string): T[] {
  return list.filter((item) => item.eventId !== eventId);
}

/** Returns the items that belong to `eventId`. */
export function filterByEventId<T extends EventScoped>(list: readonly T[], eventId: string): T[] {
  return list.filter((item) => item.eventId === eventId);
}

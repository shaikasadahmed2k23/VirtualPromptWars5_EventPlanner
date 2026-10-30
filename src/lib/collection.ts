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

/**
 * Returns a new list with `item` re-inserted at `index` (clamped), used to undo
 * a delete. A no-op if an item with the same id is already present.
 */
export function restoreAt<T extends Identified>(list: readonly T[], index: number, item: T): T[] {
  if (list.some((existing) => existing.id === item.id)) return [...list];
  const position = Math.min(Math.max(index, 0), list.length);
  return [...list.slice(0, position), item, ...list.slice(position)];
}

/** Returns a new list without any items that belong to `eventId`. */
export function removeByEventId<T extends EventScoped>(list: readonly T[], eventId: string): T[] {
  return list.filter((item) => item.eventId !== eventId);
}

/** Returns the items that belong to `eventId`. */
export function filterByEventId<T extends EventScoped>(list: readonly T[], eventId: string): T[] {
  return list.filter((item) => item.eventId === eventId);
}

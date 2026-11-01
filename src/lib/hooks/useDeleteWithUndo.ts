import { useCallback } from 'react';
import type { Id } from '@/types';
import { notifyWithUndo } from '../undoToast';

/** Keys of `T` whose values are strings, so they can name the item in a toast. */
type StringKey<T> = { [K in keyof T]: T[K] extends string ? K : never }[keyof T];

/**
 * A stable delete handler for list rows: removes the item through a store
 * action that returns its own undo, then confirms with `Removed “name”` and an
 * Undo button. `nameKey` is a property name rather than a function so the
 * handler stays stable and memoised rows do not re-render.
 */
export function useDeleteWithUndo<T extends { id: Id }>(
  remove: (id: Id) => () => void,
  nameKey: StringKey<T>,
): (item: T) => void {
  return useCallback(
    (item: T) => {
      notifyWithUndo(`Removed “${String(item[nameKey])}”`, remove(item.id));
    },
    [remove, nameKey],
  );
}

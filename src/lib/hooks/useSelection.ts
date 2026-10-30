import { useCallback, useState } from 'react';

export interface Selection {
  selected: ReadonlySet<string>;
  /** Selects or deselects one id. */
  toggle: (id: string, checked: boolean) => void;
  /** Selects or deselects several ids at once (e.g. "select all visible"). */
  setMany: (ids: readonly string[], checked: boolean) => void;
  clear: () => void;
}

/**
 * Multi-select state for bulk actions. Clears itself whenever `resetKey`
 * changes (filters or page changed), so a bulk action never touches rows the
 * user can no longer see.
 */
export function useSelection(resetKey: string): Selection {
  const [selected, setSelected] = useState<ReadonlySet<string>>(() => new Set());
  const [lastResetKey, setLastResetKey] = useState(resetKey);
  if (resetKey !== lastResetKey) {
    setLastResetKey(resetKey);
    setSelected(new Set());
  }

  const setMany = useCallback((ids: readonly string[], checked: boolean) => {
    setSelected((current) => {
      const next = new Set(current);
      for (const id of ids) {
        if (checked) next.add(id);
        else next.delete(id);
      }
      return next;
    });
  }, []);
  const toggle = useCallback(
    (id: string, checked: boolean) => {
      setMany([id], checked);
    },
    [setMany],
  );
  const clear = useCallback(() => {
    setSelected(new Set());
  }, []);

  return { selected, toggle, setMany, clear };
}

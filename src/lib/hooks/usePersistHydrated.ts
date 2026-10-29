import { useCallback, useSyncExternalStore } from 'react';

/** The slice of Zustand's `persist` API needed to observe hydration. */
export interface PersistedStore {
  persist: {
    hasHydrated: () => boolean;
    onFinishHydration: (listener: () => void) => () => void;
  };
}

/**
 * True once every given persisted store has rehydrated from storage. Drives
 * loading skeletons so widgets never flash seed data before saved data loads.
 */
export function usePersistHydrated(stores: readonly PersistedStore[]): boolean {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const unsubscribers = stores.map((store) => store.persist.onFinishHydration(onChange));
      return () => {
        for (const unsubscribe of unsubscribers) unsubscribe();
      };
    },
    [stores],
  );
  const getSnapshot = useCallback(() => stores.every((store) => store.persist.hasHydrated()), [stores]);
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}

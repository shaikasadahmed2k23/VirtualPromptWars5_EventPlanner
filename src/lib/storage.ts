import { createJSONStorage, type PersistStorage, type StateStorage } from 'zustand/middleware';
import { STORE_VERSION } from './constants';
import { logger } from './logger';

/**
 * `localStorage` wrapper that never throws. Storage can be unavailable
 * (private mode, disabled cookies) or full (quota exceeded); in those cases the
 * app keeps working in memory instead of crashing.
 */
export const safeLocalStorage = {
  getItem(name: string): string | null {
    try {
      return window.localStorage.getItem(name);
    } catch (error: unknown) {
      logger.warn(`Could not read "${name}" from storage`, error);
      return null;
    }
  },
  setItem(name: string, value: string): void {
    try {
      window.localStorage.setItem(name, value);
    } catch (error: unknown) {
      logger.warn(`Could not write "${name}" to storage`, error);
    }
  },
  removeItem(name: string): void {
    try {
      window.localStorage.removeItem(name);
    } catch (error: unknown) {
      logger.warn(`Could not remove "${name}" from storage`, error);
    }
  },
} satisfies StateStorage;

/** JSON persist storage for Zustand stores backed by {@link safeLocalStorage}. */
export function createSafeStorage<S>(): PersistStorage<S> | undefined {
  return createJSONStorage<S>(() => safeLocalStorage);
}

/** A migration step upgrading persisted state from version `n` to `n + 1`. */
export type MigrationStep = (state: unknown) => unknown;

/**
 * Builds a Zustand `migrate` function. Steps are applied in order from the
 * persisted version up to `currentVersion` (default {@link STORE_VERSION}). If a step is missing (an
 * unknown or very old version), the store falls back to fresh state rather
 * than hydrating a shape it cannot trust.
 */
export function createMigrate<S>(
  fallback: () => S,
  steps: Partial<Record<number, MigrationStep>> = {},
  currentVersion: number = STORE_VERSION,
): (persisted: unknown, fromVersion: number) => S {
  return (persisted, fromVersion) => {
    let state = persisted;
    for (let version = fromVersion; version < currentVersion; version += 1) {
      const step = steps[version];
      if (!step) return fallback();
      state = step(state);
    }
    // The final step produces the current shape by construction.
    return state as S;
  };
}

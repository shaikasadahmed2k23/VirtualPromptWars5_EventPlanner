import { STORE_VERSION } from './constants';
import { createMigrate, safeLocalStorage } from './storage';

describe('safeLocalStorage', () => {
  it('round-trips values through localStorage', () => {
    safeLocalStorage.setItem('k', 'v');
    expect(safeLocalStorage.getItem('k')).toBe('v');
    safeLocalStorage.removeItem('k');
    expect(safeLocalStorage.getItem('k')).toBeNull();
  });

  it('never throws when storage is unavailable, and reports the failure in development', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    const failure = new DOMException('Quota exceeded', 'QuotaExceededError');
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw failure;
    });
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw failure;
    });
    vi.spyOn(Storage.prototype, 'removeItem').mockImplementation(() => {
      throw failure;
    });

    expect(safeLocalStorage.getItem('k')).toBeNull();
    expect(() => {
      safeLocalStorage.setItem('k', 'v');
      safeLocalStorage.removeItem('k');
    }).not.toThrow();
    expect(warn).toHaveBeenCalledTimes(3);
  });
});

describe('createMigrate', () => {
  const fallback = () => ({ items: ['seed'] });

  it('falls back to fresh state when no migration path exists', () => {
    const migrate = createMigrate(fallback);
    expect(migrate({ legacy: true }, STORE_VERSION - 1)).toEqual({ items: ['seed'] });
  });

  it('applies registered steps in order up to the current version', () => {
    const fromVersion = STORE_VERSION - 1;
    const migrate = createMigrate(fallback, {
      [fromVersion]: (state) => ({ items: [...(state as { list: string[] }).list, 'migrated'] }),
    });
    expect(migrate({ list: ['old'] }, fromVersion)).toEqual({ items: ['old', 'migrated'] });
  });
});

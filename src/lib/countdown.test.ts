import { act, renderHook } from '@testing-library/react';
import { COUNTDOWN_TICK_MS } from './constants';
import { getCountdown } from './countdown';
import { useCountdown } from './hooks/useCountdown';

describe('getCountdown', () => {
  const now = new Date('2026-10-29T10:00:00');

  it('breaks the remaining time into days, hours and minutes', () => {
    expect(getCountdown(new Date('2026-11-01T13:45:30'), now)).toEqual({
      days: 3,
      hours: 3,
      minutes: 45,
      isPast: false,
    });
  });

  it('floors partial minutes', () => {
    expect(getCountdown(new Date('2026-10-29T10:00:59'), now)).toMatchObject({ days: 0, hours: 0, minutes: 0 });
  });

  it('reports past events as zero and isPast', () => {
    expect(getCountdown(new Date('2026-10-28T10:00:00'), now)).toEqual({
      days: 0,
      hours: 0,
      minutes: 0,
      isPast: true,
    });
  });
});

describe('useCountdown', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-10-29T10:00:00'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns null without a target', () => {
    const { result } = renderHook(() => useCountdown(null));
    expect(result.current).toBeNull();
  });

  it('re-computes on every tick', () => {
    const target = new Date('2026-10-29T12:00:00');
    const { result } = renderHook(() => useCountdown(target));
    expect(result.current).toMatchObject({ hours: 2, minutes: 0 });

    act(() => {
      vi.advanceTimersByTime(COUNTDOWN_TICK_MS);
    });
    expect(result.current).toMatchObject({ hours: 1, minutes: 59 });
  });

  it('clears its interval on unmount', () => {
    const clearInterval = vi.spyOn(window, 'clearInterval');
    const { unmount } = renderHook(() => useCountdown(new Date('2026-12-01T00:00:00')));
    unmount();
    expect(clearInterval).toHaveBeenCalled();
  });
});

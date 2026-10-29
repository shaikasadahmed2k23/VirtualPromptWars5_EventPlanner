import { act, renderHook } from '@testing-library/react';
import {
  LOADING_MESSAGE_INTERVAL_MS,
  LOADING_MESSAGE_SLOW_THRESHOLD_MS,
  useLoadingStatusMessage,
} from './useLoadingStatusMessage';

describe('useLoadingStatusMessage', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('rotates progress messages and shows the slower-loading message', () => {
    const { result } = renderHook(() => useLoadingStatusMessage(true));
    expect(result.current).toBe('Designing your décor…');

    act(() => {
      vi.advanceTimersByTime(LOADING_MESSAGE_INTERVAL_MS);
    });
    expect(result.current).toBe('Curating the menu…');

    act(() => {
      vi.advanceTimersByTime(LOADING_MESSAGE_INTERVAL_MS);
    });
    expect(result.current).toBe('Building your schedule…');

    act(() => {
      vi.advanceTimersByTime(LOADING_MESSAGE_SLOW_THRESHOLD_MS - LOADING_MESSAGE_INTERVAL_MS * 2);
    });
    expect(result.current).toBe('Almost there…');
  });

  it('clears the message when loading finishes', () => {
    const { result, rerender } = renderHook(({ isLoading }) => useLoadingStatusMessage(isLoading), {
      initialProps: { isLoading: true },
    });

    rerender({ isLoading: false });
    expect(result.current).toBe('');
  });
});

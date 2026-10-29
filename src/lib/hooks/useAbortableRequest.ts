import { useCallback, useEffect, useRef, useState } from 'react';
import { ApiClientError, describeApiError } from '@/lib/apiClient';
import type { AsyncStatus } from '@/types';

/** State and controls for one cancellable async operation. */
export interface AbortableRequest {
  status: AsyncStatus;
  /** User-facing error message when `status` is `error`. */
  error: string | null;
  /**
   * Runs `task`, cancelling any request still in flight. Resolves with the
   * result, or `undefined` if it failed or was superseded/cancelled.
   */
  run: <T>(task: (signal: AbortSignal) => Promise<T>) => Promise<T | undefined>;
}

const isCancellation = (error: unknown) =>
  (error instanceof ApiClientError && error.code === 'ABORTED') ||
  (error instanceof DOMException && error.name === 'AbortError');

/**
 * Tracks loading / success / error for async work and aborts it on unmount,
 * so leaving a page never leaves a request running or updates unmounted state.
 */
export function useAbortableRequest(): AbortableRequest {
  const [status, setStatus] = useState<AsyncStatus>('idle');
  const [error, setError] = useState<string | null>(null);
  const controllerRef = useRef<AbortController | null>(null);

  useEffect(
    () => () => {
      controllerRef.current?.abort();
    },
    [],
  );

  const run = useCallback(async <T>(task: (signal: AbortSignal) => Promise<T>): Promise<T | undefined> => {
    controllerRef.current?.abort();
    const controller = new AbortController();
    controllerRef.current = controller;
    setStatus('loading');
    setError(null);
    try {
      const result = await task(controller.signal);
      if (controller.signal.aborted) return undefined;
      setStatus('success');
      return result;
    } catch (caught: unknown) {
      if (controller.signal.aborted || isCancellation(caught)) return undefined;
      setStatus('error');
      setError(describeApiError(caught));
      return undefined;
    }
  }, []);

  return { status, error, run };
}

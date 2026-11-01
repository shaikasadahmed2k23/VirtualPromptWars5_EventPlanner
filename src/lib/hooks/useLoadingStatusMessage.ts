import { useEffect, useState } from 'react';

/** How often the progress message rotates; slow enough for screen readers to finish each one. */
export const LOADING_MESSAGE_INTERVAL_MS = 3_000;
/** After this long, stop rotating and reassure the user instead. */
export const LOADING_MESSAGE_SLOW_THRESHOLD_MS = 10_000;

const LOADING_MESSAGES = ['Designing your décor…', 'Curating the menu…', 'Building your schedule…'] as const;
const SLOW_LOADING_MESSAGE = 'Almost there…';

/**
 * Rotates through helpful progress messages while an async operation is loading.
 * The slower-loading message replaces the rotation after the configured threshold.
 */
export function useLoadingStatusMessage(isLoading: boolean): string {
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!isLoading) {
      setMessage('');
      return;
    }

    let messageIndex = 0;
    const initialMessage = LOADING_MESSAGES[messageIndex];
    if (initialMessage) setMessage(initialMessage);

    const rotationTimer = window.setInterval(() => {
      messageIndex = (messageIndex + 1) % LOADING_MESSAGES.length;
      const nextMessage = LOADING_MESSAGES[messageIndex];
      if (nextMessage) setMessage(nextMessage);
    }, LOADING_MESSAGE_INTERVAL_MS);
    const slowLoadingTimer = window.setTimeout(() => {
      setMessage(SLOW_LOADING_MESSAGE);
    }, LOADING_MESSAGE_SLOW_THRESHOLD_MS);

    return () => {
      window.clearInterval(rotationTimer);
      window.clearTimeout(slowLoadingTimer);
    };
  }, [isLoading]);

  return message;
}

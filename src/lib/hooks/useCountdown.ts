import { useEffect, useState } from 'react';
import { COUNTDOWN_TICK_MS } from '@/lib/constants';
import { type Countdown, getCountdown } from '@/lib/countdown';

/**
 * Live countdown to `target`, re-computed every {@link COUNTDOWN_TICK_MS}.
 * Returns `null` when there is no valid target.
 */
export function useCountdown(target: Date | null): Countdown | null {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const timer = window.setInterval(() => {
      setNow(new Date());
    }, COUNTDOWN_TICK_MS);
    return () => {
      window.clearInterval(timer);
    };
  }, []);

  return target ? getCountdown(target, now) : null;
}

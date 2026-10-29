const MS_PER_MINUTE = 60_000;
const MINUTES_PER_HOUR = 60;
const HOURS_PER_DAY = 24;
const MINUTES_PER_DAY = MINUTES_PER_HOUR * HOURS_PER_DAY;

/** Time remaining until an event, broken into display units. */
export interface Countdown {
  days: number;
  hours: number;
  minutes: number;
  /** True once the target moment has passed. */
  isPast: boolean;
}

/** Computes the countdown from `now` to `target`, floored to whole minutes. */
export function getCountdown(target: Date, now: Date): Countdown {
  const remainingMs = target.getTime() - now.getTime();
  if (remainingMs <= 0) {
    return { days: 0, hours: 0, minutes: 0, isPast: true };
  }
  const totalMinutes = Math.floor(remainingMs / MS_PER_MINUTE);
  return {
    days: Math.floor(totalMinutes / MINUTES_PER_DAY),
    hours: Math.floor((totalMinutes % MINUTES_PER_DAY) / MINUTES_PER_HOUR),
    minutes: totalMinutes % MINUTES_PER_HOUR,
    isPast: false,
  };
}

import { ConfettiScatter } from '@/components/decor/ConfettiScatter';
import { Photo } from '@/components/ui/photo';
import { PHOTOS } from '@/data/photos';
import { EVENT_TYPE_META } from '@/features/events/lib/eventTypeMeta';
import { ASPECT } from '@/lib/constants';
import { combineDateTime, formatDisplayDate } from '@/lib/dates';
import { pluralize } from '@/lib/format';
import { useCountdown } from '@/lib/hooks/useCountdown';
import type { CelebrationEvent } from '@/types';

const UNITS = ['days', 'hours', 'minutes'] as const;

/**
 * Live countdown over the event-type photograph. The visible timer is not a
 * live region (it changes every minute); a separate polite live region only
 * changes, and so only announces, when the day count changes.
 */
export function CountdownPanel({ event }: { event: CelebrationEvent }) {
  const countdown = useCountdown(combineDateTime(event.date, event.startTime));
  const photo = PHOTOS[EVENT_TYPE_META[event.type].photo];

  return (
    <div className="relative isolate flex min-h-64 flex-col justify-end overflow-hidden rounded-2xl p-6 text-white">
      <div className="absolute inset-0 -z-20">
        <Photo photo={photo} aspect={ASPECT.portrait} width={640} sizes="(min-width: 1024px) 30vw, 100vw" decorative />
      </div>
      <div className="absolute inset-0 -z-10 bg-linear-to-t from-charcoal/90 via-charcoal/75 to-charcoal/50" />
      <ConfettiScatter className="absolute inset-x-0 top-3 h-16 w-full opacity-80" />

      {countdown && !countdown.isPast ? (
        <>
          <p className="text-xs font-semibold uppercase tracking-[0.2em]">Counting down</p>
          <div role="timer" aria-label="Time until the event" className="mt-3 flex items-end gap-5">
            {UNITS.map((unit) => (
              <div key={unit}>
                <span className="block font-serif text-5xl font-semibold leading-none tabular-nums">
                  {countdown[unit]}
                </span>
                <span className="mt-1 block text-xs uppercase tracking-widest">{unit}</span>
              </div>
            ))}
          </div>
          <p className="sr-only" aria-live="polite">
            {pluralize(countdown.days, 'day')} to go
          </p>
        </>
      ) : (
        <p className="font-serif text-3xl font-semibold">
          Celebrated on {formatDisplayDate(event.date, 'd MMMM yyyy')}
        </p>
      )}
    </div>
  );
}

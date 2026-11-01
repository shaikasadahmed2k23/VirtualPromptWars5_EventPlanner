import { Link } from 'react-router-dom';
import { paths } from '@/app/navigation';
import { Photo } from '@/components/ui/photo';
import { ASPECT } from '@/lib/constants';
import { PHOTOS } from '@/data/photos';
import { createSeedEvent } from '@/data/seed';
import { daysBetween, formatDisplayDate, todayISO } from '@/lib/dates';
import { pluralize } from '@/lib/format';
import { cn } from '@/lib/utils';

const demo = createSeedEvent();

/** Floating "magazine clipping" in the hero that previews the seeded demo wedding. */
export function DemoPreviewCard({ className }: { className?: string }) {
  const daysToGo = daysBetween(todayISO(), demo.date);

  return (
    <Link
      to={paths.event(demo.id)}
      className={cn(
        'group block rotate-2 rounded-2xl bg-surface p-3 shadow-lift transition-transform duration-300 hover:rotate-0',
        className,
      )}
    >
      <div className="aspect-[4/3] overflow-hidden rounded-xl">
        <Photo photo={PHOTOS.ringsHands} aspect={ASPECT.landscape} width={480} sizes="18rem" decorative />
      </div>
      <div className="px-1 pb-1 pt-3">
        <p className="text-[0.65rem] font-semibold uppercase tracking-[0.24em] text-rose-ink">Sample plan</p>
        <p className="mt-1 font-serif text-xl font-semibold leading-tight">{demo.name}</p>
        <p className="mt-1 text-xs text-muted">
          {formatDisplayDate(demo.date)} · {demo.city}
          {daysToGo > 0 ? ` · ${pluralize(daysToGo, 'day')} to go` : ''}
        </p>
      </div>
    </Link>
  );
}

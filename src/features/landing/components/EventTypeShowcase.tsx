import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { EVENT_TYPES } from '@shared/domain';
import { paths } from '@/app/navigation';
import { Photo } from '@/components/ui/photo';
import { PHOTOS } from '@/data/photos';
import { EVENT_TYPE_META } from '@/features/events/lib/eventTypeMeta';
import { ASPECT } from '@/lib/constants';
import { EVENT_TYPE_LABELS } from '@/lib/labels';
import { cn } from '@/lib/utils';
import { EditorialHeading } from './EditorialHeading';

/** Four occasion cards in a staggered editorial grid; each opens the wizard preselected. */
export function EventTypeShowcase() {
  return (
    <section aria-labelledby="occasions-title" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <EditorialHeading id="occasions-title" eyebrow="Every occasion" title="What are you celebrating?" />
      <ul className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {EVENT_TYPES.map((type, index) => {
          const meta = EVENT_TYPE_META[type];
          return (
            <li key={type} className={cn(index % 2 === 1 && 'lg:mt-14')}>
              <Link
                to={`${paths.newEvent()}?type=${type}`}
                className="group block overflow-hidden rounded-3xl border border-line bg-surface shadow-soft transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lift"
              >
                <div className="aspect-[4/3] overflow-hidden sm:aspect-[3/4]">
                  <Photo
                    photo={PHOTOS[meta.photo]}
                    aspect={ASPECT.tall}
                    width={600}
                    sizes="(min-width: 1024px) 22vw, (min-width: 640px) 45vw, 100vw"
                    className="transition-transform duration-700 group-hover:scale-105"
                    decorative
                  />
                </div>
                <div className="p-6">
                  <h3 className="flex items-center justify-between text-2xl">
                    {EVENT_TYPE_LABELS[type]}
                    <ArrowUpRight
                      className="size-5 text-rose-ink transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                      aria-hidden="true"
                    />
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{meta.pitch}</p>
                  <span className="mt-4 inline-block text-sm font-medium text-rose-ink">Start planning</span>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

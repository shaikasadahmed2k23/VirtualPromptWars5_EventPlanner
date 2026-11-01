import { CalendarDays, MapPin, Palette, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { paths } from '@/app/navigation';
import { FloralSprig } from '@/components/decor/FloralSprig';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { EVENT_TYPE_META } from '@/features/events/components/eventTypeMeta';
import { formatDisplayDate } from '@/lib/dates';
import { pluralize } from '@/lib/format';
import { EVENT_STYLE_LABELS, EVENT_TYPE_LABELS } from '@/lib/labels';
import type { CelebrationEvent } from '@/types';
import { CountdownPanel } from './CountdownPanel';

/** Dashboard hero: the page's `h1`, key event facts, theme swatch and countdown. */
export function EventHero({ event }: { event: CelebrationEvent }) {
  const TypeIcon = EVENT_TYPE_META[event.type].icon;
  const place = [event.venue, event.city].filter(Boolean).join(', ');

  return (
    <Card className="relative grid gap-4 overflow-hidden p-3 lg:grid-cols-[1.5fr_1fr]">
      <FloralSprig className="absolute -left-8 -top-8 size-40 opacity-40" />
      <div className="relative flex flex-col gap-5 p-4 sm:p-6">
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone="rose">
            <TypeIcon aria-hidden="true" />
            {EVENT_TYPE_LABELS[event.type]}
          </Badge>
          <Badge tone="lavender">{EVENT_STYLE_LABELS[event.style]}</Badge>
        </div>
        <h1 className="text-4xl leading-[1.05] sm:text-6xl">{event.name}</h1>
        <ul className="grid gap-2 text-sm text-charcoal sm:grid-cols-2">
          <li className="flex items-center gap-2">
            <CalendarDays className="size-4 text-rose-ink" aria-hidden="true" />
            {formatDisplayDate(event.date, 'EEEE, d MMMM yyyy')} · {event.startTime}
          </li>
          <li className="flex items-center gap-2">
            <MapPin className="size-4 text-rose-ink" aria-hidden="true" />
            {place}
          </li>
          <li className="flex items-center gap-2">
            <Users className="size-4 text-rose-ink" aria-hidden="true" />
            {pluralize(event.guestCount, 'guest')} expected
          </li>
        </ul>
        <ThemeSwatch event={event} />
      </div>
      <CountdownPanel event={event} />
    </Card>
  );
}

function ThemeSwatch({ event }: { event: CelebrationEvent }) {
  if (!event.theme) {
    return (
      <Link
        to={paths.themes(event.id)}
        className="inline-flex w-fit items-center gap-2 text-sm font-medium text-rose-ink underline-offset-4 hover:underline"
      >
        <Palette className="size-4" aria-hidden="true" />
        Choose a theme and colour palette
      </Link>
    );
  }
  return (
    <div className="flex flex-wrap items-center gap-3">
      <span className="text-sm text-muted">
        Theme: <span className="font-medium text-charcoal">{event.theme.name}</span>
      </span>
      <ul className="flex -space-x-1.5" aria-label={`${event.theme.name} palette`}>
        {event.theme.palette.map((swatch) => (
          <li
            key={swatch.hex}
            className="size-7 rounded-full border-2 border-surface shadow-soft"
            style={{ backgroundColor: swatch.hex }}
            title={`${swatch.name} ${swatch.hex}`}
          >
            <span className="sr-only">{swatch.name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

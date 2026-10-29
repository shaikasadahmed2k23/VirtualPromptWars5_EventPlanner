import { CalendarX2 } from 'lucide-react';
import { useEffect } from 'react';
import { Link, NavLink, Outlet, useParams } from 'react-router-dom';
import { getEventNav, paths } from '@/app/navigation';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/states';
import { EventSwitcher } from '@/features/events/components/EventSwitcher';
import type { EventOutletContext } from '@/features/events/hooks/useCurrentEvent';
import { selectEventById, useEventStore } from '@/features/events/store/useEventStore';
import { useDocumentTitle } from '@/lib/hooks/useDocumentTitle';
import { cn } from '@/lib/utils';

/**
 * Resolves `:eventId`, marks it active, and renders the event section
 * navigation around the nested page. Shows a recoverable state if the event
 * does not exist (e.g. deleted, or a stale link).
 */
export default function EventLayout() {
  const { eventId } = useParams();
  const event = useEventStore(selectEventById(eventId));
  const setActiveEvent = useEventStore((state) => state.setActiveEvent);

  useEffect(() => {
    if (event) setActiveEvent(event.id);
  }, [event, setActiveEvent]);

  if (!event) {
    return <MissingEvent />;
  }

  const context: EventOutletContext = { event };

  return (
    <div className="bg-paper">
      <div className="mx-auto flex max-w-7xl flex-col gap-2 border-b border-line/70 px-4 py-2 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <nav aria-label="Event sections" className="min-w-0">
          <ul className="flex gap-1 overflow-x-auto">
            {getEventNav(event.id).map(({ label, to, icon: Icon, end }) => (
              <li key={label} className="shrink-0">
                <NavLink
                  to={to}
                  end={end}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-2 rounded-full px-3.5 py-2 text-sm font-medium transition-colors',
                      isActive ? 'bg-rose-ink text-white' : 'text-charcoal hover:bg-ivory-deep',
                    )
                  }
                >
                  <Icon className="size-4" aria-hidden="true" />
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
        <div className="shrink-0">
          <EventSwitcher current={event} />
        </div>
      </div>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <Outlet context={context} />
      </div>
    </div>
  );
}

function MissingEvent() {
  useDocumentTitle('Event not found');
  return (
    <div className="mx-auto max-w-2xl px-4 py-16">
      <h1 className="sr-only">Event not found</h1>
      <EmptyState
        icon={CalendarX2}
        title="We couldn’t find that event"
        description="It may have been deleted, or the link is from another browser. Your events are stored privately on this device."
        action={
          <div className="flex flex-wrap justify-center gap-3">
            <Button asChild>
              <Link to={paths.newEvent()}>Plan a new event</Link>
            </Button>
            <Button asChild variant="secondary">
              <Link to={paths.events()}>Go to my events</Link>
            </Button>
          </div>
        }
      />
    </div>
  );
}

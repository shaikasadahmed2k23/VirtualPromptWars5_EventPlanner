import { CalendarHeart } from 'lucide-react';
import { Link, Navigate } from 'react-router-dom';
import { paths } from '@/app/navigation';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/states';
import { useEventStore } from '@/features/events/store/useEventStore';
import { useDocumentTitle } from '@/lib/hooks/useDocumentTitle';

/** `/events` → the active event's dashboard, or an empty state when there are none. */
export default function EventsIndexPage() {
  const eventId = useEventStore((state) => state.activeEventId ?? state.events[0]?.id ?? null);
  useDocumentTitle('My events');

  if (eventId) {
    return <Navigate to={paths.event(eventId)} replace />;
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-16">
      <h1 className="sr-only">My events</h1>
      <EmptyState
        icon={CalendarHeart}
        title="No celebrations planned yet"
        description="Answer six quick questions and Utsav will draft your checklist, budget and ideas."
        action={
          <Button asChild size="lg">
            <Link to={paths.newEvent()}>Plan my event</Link>
          </Button>
        }
      />
    </div>
  );
}

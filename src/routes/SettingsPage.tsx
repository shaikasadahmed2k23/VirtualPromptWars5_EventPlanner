import { CalendarHeart, RotateCcw } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { paths } from '@/app/navigation';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ConfirmDeleteButton, ConfirmDialog } from '@/components/ui/confirm-dialog';
import { PageHeader } from '@/components/ui/headings';
import { EmptyState } from '@/components/ui/states';
import { deleteEventCascade, resetDemoData } from '@/features/events/store/eventLifecycle';
import { useEventStore } from '@/features/events/store/useEventStore';
import { formatDisplayDate } from '@/lib/dates';
import { useDocumentTitle } from '@/lib/hooks/useDocumentTitle';
import { EVENT_TYPE_LABELS } from '@/lib/labels';
import type { CelebrationEvent } from '@/types';

/** One saved event: a link to its dashboard, its summary, and a confirmed cascade delete. */
function EventListItem({ event, isActive }: { event: CelebrationEvent; isActive: boolean }) {
  return (
    <li className="flex flex-wrap items-center justify-between gap-3 py-4">
      <div className="min-w-0">
        <Link
          to={paths.event(event.id)}
          className="font-serif text-xl font-semibold hover:text-rose-ink hover:underline"
        >
          {event.name}
        </Link>
        <p className="text-sm text-muted">
          {EVENT_TYPE_LABELS[event.type]} · {formatDisplayDate(event.date)} · {event.city}
        </p>
      </div>
      <div className="flex items-center gap-2">
        {isActive ? <Badge tone="rose">Active</Badge> : null}
        <ConfirmDeleteButton
          itemName={event.name}
          title={`Delete “${event.name}”?`}
          description="This permanently removes the event and all of its planning data from this browser."
          confirmLabel="Delete event"
          onConfirm={() => {
            deleteEventCascade(event.id);
            toast.success(`Deleted “${event.name}”`);
          }}
        />
      </div>
    </li>
  );
}

function EventsCard() {
  const events = useEventStore((state) => state.events);
  const activeEventId = useEventStore((state) => state.activeEventId);
  return (
    <Card>
      <CardHeader>
        <CardTitle as="h2">Your events</CardTitle>
        <CardDescription>Deleting an event also removes its tasks, budget, guests and AI ideas.</CardDescription>
      </CardHeader>
      <CardContent>
        {events.length === 0 ? (
          <EmptyState
            icon={CalendarHeart}
            title="No events yet"
            description="Start the planning wizard to create your first celebration."
            action={
              <Button asChild>
                <Link to={paths.newEvent()}>Plan my event</Link>
              </Button>
            }
          />
        ) : (
          <ul className="divide-y divide-line">
            {events.map((event) => (
              <EventListItem key={event.id} event={event} isActive={event.id === activeEventId} />
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}

function ResetDemoCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle as="h2">Reset demo data</CardTitle>
        <CardDescription>
          Restore Ayesha &amp; Rohan’s sample wedding with its tasks, budget, guests and AI plan. Events you created
          will be removed.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ConfirmDialog
          trigger={
            <Button variant="secondary">
              <RotateCcw aria-hidden="true" />
              Reset demo data
            </Button>
          }
          title="Reset all data to the demo?"
          description="Your own events, shortlist and quote requests will be cleared and the sample wedding restored."
          confirmLabel="Reset to demo"
          destructive
          onConfirm={() => {
            resetDemoData();
            toast.success('Demo data restored');
          }}
        />
      </CardContent>
    </Card>
  );
}

/** Manage saved events and restore the demo data. */
export default function SettingsPage() {
  useDocumentTitle('Settings');
  return (
    <div className="mx-auto max-w-4xl space-y-8 px-4 py-10 sm:px-6">
      <PageHeader
        eyebrow="Settings"
        title="Your planning space"
        description="Everything you plan in Utsav is saved privately in this browser. Manage your events or start fresh with the demo."
      />
      <EventsCard />
      <ResetDemoCard />
    </div>
  );
}

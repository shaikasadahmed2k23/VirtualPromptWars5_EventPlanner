import { CalendarHeart, RotateCcw, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { paths } from '@/app/navigation';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { PageHeader } from '@/components/ui/headings';
import { EmptyState } from '@/components/ui/states';
import { deleteEventCascade, resetDemoData } from '@/features/events/lib/eventLifecycle';
import { useEventStore } from '@/features/events/store/useEventStore';
import { formatDisplayDate } from '@/lib/dates';
import { useDocumentTitle } from '@/lib/hooks/useDocumentTitle';
import { EVENT_TYPE_LABELS } from '@/lib/labels';

/** Manage saved events and restore the demo data. */
export default function SettingsPage() {
  useDocumentTitle('Settings');
  const events = useEventStore((state) => state.events);
  const activeEventId = useEventStore((state) => state.activeEventId);

  return (
    <div className="mx-auto max-w-4xl space-y-8 px-4 py-10 sm:px-6">
      <PageHeader
        eyebrow="Settings"
        title="Your planning space"
        description="Everything you plan in Utsav is saved privately in this browser. Manage your events or start fresh with the demo."
      />

      <Card>
        <CardHeader>
          <CardTitle>Your events</CardTitle>
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
                <li key={event.id} className="flex flex-wrap items-center justify-between gap-3 py-4">
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
                    {event.id === activeEventId ? <Badge tone="rose">Active</Badge> : null}
                    <ConfirmDialog
                      trigger={
                        <Button variant="ghost" size="icon-sm" aria-label={`Delete ${event.name}`}>
                          <Trash2 aria-hidden="true" />
                        </Button>
                      }
                      title={`Delete “${event.name}”?`}
                      description="This permanently removes the event and all of its planning data from this browser."
                      confirmLabel="Delete event"
                      destructive
                      onConfirm={() => {
                        deleteEventCascade(event.id);
                        toast.success(`Deleted “${event.name}”`);
                      }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Reset demo data</CardTitle>
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
    </div>
  );
}

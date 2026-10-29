import { PageHeader } from '@/components/ui/headings';
import { useCurrentEvent } from '@/features/events/hooks/useCurrentEvent';
import { useDocumentTitle } from '@/lib/hooks/useDocumentTitle';

/** Guests for the current event. */
export default function GuestsPage() {
  const event = useCurrentEvent();
  useDocumentTitle(`Guests · ${event.name}`);
  return (
    <PageHeader eyebrow={event.name} title="Guests" description="RSVPs, dietary needs and plus-ones at a glance." />
  );
}

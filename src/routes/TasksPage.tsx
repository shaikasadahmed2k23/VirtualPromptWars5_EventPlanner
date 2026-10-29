import { PageHeader } from '@/components/ui/headings';
import { useCurrentEvent } from '@/features/events/hooks/useCurrentEvent';
import { useDocumentTitle } from '@/lib/hooks/useDocumentTitle';

/** Checklist & timeline for the current event. */
export default function TasksPage() {
  const event = useCurrentEvent();
  useDocumentTitle(`Checklist & timeline · ${event.name}`);
  return (
    <PageHeader
      eyebrow={event.name}
      title="Checklist & timeline"
      description="Every task from now until the big day, grouped by months before the event."
    />
  );
}

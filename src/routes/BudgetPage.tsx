import { PageHeader } from '@/components/ui/headings';
import { useCurrentEvent } from '@/features/events/hooks/useCurrentEvent';
import { useDocumentTitle } from '@/lib/hooks/useDocumentTitle';

/** Budget for the current event. */
export default function BudgetPage() {
  const event = useCurrentEvent();
  useDocumentTitle(`Budget · ${event.name}`);
  return (
    <PageHeader
      eyebrow={event.name}
      title="Budget"
      description="Track estimated against actual spend across every category."
    />
  );
}

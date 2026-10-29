import { AIPlanWidget } from '@/features/dashboard/components/AIPlanWidget';
import { BudgetByCategoryWidget } from '@/features/dashboard/components/BudgetByCategoryWidget';
import { DashboardStats } from '@/features/dashboard/components/DashboardStats';
import { EventHero } from '@/features/dashboard/components/EventHero';
import { MiniTimelineWidget } from '@/features/dashboard/components/MiniTimelineWidget';
import { UpcomingTasksWidget } from '@/features/dashboard/components/UpcomingTasksWidget';
import { useDashboardHydrated } from '@/features/dashboard/hooks/useDashboardHydrated';
import { useCurrentEvent } from '@/features/events/hooks/useCurrentEvent';
import { useDocumentTitle } from '@/lib/hooks/useDocumentTitle';

/** `/events/:eventId`: the event overview. */
export default function DashboardPage() {
  const event = useCurrentEvent();
  const isLoading = !useDashboardHydrated();
  useDocumentTitle(event.name);

  return (
    <div className="space-y-6">
      <EventHero event={event} />
      <DashboardStats event={event} isLoading={isLoading} />
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        <UpcomingTasksWidget event={event} isLoading={isLoading} />
        <AIPlanWidget event={event} isLoading={isLoading} />
      </div>
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]">
        <MiniTimelineWidget event={event} isLoading={isLoading} />
        <BudgetByCategoryWidget event={event} isLoading={isLoading} />
      </div>
    </div>
  );
}

import { Download, UserPlus, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/ui/headings';
import { EmptyState } from '@/components/ui/states';
import { useCurrentEvent } from '@/features/events/hooks/useCurrentEvent';
import { GuestFormDialog } from '@/features/guests/components/GuestFormDialog';
import { GuestListSection } from '@/features/guests/components/GuestListSection';
import { GuestStatsPanel } from '@/features/guests/components/GuestStatsPanel';
import { useGuestStats } from '@/features/guests/hooks/useGuestStats';
import { CSV_MIME_TYPE, guestsToCsv } from '@/features/guests/lib/guestCsv';
import { DEFAULT_GUEST_FILTERS, filterAndSortGuests } from '@/features/guests/lib/guestFilters';
import { downloadTextFile, toFileSlug } from '@/lib/download';
import { useDocumentTitle } from '@/lib/hooks/useDocumentTitle';
import { useListFilters } from '@/lib/hooks/useListFilters';

const addGuestButton = (label: string) => (
  <Button>
    <UserPlus aria-hidden="true" />
    {label}
  </Button>
);

/** Guest list for the current event: RSVPs, dietary needs, bulk updates and CSV export. */
export default function GuestsPage() {
  const event = useCurrentEvent();
  const { guests, stats } = useGuestStats(event.id);
  const listFilters = useListFilters(guests, DEFAULT_GUEST_FILTERS, filterAndSortGuests);
  useDocumentTitle(`Guests · ${event.name}`);

  // Exports what the filters show, across every page.
  const exportCsv = () => {
    downloadTextFile(`${toFileSlug(event.name)}-guests.csv`, guestsToCsv(listFilters.results), CSV_MIME_TYPE);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow={event.name}
        title="Guests"
        description="RSVPs, dietary needs and plus-ones at a glance."
        actions={
          <>
            <Button variant="secondary" onClick={exportCsv} disabled={listFilters.results.length === 0}>
              <Download aria-hidden="true" />
              Export CSV
            </Button>
            <GuestFormDialog eventId={event.id} trigger={addGuestButton('Add guest')} />
          </>
        }
      />
      <GuestStatsPanel stats={stats} />
      {guests.length === 0 ? (
        <EmptyState
          icon={Users}
          title="Your guest list is empty"
          description="Add everyone you want to keep in the loop for this celebration."
          action={<GuestFormDialog eventId={event.id} trigger={addGuestButton('Add your first guest')} />}
        />
      ) : (
        <GuestListSection {...listFilters} />
      )}
    </div>
  );
}

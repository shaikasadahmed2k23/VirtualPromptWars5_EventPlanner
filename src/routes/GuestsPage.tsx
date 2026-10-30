import { Download, UserPlus, Users } from 'lucide-react';
import { useCallback } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/ui/headings';
import { Pagination } from '@/components/ui/pagination';
import { EmptyState } from '@/components/ui/states';
import { useCurrentEvent } from '@/features/events/hooks/useCurrentEvent';
import { GuestBulkActions } from '@/features/guests/components/GuestBulkActions';
import { GuestFilters } from '@/features/guests/components/GuestFilters';
import { GuestFormDialog } from '@/features/guests/components/GuestFormDialog';
import { GuestRow } from '@/features/guests/components/GuestRow';
import { GuestStatsPanel } from '@/features/guests/components/GuestStatsPanel';
import { useGuestStats } from '@/features/guests/hooks/useGuestStats';
import { CSV_MIME_TYPE, guestsToCsv } from '@/features/guests/lib/guestCsv';
import { DEFAULT_GUEST_FILTERS, filterAndSortGuests } from '@/features/guests/lib/guestFilters';
import { useGuestStore } from '@/features/guests/store/useGuestStore';
import { PAGE_SIZE } from '@/lib/constants';
import { downloadTextFile, toFileSlug } from '@/lib/download';
import { pluralize } from '@/lib/format';
import { useDocumentTitle } from '@/lib/hooks/useDocumentTitle';
import { RSVP_LABELS } from '@/lib/labels';
import { useListFilters } from '@/lib/hooks/useListFilters';
import { usePagination } from '@/lib/hooks/usePagination';
import { useSelection } from '@/lib/hooks/useSelection';
import { notifyWithUndo } from '@/lib/undoToast';
import type { Guest, RsvpStatus } from '@/types';

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
  const deleteGuest = useGuestStore((state) => state.deleteGuest);
  const updateGuests = useGuestStore((state) => state.updateGuests);
  const { filters, setFilter, results, resultsKey } = useListFilters(
    guests,
    DEFAULT_GUEST_FILTERS,
    filterAndSortGuests,
  );
  const { pageItems, page, pageCount, setPage } = usePagination(results, PAGE_SIZE.guests, resultsKey);
  const selection = useSelection(`${resultsKey}:${String(page)}`);
  useDocumentTitle(`Guests · ${event.name}`);

  const visibleIds = pageItems.map((guest) => guest.id);
  const allVisibleSelected = visibleIds.length > 0 && visibleIds.every((id) => selection.selected.has(id));

  const onDelete = useCallback(
    (guest: Guest) => {
      notifyWithUndo(`Removed “${guest.name}”`, deleteGuest(guest.id));
    },
    [deleteGuest],
  );

  const applyBulkRsvp = (rsvp: RsvpStatus) => {
    const count = selection.selected.size;
    updateGuests(selection.selected, { rsvp });
    selection.clear();
    toast.success(`${pluralize(count, 'guest')} marked ${RSVP_LABELS[rsvp].toLowerCase()}`);
  };

  const exportCsv = () => {
    downloadTextFile(`${toFileSlug(event.name)}-guests.csv`, guestsToCsv(results), CSV_MIME_TYPE);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow={event.name}
        title="Guests"
        description="RSVPs, dietary needs and plus-ones at a glance."
        actions={
          <>
            <Button variant="secondary" onClick={exportCsv} disabled={results.length === 0}>
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
        <>
          <GuestFilters filters={filters} setFilter={setFilter} />
          <GuestBulkActions
            selectedCount={selection.selected.size}
            visibleCount={visibleIds.length}
            allVisibleSelected={allVisibleSelected}
            onSelectAllVisible={(checked) => {
              selection.setMany(visibleIds, checked);
            }}
            onApplyRsvp={applyBulkRsvp}
          />
          {pageItems.length > 0 ? (
            <ul className="space-y-3" aria-label="Guest list">
              {pageItems.map((guest) => (
                <GuestRow
                  key={guest.id}
                  guest={guest}
                  selected={selection.selected.has(guest.id)}
                  onSelectedChange={selection.toggle}
                  onDelete={onDelete}
                />
              ))}
            </ul>
          ) : (
            <EmptyState
              icon={Users}
              title="No matching guests"
              description="Try changing your filters or add a new guest."
            />
          )}
          <Pagination label="Guest list pages" page={page} pageCount={pageCount} onPageChange={setPage} />
        </>
      )}
    </div>
  );
}

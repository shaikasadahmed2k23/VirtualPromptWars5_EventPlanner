import { Users } from 'lucide-react';
import { useCallback } from 'react';
import { toast } from 'sonner';
import { Pagination } from '@/components/ui/pagination';
import { EmptyState } from '@/components/ui/states';
import { PAGE_SIZE } from '@/lib/constants';
import { pluralize } from '@/lib/format';
import type { ListFilters } from '@/lib/hooks/useListFilters';
import { usePagination } from '@/lib/hooks/usePagination';
import { type Selection, useSelection } from '@/lib/hooks/useSelection';
import { RSVP_LABELS } from '@/lib/labels';
import { notifyWithUndo } from '@/lib/undoToast';
import type { Guest, RsvpStatus } from '@/types';
import type { GuestFilterOptions } from '../lib/guestFilters';
import { useGuestStore } from '../store/useGuestStore';
import { GuestBulkActions } from './GuestBulkActions';
import { GuestFilters } from './GuestFilters';
import { GuestRow } from './GuestRow';

type GuestListFilters = Pick<ListFilters<Guest, GuestFilterOptions>, 'bind' | 'results' | 'resultsKey'>;

interface GuestListProps {
  guests: readonly Guest[];
  selection: Selection;
}

/** The current page of guests, or a hint when the filters match nobody. */
function GuestList({ guests, selection }: GuestListProps) {
  const deleteGuest = useGuestStore((state) => state.deleteGuest);
  const onDelete = useCallback(
    (guest: Guest) => {
      notifyWithUndo(`Removed “${guest.name}”`, deleteGuest(guest.id));
    },
    [deleteGuest],
  );

  if (guests.length === 0) {
    return (
      <EmptyState icon={Users} title="No matching guests" description="Try changing your filters or add a new guest." />
    );
  }
  return (
    <ul className="space-y-3" aria-label="Guest list">
      {guests.map((guest) => (
        <GuestRow
          key={guest.id}
          guest={guest}
          selected={selection.selected.has(guest.id)}
          onSelectedChange={selection.toggle}
          onDelete={onDelete}
        />
      ))}
    </ul>
  );
}

/**
 * Filters, bulk RSVP, the paginated guest list and its pager. Selection is
 * scoped to the visible page and resets when the filters or page change.
 */
export function GuestListSection({ bind, results, resultsKey }: GuestListFilters) {
  const updateGuests = useGuestStore((state) => state.updateGuests);
  const { pageItems, page, pageCount, setPage } = usePagination(results, PAGE_SIZE.guests, resultsKey);
  const selection = useSelection(`${resultsKey}:${String(page)}`);
  const visibleIds = pageItems.map((guest) => guest.id);

  const applyBulkRsvp = (rsvp: RsvpStatus) => {
    const count = selection.selected.size;
    updateGuests(selection.selected, { rsvp });
    selection.clear();
    toast.success(`${pluralize(count, 'guest')} marked ${RSVP_LABELS[rsvp].toLowerCase()}`);
  };

  return (
    <>
      <GuestFilters bind={bind} />
      <GuestBulkActions
        selectedCount={selection.selected.size}
        visibleCount={visibleIds.length}
        allVisibleSelected={visibleIds.length > 0 && visibleIds.every((id) => selection.selected.has(id))}
        onSelectAllVisible={(checked) => {
          selection.setMany(visibleIds, checked);
        }}
        onApplyRsvp={applyBulkRsvp}
      />
      <GuestList guests={pageItems} selection={selection} />
      <Pagination label="Guest list pages" page={page} pageCount={pageCount} onPageChange={setPage} />
    </>
  );
}

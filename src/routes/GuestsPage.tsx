import { ChevronLeft, ChevronRight, Download, UserPlus, Users } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { EmptyState } from '@/components/ui/states';
import { PageHeader } from '@/components/ui/headings';
import { useCurrentEvent } from '@/features/events/hooks/useCurrentEvent';
import { GuestFilters } from '@/features/guests/components/GuestFilters';
import { GuestFormDialog } from '@/features/guests/components/GuestFormDialog';
import { GuestRow } from '@/features/guests/components/GuestRow';
import { GuestStatsPanel } from '@/features/guests/components/GuestStatsPanel';
import { useGuestFilters } from '@/features/guests/hooks/useGuestFilters';
import { useGuestStats } from '@/features/guests/hooks/useGuestStats';
import { guestsToCsv } from '@/features/guests/lib/guestCsv';
import { useGuestStore } from '@/features/guests/store/useGuestStore';
import { useDocumentTitle } from '@/lib/hooks/useDocumentTitle';

const PAGE_SIZE = 50;

/** Guests for the current event. */
export default function GuestsPage() {
  const event = useCurrentEvent();
  const { guests, stats } = useGuestStats(event.id);
  const filters = useGuestFilters(guests);
  const addGuest = useGuestStore((state) => state.addGuest);
  const deleteGuest = useGuestStore((state) => state.deleteGuest);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [page, setPage] = useState(1);
  useDocumentTitle(`Guests · ${event.name}`);

  const pageCount = Math.max(1, Math.ceil(filters.filteredGuests.length / PAGE_SIZE));
  const visibleGuests = useMemo(
    () => filters.filteredGuests.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [filters.filteredGuests, page],
  );
  const visibleIds = visibleGuests.map((guest) => guest.id);
  const allVisibleSelected = visibleIds.length > 0 && visibleIds.every((id) => selectedIds.has(id));

  useEffect(() => {
    setPage(1);
    setSelectedIds(new Set());
  }, [filters.dietary, filters.group, filters.rsvp, filters.searchInput, filters.sort]);

  useEffect(() => {
    if (page > pageCount) setPage(pageCount);
  }, [page, pageCount]);

  const removeGuest = (guestId: string, name: string) => {
    const guest = guests.find((item) => item.id === guestId);
    if (!guest) return;
    deleteGuest(guestId);
    const { id: _id, eventId: _eventId, ...input } = guest;
    toast.success(`Removed “${name}”`, {
      action: { label: 'Undo', onClick: () => addGuest(event.id, input) },
    });
  };

  const toggleVisible = (checked: boolean) => {
    setSelectedIds((current) => {
      const next = new Set(current);
      visibleIds.forEach((id) => (checked ? next.add(id) : next.delete(id)));
      return next;
    });
  };

  const exportCsv = () => {
    const blob = new Blob([guestsToCsv(filters.filteredGuests)], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${event.name.replace(/[^a-z0-9]+/gi, '-').toLowerCase()}-guests.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const setBulkRsvp = (value: string) => {
    if (!value) return;
    const updateGuest = useGuestStore.getState().updateGuest;
    selectedIds.forEach((id) => updateGuest(id, { rsvp: value as 'attending' | 'pending' | 'declined' }));
    setSelectedIds(new Set());
  };

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow={event.name}
        title="Guests"
        description="RSVPs, dietary needs and plus-ones at a glance."
        actions={
          <>
            <Button variant="secondary" onClick={exportCsv}><Download aria-hidden="true" />Export CSV</Button>
            <GuestFormDialog eventId={event.id} trigger={<Button><UserPlus aria-hidden="true" />Add guest</Button>} />
          </>
        }
      />
      <GuestStatsPanel stats={stats} />
      {guests.length === 0 ? (
        <EmptyState
          icon={Users}
          title="Your guest list is empty"
          description="Add everyone you want to keep in the loop for this celebration."
          action={<GuestFormDialog eventId={event.id} trigger={<Button><UserPlus aria-hidden="true" />Add your first guest</Button>} />}
        />
      ) : (
        <>
          <GuestFilters {...filters} />
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-line bg-surface p-4">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Checkbox checked={allVisibleSelected} onCheckedChange={(checked) => toggleVisible(checked === true)} aria-label="Select all visible guests" />
              Select all visible
            </div>
            <div className="flex items-center gap-2">
              <label className="text-sm text-muted" htmlFor="bulk-rsvp">Set RSVP for selected</label>
              <select id="bulk-rsvp" aria-label="Bulk RSVP" defaultValue="" className="h-10 rounded-xl border border-line bg-surface px-3 text-sm" onChange={(event) => setBulkRsvp(event.target.value)}>
                <option value="">Choose…</option><option value="attending">Attending</option><option value="pending">Pending</option><option value="declined">Declined</option>
              </select>
            </div>
          </div>
          {visibleGuests.length > 0 ? (
            <ul className="space-y-3">
              {visibleGuests.map((guest) => (
                <GuestRow
                  key={guest.id}
                  guest={guest}
                  selected={selectedIds.has(guest.id)}
                  onSelectedChange={(checked) => setSelectedIds((current) => {
                    const next = new Set(current);
                    if (checked) next.add(guest.id); else next.delete(guest.id);
                    return next;
                  })}
                  onDelete={() => removeGuest(guest.id, guest.name)}
                />
              ))}
            </ul>
          ) : (
            <EmptyState icon={Users} title="No matching guests" description="Try changing your filters or add a new guest." />
          )}
          {pageCount > 1 ? (
            <nav className="flex items-center justify-center gap-3" aria-label="Guest list pagination">
              <Button variant="secondary" size="icon-sm" aria-label="Previous page" disabled={page === 1} onClick={() => setPage((current) => current - 1)}><ChevronLeft aria-hidden="true" /></Button>
              <span className="text-sm text-muted">Page {page} of {pageCount}</span>
              <Button variant="secondary" size="icon-sm" aria-label="Next page" disabled={page === pageCount} onClick={() => setPage((current) => current + 1)}><ChevronRight aria-hidden="true" /></Button>
            </nav>
          ) : null}
        </>
      )}
    </div>
  );
}

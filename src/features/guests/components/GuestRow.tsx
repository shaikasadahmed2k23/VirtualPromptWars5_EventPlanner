import { Pencil } from 'lucide-react';
import { memo } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { ConfirmDeleteButton } from '@/components/ui/confirm-dialog';
import { GUEST_DIETARY_LABELS, GUEST_GROUP_LABELS } from '@/lib/labels';
import type { Guest, Id } from '@/types';
import { useGuestStore } from '../store/useGuestStore';
import { GuestFormDialog } from './GuestFormDialog';
import { RsvpSelect } from './RsvpSelect';

interface GuestRowProps {
  guest: Guest;
  selected: boolean;
  onSelectedChange: (guestId: Id, selected: boolean) => void;
  onDelete: (guest: Guest) => void;
}

/** Name, group/plus-one/dietary badges, contact line and notes. */
function GuestDetails({ guest }: { guest: Guest }) {
  return (
    <div className="min-w-0 flex-1">
      <div className="flex flex-wrap items-center gap-2">
        <h3 className="font-medium">{guest.name}</h3>
        <Badge tone="neutral">{GUEST_GROUP_LABELS[guest.group]}</Badge>
        {guest.plusOnes > 0 ? (
          <Badge tone="lavender">
            +{guest.plusOnes}
            <span className="sr-only"> plus-ones</span>
          </Badge>
        ) : null}
        {guest.dietary !== 'none' ? <Badge tone="gold">{GUEST_DIETARY_LABELS[guest.dietary]}</Badge> : null}
      </div>
      <p className="mt-1 break-words text-sm text-muted">{guest.email || guest.phone || 'No contact details'}</p>
      {guest.notes ? <p className="mt-2 text-sm text-muted">{guest.notes}</p> : null}
    </div>
  );
}

/** Guest row with selection, inline RSVP editing, edit and delete. Memoised for long lists. */
export const GuestRow = memo(function GuestRow({ guest, selected, onSelectedChange, onDelete }: GuestRowProps) {
  const updateGuest = useGuestStore((state) => state.updateGuest);
  return (
    <li className="flex flex-wrap items-start gap-3 rounded-2xl border border-line bg-surface p-4 sm:flex-nowrap">
      <Checkbox
        checked={selected}
        onCheckedChange={(checked) => {
          onSelectedChange(guest.id, checked === true);
        }}
        aria-label={`Select ${guest.name}`}
        className="mt-1"
      />
      <GuestDetails guest={guest} />
      <div className="flex shrink-0 items-center gap-1">
        <RsvpSelect
          aria-label={`RSVP for ${guest.name}`}
          className="h-9 min-w-28 px-2 text-xs"
          value={guest.rsvp}
          onChange={(rsvp) => {
            updateGuest(guest.id, { rsvp });
          }}
        />
        <GuestFormDialog
          guest={guest}
          eventId={guest.eventId}
          trigger={
            <Button variant="ghost" size="icon-sm" aria-label={`Edit ${guest.name}`}>
              <Pencil aria-hidden="true" />
            </Button>
          }
        />
        <ConfirmDeleteButton
          itemName={guest.name}
          title="Delete guest?"
          description={`Remove “${guest.name}” from this guest list?`}
          confirmLabel="Delete guest"
          onConfirm={() => {
            onDelete(guest);
          }}
        />
      </div>
    </li>
  );
});

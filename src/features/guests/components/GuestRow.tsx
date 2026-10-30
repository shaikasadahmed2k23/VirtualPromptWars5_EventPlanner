import { Pencil, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { Select } from '@/components/ui/input';
import { GUEST_DIETARY_LABELS, GUEST_GROUP_LABELS, RSVP_LABELS } from '@/lib/labels';
import { RSVP_STATUSES, type Guest, type GuestInput } from '@/types';
import { GuestFormDialog } from './GuestFormDialog';
import { useGuestStore } from '../store/useGuestStore';

interface GuestRowProps {
  guest: Guest;
  selected: boolean;
  onSelectedChange: (selected: boolean) => void;
  onDelete: () => void;
}

/** Guest list row with selection, inline RSVP editing and CRUD actions. */
export function GuestRow({ guest, selected, onSelectedChange, onDelete }: GuestRowProps) {
  const updateGuest = useGuestStore((state) => state.updateGuest);
  return (
    <li className="flex items-start gap-3 rounded-2xl border border-line bg-surface p-4">
      <Checkbox checked={selected} onCheckedChange={onSelectedChange} aria-label={`Select ${guest.name}`} className="mt-1" />
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="font-medium">{guest.name}</h3>
          <Badge tone="neutral">{GUEST_GROUP_LABELS[guest.group]}</Badge>
          {guest.plusOnes > 0 ? <Badge tone="lavender">+{guest.plusOnes}</Badge> : null}
          {guest.dietary !== 'none' ? <Badge tone="gold">{GUEST_DIETARY_LABELS[guest.dietary]}</Badge> : null}
        </div>
        <p className="mt-1 text-sm text-muted">{guest.email || guest.phone || 'No contact details'}</p>
        {guest.notes ? <p className="mt-2 text-sm text-muted">{guest.notes}</p> : null}
      </div>
      <div className="flex shrink-0 items-center gap-1">
        <label className="sr-only" htmlFor={`rsvp-${guest.id}`}>RSVP for {guest.name}</label>
        <Select id={`rsvp-${guest.id}`} aria-label={`RSVP for ${guest.name}`} className="h-9 min-w-28 px-2 text-xs" value={guest.rsvp} onChange={(event) => updateGuest(guest.id, { rsvp: event.target.value as GuestInput['rsvp'] })}>
          {RSVP_STATUSES.map((status) => <option key={status} value={status}>{RSVP_LABELS[status]}</option>)}
        </Select>
        <GuestFormDialog guest={guest} eventId={guest.eventId} trigger={<Button variant="ghost" size="icon-sm" aria-label={`Edit ${guest.name}`}><Pencil aria-hidden="true" /></Button>} />
        <ConfirmDialog
          trigger={<Button variant="ghost" size="icon-sm" aria-label={`Delete ${guest.name}`}><Trash2 aria-hidden="true" /></Button>}
          title="Delete guest?"
          description={`Remove “${guest.name}” from this guest list?`}
          confirmLabel="Delete guest"
          destructive
          onConfirm={onDelete}
        />
      </div>
    </li>
  );
}

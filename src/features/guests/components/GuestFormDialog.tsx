import { useState, type ReactElement } from 'react';
import { GUEST_DIETARY, GUEST_GROUPS, RSVP_STATUSES } from '@/types';
import type { Guest, GuestInput } from '@/types';
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Field } from '@/components/ui/field';
import { Input, Select, Textarea } from '@/components/ui/input';
import { GUEST_DIETARY_LABELS, GUEST_GROUP_LABELS, RSVP_LABELS } from '@/lib/labels';
import { guestInputSchema } from '../lib/guestValidation';
import { useGuestStore } from '../store/useGuestStore';

const EMPTY_GUEST: GuestInput = {
  name: '',
  email: '',
  phone: '',
  rsvp: 'pending',
  dietary: 'none',
  plusOnes: 0,
  group: 'friends',
  notes: '',
};

interface GuestFormDialogProps {
  eventId: string;
  guest?: Guest;
  trigger: ReactElement;
}

/** Accessible dialog for creating or editing a validated guest. */
export function GuestFormDialog({ eventId, guest, trigger }: GuestFormDialogProps) {
  const addGuest = useGuestStore((state) => state.addGuest);
  const updateGuest = useGuestStore((state) => state.updateGuest);
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<GuestInput>(guest ? { ...guest, notes: guest.notes ?? '' } : EMPTY_GUEST);
  const [error, setError] = useState<string>();
  const update = <K extends keyof GuestInput>(key: K, value: GuestInput[K]) =>
    setDraft((current) => ({ ...current, [key]: value }));

  const submit = () => {
    const result = guestInputSchema.safeParse(draft);
    if (!result.success) {
      setError(result.error.issues[0]?.message ?? 'Check the guest details.');
      return;
    }
    if (guest) updateGuest(guest.id, result.data);
    else addGuest(eventId, result.data);
    setError(undefined);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={(nextOpen) => {
      setOpen(nextOpen);
      if (nextOpen) setDraft(guest ? { ...guest, notes: guest.notes ?? '' } : EMPTY_GUEST);
    }}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent title={guest ? 'Edit guest' : 'Add guest'} description="Keep contact and RSVP details ready for your planning team.">
        <div className="grid gap-4">
          <Field label="Name" required error={error}>
            {(props) => <Input {...props} value={draft.name} onChange={(event) => update('name', event.target.value)} />}
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Email">
              {(props) => <Input {...props} type="email" value={draft.email} onChange={(event) => update('email', event.target.value)} />}
            </Field>
            <Field label="Phone">
              {(props) => <Input {...props} type="tel" value={draft.phone} onChange={(event) => update('phone', event.target.value)} />}
            </Field>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Side / group" required>
              {(props) => <Select {...props} value={draft.group} onChange={(event) => update('group', event.target.value as GuestInput['group'])}>
                {GUEST_GROUPS.map((group) => <option key={group} value={group}>{GUEST_GROUP_LABELS[group]}</option>)}
              </Select>}
            </Field>
            <Field label="RSVP" required>
              {(props) => <Select {...props} value={draft.rsvp} onChange={(event) => update('rsvp', event.target.value as GuestInput['rsvp'])}>
                {RSVP_STATUSES.map((status) => <option key={status} value={status}>{RSVP_LABELS[status]}</option>)}
              </Select>}
            </Field>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Plus-ones">
              {(props) => <Input {...props} type="number" min={0} value={draft.plusOnes} onChange={(event) => update('plusOnes', Number(event.target.value))} />}
            </Field>
            <Field label="Dietary preference">
              {(props) => <Select {...props} value={draft.dietary} onChange={(event) => update('dietary', event.target.value as GuestInput['dietary'])}>
                {GUEST_DIETARY.map((dietary) => <option key={dietary} value={dietary}>{GUEST_DIETARY_LABELS[dietary]}</option>)}
              </Select>}
            </Field>
          </div>
          <Field label="Notes">
            {(props) => <Textarea {...props} value={draft.notes ?? ''} onChange={(event) => update('notes', event.target.value)} />}
          </Field>
          <div className="flex justify-end gap-3">
            <DialogClose asChild><Button variant="secondary">Cancel</Button></DialogClose>
            <Button onClick={submit}>{guest ? 'Save guest' : 'Add guest'}</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

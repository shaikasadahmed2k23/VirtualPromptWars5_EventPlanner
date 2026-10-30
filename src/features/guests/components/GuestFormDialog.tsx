import type { ReactElement } from 'react';
import { Field } from '@/components/ui/field';
import { FormDialog } from '@/components/ui/form-dialog';
import { Input, Select, Textarea } from '@/components/ui/input';
import { useDialogForm } from '@/lib/hooks/useDialogForm';
import { GUEST_DIETARY_LABELS, GUEST_GROUP_LABELS, RSVP_LABELS } from '@/lib/labels';
import { GUEST_DIETARY, GUEST_GROUPS, RSVP_STATUSES, type Guest, type GuestInput, type Id } from '@/types';
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

function toGuestInput({ id: _id, eventId: _eventId, ...input }: Guest): GuestInput {
  return { ...input, notes: input.notes ?? '' };
}

interface GuestFormDialogProps {
  eventId: Id;
  /** Guest to edit; omit to add a new one. */
  guest?: Guest;
  trigger: ReactElement;
}

/** Dialog for adding or editing a validated guest. */
export function GuestFormDialog({ eventId, guest, trigger }: GuestFormDialogProps) {
  const addGuest = useGuestStore((state) => state.addGuest);
  const updateGuest = useGuestStore((state) => state.updateGuest);
  const { form, open, onOpenChange, submitWith } = useDialogForm(guestInputSchema, () =>
    guest ? toGuestInput(guest) : EMPTY_GUEST,
  );
  const {
    register,
    formState: { errors },
  } = form;

  return (
    <FormDialog
      trigger={trigger}
      title={guest ? 'Edit guest' : 'Add guest'}
      description="Keep contact and RSVP details ready for your planning team."
      submitLabel={guest ? 'Save guest' : 'Add guest'}
      open={open}
      onOpenChange={onOpenChange}
      onSubmit={submitWith((values) => {
        if (guest) updateGuest(guest.id, values);
        else addGuest(eventId, values);
      })}
    >
      <Field label="Name" required error={errors.name?.message}>
        {(props) => <Input {...props} autoComplete="off" {...register('name')} />}
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Email" error={errors.email?.message}>
          {(props) => <Input {...props} type="email" autoComplete="off" {...register('email')} />}
        </Field>
        <Field label="Phone" error={errors.phone?.message}>
          {(props) => <Input {...props} type="tel" autoComplete="off" {...register('phone')} />}
        </Field>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Side / group" required>
          {(props) => (
            <Select {...props} {...register('group')}>
              {GUEST_GROUPS.map((group) => (
                <option key={group} value={group}>
                  {GUEST_GROUP_LABELS[group]}
                </option>
              ))}
            </Select>
          )}
        </Field>
        <Field label="RSVP" required>
          {(props) => (
            <Select {...props} {...register('rsvp')}>
              {RSVP_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {RSVP_LABELS[status]}
                </option>
              ))}
            </Select>
          )}
        </Field>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Plus-ones" error={errors.plusOnes?.message}>
          {(props) => <Input {...props} type="number" min={0} {...register('plusOnes', { valueAsNumber: true })} />}
        </Field>
        <Field label="Dietary preference">
          {(props) => (
            <Select {...props} {...register('dietary')}>
              {GUEST_DIETARY.map((dietary) => (
                <option key={dietary} value={dietary}>
                  {GUEST_DIETARY_LABELS[dietary]}
                </option>
              ))}
            </Select>
          )}
        </Field>
      </div>
      <Field label="Notes" error={errors.notes?.message}>
        {(props) => <Textarea {...props} {...register('notes')} />}
      </Field>
    </FormDialog>
  );
}

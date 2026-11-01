import type { ReactElement } from 'react';
import type { FieldErrors, UseFormRegister } from 'react-hook-form';
import { Field } from '@/components/ui/field';
import { FormDialog } from '@/components/ui/form-dialog';
import { Input, LabelledOptions, Select, Textarea } from '@/components/ui/input';
import { useDialogForm } from '@/lib/hooks/useDialogForm';
import { GUEST_DIETARY_LABELS, GUEST_GROUP_LABELS, RSVP_LABELS } from '@/lib/labels';
import { type Guest, GUEST_DIETARY, GUEST_GROUPS, type GuestInput, type Id, RSVP_STATUSES } from '@/types';
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

interface GuestFieldsProps {
  register: UseFormRegister<GuestInput>;
  errors: FieldErrors<GuestInput>;
}

/** Every guest field, each labelled and linked to its validation message. */
function GuestFields({ register, errors }: GuestFieldsProps) {
  return (
    <>
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
              <LabelledOptions values={GUEST_GROUPS} labels={GUEST_GROUP_LABELS} />
            </Select>
          )}
        </Field>
        <Field label="RSVP" required>
          {(props) => (
            <Select {...props} {...register('rsvp')}>
              <LabelledOptions values={RSVP_STATUSES} labels={RSVP_LABELS} />
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
              <LabelledOptions values={GUEST_DIETARY} labels={GUEST_DIETARY_LABELS} />
            </Select>
          )}
        </Field>
      </div>
      <Field label="Notes" error={errors.notes?.message}>
        {(props) => <Textarea {...props} {...register('notes')} />}
      </Field>
    </>
  );
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
      <GuestFields register={form.register} errors={form.formState.errors} />
    </FormDialog>
  );
}

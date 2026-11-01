import type { ReactElement } from 'react';
import { toast } from 'sonner';
import { Field } from '@/components/ui/field';
import { FormDialog } from '@/components/ui/form-dialog';
import { Input, Textarea } from '@/components/ui/input';
import { useDialogForm } from '@/lib/hooks/useDialogForm';
import type { CelebrationEvent, Vendor } from '@/types';
import { type QuoteRequestInput, quoteRequestSchema } from '../lib/vendorValidation';
import { useVendorStore } from '../store/useVendorStore';

interface QuoteDialogProps {
  vendor: Vendor;
  /** The event being planned; pre-fills the date and guest count. */
  event: CelebrationEvent | undefined;
  trigger: ReactElement;
}

/** User-facing copy; requests are demo-only and never leave the device. */
const QUOTE_COPY = {
  notice: 'Demo only. The request is saved on this device; nothing is sent to the vendor.',
  saved: 'Quote request saved on this device',
  savedDetail: 'Demo only. Nothing was sent.',
} as const;

/** Blank request, pre-filled with the planning event's date and guest count when there is one. */
const quoteDefaults = (event: CelebrationEvent | undefined): QuoteRequestInput => ({
  name: '',
  email: '',
  eventDate: event?.date ?? '',
  guestCount: event?.guestCount ?? 0,
  message: '',
});

/** Request-a-quote form. Demo only: the request is stored on this device and never sent. */
export function QuoteDialog({ vendor, event, trigger }: QuoteDialogProps) {
  const submitQuoteRequest = useVendorStore((state) => state.submitQuoteRequest);
  const { form, open, onOpenChange, submitWith } = useDialogForm(quoteRequestSchema, () => quoteDefaults(event));
  const {
    register,
    formState: { errors },
  } = form;

  return (
    <FormDialog
      trigger={trigger}
      title={`Request a quote from ${vendor.name}`}
      description={QUOTE_COPY.notice}
      submitLabel="Save request"
      open={open}
      onOpenChange={onOpenChange}
      onSubmit={submitWith((values) => {
        submitQuoteRequest({ ...values, vendorId: vendor.id, eventId: event?.id ?? null });
        toast.success(QUOTE_COPY.saved, { description: QUOTE_COPY.savedDetail });
      })}
    >
      <Field label="Your name" required error={errors.name?.message}>
        {(props) => <Input {...props} autoComplete="name" {...register('name')} />}
      </Field>
      <Field label="Email" required error={errors.email?.message}>
        {(props) => <Input {...props} type="email" autoComplete="email" {...register('email')} />}
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Event date" required error={errors.eventDate?.message}>
          {(props) => <Input {...props} type="date" {...register('eventDate')} />}
        </Field>
        <Field label="Guests" required error={errors.guestCount?.message}>
          {(props) => <Input {...props} type="number" min={1} {...register('guestCount', { valueAsNumber: true })} />}
        </Field>
      </div>
      <Field label="Message" required error={errors.message?.message}>
        {(props) => <Textarea {...props} {...register('message')} />}
      </Field>
    </FormDialog>
  );
}

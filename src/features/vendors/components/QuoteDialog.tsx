import { useState, type ReactNode } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Field } from '@/components/ui/field';
import { Input, Textarea } from '@/components/ui/input';
import { useVendorStore } from '../store/useVendorStore';
import { quoteRequestSchema, type QuoteRequestInput } from '../lib/vendorValidation';
import type { Vendor } from '@/types';

const INITIAL: QuoteRequestInput = { name: '', email: '', eventDate: '', message: '' };

/** Local-only request-a-quote dialog for a vendor. */
export function QuoteDialog({ vendor, eventId, children }: { vendor: Vendor; eventId: string | null; children: ReactNode }) {
  const submit = useVendorStore((state) => state.submitQuoteRequest);
  const [open, setOpen] = useState(false);
  const [values, setValues] = useState(INITIAL);
  const [errors, setErrors] = useState<Partial<Record<keyof QuoteRequestInput, string>>>({});
  const set = (key: keyof QuoteRequestInput, value: string) => setValues((current) => ({ ...current, [key]: value }));
  const handleSubmit = () => {
    const result = quoteRequestSchema.safeParse(values);
    if (!result.success) {
      const nextErrors: Partial<Record<keyof QuoteRequestInput, string>> = {};
      result.error.issues.forEach((issue) => {
        const key = issue.path[0];
        if (typeof key === 'string' && key in INITIAL) nextErrors[key as keyof QuoteRequestInput] = issue.message;
      });
      setErrors(nextErrors);
      return;
    }
    submit({ ...result.data, vendorId: vendor.id, eventId, guestCount: 0 });
    setOpen(false);
    setValues(INITIAL);
    setErrors({});
    toast.success('Quote request saved locally', { description: 'Demo only — nothing was sent.' });
  };
  return <Dialog open={open} onOpenChange={setOpen}><DialogTrigger asChild>{children}</DialogTrigger><DialogContent title={`Request a quote from ${vendor.name}`} description="Demo only. This request is saved on this device and nothing is sent.">
    <div className="space-y-4">
      <Field label="Your name" required error={errors.name}>{(props) => <Input {...props} value={values.name} onChange={(event) => set('name', event.target.value)} />}</Field>
      <Field label="Email" required error={errors.email}>{(props) => <Input {...props} type="email" value={values.email} onChange={(event) => set('email', event.target.value)} />}</Field>
      <Field label="Event date" required error={errors.eventDate}>{(props) => <Input {...props} type="date" value={values.eventDate} onChange={(event) => set('eventDate', event.target.value)} />}</Field>
      <Field label="Message" required error={errors.message}>{(props) => <Textarea {...props} value={values.message} onChange={(event) => set('message', event.target.value)} />}</Field>
      <Button onClick={handleSubmit}>Save request</Button>
    </div>
  </DialogContent></Dialog>;
}

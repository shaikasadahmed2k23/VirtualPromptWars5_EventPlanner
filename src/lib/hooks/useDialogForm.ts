import { zodResolver } from '@hookform/resolvers/zod';
import { useState, type FormEventHandler } from 'react';
import { useForm, type DefaultValues, type FieldValues, type UseFormReturn } from 'react-hook-form';
import type { ZodType } from 'zod';

export interface DialogForm<T extends FieldValues> {
  form: UseFormReturn<T>;
  open: boolean;
  /** Pass to `FormDialog`; re-reads the defaults every time the dialog opens. */
  onOpenChange: (open: boolean) => void;
  /** Builds the form's submit handler: validates, calls `onValid`, then closes. */
  submitWith: (onValid: (values: T) => void) => FormEventHandler<HTMLFormElement>;
}

/**
 * React Hook Form + Zod state for a dialog form (add/edit guest, task, expense,
 * quote). Same validation behaviour as the wizard: on submit, then live as the
 * user corrects a field. Errors are per field, so each message is announced
 * next to the control it belongs to.
 */
export function useDialogForm<T extends FieldValues>(
  schema: ZodType<T>,
  getDefaults: () => NoInfer<DefaultValues<T>>,
): DialogForm<T> {
  const [open, setOpen] = useState(false);
  const form = useForm<T>({
    resolver: zodResolver(schema),
    defaultValues: getDefaults(),
    mode: 'onSubmit',
    reValidateMode: 'onChange',
  });

  const onOpenChange = (next: boolean) => {
    if (next) form.reset(getDefaults());
    setOpen(next);
  };

  const submitWith = (onValid: (values: T) => void): FormEventHandler<HTMLFormElement> =>
    form.handleSubmit((values) => {
      onValid(values);
      setOpen(false);
    });

  return { form, open, onOpenChange, submitWith };
}

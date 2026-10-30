import type { FormEventHandler, ReactElement, ReactNode } from 'react';
import { Button } from './button';
import { Dialog, DialogClose, DialogContent, DialogTrigger } from './dialog';

interface FormDialogProps {
  /** Element that opens the dialog (usually a `Button`). */
  trigger: ReactElement;
  title: string;
  description?: string;
  submitLabel: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: FormEventHandler<HTMLFormElement>;
  children: ReactNode;
}

/**
 * Modal form with a consistent Cancel / submit footer. A real `<form>` means
 * Enter submits and the submit button is announced as such. Pair it with
 * `useDialogForm`, which owns the open state and Zod validation.
 */
export function FormDialog({
  trigger,
  title,
  description,
  submitLabel,
  open,
  onOpenChange,
  onSubmit,
  children,
}: FormDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent title={title} {...(description ? { description } : {})}>
        <form noValidate onSubmit={onSubmit} className="grid gap-4">
          {children}
          <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit">{submitLabel}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

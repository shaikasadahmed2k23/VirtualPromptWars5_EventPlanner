import * as DialogPrimitive from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

/** Radix dialog parts re-exported unchanged; `DialogContent` below adds the styled, titled panel. */
export const Dialog = DialogPrimitive.Root;
export const DialogTrigger = DialogPrimitive.Trigger;
export const DialogClose = DialogPrimitive.Close;

interface DialogContentProps {
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
}

/**
 * Modal dialog surface. Radix handles focus trapping, `Escape` to close,
 * scroll locking and `aria-labelledby`/`aria-describedby` wiring.
 */
export function DialogContent({ title, description, children, className }: DialogContentProps) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-charcoal/40 backdrop-blur-sm data-[state=open]:animate-fade-up" />
      <DialogPrimitive.Content
        className={cn(
          'fixed inset-x-4 top-1/2 z-50 mx-auto max-h-[90dvh] max-w-lg -translate-y-1/2 overflow-y-auto rounded-3xl border border-line bg-surface p-6 shadow-lift sm:p-8',
          className,
        )}
        {...(description ? {} : { 'aria-describedby': undefined })}
      >
        <div className="mb-5 pr-8">
          <DialogPrimitive.Title className="font-serif text-2xl font-semibold">{title}</DialogPrimitive.Title>
          {description ? (
            <DialogPrimitive.Description className="mt-1 text-sm text-muted">{description}</DialogPrimitive.Description>
          ) : null}
        </div>
        {children}
        <DialogPrimitive.Close
          className="absolute right-4 top-4 rounded-full p-2 text-muted transition-colors hover:bg-ivory-deep hover:text-charcoal"
          aria-label="Close dialog"
        >
          <X className="size-5" aria-hidden="true" />
        </DialogPrimitive.Close>
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
}

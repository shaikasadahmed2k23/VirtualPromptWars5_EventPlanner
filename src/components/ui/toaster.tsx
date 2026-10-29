import { Toaster as SonnerToaster } from 'sonner';

/** App-wide toast host. Sonner renders toasts in an `aria-live` region. */
export function Toaster() {
  return (
    <SonnerToaster
      position="top-center"
      closeButton
      toastOptions={{
        classNames: {
          toast: '!rounded-2xl !border-line !bg-surface !text-charcoal !shadow-lift !font-sans',
          description: '!text-muted',
          actionButton: '!bg-rose-ink !text-white',
        },
      }}
    />
  );
}

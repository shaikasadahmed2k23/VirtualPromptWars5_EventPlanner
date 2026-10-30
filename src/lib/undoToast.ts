import { toast } from 'sonner';

/**
 * Success toast with an "Undo" action. Every reversible change in the app
 * (deletes, AI additions, theme changes) confirms through this one helper.
 */
export function notifyWithUndo(message: string, onUndo: () => void, description?: string): void {
  toast.success(message, {
    ...(description ? { description } : {}),
    action: { label: 'Undo', onClick: onUndo },
  });
}

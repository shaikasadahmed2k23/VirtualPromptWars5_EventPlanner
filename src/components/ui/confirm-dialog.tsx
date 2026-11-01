import { Trash2 } from 'lucide-react';
import { type ReactElement, useState } from 'react';
import { Button } from './button';
import { Dialog, DialogClose, DialogContent, DialogTrigger } from './dialog';

interface ConfirmDialogProps {
  /** Element that opens the dialog (usually a `Button`). */
  trigger: ReactElement;
  title: string;
  description: string;
  confirmLabel: string;
  onConfirm: () => void;
  /** Style the confirm button as destructive. */
  destructive?: boolean;
}

/** Accessible confirmation step for destructive or irreversible actions. */
export function ConfirmDialog({
  trigger,
  title,
  description,
  confirmLabel,
  onConfirm,
  destructive = false,
}: ConfirmDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent title={title} description={description}>
        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <DialogClose asChild>
            <Button variant="secondary">Cancel</Button>
          </DialogClose>
          <Button
            variant={destructive ? 'danger' : 'primary'}
            onClick={() => {
              onConfirm();
              setOpen(false);
            }}
          >
            {confirmLabel}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

interface ConfirmDeleteButtonProps extends Omit<ConfirmDialogProps, 'trigger' | 'destructive'> {
  /** Names the thing being deleted in the button's accessible label, e.g. `Delete Priya`. */
  itemName: string;
}

/** Trash icon button that asks for confirmation before a destructive delete. */
export function ConfirmDeleteButton({ itemName, ...dialog }: ConfirmDeleteButtonProps) {
  return (
    <ConfirmDialog
      destructive
      trigger={
        <Button variant="ghost" size="icon-sm" aria-label={`Delete ${itemName}`}>
          <Trash2 aria-hidden="true" />
        </Button>
      }
      {...dialog}
    />
  );
}

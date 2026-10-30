import { Trash2 } from 'lucide-react';
import { memo, useId, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { Input } from '@/components/ui/input';
import type { BudgetItem, BudgetItemInput } from '@/types';
import { validateBudgetItem } from '../lib/budgetValidation';
import { useBudgetStore } from '../store/useBudgetStore';

interface BudgetEntryRowProps {
  item: BudgetItem;
  onDelete: (item: BudgetItem) => void;
}

/**
 * Inline-editable budget line. Edits are validated on blur; an invalid value is
 * not saved and its message is linked to every field of the row.
 */
export const BudgetEntryRow = memo(function BudgetEntryRow({ item, onDelete }: BudgetEntryRowProps) {
  const updateItem = useBudgetStore((state) => state.updateItem);
  const [error, setError] = useState<string>();
  const errorId = useId();
  const invalidProps = { 'aria-invalid': Boolean(error), 'aria-describedby': error ? errorId : undefined };

  const save = (patch: Partial<BudgetItemInput>) => {
    const message = validateBudgetItem({ ...item, ...patch });
    setError(message);
    if (!message) updateItem(item.id, patch);
  };

  return (
    <tr className="border-t border-line align-top">
      <td className="min-w-52 py-3 pr-3">
        <Input
          aria-label={`${item.name} name`}
          defaultValue={item.name}
          onBlur={(event) => {
            save({ name: event.currentTarget.value });
          }}
          className="h-9"
          {...invalidProps}
        />
        <Input
          aria-label={`${item.name} notes`}
          defaultValue={item.notes ?? ''}
          placeholder="Notes"
          onBlur={(event) => {
            save({ notes: event.currentTarget.value });
          }}
          className="mt-1 h-8 text-xs"
        />
        {item.source === 'ai' ? <Badge className="mt-2">From AI plan</Badge> : null}
        {error ? (
          <p id={errorId} role="alert" className="mt-1 text-xs font-medium text-danger">
            {error}
          </p>
        ) : null}
      </td>
      <td className="min-w-32 py-3 pr-3">
        <Input
          aria-label={`${item.name} estimated amount`}
          type="number"
          min={0}
          defaultValue={item.estimated}
          onBlur={(event) => {
            save({ estimated: event.currentTarget.valueAsNumber });
          }}
          className="h-9"
          {...invalidProps}
        />
      </td>
      <td className="min-w-32 py-3 pr-3">
        <Input
          aria-label={`${item.name} actual amount`}
          type="number"
          min={0}
          defaultValue={item.actual}
          onBlur={(event) => {
            save({ actual: event.currentTarget.valueAsNumber });
          }}
          className="h-9"
          {...invalidProps}
        />
      </td>
      <td className="py-3 pr-3 text-center">
        <Checkbox
          checked={item.paid}
          onCheckedChange={(checked) => {
            save({ paid: checked === true });
          }}
          aria-label={`${item.name} paid`}
        />
      </td>
      <td className="py-3 text-right">
        <ConfirmDialog
          trigger={
            <Button variant="ghost" size="icon-sm" aria-label={`Delete ${item.name}`}>
              <Trash2 aria-hidden="true" />
            </Button>
          }
          title="Delete budget line?"
          description={`Remove “${item.name}” from this event budget?`}
          confirmLabel="Delete line"
          destructive
          onConfirm={() => {
            onDelete(item);
          }}
        />
      </td>
    </tr>
  );
});

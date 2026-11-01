import { memo, useId, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { ConfirmDeleteButton } from '@/components/ui/confirm-dialog';
import { Input } from '@/components/ui/input';
import type { BudgetItem, BudgetItemInput } from '@/types';
import { validateBudgetItem } from '../lib/budgetValidation';
import { useBudgetStore } from '../store/useBudgetStore';

interface BudgetEntryRowProps {
  item: BudgetItem;
  onDelete: (item: BudgetItem) => void;
}

/** `aria-invalid` / `aria-describedby` for every field of a row that shares one error message. */
interface InvalidProps {
  'aria-invalid': boolean;
  'aria-describedby': string | undefined;
}

type Save = (patch: Partial<BudgetItemInput>) => void;

interface AmountCellProps {
  item: BudgetItem;
  field: 'estimated' | 'actual';
  label: string;
  save: Save;
  invalidProps: InvalidProps;
}

/** A numeric amount input saved on blur. */
function AmountCell({ item, field, label, save, invalidProps }: AmountCellProps) {
  return (
    <td className="min-w-32 py-3 pr-3">
      <Input
        aria-label={`${item.name} ${label}`}
        type="number"
        min={0}
        defaultValue={item[field]}
        onBlur={(event) => {
          save({ [field]: event.currentTarget.valueAsNumber });
        }}
        className="h-9"
        {...invalidProps}
      />
    </td>
  );
}

interface NameCellProps {
  item: BudgetItem;
  save: Save;
  invalidProps: InvalidProps;
  error: string | undefined;
  errorId: string;
}

/** Name and notes inputs, the AI provenance badge, and the row's error message. */
function NameCell({ item, save, invalidProps, error, errorId }: NameCellProps) {
  return (
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
  );
}

/**
 * Inline-editable budget line. Edits are validated on blur; an invalid value is
 * not saved and its message is linked to every field of the row.
 */
export const BudgetEntryRow = memo(function BudgetEntryRow({ item, onDelete }: BudgetEntryRowProps) {
  const updateItem = useBudgetStore((state) => state.updateItem);
  const [error, setError] = useState<string>();
  const errorId = useId();
  const invalidProps: InvalidProps = {
    'aria-invalid': Boolean(error),
    'aria-describedby': error ? errorId : undefined,
  };

  const save: Save = (patch) => {
    const message = validateBudgetItem({ ...item, ...patch });
    setError(message);
    if (!message) updateItem(item.id, patch);
  };

  return (
    <tr className="border-t border-line align-top">
      <NameCell item={item} save={save} invalidProps={invalidProps} error={error} errorId={errorId} />
      <AmountCell item={item} field="estimated" label="estimated amount" save={save} invalidProps={invalidProps} />
      <AmountCell item={item} field="actual" label="actual amount" save={save} invalidProps={invalidProps} />
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
        <ConfirmDeleteButton
          itemName={item.name}
          title="Delete budget line?"
          description={`Remove “${item.name}” from this event budget?`}
          confirmLabel="Delete line"
          onConfirm={() => {
            onDelete(item);
          }}
        />
      </td>
    </tr>
  );
});

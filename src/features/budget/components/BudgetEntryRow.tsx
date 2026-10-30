import { Trash2 } from 'lucide-react';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { Input } from '@/components/ui/input';
import { useBudgetStore } from '../store/useBudgetStore';
import { validateBudgetItem } from '../lib/budgetValidation';
import { formatCurrency } from '@/lib/format';
import type { BudgetItem } from '@/types';
import type { CurrencyCode } from '@shared/domain';

interface BudgetEntryRowProps {
  item: BudgetItem;
  currency: CurrencyCode;
  onDelete: (item: BudgetItem) => void;
}

/** Inline-editable budget line with validation and an accessible delete flow. */
export function BudgetEntryRow({ item, currency, onDelete }: BudgetEntryRowProps) {
  const updateItem = useBudgetStore((state) => state.updateItem);
  const [error, setError] = useState<string>();
  const save = (patch: Partial<BudgetItem>) => {
    const next = { ...item, ...patch };
    const message = validateBudgetItem(next);
    setError(message);
    if (!message) updateItem(item.id, patch);
  };

  return (
    <tr className="border-t border-line align-top">
      <td className="min-w-52 py-3 pr-3">
        <Input
          aria-label={`${item.name} name`}
          defaultValue={item.name}
          onBlur={(event) => save({ name: event.currentTarget.value })}
          aria-invalid={Boolean(error)}
          className="h-9"
        />
        <Input
          aria-label={`${item.name} notes`}
          defaultValue={item.notes ?? ''}
          placeholder="Notes"
          onBlur={(event) => save({ notes: event.currentTarget.value })}
          className="mt-1 h-8 text-xs"
        />
        {item.source === 'ai' ? <Badge className="mt-2">From AI plan</Badge> : null}
        {error ? <p className="mt-1 text-xs text-danger">{error}</p> : null}
      </td>
      <td className="min-w-32 py-3 pr-3">
        <Input
          aria-label={`${item.name} estimated amount`}
          type="number"
          min={0}
          defaultValue={item.estimated}
          onBlur={(event) => save({ estimated: Number(event.currentTarget.value) })}
          className="h-9"
        />
        <span className="sr-only">{formatCurrency(item.estimated, currency)}</span>
      </td>
      <td className="min-w-32 py-3 pr-3">
        <Input
          aria-label={`${item.name} actual amount`}
          type="number"
          min={0}
          defaultValue={item.actual}
          onBlur={(event) => save({ actual: Number(event.currentTarget.value) })}
          className="h-9"
        />
      </td>
      <td className="py-3 pr-3 text-center">
        <Checkbox
          checked={item.paid}
          onCheckedChange={(checked) => save({ paid: checked === true })}
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
          onConfirm={() => onDelete(item)}
        />
      </td>
    </tr>
  );
}

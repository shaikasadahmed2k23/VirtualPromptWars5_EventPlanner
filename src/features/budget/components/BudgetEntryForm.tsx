import { useRef, useState } from 'react';
import { BUDGET_CATEGORIES } from '@shared/domain';
import { LIMITS } from '@shared/limits';
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Field } from '@/components/ui/field';
import { Input, Select, Textarea } from '@/components/ui/input';
import { useBudgetStore } from '../store/useBudgetStore';
import { budgetItemSchema } from '../lib/budgetValidation';
import { BUDGET_CATEGORY_LABELS } from '@/lib/labels';
import type { BudgetItemInput } from '@/types';

const EMPTY_ITEM: BudgetItemInput = {
  category: 'venue',
  name: '',
  estimated: 0,
  actual: 0,
  paid: false,
  vendorName: '',
  notes: '',
  source: 'manual',
};

/** Dialog for adding a validated budget line. */
export function BudgetEntryForm({ eventId }: { eventId: string }) {
  const addItem = useBudgetStore((state) => state.addItem);
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<BudgetItemInput>(EMPTY_ITEM);
  const [error, setError] = useState<string>();
  const submitting = useRef(false);
  const update = <K extends keyof BudgetItemInput>(key: K, value: BudgetItemInput[K]) =>
    setDraft((current) => ({ ...current, [key]: value }));

  const submit = () => {
    if (submitting.current) return;
    submitting.current = true;
    const result = budgetItemSchema.safeParse(draft);
    if (!result.success) {
      setError(result.error.issues[0]?.message ?? 'Check the budget line details.');
      submitting.current = false;
      return;
    }
    addItem(eventId, result.data);
    setDraft(EMPTY_ITEM);
    setError(undefined);
    setOpen(false);
    submitting.current = false;
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Add expense</Button>
      </DialogTrigger>
      <DialogContent title="Add budget line" description="Capture an estimated and actual amount for this expense.">
        <div className="grid gap-4">
          <Field label="Name" required error={error}>
            {(props) => <Input {...props} value={draft.name} onChange={(event) => update('name', event.target.value)} />}
          </Field>
          <Field label="Category" required>
            {(props) => (
              <Select {...props} value={draft.category} onChange={(event) => update('category', event.target.value as BudgetItemInput['category'])}>
                {BUDGET_CATEGORIES.map((category) => (
                  <option key={category} value={category}>
                    {BUDGET_CATEGORY_LABELS[category]}
                  </option>
                ))}
              </Select>
            )}
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Estimated" required hint={`Maximum ${LIMITS.budgetMax.toLocaleString('en-IN')}`}>
              {(props) => <Input {...props} type="number" min={0} value={draft.estimated} onChange={(event) => update('estimated', Number(event.target.value))} />}
            </Field>
            <Field label="Actual" required>
              {(props) => <Input {...props} type="number" min={0} value={draft.actual} onChange={(event) => update('actual', Number(event.target.value))} />}
            </Field>
          </div>
          <Field label="Notes">
            {(props) => <Textarea {...props} value={draft.notes} onChange={(event) => update('notes', event.target.value)} />}
          </Field>
          <div className="flex justify-end gap-3">
            <DialogClose asChild>
              <Button variant="secondary">Cancel</Button>
            </DialogClose>
            <Button onClick={submit}>Add expense</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

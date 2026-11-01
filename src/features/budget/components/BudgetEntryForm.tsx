import { Plus } from 'lucide-react';
import { BUDGET_CATEGORIES } from '@shared/domain';
import { Button } from '@/components/ui/button';
import { Field } from '@/components/ui/field';
import { FormDialog } from '@/components/ui/form-dialog';
import { Input, LabelledOptions, Select, Textarea } from '@/components/ui/input';
import { useDialogForm } from '@/lib/hooks/useDialogForm';
import { BUDGET_CATEGORY_LABELS } from '@/lib/labels';
import type { BudgetItemInput, Id } from '@/types';
import { budgetItemSchema } from '../lib/budgetValidation';
import { useBudgetStore } from '../store/useBudgetStore';

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

/** "Add expense" button and dialog for a validated budget line. */
export function BudgetEntryForm({ eventId }: { eventId: Id }) {
  const addItem = useBudgetStore((state) => state.addItem);
  const { form, open, onOpenChange, submitWith } = useDialogForm(budgetItemSchema, () => EMPTY_ITEM);
  const {
    register,
    formState: { errors },
  } = form;

  return (
    <FormDialog
      trigger={
        <Button>
          <Plus aria-hidden="true" />
          Add expense
        </Button>
      }
      title="Add expense"
      description="Capture an estimated and actual amount for this expense."
      submitLabel="Add expense"
      open={open}
      onOpenChange={onOpenChange}
      onSubmit={submitWith((values) => {
        addItem(eventId, values);
      })}
    >
      <Field label="Name" required error={errors.name?.message}>
        {(props) => <Input {...props} {...register('name')} />}
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Category" required>
          {(props) => (
            <Select {...props} {...register('category')}>
              <LabelledOptions values={BUDGET_CATEGORIES} labels={BUDGET_CATEGORY_LABELS} />
            </Select>
          )}
        </Field>
        <Field label="Vendor" error={errors.vendorName?.message}>
          {(props) => <Input {...props} {...register('vendorName')} />}
        </Field>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Estimated" required error={errors.estimated?.message}>
          {(props) => <Input {...props} type="number" min={0} {...register('estimated', { valueAsNumber: true })} />}
        </Field>
        <Field label="Actual" required error={errors.actual?.message}>
          {(props) => <Input {...props} type="number" min={0} {...register('actual', { valueAsNumber: true })} />}
        </Field>
      </div>
      <Field label="Notes" error={errors.notes?.message}>
        {(props) => <Textarea {...props} {...register('notes')} />}
      </Field>
    </FormDialog>
  );
}

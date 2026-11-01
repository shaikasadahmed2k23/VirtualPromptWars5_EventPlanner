import { CURRENCIES } from '@shared/domain';
import { Field } from '@/components/ui/field';
import { Input, LabelledOptions, Select } from '@/components/ui/input';
import { formatCurrency } from '@/lib/format';
import { CURRENCY_LABELS } from '@/lib/labels';
import { useStepForm } from '../../hooks/useStepForm';
import { guestsBudgetStepSchema, type GuestsBudgetStepValues } from '../../lib/wizardSchema';
import { StepShell } from '../StepShell';
import type { StepProps } from './stepProps';

/** Step 3: guest count, total budget and currency. */
export function GuestsBudgetStep({ draft, onComplete, onBack, focusHeading }: StepProps<GuestsBudgetStepValues>) {
  const { register, handleSubmit, formState, watch } = useStepForm(guestsBudgetStepSchema, {
    guestCount: draft.guestCount,
    budget: draft.budget,
    currency: draft.currency ?? 'INR',
  });
  const { errors } = formState;
  const [budget, currency] = watch(['budget', 'currency']);
  const budgetPreview =
    budget && Number.isFinite(budget) && budget > 0 ? `That’s ${formatCurrency(budget, currency)}.` : null;

  return (
    <StepShell
      title="Guests and budget"
      description="Rough numbers are fine. You can refine both any time."
      onSubmit={handleSubmit(onComplete)}
      onBack={onBack}
      focusHeading={focusHeading}
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Expected guests" required error={errors.guestCount?.message} className="sm:col-span-2">
          {(props) => (
            <Input
              {...props}
              type="number"
              inputMode="numeric"
              min={1}
              {...register('guestCount', { valueAsNumber: true })}
            />
          )}
        </Field>
        <Field label="Total budget" required hint={budgetPreview} error={errors.budget?.message}>
          {(props) => (
            <Input
              {...props}
              type="number"
              inputMode="numeric"
              min={1}
              {...register('budget', { valueAsNumber: true })}
            />
          )}
        </Field>
        <Field label="Currency" required error={errors.currency?.message}>
          {(props) => (
            <Select {...props} {...register('currency')}>
              <LabelledOptions values={CURRENCIES} labels={CURRENCY_LABELS} />
            </Select>
          )}
        </Field>
      </div>
    </StepShell>
  );
}

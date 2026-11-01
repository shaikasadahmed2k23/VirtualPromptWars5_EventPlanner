import { Field } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { todayISO } from '@/lib/dates';
import { useStepForm } from '../../hooks/useStepForm';
import { detailsStepSchema, type DetailsStepValues } from '../../lib/wizardSchema';
import { StepShell } from '../StepShell';
import type { StepProps } from './stepProps';

const DEFAULT_START_TIME = '18:00';

const detailsDefaults = (draft: StepProps<DetailsStepValues>['draft']): DetailsStepValues => ({
  name: draft.name ?? '',
  date: draft.date ?? '',
  startTime: draft.startTime ?? DEFAULT_START_TIME,
  city: draft.city ?? '',
  venue: draft.venue ?? '',
});

/** Step 2: name, date, time, city and venue. */
export function DetailsStep({ draft, onComplete, onBack, focusHeading }: StepProps<DetailsStepValues>) {
  const { register, handleSubmit, formState } = useStepForm(detailsStepSchema, detailsDefaults(draft));
  const { errors } = formState;

  return (
    <StepShell
      title="When and where?"
      description="A date lets us build your timeline backwards from the big day."
      onSubmit={handleSubmit(onComplete)}
      onBack={onBack}
      focusHeading={focusHeading}
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Event name" required error={errors.name?.message} className="sm:col-span-2">
          {(props) => <Input {...props} placeholder="e.g. Meera & Arjun’s Wedding" {...register('name')} />}
        </Field>
        <Field label="Date" required error={errors.date?.message}>
          {(props) => <Input {...props} type="date" min={todayISO()} {...register('date')} />}
        </Field>
        <Field label="Start time" required error={errors.startTime?.message}>
          {(props) => <Input {...props} type="time" {...register('startTime')} />}
        </Field>
        <Field label="City" required error={errors.city?.message}>
          {(props) => <Input {...props} autoComplete="address-level2" {...register('city')} />}
        </Field>
        <Field label="Venue" hint="Optional. Leave blank if you’re still deciding." error={errors.venue?.message}>
          {(props) => <Input {...props} {...register('venue')} />}
        </Field>
      </div>
    </StepShell>
  );
}

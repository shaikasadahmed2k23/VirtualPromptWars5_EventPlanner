import { DIETARY_OPTIONS } from '@shared/domain';
import { LIMITS } from '@shared/limits';
import { Field } from '@/components/ui/field';
import { Textarea } from '@/components/ui/input';
import { DIETARY_LABELS } from '@/lib/labels';
import { useStepForm } from '../../hooks/useStepForm';
import { requirementsStepSchema, type RequirementsStepValues } from '../../lib/wizardSchema';
import { StepShell } from '../StepShell';
import type { StepProps } from './stepProps';

/** Step 5: dietary needs, accessibility, cultural traditions and notes. */
export function RequirementsStep({ draft, onComplete, onBack, focusHeading }: StepProps<RequirementsStepValues>) {
  const { register, handleSubmit, formState } = useStepForm(requirementsStepSchema, {
    dietary: draft.dietary ?? [],
    accessibility: draft.accessibility ?? '',
    cultural: draft.cultural ?? '',
    notes: draft.notes ?? '',
  });
  const { errors } = formState;

  return (
    <StepShell
      title="Special requirements"
      description="Everything here is optional, and it helps the AI plan something that truly fits."
      onSubmit={handleSubmit(onComplete)}
      onBack={onBack}
      submitLabel="Review"
      focusHeading={focusHeading}
    >
      <fieldset>
        <legend className="text-sm font-medium">Dietary needs to cater for</legend>
        <div className="mt-3 flex flex-wrap gap-2">
          {DIETARY_OPTIONS.map((option) => (
            <label
              key={option}
              className="flex cursor-pointer items-center gap-2 rounded-full border border-line bg-surface px-4 py-2 text-sm transition-colors hover:border-rose has-[:checked]:border-rose-ink has-[:checked]:bg-blush-soft has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-rose-ink"
            >
              <input type="checkbox" value={option} className="accent-rose-ink" {...register('dietary')} />
              {DIETARY_LABELS[option]}
            </label>
          ))}
        </div>
      </fieldset>

      <Field
        label="Accessibility needs"
        hint={`e.g. step-free access, seating for elders. Up to ${LIMITS.requirementTextMax} characters.`}
        error={errors.accessibility?.message}
      >
        {(props) => <Textarea {...props} maxLength={LIMITS.requirementTextMax} {...register('accessibility')} />}
      </Field>
      <Field
        label="Cultural traditions"
        hint="e.g. haldi, sangeet, nikah, cake cutting, prayers."
        error={errors.cultural?.message}
      >
        {(props) => <Textarea {...props} maxLength={LIMITS.requirementTextMax} {...register('cultural')} />}
      </Field>
      <Field label="Anything else?" error={errors.notes?.message}>
        {(props) => <Textarea {...props} maxLength={LIMITS.notesMax} {...register('notes')} />}
      </Field>
    </StepShell>
  );
}

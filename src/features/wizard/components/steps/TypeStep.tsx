import { EVENT_TYPES } from '@shared/domain';
import { EVENT_TYPE_META } from '@/features/events/components/eventTypeMeta';
import { EVENT_TYPE_LABELS } from '@/lib/labels';
import { useStepForm } from '../../hooks/useStepForm';
import { typeStepSchema, type TypeStepValues } from '../../lib/wizardSchema';
import { ChoiceCards } from '../ChoiceCards';
import { StepShell } from '../StepShell';
import type { StepProps } from './stepProps';

const OPTIONS = EVENT_TYPES.map((type) => ({
  value: type,
  label: EVENT_TYPE_LABELS[type],
  description: EVENT_TYPE_META[type].pitch,
  icon: EVENT_TYPE_META[type].icon,
}));

/** Step 1: choose the kind of celebration. */
export function TypeStep({ draft, onComplete, focusHeading }: StepProps<TypeStepValues>) {
  const { register, handleSubmit, formState } = useStepForm(typeStepSchema, { type: draft.type });

  return (
    <StepShell
      title="What are we celebrating?"
      description="We’ll tailor your checklist, budget split and AI ideas to the occasion."
      onSubmit={handleSubmit(onComplete)}
      focusHeading={focusHeading}
    >
      <ChoiceCards
        legend="Event type"
        options={OPTIONS}
        registration={register('type')}
        error={formState.errors.type?.message}
      />
    </StepShell>
  );
}

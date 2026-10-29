import { EVENT_STYLES } from '@shared/domain';
import { EVENT_STYLE_DESCRIPTIONS } from '@/features/events/lib/eventTypeMeta';
import { EVENT_STYLE_LABELS } from '@/lib/labels';
import { useStepForm } from '../../hooks/useStepForm';
import { styleStepSchema, type StyleStepValues } from '../../lib/wizardSchema';
import { ChoiceCards } from '../ChoiceCards';
import { StepShell } from '../StepShell';
import type { StepProps } from './stepProps';

const OPTIONS = EVENT_STYLES.map((style) => ({
  value: style,
  label: EVENT_STYLE_LABELS[style],
  description: EVENT_STYLE_DESCRIPTIONS[style],
}));

/** Step 4: overall look and feel. */
export function StyleStep({ draft, onComplete, onBack, focusHeading }: StepProps<StyleStepValues>) {
  const { register, handleSubmit, formState } = useStepForm(styleStepSchema, { style: draft.style });

  return (
    <StepShell
      title="Choose your style"
      description="This sets the tone for décor ideas, colour palettes and mood boards."
      onSubmit={handleSubmit(onComplete)}
      onBack={onBack}
      focusHeading={focusHeading}
    >
      <ChoiceCards
        legend="Event style"
        options={OPTIONS}
        registration={register('style')}
        error={formState.errors.style?.message}
        columns={4}
      />
    </StepShell>
  );
}

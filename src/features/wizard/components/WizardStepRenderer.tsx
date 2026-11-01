import type { WizardState } from '../hooks/useWizard';
import { WIZARD_STEPS } from '../lib/wizardSteps';
import { DetailsStep } from './steps/DetailsStep';
import { GuestsBudgetStep } from './steps/GuestsBudgetStep';
import { RequirementsStep } from './steps/RequirementsStep';
import { ReviewStep } from './steps/ReviewStep';
import { StyleStep } from './steps/StyleStep';
import { TypeStep } from './steps/TypeStep';

/** Renders the form for the wizard's current step. */
export function WizardStepRenderer({ wizard }: { wizard: WizardState }) {
  const { draft, stepIndex, focusHeading, completeStep, back, moveTo, submit } = wizard;
  const common = { draft, focusHeading, onComplete: completeStep, onBack: back };

  switch (WIZARD_STEPS[stepIndex]?.id ?? 'type') {
    case 'type':
      return <TypeStep draft={draft} focusHeading={focusHeading} onComplete={completeStep} />;
    case 'details':
      return <DetailsStep {...common} />;
    case 'guests':
      return <GuestsBudgetStep {...common} />;
    case 'style':
      return <StyleStep {...common} />;
    case 'requirements':
      return <RequirementsStep {...common} />;
    case 'review':
      return <ReviewStep draft={draft} focusHeading={focusHeading} onEdit={moveTo} onBack={back} onConfirm={submit} />;
  }
}

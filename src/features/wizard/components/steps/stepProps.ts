import type { WizardDraft } from '../../lib/wizardSchema';

/** Props shared by every form step of the wizard. */
export interface StepProps<TValues> {
  /** Previously entered answers (from the persisted draft). */
  draft: WizardDraft;
  /** Called with validated values when the step is submitted. */
  onComplete: (values: TValues) => void;
  onBack?: () => void;
  focusHeading: boolean;
}

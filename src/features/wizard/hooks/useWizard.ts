import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { paths } from '@/app/navigation';
import { createEventWithStarterPlan } from '@/features/events/lib/eventLifecycle';
import { firstInvalidStep, toNewEventInput, wizardSchema, type WizardDraft } from '../lib/wizardSchema';
import { WIZARD_STEPS } from '../lib/wizardSteps';
import { useWizardDraftStore } from '../store/useWizardDraftStore';

/**
 * Wizard orchestration: step navigation over the persisted draft, heading
 * focus management, and final submission (event + starter plan + redirect).
 */
export function useWizard() {
  const draft = useWizardDraftStore((state) => state.draft);
  const stepIndex = useWizardDraftStore((state) => state.stepIndex);
  const saveStep = useWizardDraftStore((state) => state.saveStep);
  const goToStep = useWizardDraftStore((state) => state.goToStep);
  const clearDraft = useWizardDraftStore((state) => state.clearDraft);
  const navigate = useNavigate();
  // Focus the step heading only after the user moves between steps, never on first load.
  const [focusHeading, setFocusHeading] = useState(false);

  const moveTo = useCallback(
    (index: number) => {
      goToStep(index);
      setFocusHeading(true);
    },
    [goToStep],
  );

  const completeStep = useCallback(
    (values: WizardDraft) => {
      saveStep(values, stepIndex + 1);
      setFocusHeading(true);
    },
    [saveStep, stepIndex],
  );

  const back = useCallback(() => {
    moveTo(stepIndex - 1);
  }, [moveTo, stepIndex]);

  const submit = useCallback(() => {
    const invalidStep = firstInvalidStep(draft);
    const parsed = wizardSchema.safeParse(draft);
    if (invalidStep !== null || !parsed.success) {
      const step = WIZARD_STEPS[invalidStep ?? 0];
      toast.error(`Please check “${step?.title ?? 'your answers'}” before continuing.`);
      moveTo(invalidStep ?? 0);
      return;
    }
    const event = createEventWithStarterPlan(toNewEventInput(parsed.data));
    clearDraft();
    toast.success(`${event.name} is ready`, {
      description: 'We’ve drafted a starter checklist and budget for you.',
    });
    navigate(paths.event(event.id));
  }, [draft, moveTo, clearDraft, navigate]);

  return { draft, stepIndex, focusHeading, completeStep, back, moveTo, submit };
}

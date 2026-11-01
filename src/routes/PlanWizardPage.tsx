import { AnimatePresence, motion, MotionConfig } from 'framer-motion';
import { FloralSprig } from '@/components/decor/FloralSprig';
import { PageHeader } from '@/components/ui/headings';
import { WizardProgress } from '@/features/wizard/components/WizardProgress';
import { WizardStepRenderer } from '@/features/wizard/components/WizardStepRenderer';
import { usePreselectedType } from '@/features/wizard/hooks/usePreselectedType';
import { useWizard } from '@/features/wizard/hooks/useWizard';
import { WIZARD_STEPS } from '@/features/wizard/lib/wizardSteps';
import { useDocumentTitle } from '@/lib/hooks/useDocumentTitle';

const STEP_TRANSITION = { duration: 0.25, ease: 'easeOut' } as const;
const STEP_OFFSET_PX = 16;

/** `/plan/new`: multi-step event wizard with a persisted draft. */
export default function PlanWizardPage() {
  const isApplyingPreselection = usePreselectedType();
  const wizard = useWizard();
  const stepId = WIZARD_STEPS[wizard.stepIndex]?.id;
  useDocumentTitle('Plan a new celebration');

  return (
    <div className="bg-paper relative overflow-hidden">
      <FloralSprig className="absolute -right-10 -top-6 hidden size-56 opacity-70 lg:block" />
      <div className="relative mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-14">
        <PageHeader
          eyebrow="Event wizard"
          title="Plan a new celebration"
          description="Six short steps. Your answers save as you type, so you can pick up where you left off."
        />
        <div className="mt-8">
          <WizardProgress currentIndex={wizard.stepIndex} />
        </div>
        <MotionConfig reducedMotion="user">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={stepId}
              initial={{ opacity: 0, x: STEP_OFFSET_PX }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -STEP_OFFSET_PX }}
              transition={STEP_TRANSITION}
              className="mt-8 rounded-3xl border border-line bg-surface/80 p-5 shadow-soft backdrop-blur sm:p-8"
            >
              {isApplyingPreselection ? null : <WizardStepRenderer wizard={wizard} />}
            </motion.div>
          </AnimatePresence>
        </MotionConfig>
      </div>
    </div>
  );
}

import { Check } from 'lucide-react';
import { toPercent } from '@/lib/format';
import { cn } from '@/lib/utils';
import { WIZARD_STEPS } from '../lib/wizardSteps';

type StepState = 'done' | 'current' | 'upcoming';

const BADGE_CLASS: Record<StepState, string> = {
  done: 'border-rose-ink bg-rose-ink text-white',
  current: 'border-rose-ink bg-surface text-rose-ink ring-4 ring-blush-soft',
  upcoming: 'border-line bg-surface text-muted',
};

const stepState = (index: number, currentIndex: number): StepState => {
  if (index < currentIndex) return 'done';
  return index === currentIndex ? 'current' : 'upcoming';
};

interface StepMarkerProps {
  index: number;
  title: string;
  currentIndex: number;
}

/** One stepper entry: a numbered (or ticked) badge, the step title and the connector to the next step. */
function StepMarker({ index, title, currentIndex }: StepMarkerProps) {
  const state = stepState(index, currentIndex);
  const isDone = state === 'done';
  const isCurrent = state === 'current';
  const isLast = index === WIZARD_STEPS.length - 1;
  return (
    <li className="flex flex-1 items-center gap-2" aria-current={isCurrent ? 'step' : undefined}>
      <span
        className={cn(
          'grid size-8 shrink-0 place-items-center rounded-full border text-sm font-semibold transition-colors',
          BADGE_CLASS[state],
        )}
      >
        {isDone ? <Check className="size-4" aria-hidden="true" /> : index + 1}
      </span>
      <span className={cn('text-sm', isCurrent ? 'font-semibold text-charcoal' : 'text-muted')}>
        {title}
        {isDone ? <span className="sr-only"> (completed)</span> : null}
      </span>
      {isLast ? null : <span className={cn('h-px flex-1', isDone ? 'bg-rose-ink' : 'bg-line')} aria-hidden="true" />}
    </li>
  );
}

/** Step indicator: a compact bar on mobile, a labelled stepper from `md` up. */
export function WizardProgress({ currentIndex }: { currentIndex: number }) {
  const current = WIZARD_STEPS[currentIndex];
  const percent = toPercent((currentIndex + 1) / WIZARD_STEPS.length);

  return (
    <nav aria-label="Wizard progress">
      <p className="text-sm font-medium text-muted md:sr-only">
        Step {currentIndex + 1} of {WIZARD_STEPS.length}: <span className="text-charcoal">{current?.title}</span>
      </p>
      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-ivory-deep md:hidden" aria-hidden="true">
        <div className="h-full rounded-full bg-rose transition-[width] duration-500" style={{ width: `${percent}%` }} />
      </div>

      <ol className="hidden items-center gap-2 md:flex">
        {WIZARD_STEPS.map((step, index) => (
          <StepMarker key={step.id} index={index} title={step.title} currentIndex={currentIndex} />
        ))}
      </ol>
    </nav>
  );
}

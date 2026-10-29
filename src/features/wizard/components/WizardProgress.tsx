import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { WIZARD_STEPS } from '../lib/wizardSteps';

/** Step indicator: a compact bar on mobile, a labelled stepper from `md` up. */
export function WizardProgress({ currentIndex }: { currentIndex: number }) {
  const current = WIZARD_STEPS[currentIndex];
  const percent = Math.round(((currentIndex + 1) / WIZARD_STEPS.length) * 100);

  return (
    <nav aria-label="Wizard progress">
      <p className="text-sm font-medium text-muted md:sr-only">
        Step {currentIndex + 1} of {WIZARD_STEPS.length}: <span className="text-charcoal">{current?.title}</span>
      </p>
      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-ivory-deep md:hidden" aria-hidden="true">
        <div className="h-full rounded-full bg-rose transition-[width] duration-500" style={{ width: `${percent}%` }} />
      </div>

      <ol className="hidden items-center gap-2 md:flex">
        {WIZARD_STEPS.map((step, index) => {
          const isDone = index < currentIndex;
          const isCurrent = index === currentIndex;
          return (
            <li key={step.id} className="flex flex-1 items-center gap-2" aria-current={isCurrent ? 'step' : undefined}>
              <span
                className={cn(
                  'grid size-8 shrink-0 place-items-center rounded-full border text-sm font-semibold transition-colors',
                  isDone && 'border-rose-ink bg-rose-ink text-white',
                  isCurrent && 'border-rose-ink bg-surface text-rose-ink ring-4 ring-blush-soft',
                  !isDone && !isCurrent && 'border-line bg-surface text-muted',
                )}
              >
                {isDone ? <Check className="size-4" aria-hidden="true" /> : index + 1}
              </span>
              <span className={cn('text-sm', isCurrent ? 'font-semibold text-charcoal' : 'text-muted')}>
                {step.title}
                {isDone ? <span className="sr-only"> (completed)</span> : null}
              </span>
              {index < WIZARD_STEPS.length - 1 ? (
                <span className={cn('h-px flex-1', isDone ? 'bg-rose-ink' : 'bg-line')} aria-hidden="true" />
              ) : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

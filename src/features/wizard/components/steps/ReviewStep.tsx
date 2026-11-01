import { ArrowLeft, Pencil, Sparkles } from 'lucide-react';
import { type ReactNode, useId } from 'react';
import { Button } from '@/components/ui/button';
import { formatDisplayDate } from '@/lib/dates';
import { formatCurrency, pluralize } from '@/lib/format';
import { useFocusOnMount } from '@/lib/hooks/useFocusOnMount';
import { CURRENCY_LABELS, DIETARY_LABELS, EVENT_STYLE_LABELS, EVENT_TYPE_LABELS } from '@/lib/labels';
import type { WizardDraft } from '../../lib/wizardSchema';
import { WIZARD_STEPS } from '../../lib/wizardSteps';

interface ReviewStepProps {
  draft: WizardDraft;
  onEdit: (stepIndex: number) => void;
  onBack: () => void;
  onConfirm: () => void;
  focusHeading: boolean;
}

const NOT_SET = 'Not set';
const orNotSet = (value: string | undefined) => (value?.trim() ? value : NOT_SET);

const detailsLines = (draft: WizardDraft): ReactNode[] => [
  orNotSet(draft.name),
  draft.date ? `${formatDisplayDate(draft.date, 'EEEE, d MMMM yyyy')} at ${draft.startTime ?? ''}` : NOT_SET,
  [draft.venue, draft.city].filter(Boolean).join(', ') || NOT_SET,
];

const guestsBudgetLines = (draft: WizardDraft): ReactNode[] => [
  draft.guestCount ? pluralize(draft.guestCount, 'guest') : NOT_SET,
  draft.budget && draft.currency
    ? `${formatCurrency(draft.budget, draft.currency)} · ${CURRENCY_LABELS[draft.currency]}`
    : NOT_SET,
];

const requirementsLines = (draft: WizardDraft): ReactNode[] => [
  `Dietary: ${draft.dietary?.length ? draft.dietary.map((d) => DIETARY_LABELS[d]).join(', ') : 'none specified'}`,
  `Accessibility: ${orNotSet(draft.accessibility)}`,
  `Traditions: ${orNotSet(draft.cultural)}`,
  `Notes: ${orNotSet(draft.notes)}`,
];

/** Summary lines for each wizard step, in step order. */
function summarise(draft: WizardDraft): ReactNode[][] {
  return [
    [draft.type ? EVENT_TYPE_LABELS[draft.type] : NOT_SET],
    detailsLines(draft),
    guestsBudgetLines(draft),
    [draft.style ? EVENT_STYLE_LABELS[draft.style] : NOT_SET],
    requirementsLines(draft),
  ];
}

/** Final step: a summary of every answer with "Edit" links, then create the event. */
export function ReviewStep({ draft, onEdit, onBack, onConfirm, focusHeading }: ReviewStepProps) {
  const headingId = useId();
  const headingRef = useFocusOnMount<HTMLHeadingElement>(focusHeading);

  return (
    <section aria-labelledby={headingId} className="space-y-8">
      <div>
        <h2 id={headingId} ref={headingRef} tabIndex={-1} className="text-3xl outline-none sm:text-4xl">
          Review your celebration
        </h2>
        <p className="mt-2 text-muted">Check the details below. We’ll draft your checklist and budget straight away.</p>
      </div>

      <dl className="divide-y divide-line rounded-2xl border border-line bg-surface">
        {summarise(draft).map((lines, index) => {
          const step = WIZARD_STEPS[index];
          return (
            <div key={step?.id} className="flex flex-col gap-2 p-5 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <dt className="text-xs font-semibold uppercase tracking-[0.18em] text-rose-ink">{step?.title}</dt>
                {lines.map((line, lineIndex) => (
                  <dd key={lineIndex} className="mt-1 text-charcoal">
                    {line}
                  </dd>
                ))}
              </div>
              <Button variant="link" size="sm" className="self-start" onClick={() => onEdit(index)}>
                <Pencil aria-hidden="true" />
                Edit <span className="sr-only">{step?.title}</span>
              </Button>
            </div>
          );
        })}
      </dl>

      <div className="flex flex-col-reverse gap-3 border-t border-line pt-6 sm:flex-row sm:justify-between">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft aria-hidden="true" />
          Back
        </Button>
        <Button size="lg" onClick={onConfirm}>
          <Sparkles aria-hidden="true" />
          Create my event
        </Button>
      </div>
    </section>
  );
}

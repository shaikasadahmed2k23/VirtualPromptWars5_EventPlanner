import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useId, type FormEventHandler, type ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { useFocusOnMount } from '@/lib/hooks/useFocusOnMount';

interface StepShellProps {
  title: string;
  description: string;
  onSubmit: FormEventHandler<HTMLFormElement>;
  /** Omit on the first step. */
  onBack?: () => void;
  submitLabel?: string;
  /** Move focus to the heading on mount (true after the user changes step). */
  focusHeading: boolean;
  children: ReactNode;
}

/**
 * Frame shared by every wizard step: a labelled form whose native submit
 * (button click or Enter) advances the wizard, plus Back/Next controls.
 */
export function StepShell({
  title,
  description,
  onSubmit,
  onBack,
  submitLabel = 'Continue',
  focusHeading,
  children,
}: StepShellProps) {
  const headingId = useId();
  const headingRef = useFocusOnMount<HTMLHeadingElement>(focusHeading);

  return (
    <form noValidate onSubmit={onSubmit} aria-labelledby={headingId} className="space-y-8">
      <div>
        <h2 id={headingId} ref={headingRef} tabIndex={-1} className="text-3xl outline-none sm:text-4xl">
          {title}
        </h2>
        <p className="mt-2 text-muted">{description}</p>
      </div>

      {children}

      <div className="flex flex-col-reverse gap-3 border-t border-line pt-6 sm:flex-row sm:justify-between">
        {onBack ? (
          <Button variant="ghost" onClick={onBack}>
            <ArrowLeft aria-hidden="true" />
            Back
          </Button>
        ) : (
          <span aria-hidden="true" />
        )}
        <Button type="submit" size="lg">
          {submitLabel}
          <ArrowRight aria-hidden="true" />
        </Button>
      </div>
    </form>
  );
}

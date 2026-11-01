import { CircleAlert } from 'lucide-react';
import { type ReactNode, useId } from 'react';
import { cn } from '@/lib/utils';

/** Accessibility props a form control receives from {@link Field}. */
export interface FieldControlProps {
  id: string;
  'aria-invalid': boolean;
  'aria-describedby': string | undefined;
  'aria-required': boolean | undefined;
}

interface FieldProps {
  label: ReactNode;
  /** Validation message; when present the control is marked invalid. */
  error?: string | undefined;
  hint?: ReactNode;
  required?: boolean;
  className?: string;
  /** Visually hide the label (it stays available to screen readers). */
  hideLabel?: boolean;
  children: (props: FieldControlProps) => ReactNode;
}

/**
 * Form field wrapper: renders a label, the control, an optional hint and an
 * error message, and links them with `htmlFor` and `aria-describedby`.
 */
export function Field({ label, error, hint, required, className, hideLabel, children }: FieldProps) {
  const id = useId();
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(' ') || undefined;

  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <label htmlFor={id} className={cn('text-sm font-medium text-charcoal', hideLabel && 'sr-only')}>
        {label}
        {required ? (
          <span className="ml-0.5 text-rose-ink" aria-hidden="true">
            *
          </span>
        ) : null}
      </label>
      {children({ id, 'aria-invalid': Boolean(error), 'aria-describedby': describedBy, 'aria-required': required })}
      {hint ? (
        <p id={hintId} className="text-xs text-muted">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={errorId} className="flex items-center gap-1 text-xs font-medium text-danger" role="alert">
          <CircleAlert className="size-3.5" aria-hidden="true" />
          {error}
        </p>
      ) : null}
    </div>
  );
}

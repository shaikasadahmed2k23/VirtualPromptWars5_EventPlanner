import { Check, CircleAlert, type LucideIcon } from 'lucide-react';
import { useId } from 'react';
import type { UseFormRegisterReturn } from 'react-hook-form';
import { cn } from '@/lib/utils';

/** One selectable option. */
export interface ChoiceOption {
  value: string;
  label: string;
  description: string;
  icon?: LucideIcon;
}

interface ChoiceCardsProps {
  legend: string;
  options: readonly ChoiceOption[];
  registration: UseFormRegisterReturn;
  error?: string | undefined;
  columns?: 2 | 4;
}

/**
 * Radio group rendered as cards. Uses native radio inputs inside a
 * fieldset/legend, so arrow-key navigation and announcements come for free.
 */
export function ChoiceCards({ legend, options, registration, error, columns = 2 }: ChoiceCardsProps) {
  const errorId = useId();

  return (
    <fieldset aria-describedby={error ? errorId : undefined} aria-invalid={Boolean(error)}>
      <legend className="sr-only">{legend}</legend>
      <div className={cn('grid gap-3 sm:grid-cols-2', columns === 4 && 'lg:grid-cols-4')}>
        {options.map(({ value, label, description, icon: Icon }) => (
          <label
            key={value}
            className="group relative flex cursor-pointer flex-col gap-2 rounded-2xl border border-line bg-surface p-5 shadow-soft transition-all hover:-translate-y-0.5 hover:border-rose hover:shadow-lift has-[:checked]:border-rose-ink has-[:checked]:bg-blush-soft/50 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-rose-ink"
          >
            <input type="radio" value={value} className="sr-only" {...registration} />
            <span className="flex items-center justify-between">
              {Icon ? (
                <span className="grid size-10 place-items-center rounded-xl bg-ivory-deep text-rose-deep group-has-[:checked]:bg-rose-ink group-has-[:checked]:text-white">
                  <Icon className="size-5" aria-hidden="true" />
                </span>
              ) : (
                <span />
              )}
              <Check className="size-5 text-rose-ink opacity-0 group-has-[:checked]:opacity-100" aria-hidden="true" />
            </span>
            <span className="font-serif text-xl font-semibold">{label}</span>
            <span className="text-sm text-muted">{description}</span>
          </label>
        ))}
      </div>
      {error ? (
        <p id={errorId} role="alert" className="mt-3 flex items-center gap-1 text-sm font-medium text-danger">
          <CircleAlert className="size-4" aria-hidden="true" />
          {error}
        </p>
      ) : null}
    </fieldset>
  );
}

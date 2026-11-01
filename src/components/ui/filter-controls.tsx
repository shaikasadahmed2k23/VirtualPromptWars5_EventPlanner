import { Search } from 'lucide-react';
import type { ReactNode } from 'react';
import type { FilterOption } from '@/lib/filterOptions';
import { cn } from '@/lib/utils';
import { Field } from './field';
import { Input, Select } from './input';

interface FilterSelectProps<T extends string | number> {
  label: string;
  value: T;
  options: readonly FilterOption<T>[];
  onChange: (value: T) => void;
  className?: string;
}

/**
 * Labelled native select for list filters and sorting. Typed by its options,
 * so the change handler receives a valid value without casting.
 */
export function FilterSelect<T extends string | number>({
  label,
  value,
  options,
  onChange,
  className,
}: FilterSelectProps<T>) {
  return (
    <Field label={label} {...(className ? { className } : {})}>
      {(props) => (
        <Select
          {...props}
          value={String(value)}
          onChange={(event) => {
            const option = options.find((candidate) => String(candidate.value) === event.target.value);
            if (option) onChange(option.value);
          }}
        >
          {options.map((option) => (
            <option key={String(option.value)} value={String(option.value)}>
              {option.label}
            </option>
          ))}
        </Select>
      )}
    </Field>
  );
}

interface SearchFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

/** Search box with a leading icon and a visually hidden label. */
export function SearchField({ label, value, onChange, placeholder, className }: SearchFieldProps) {
  return (
    <Field label={label} hideLabel {...(className ? { className } : {})}>
      {(props) => (
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-3.5 size-4 text-muted" aria-hidden="true" />
          <Input
            {...props}
            type="search"
            className="pl-9"
            placeholder={placeholder ?? label}
            value={value}
            onChange={(event) => {
              onChange(event.target.value);
            }}
          />
        </div>
      )}
    </Field>
  );
}

/** Bordered panel that lays out a search box and filter selects responsively. */
export function FilterPanel({
  label,
  children,
  className,
}: {
  label: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      aria-label={label}
      className={cn(
        'grid items-end gap-3 rounded-2xl border border-line bg-surface p-4 sm:grid-cols-2 lg:grid-cols-5',
        className,
      )}
    >
      {children}
    </section>
  );
}

import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface PageHeaderProps {
  /** Small uppercase label above the title. */
  eyebrow?: string;
  title: string;
  description?: ReactNode;
  /** Right-aligned actions (buttons, switchers). */
  actions?: ReactNode;
  className?: string;
}

/** Page title block. Renders the page's single `h1`. */
export function PageHeader({ eyebrow, title, description, actions, className }: PageHeaderProps) {
  return (
    <header className={cn('flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between', className)}>
      <div className="min-w-0">
        {eyebrow ? <p className="text-xs font-semibold uppercase tracking-[0.2em] text-rose-ink">{eyebrow}</p> : null}
        <h1 className="mt-1 text-4xl leading-[1.05] sm:text-5xl">{title}</h1>
        {description ? <p className="mt-2 max-w-2xl text-base text-muted">{description}</p> : null}
      </div>
      {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
    </header>
  );
}

interface SectionTitleProps {
  title: string;
  description?: ReactNode;
  action?: ReactNode;
  /** Heading element id, for `aria-labelledby` on the enclosing section. */
  id?: string;
  className?: string;
}

/** Section heading (`h2`) with optional description and trailing action. */
export function SectionTitle({ title, description, action, id, className }: SectionTitleProps) {
  return (
    <div className={cn('flex items-end justify-between gap-4', className)}>
      <div>
        <h2 id={id} className="text-2xl sm:text-3xl">
          {title}
        </h2>
        {description ? <p className="mt-1 text-sm text-muted">{description}</p> : null}
      </div>
      {action}
    </div>
  );
}

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

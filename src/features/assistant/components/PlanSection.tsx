import type { LucideIcon } from 'lucide-react';
import { useId, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface PlanSectionProps {
  title: string;
  icon: LucideIcon;
  description?: string;
  action?: ReactNode;
  className?: string;
  children: ReactNode;
}

/** A labelled region of the AI plan with a serif `h2` and icon. */
export function PlanSection({ title, icon: Icon, description, action, className, children }: PlanSectionProps) {
  const headingId = useId();
  return (
    <section aria-labelledby={headingId} className={cn('space-y-4', className)}>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-full bg-blush-soft text-rose-deep">
            <Icon className="size-5" aria-hidden="true" />
          </span>
          <div>
            <h2 id={headingId} className="text-3xl">
              {title}
            </h2>
            {description ? <p className="text-sm text-muted">{description}</p> : null}
          </div>
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

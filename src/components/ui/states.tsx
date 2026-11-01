import { CloudOff, type LucideIcon, RotateCcw } from 'lucide-react';
import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { Button } from './button';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  /** Primary call to action, e.g. an "Add guest" button. */
  action?: ReactNode;
  className?: string;
}

/** Friendly placeholder for lists and pages with no data yet. */
export function EmptyState({ icon: Icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center rounded-2xl border border-dashed border-line bg-surface/60 px-6 py-12 text-center',
        className,
      )}
    >
      <span className="grid size-14 place-items-center rounded-full bg-blush-soft text-rose-deep">
        <Icon className="size-6" aria-hidden="true" />
      </span>
      <h3 className="mt-4 text-2xl">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-muted">{description}</p>
      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  );
}

interface ErrorStateProps {
  title?: string;
  description: string;
  onRetry?: () => void;
  className?: string;
}

/** Recoverable error message with an optional retry action. Announced politely. */
export function ErrorState({ title = 'Something went wrong', description, onRetry, className }: ErrorStateProps) {
  return (
    <div
      role="alert"
      className={cn(
        'flex flex-col items-center rounded-2xl border border-danger/25 bg-danger-soft/50 px-6 py-10 text-center',
        className,
      )}
    >
      <span className="grid size-12 place-items-center rounded-full bg-danger-soft text-danger">
        <CloudOff className="size-5" aria-hidden="true" />
      </span>
      <h3 className="mt-3 text-xl">{title}</h3>
      <p className="mt-1 max-w-md text-sm text-muted">{description}</p>
      {onRetry ? (
        <Button variant="secondary" size="sm" className="mt-5" onClick={onRetry}>
          <RotateCcw aria-hidden="true" />
          Try again
        </Button>
      ) : null}
    </div>
  );
}

/** Shimmering placeholder block used while content loads. */
export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        'animate-shimmer rounded-xl bg-[linear-gradient(90deg,var(--color-ivory-deep)_0%,var(--color-surface)_50%,var(--color-ivory-deep)_100%)] bg-[length:200%_100%]',
        className,
      )}
    />
  );
}

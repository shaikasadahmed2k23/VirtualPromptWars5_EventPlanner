import { useId, type ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { Card } from './card';
import { ErrorBoundary } from './error-boundary';
import { ErrorState, Skeleton } from './states';

interface WidgetCardProps {
  title: string;
  description?: string;
  /** Header action, e.g. a "View all" link. */
  action?: ReactNode;
  /** Show the skeleton instead of content (e.g. while stores hydrate). */
  isLoading?: boolean;
  /** Custom loading placeholder; defaults to three skeleton rows. */
  skeleton?: ReactNode;
  className?: string;
  children: ReactNode;
}

const DEFAULT_SKELETON = (
  <div className="space-y-3">
    <Skeleton className="h-5 w-3/4" />
    <Skeleton className="h-5 w-2/3" />
    <Skeleton className="h-5 w-1/2" />
  </div>
);

/**
 * Dashboard widget frame: a labelled region with header, loading skeleton and
 * an error boundary that offers a retry without affecting other widgets.
 */
export function WidgetCard({
  title,
  description,
  action,
  isLoading = false,
  skeleton = DEFAULT_SKELETON,
  className,
  children,
}: WidgetCardProps) {
  const headingId = useId();

  return (
    <Card className={cn('flex flex-col', className)}>
      <section aria-labelledby={headingId} aria-busy={isLoading} className="flex flex-1 flex-col p-5 sm:p-6">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <h2 id={headingId} className="text-2xl">
              {title}
            </h2>
            {description ? <p className="mt-0.5 text-sm text-muted">{description}</p> : null}
          </div>
          {action}
        </div>
        <ErrorBoundary
          fallback={(reset) => (
            <ErrorState
              title="This section couldn’t load"
              description="Your data is safe. Try again, or reload the page."
              onRetry={reset}
            />
          )}
        >
          {isLoading ? skeleton : children}
        </ErrorBoundary>
      </section>
    </Card>
  );
}

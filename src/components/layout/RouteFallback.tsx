import { Skeleton } from '@/components/ui/states';

/** Suspense fallback shown while a lazily-loaded route chunk downloads. */
export function RouteFallback() {
  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-10 sm:px-6 lg:px-8" role="status" aria-live="polite">
      <span className="sr-only">Loading page…</span>
      <Skeleton className="h-4 w-32" />
      <Skeleton className="h-12 w-2/3 max-w-md" />
      <div className="grid gap-4 sm:grid-cols-3">
        <Skeleton className="h-28" />
        <Skeleton className="h-28" />
        <Skeleton className="h-28" />
      </div>
      <Skeleton className="h-64" />
    </div>
  );
}

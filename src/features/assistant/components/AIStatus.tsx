import { ErrorState } from '@/components/ui/states';
import type { AsyncStatus } from '@/types';

interface AIStatusProps {
  status: AsyncStatus;
  error: string | null;
  onRetry: () => void;
  loadingMessage: string;
  successMessage: string;
}

/**
 * Announces AI progress to screen readers via a polite live region, and shows
 * a friendly error with Retry when a request fails.
 */
export function AIStatus({ status, error, onRetry, loadingMessage, successMessage }: AIStatusProps) {
  const announcement = status === 'loading' ? loadingMessage : status === 'success' ? successMessage : '';
  return (
    <>
      <p className="sr-only" role="status" aria-live="polite">
        {announcement}
      </p>
      {status === 'error' && error ? (
        <ErrorState title="We couldn’t reach the planner" description={error} onRetry={onRetry} />
      ) : null}
    </>
  );
}

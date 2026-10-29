import { Home } from 'lucide-react';
import { isRouteErrorResponse, Link, useRouteError } from 'react-router-dom';
import { paths } from '@/app/navigation';
import { Button } from '@/components/ui/button';
import { ErrorState } from '@/components/ui/states';

const CHUNK_LOAD_ERROR = /Failed to fetch dynamically imported module|Loading chunk/i;

function describe(error: unknown): string {
  if (isRouteErrorResponse(error)) return `The page responded with ${String(error.status)}.`;
  if (error instanceof Error && CHUNK_LOAD_ERROR.test(error.message)) {
    return 'A newer version of Utsav is available. Reload the page to continue.';
  }
  return 'An unexpected problem stopped this page from loading. Your saved plans are safe.';
}

/** Router-level error boundary. Never exposes stack traces to the user. */
export function RouteError() {
  const error = useRouteError();

  return (
    <main id="main" className="mx-auto max-w-2xl px-4 py-20">
      <h1 className="sr-only">Error</h1>
      <ErrorState
        description={describe(error)}
        onRetry={() => {
          window.location.reload();
        }}
      />
      <div className="mt-6 text-center">
        <Button asChild variant="link">
          <Link to={paths.home()}>
            <Home aria-hidden="true" />
            Back to home
          </Link>
        </Button>
      </div>
    </main>
  );
}

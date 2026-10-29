import { Compass } from 'lucide-react';
import { Link } from 'react-router-dom';
import { paths } from '@/app/navigation';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/states';
import { useDocumentTitle } from '@/lib/hooks/useDocumentTitle';

/** 404 page for unknown routes. */
export default function NotFoundPage() {
  useDocumentTitle('Page not found');
  return (
    <div className="mx-auto max-w-2xl px-4 py-16">
      <h1 className="sr-only">Page not found</h1>
      <EmptyState
        icon={Compass}
        title="This page wandered off"
        description="The link may be mistyped or outdated. Let’s get you back to planning."
        action={
          <Button asChild>
            <Link to={paths.home()}>Back to home</Link>
          </Button>
        }
      />
    </div>
  );
}

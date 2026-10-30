import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './button';

interface PaginationProps {
  /** Names the navigation landmark, e.g. "Guest list pages". */
  label: string;
  page: number;
  pageCount: number;
  onPageChange: (page: number) => void;
}

/** Previous / next pager. Renders nothing when everything fits on one page. */
export function Pagination({ label, page, pageCount, onPageChange }: PaginationProps) {
  if (pageCount <= 1) return null;
  return (
    <nav className="flex items-center justify-center gap-3" aria-label={label}>
      <Button
        variant="secondary"
        size="icon-sm"
        aria-label="Previous page"
        disabled={page <= 1}
        onClick={() => {
          onPageChange(page - 1);
        }}
      >
        <ChevronLeft aria-hidden="true" />
      </Button>
      <span className="text-sm text-muted" aria-live="polite">
        Page {page} of {pageCount}
      </span>
      <Button
        variant="secondary"
        size="icon-sm"
        aria-label="Next page"
        disabled={page >= pageCount}
        onClick={() => {
          onPageChange(page + 1);
        }}
      >
        <ChevronRight aria-hidden="true" />
      </Button>
    </nav>
  );
}

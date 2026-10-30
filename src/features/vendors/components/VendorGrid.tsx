import { Store } from 'lucide-react';
import type { ReactNode } from 'react';
import { Pagination } from '@/components/ui/pagination';
import { EmptyState } from '@/components/ui/states';
import { PAGE_SIZE } from '@/lib/constants';
import { pluralize } from '@/lib/format';
import { usePagination } from '@/lib/hooks/usePagination';
import type { CelebrationEvent, Vendor } from '@/types';
import { VendorCard } from './VendorCard';

interface VendorGridProps {
  vendors: readonly Vendor[];
  /** Resets to the first page when the filters change. */
  resultsKey: string;
  shortlist: ReadonlySet<string>;
  event: CelebrationEvent | undefined;
  onToggleShortlist: (vendor: Vendor) => void;
  onAddToBudget: (vendor: Vendor) => void;
  emptyTitle: string;
  emptyAction: ReactNode;
}

/** Paginated vendor cards with a live result count and an empty state. */
export function VendorGrid({
  vendors,
  resultsKey,
  shortlist,
  event,
  onToggleShortlist,
  onAddToBudget,
  emptyTitle,
  emptyAction,
}: VendorGridProps) {
  const { pageItems, page, pageCount, setPage } = usePagination(vendors, PAGE_SIZE.vendors, resultsKey);

  return (
    <div className="space-y-5">
      <p className="mt-5 text-sm text-muted" role="status">
        {pluralize(vendors.length, 'vendor')} found
      </p>
      {pageItems.length > 0 ? (
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {pageItems.map((vendor) => (
            <VendorCard
              key={vendor.id}
              vendor={vendor}
              shortlisted={shortlist.has(vendor.id)}
              event={event}
              onToggleShortlist={onToggleShortlist}
              onAddToBudget={onAddToBudget}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Store}
          title={emptyTitle}
          description="Try clearing a filter or searching for a different service."
          action={emptyAction}
        />
      )}
      <Pagination label="Vendor directory pages" page={page} pageCount={pageCount} onPageChange={setPage} />
    </div>
  );
}

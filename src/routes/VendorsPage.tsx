import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/ui/headings';
import { VENDOR_DIRECTORY } from '@/data/seed';
import { useActiveEvent } from '@/features/events/hooks/useActiveEvent';
import { VendorDirectoryTabs } from '@/features/vendors/components/VendorDirectoryTabs';
import { VendorFilters } from '@/features/vendors/components/VendorFilters';
import { useVendorActions } from '@/features/vendors/hooks/useVendorActions';
import { DEFAULT_VENDOR_FILTERS, filterVendors } from '@/features/vendors/lib/vendorFilters';
import { useDocumentTitle } from '@/lib/hooks/useDocumentTitle';
import { useListFilters } from '@/lib/hooks/useListFilters';

/** Vendor directory: search and filter sample vendors, shortlist them and add quotes to the event budget. */
export default function VendorsPage() {
  useDocumentTitle('Vendors');
  const event = useActiveEvent();
  const actions = useVendorActions(event);
  const listFilters = useListFilters(VENDOR_DIRECTORY, DEFAULT_VENDOR_FILTERS, filterVendors);

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-10 sm:px-6 lg:px-8">
      <PageHeader
        eyebrow="Directory"
        title="Vendors"
        description="Browse venues, caterers, photographers, decorators and entertainers, then shortlist and budget for them."
      />
      <p className="flex items-center gap-2 rounded-2xl border border-gold/40 bg-gold-soft px-4 py-3 text-sm text-gold-ink">
        <AlertCircle className="size-4 shrink-0" aria-hidden="true" />
        Sample vendors for demonstration. Contact details are placeholders.
      </p>
      <VendorFilters {...listFilters} />
      <VendorDirectoryTabs
        results={listFilters.results}
        resultsKey={listFilters.resultsKey}
        event={event}
        clearFiltersAction={
          <Button variant="secondary" onClick={listFilters.clear}>
            Clear filters
          </Button>
        }
        {...actions}
      />
    </div>
  );
}

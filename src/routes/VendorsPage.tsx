import { AlertCircle, Heart, Store } from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/ui/headings';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { VENDOR_DIRECTORY } from '@/data/seed';
import { useBudgetStore } from '@/features/budget/store/useBudgetStore';
import { useActiveEvent } from '@/features/events/hooks/useActiveEvent';
import { VendorFilters } from '@/features/vendors/components/VendorFilters';
import { VendorGrid } from '@/features/vendors/components/VendorGrid';
import { DEFAULT_VENDOR_FILTERS, filterVendors, vendorBudgetCategory } from '@/features/vendors/lib/vendorFilters';
import { useVendorStore } from '@/features/vendors/store/useVendorStore';
import { useDocumentTitle } from '@/lib/hooks/useDocumentTitle';
import { useListFilters } from '@/lib/hooks/useListFilters';
import { notifyWithUndo } from '@/lib/undoToast';
import type { Vendor } from '@/types';

type DirectoryTab = 'all' | 'shortlisted';

/** Vendor directory: search and filter sample vendors, shortlist them and add quotes to the event budget. */
export default function VendorsPage() {
  useDocumentTitle('Vendors');
  const event = useActiveEvent();
  const shortlistIds = useVendorStore((state) => state.shortlist);
  const toggleShortlist = useVendorStore((state) => state.toggleShortlist);
  const addItem = useBudgetStore((state) => state.addItem);
  const deleteItem = useBudgetStore((state) => state.deleteItem);
  const [tab, setTab] = useState<DirectoryTab>('all');
  const listFilters = useListFilters(VENDOR_DIRECTORY, DEFAULT_VENDOR_FILTERS, filterVendors);
  const { results, resultsKey, clear } = listFilters;

  const shortlist = useMemo(() => new Set(shortlistIds), [shortlistIds]);
  const shortlisted = useMemo(() => results.filter((vendor) => shortlist.has(vendor.id)), [results, shortlist]);

  const onToggleShortlist = useCallback(
    (vendor: Vendor) => {
      toggleShortlist(vendor.id);
    },
    [toggleShortlist],
  );

  const onAddToBudget = useCallback(
    (vendor: Vendor) => {
      if (!event) {
        toast.error('Create an event before adding a vendor to a budget.');
        return;
      }
      const item = addItem(event.id, {
        category: vendorBudgetCategory(vendor.category),
        name: vendor.name,
        estimated: vendor.startingPrice,
        actual: 0,
        paid: false,
        vendorName: vendor.name,
        notes: 'Starting price from the vendor directory',
        source: 'manual',
      });
      notifyWithUndo(`${vendor.name} added to the ${event.name} budget`, () => {
        deleteItem(item.id);
      });
    },
    [addItem, deleteItem, event],
  );

  const gridProps = { shortlist, event, onToggleShortlist, onAddToBudget };
  const clearButton = (
    <Button variant="secondary" onClick={clear}>
      Clear filters
    </Button>
  );

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
      <Tabs
        value={tab}
        onValueChange={(value) => {
          setTab(value === 'shortlisted' ? 'shortlisted' : 'all');
        }}
      >
        <TabsList aria-label="Vendor lists">
          <TabsTrigger value="all">
            <Store aria-hidden="true" />
            All vendors
          </TabsTrigger>
          <TabsTrigger value="shortlisted">
            <Heart aria-hidden="true" />
            Shortlisted ({shortlist.size})
          </TabsTrigger>
        </TabsList>
        <TabsContent value="all">
          <VendorGrid
            vendors={results}
            resultsKey={resultsKey}
            emptyTitle="No vendors match"
            emptyAction={clearButton}
            {...gridProps}
          />
        </TabsContent>
        <TabsContent value="shortlisted">
          <VendorGrid
            vendors={shortlisted}
            resultsKey={resultsKey}
            emptyTitle="No shortlisted vendors"
            emptyAction={null}
            {...gridProps}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

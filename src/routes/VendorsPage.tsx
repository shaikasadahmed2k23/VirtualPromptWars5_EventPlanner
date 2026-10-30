import { AlertCircle, Heart, Store } from 'lucide-react';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/states';
import { PageHeader } from '@/components/ui/headings';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useBudgetStore } from '@/features/budget/store/useBudgetStore';
import { useEventStore } from '@/features/events/store/useEventStore';
import { useVendorFilters } from '@/features/vendors/hooks/useVendorFilters';
import { vendorBudgetCategory } from '@/features/vendors/lib/vendorFilters';
import { useVendorStore } from '@/features/vendors/store/useVendorStore';
import { VendorCard } from '@/features/vendors/components/VendorCard';
import { VendorFilters } from '@/features/vendors/components/VendorFilters';
import { PAGE_SIZE } from '@/lib/constants';
import { useDocumentTitle } from '@/lib/hooks/useDocumentTitle';

/** Vendors page. */
export default function VendorsPage() {
  useDocumentTitle('Vendors');
  const vendors = useVendorStore((state) => state.vendors);
  const shortlist = useVendorStore((state) => state.shortlist);
  const toggleShortlist = useVendorStore((state) => state.toggleShortlist);
  const events = useEventStore((state) => state.events);
  const activeEventId = useEventStore((state) => state.activeEventId);
  const addItem = useBudgetStore((state) => state.addItem);
  const deleteItem = useBudgetStore((state) => state.deleteItem);
  const [tab, setTab] = useState('all');
  const filters = useVendorFilters(vendors);
  const currentEvent = events.find((event) => event.id === activeEventId) ?? events[events.length - 1];
  const displayed = useMemo(
    () => tab === 'shortlisted' ? filters.filteredVendors.filter((vendor) => shortlist.includes(vendor.id)) : filters.filteredVendors,
    [filters.filteredVendors, shortlist, tab],
  );
  const addToBudget = (vendor: (typeof vendors)[number]) => {
    if (!currentEvent) {
      toast.error('Create an event before adding a vendor to a budget.');
      return;
    }
    const item = addItem(currentEvent.id, {
      category: vendorBudgetCategory(vendor.category),
      name: vendor.name,
      estimated: vendor.startingPrice,
      actual: 0,
      paid: false,
      vendorName: vendor.name,
      notes: 'Added from vendor directory',
      source: 'manual',
    });
    toast.success(`${vendor.name} added to ${currentEvent.name}`, {
      action: { label: 'Undo', onClick: () => deleteItem(item.id) },
    });
  };
  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-10 sm:px-6 lg:px-8">
      <PageHeader eyebrow="Directory" title="Vendors" description="Find trusted-looking inspiration for every part of your celebration." />
      <div role="note" className="flex items-center gap-2 rounded-2xl border border-gold/40 bg-gold-soft px-4 py-3 text-sm text-gold-ink">
        <AlertCircle className="size-4 shrink-0" aria-hidden="true" /><span>Sample vendors, demo data</span>
      </div>
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList><TabsTrigger value="all"><Store aria-hidden="true" />All vendors</TabsTrigger><TabsTrigger value="shortlisted"><Heart aria-hidden="true" />Shortlisted ({shortlist.length})</TabsTrigger></TabsList>
        <TabsContent value={tab}>
          <VendorFilters filters={filters} />
          <p className="mt-5 text-sm text-muted" role="status" aria-live="polite">{displayed.length} vendor{displayed.length === 1 ? '' : 's'} found</p>
          {displayed.length ? (
            <div className="mt-4 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {displayed.slice(0, PAGE_SIZE.vendors).map((vendor) => (
                <VendorCard key={vendor.id} vendor={vendor} shortlisted={shortlist.includes(vendor.id)} onShortlist={() => toggleShortlist(vendor.id)} onAddToBudget={() => addToBudget(vendor)} eventId={currentEvent?.id ?? null} />
              ))}
            </div>
          ) : (
            <EmptyState icon={Store} title={tab === 'shortlisted' ? 'No shortlisted vendors' : 'No vendors match'} description="Try clearing a filter or searching for a different service." action={<Button variant="secondary" onClick={filters.clear}>Clear filters</Button>} />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

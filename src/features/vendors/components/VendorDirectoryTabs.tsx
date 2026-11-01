import { Heart, Store } from 'lucide-react';
import { useMemo, useState, type ReactNode } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { CelebrationEvent, Vendor } from '@/types';
import type { VendorActions } from '../hooks/useVendorActions';
import { VendorGrid } from './VendorGrid';

type DirectoryTab = 'all' | 'shortlisted';

interface VendorDirectoryTabsProps extends VendorActions {
  /** Filtered vendors; the shortlisted tab shows the shortlisted subset of these. */
  results: readonly Vendor[];
  resultsKey: string;
  event: CelebrationEvent | undefined;
  /** Shown when no vendor matches the filters. */
  clearFiltersAction: ReactNode;
}

/** "All vendors" and "Shortlisted" tabs, each a paginated grid of the filtered results. */
export function VendorDirectoryTabs({
  results,
  resultsKey,
  clearFiltersAction,
  ...gridProps
}: VendorDirectoryTabsProps) {
  const [tab, setTab] = useState<DirectoryTab>('all');
  const { shortlist } = gridProps;
  const shortlisted = useMemo(() => results.filter((vendor) => shortlist.has(vendor.id)), [results, shortlist]);

  return (
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
          emptyAction={clearFiltersAction}
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
  );
}

import { useCallback, useMemo } from 'react';
import { toast } from 'sonner';
import { useBudgetStore } from '@/features/budget/store/useBudgetStore';
import { notifyWithUndo } from '@/lib/undoToast';
import type { CelebrationEvent, Vendor } from '@/types';
import { vendorBudgetCategory } from '../lib/vendorFilters';
import { useVendorStore } from '../store/useVendorStore';

/** Shortlist state for the directory, as a set for O(1) lookups per card. */
export interface VendorActions {
  shortlist: ReadonlySet<string>;
  onToggleShortlist: (vendor: Vendor) => void;
  /** Adds the vendor's starting price as a budget line on `event`, with undo. */
  onAddToBudget: (vendor: Vendor) => void;
}

/** Stable vendor-card callbacks (so memoised cards skip re-rendering) bound to the planning event. */
export function useVendorActions(event: CelebrationEvent | undefined): VendorActions {
  const shortlistIds = useVendorStore((state) => state.shortlist);
  const toggleShortlist = useVendorStore((state) => state.toggleShortlist);
  const addItem = useBudgetStore((state) => state.addItem);
  const deleteItem = useBudgetStore((state) => state.deleteItem);
  const shortlist = useMemo(() => new Set(shortlistIds), [shortlistIds]);

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

  return { shortlist, onToggleShortlist, onAddToBudget };
}

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { STORAGE_KEYS, STORE_VERSION } from '@/lib/constants';
import { nowISO } from '@/lib/dates';
import { createId } from '@/lib/id';
import { createMigrate, createSafeStorage } from '@/lib/storage';
import type { Id, QuoteRequest } from '@/types';

interface VendorState {
  /** Ids of shortlisted vendors. */
  shortlist: Id[];
  quoteRequests: QuoteRequest[];
}

interface VendorActions {
  toggleShortlist: (vendorId: Id) => void;
  submitQuoteRequest: (input: Omit<QuoteRequest, 'id' | 'createdAt'>) => QuoteRequest;
  reset: () => void;
}

export type VendorStore = VendorState & VendorActions;

function createInitialState(): VendorState {
  return { shortlist: [], quoteRequests: [] };
}

/** Vendor shortlist and quote requests (the directory itself is static demo data). */
export const useVendorStore = create<VendorStore>()(
  persist(
    (set) => ({
      ...createInitialState(),

      toggleShortlist: (vendorId) => {
        set((state) => ({
          shortlist: state.shortlist.includes(vendorId)
            ? state.shortlist.filter((id) => id !== vendorId)
            : [...state.shortlist, vendorId],
        }));
      },

      submitQuoteRequest: (input) => {
        const request: QuoteRequest = { ...input, id: createId('quote'), createdAt: nowISO() };
        set((state) => ({ quoteRequests: [...state.quoteRequests, request] }));
        return request;
      },

      reset: () => {
        set(createInitialState());
      },
    }),
    {
      name: STORAGE_KEYS.vendors,
      version: STORE_VERSION,
      storage: createSafeStorage<VendorState>(),
      partialize: ({ shortlist, quoteRequests }) => ({ shortlist, quoteRequests }),
      migrate: createMigrate<VendorState>(createInitialState),
    },
  ),
);

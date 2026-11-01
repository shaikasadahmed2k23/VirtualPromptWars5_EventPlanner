import { VENDOR_CITIES } from '@/data/seed';
import { ALL, type All, type FilterOption, toFilterOptions } from '@/lib/filterOptions';
import { VENDOR_CATEGORY_LABELS } from '@/lib/labels';
import {
  type BudgetCategory,
  PRICE_TIERS,
  type PriceTier,
  type Vendor,
  VENDOR_CATEGORIES,
  type VendorCategory,
} from '@/types';

export type VendorSort = 'rating' | 'price';

export interface VendorFilters {
  search: string;
  category: VendorCategory | All;
  city: string;
  priceTier: PriceTier | All;
  /** Minimum star rating; `0` means any. */
  minRating: number;
  sort: VendorSort;
}

/** Filters shown when the directory first opens. */
export const DEFAULT_VENDOR_FILTERS: VendorFilters = {
  search: '',
  category: ALL,
  city: ALL,
  priceTier: ALL,
  minRating: 0,
  sort: 'rating',
};

const RATING_THRESHOLDS = [4, 4.5] as const;

/** Price tier shown as rupee symbols, e.g. tier 3 → "₹₹₹". */
export function priceTierLabel(tier: PriceTier): string {
  return '₹'.repeat(tier);
}

/** Options for each directory filter control. */
export const VENDOR_FILTER_OPTIONS = {
  category: toFilterOptions(VENDOR_CATEGORIES, VENDOR_CATEGORY_LABELS, 'All categories'),
  city: [{ value: ALL, label: 'All cities' }, ...VENDOR_CITIES.map((city) => ({ value: city, label: city }))],
  priceTier: [
    { value: ALL, label: 'Any price' },
    ...PRICE_TIERS.map((tier) => ({ value: tier, label: priceTierLabel(tier) })),
  ] satisfies FilterOption<PriceTier | All>[],
  minRating: [
    { value: 0, label: 'Any rating' },
    ...RATING_THRESHOLDS.map((rating) => ({ value: rating, label: `${String(rating)}+ stars` })),
  ] satisfies FilterOption<number>[],
  sort: [
    { value: 'rating', label: 'Top rated' },
    { value: 'price', label: 'Price, low to high' },
  ] satisfies FilterOption<VendorSort>[],
};

/** Filters and sorts directory vendors without mutating the source array. */
export function filterVendors(vendors: readonly Vendor[], filters: VendorFilters): Vendor[] {
  const query = filters.search.trim().toLocaleLowerCase();
  return vendors
    .filter((vendor) => {
      const searchable = [vendor.name, vendor.city, vendor.description, ...vendor.tags].join(' ').toLocaleLowerCase();
      return (
        (!query || searchable.includes(query)) &&
        (filters.category === ALL || vendor.category === filters.category) &&
        (filters.city === ALL || vendor.city === filters.city) &&
        (filters.priceTier === ALL || vendor.priceTier === filters.priceTier) &&
        vendor.rating >= filters.minRating
      );
    })
    .sort((left, right) =>
      filters.sort === 'rating'
        ? right.rating - left.rating
        : left.priceTier - right.priceTier || right.rating - left.rating,
    );
}

const VENDOR_BUDGET_CATEGORY: Record<VendorCategory, BudgetCategory> = {
  venue: 'venue',
  photographer: 'photography',
  caterer: 'catering',
  decorator: 'decor',
  entertainer: 'entertainment',
};

/** The budget category a vendor's quote is tracked under. */
export function vendorBudgetCategory(category: VendorCategory): BudgetCategory {
  return VENDOR_BUDGET_CATEGORY[category];
}

import type { Vendor, VendorCategory, PriceTier } from '@/types';

export interface VendorFilters {
  search: string;
  category: VendorCategory | 'all';
  city: string;
  priceTier: PriceTier | 'all';
  minRating: number;
  sort: 'rating' | 'price';
}

/** Filters and sorts directory vendors without mutating the source array. */
export function filterVendors(vendors: readonly Vendor[], filters: VendorFilters): Vendor[] {
  const query = filters.search.trim().toLocaleLowerCase();
  return vendors
    .filter((vendor) => {
      const searchable = [vendor.name, vendor.city, vendor.description, ...vendor.tags].join(' ').toLocaleLowerCase();
      return (!query || searchable.includes(query))
        && (filters.category === 'all' || vendor.category === filters.category)
        && (filters.city === 'all' || vendor.city === filters.city)
        && (filters.priceTier === 'all' || vendor.priceTier === filters.priceTier)
        && vendor.rating >= filters.minRating;
    })
    .sort((left, right) => filters.sort === 'rating'
      ? right.rating - left.rating
      : left.priceTier - right.priceTier || right.rating - left.rating);
}

/** Returns the budget category corresponding to a vendor directory category. */
export function vendorBudgetCategory(category: VendorCategory): 'venue' | 'catering' | 'decor' | 'photography' | 'entertainment' {
  if (category === 'caterer') return 'catering';
  if (category === 'decorator') return 'decor';
  if (category === 'photographer') return 'photography';
  if (category === 'entertainer') return 'entertainment';
  return 'venue';
}

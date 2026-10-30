import { createSeedVendors } from '@/data/seed/vendors';
import { filterVendors, vendorBudgetCategory } from './vendorFilters';

const vendors = createSeedVendors();

describe('vendor filters', () => {
  it('filters by category, city, tier and rating', () => {
    const result = filterVendors(vendors, {
      search: '',
      category: 'venue',
      city: 'Hyderabad',
      priceTier: 'all',
      minRating: 4.5,
      sort: 'rating',
    });
    expect(
      result.every((vendor) => vendor.category === 'venue' && vendor.city === 'Hyderabad' && vendor.rating >= 4.5),
    ).toBe(true);
  });

  it('sorts by rating and maps categories to budget categories', () => {
    const result = filterVendors(vendors, {
      search: '',
      category: 'all',
      city: 'all',
      priceTier: 'all',
      minRating: 0,
      sort: 'rating',
    });
    expect(result[0]?.rating).toBeGreaterThanOrEqual(result[1]?.rating ?? 0);
    expect(vendorBudgetCategory('photographer')).toBe('photography');
    expect(vendorBudgetCategory('caterer')).toBe('catering');
  });
});

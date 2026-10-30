import { Search, SlidersHorizontal, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input, Select } from '@/components/ui/input';
import { Field } from '@/components/ui/field';
import { VENDOR_CATEGORY_LABELS } from '@/lib/labels';
import { PRICE_TIERS, VENDOR_CATEGORIES, type PriceTier, type VendorCategory } from '@/types';
import type { VendorFiltersState } from '../hooks/useVendorFilters';

const CITIES = ['all', 'Hyderabad', 'Bengaluru', 'Mumbai', 'Delhi', 'Chennai'] as const;

/** Search, filter and sort controls for the vendor directory. */
export function VendorFilters({ filters }: { filters: VendorFiltersState }) {
  const active = filters.category !== 'all' || filters.city !== 'all' || filters.priceTier !== 'all' || filters.minRating > 0;
  return (
    <section aria-label="Filter vendors" className="space-y-4 rounded-2xl border border-line bg-surface p-4 sm:p-5">
      <div className="flex items-end gap-3">
        <Field label="Search vendors" className="flex-1" hideLabel>
          {(props) => <div className="relative"><Search className="pointer-events-none absolute left-3 top-3 size-4 text-muted" aria-hidden="true" /><Input {...props} value={filters.search} onChange={(event) => filters.setSearch(event.target.value)} placeholder="Search by name, city or service" className="pl-9" /></div>}
        </Field>
        <Button variant="secondary" size="icon" aria-label="Filter options"><SlidersHorizontal aria-hidden="true" /></Button>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <Field label="Category">{(props) => <Select {...props} value={filters.category} onChange={(event) => filters.setCategory(event.target.value as VendorCategory | 'all')}><option value="all">All categories</option>{VENDOR_CATEGORIES.map((item) => <option key={item} value={item}>{VENDOR_CATEGORY_LABELS[item]}</option>)}</Select>}</Field>
        <Field label="City">{(props) => <Select {...props} value={filters.city} onChange={(event) => filters.setCity(event.target.value)}>{CITIES.map((item) => <option key={item} value={item}>{item === 'all' ? 'All cities' : item}</option>)}</Select>}</Field>
        <Field label="Price">{(props) => <Select {...props} value={filters.priceTier} onChange={(event) => filters.setPriceTier(event.target.value === 'all' ? 'all' : Number(event.target.value) as PriceTier)}><option value="all">Any price</option>{PRICE_TIERS.map((tier) => <option key={tier} value={tier}>{'₹'.repeat(tier)}</option>)}</Select>}</Field>
        <Field label="Minimum rating">{(props) => <Select {...props} value={filters.minRating} onChange={(event) => filters.setMinRating(Number(event.target.value))}><option value={0}>Any rating</option><option value={4}>4+ stars</option><option value={4.5}>4.5+ stars</option></Select>}</Field>
        <Field label="Sort by">{(props) => <Select {...props} value={filters.sort} onChange={(event) => filters.setSort(event.target.value as 'rating' | 'price')}><option value="rating">Top rated</option><option value="price">Price, low to high</option></Select>}</Field>
      </div>
      {active ? <Button variant="link" size="sm" onClick={filters.clear}><X aria-hidden="true" />Clear filters</Button> : null}
    </section>
  );
}

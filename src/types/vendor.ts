import type { CurrencyCode } from '@shared/domain';
import type { Id, ISODate, ISODateTime } from './common';

/** Vendor directory categories. */
export const VENDOR_CATEGORIES = ['venue', 'photographer', 'caterer', 'decorator', 'entertainer'] as const;
export type VendorCategory = (typeof VENDOR_CATEGORIES)[number];

/** Relative price band, 1 (budget) to 4 (luxury). */
export const PRICE_TIERS = [1, 2, 3, 4] as const;
export type PriceTier = (typeof PRICE_TIERS)[number];

/** A sample vendor listing (demo data). */
export interface Vendor {
  id: Id;
  name: string;
  category: VendorCategory;
  city: string;
  priceTier: PriceTier;
  /** Average rating out of 5. */
  rating: number;
  reviewCount: number;
  startingPrice: number;
  currency: CurrencyCode;
  description: string;
  tags: string[];
  /** Unsplash id of a curated photo; resolve with `photoById`. */
  photoId: string;
  email: string;
  phone: string;
}

/** A quote request submitted from the vendor directory. */
export interface QuoteRequest {
  id: Id;
  vendorId: Id;
  eventId: Id | null;
  name: string;
  email: string;
  eventDate: ISODate;
  guestCount: number;
  message: string;
  createdAt: ISODateTime;
}

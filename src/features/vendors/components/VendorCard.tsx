import { Heart, Mail, Phone, Star } from 'lucide-react';
import { memo, useId } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Photo } from '@/components/ui/photo';
import { PHOTOS, photoById } from '@/data/photos';
import { VENDOR_CATEGORY_LABELS } from '@/lib/labels';
import { PRICE_TIERS, type CelebrationEvent, type Vendor } from '@/types';
import { priceTierLabel } from '../lib/vendorFilters';
import { QuoteDialog } from './QuoteDialog';
import { VendorDetailsDialog } from './VendorDetailsDialog';

const CARD_PHOTO_ASPECT = 16 / 10;

interface VendorCardProps {
  vendor: Vendor;
  shortlisted: boolean;
  /** The event being planned, used for "Add to budget" and quote pre-fill. */
  event: CelebrationEvent | undefined;
  onToggleShortlist: (vendor: Vendor) => void;
  onAddToBudget: (vendor: Vendor) => void;
}

/** Directory listing: photo (opens details), rating, tags and planning actions. */
export const VendorCard = memo(function VendorCard({
  vendor,
  shortlisted,
  event,
  onToggleShortlist,
  onAddToBudget,
}: VendorCardProps) {
  const headingId = useId();
  const photo = photoById(vendor.photoId) ?? PHOTOS.mandapHall;

  return (
    <article
      aria-labelledby={headingId}
      className="overflow-hidden rounded-2xl border border-line bg-surface shadow-soft transition-transform duration-200 hover:-translate-y-1 hover:shadow-lift motion-reduce:transition-none motion-reduce:hover:translate-y-0"
    >
      <VendorDetailsDialog
        vendor={vendor}
        trigger={
          <button type="button" className="block w-full text-left" aria-label={`View details for ${vendor.name}`}>
            <Photo
              photo={photo}
              aspect={CARD_PHOTO_ASPECT}
              sizes="(min-width: 1024px) 30vw, (min-width: 768px) 45vw, 100vw"
            />
          </button>
        }
      />
      <div className="space-y-3 p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-rose-ink">
              {VENDOR_CATEGORY_LABELS[vendor.category]}
            </p>
            <h2 id={headingId} className="mt-1 text-xl">
              {vendor.name}
            </h2>
            <p className="text-sm text-muted">
              {vendor.city} · <span aria-hidden="true">{priceTierLabel(vendor.priceTier)}</span>
              <span className="sr-only">
                price level {vendor.priceTier} of {PRICE_TIERS.length}
              </span>
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label={shortlisted ? `Remove ${vendor.name} from shortlist` : `Add ${vendor.name} to shortlist`}
            aria-pressed={shortlisted}
            onClick={() => {
              onToggleShortlist(vendor);
            }}
          >
            <Heart aria-hidden="true" fill={shortlisted ? 'currentColor' : 'none'} />
          </Button>
        </div>
        <p className="text-sm text-muted">{vendor.description}</p>
        <p className="flex items-center gap-1 text-sm">
          <Star className="size-4 fill-gold text-gold-ink" aria-hidden="true" />
          {vendor.rating} out of 5<span className="text-muted">({vendor.reviewCount} reviews)</span>
        </p>
        <ul className="flex flex-wrap gap-2" aria-label="Specialities">
          {vendor.tags.map((tag) => (
            <li key={tag}>
              <Badge tone="neutral">{tag}</Badge>
            </li>
          ))}
        </ul>
        <div className="flex flex-wrap gap-2 pt-1">
          <Button
            size="sm"
            disabled={!event}
            onClick={() => {
              onAddToBudget(vendor);
            }}
          >
            Add to budget
          </Button>
          <QuoteDialog
            vendor={vendor}
            event={event}
            trigger={
              <Button size="sm" variant="secondary">
                Request quote
              </Button>
            }
          />
          <Button asChild variant="ghost" size="icon-sm">
            <a href={`mailto:${vendor.email}`} aria-label={`Email ${vendor.name}`}>
              <Mail aria-hidden="true" />
            </a>
          </Button>
          <Button asChild variant="ghost" size="icon-sm">
            <a href={`tel:${vendor.phone.replaceAll(' ', '')}`} aria-label={`Call ${vendor.name}`}>
              <Phone aria-hidden="true" />
            </a>
          </Button>
        </div>
      </div>
    </article>
  );
});

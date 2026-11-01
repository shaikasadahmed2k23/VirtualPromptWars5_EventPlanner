import type { ReactElement } from 'react';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Photo } from '@/components/ui/photo';
import { PHOTOS } from '@/data/photos';
import { VENDOR_CATEGORY_PHOTOS } from '@/data/seed';
import { ASPECT } from '@/lib/constants';
import { formatCurrency } from '@/lib/format';
import { VENDOR_CATEGORY_LABELS } from '@/lib/labels';
import type { Vendor } from '@/types';
import { priceTierLabel } from '../lib/vendorFilters';

const GALLERY_SIZE = 3;

/** Vendor profile with a small gallery, pricing and contact details. */
export function VendorDetailsDialog({ vendor, trigger }: { vendor: Vendor; trigger: ReactElement }) {
  const gallery = VENDOR_CATEGORY_PHOTOS[vendor.category].slice(0, GALLERY_SIZE);
  const details: [label: string, value: string][] = [
    ['Category', VENDOR_CATEGORY_LABELS[vendor.category]],
    ['Location', vendor.city],
    ['Price level', priceTierLabel(vendor.priceTier)],
    ['Starting at', formatCurrency(vendor.startingPrice, vendor.currency)],
    ['Email', vendor.email],
    ['Phone', vendor.phone],
  ];

  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent title={vendor.name} description={vendor.description} className="max-w-2xl">
        <div className="grid grid-cols-2 gap-2">
          {gallery.map((key, index) => (
            <Photo
              key={key}
              photo={PHOTOS[key]}
              aspect={index === 0 ? ASPECT.cinema : ASPECT.square}
              sizes="(min-width: 768px) 40rem, 90vw"
              className={index === 0 ? 'col-span-2' : ''}
            />
          ))}
        </div>
        <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
          {details.map(([label, value]) => (
            <div key={label}>
              <dt className="font-semibold">{label}</dt>
              <dd className="break-words text-muted">{value}</dd>
            </div>
          ))}
        </dl>
        <ul className="mt-4 flex flex-wrap gap-2" aria-label="Specialities">
          {vendor.tags.map((tag) => (
            <li key={tag}>
              <Badge>{tag}</Badge>
            </li>
          ))}
        </ul>
      </DialogContent>
    </Dialog>
  );
}

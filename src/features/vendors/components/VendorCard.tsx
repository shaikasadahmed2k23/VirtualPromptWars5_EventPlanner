import { Heart, Mail, Phone, Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Photo } from '@/components/ui/photo';
import { VENDOR_CATEGORY_LABELS } from '@/lib/labels';
import { PHOTOS } from '@/data/photos';
import type { Vendor, VendorCategory } from '@/types';
import { QuoteDialog } from './QuoteDialog';

function price(tier: number) { return '₹'.repeat(tier); }
function photoFor(vendor: Vendor) {
  return Object.values(PHOTOS).find((photo) => photo.id === vendor.photoId) ?? PHOTOS.mandapHall;
}
const GALLERY: Record<VendorCategory, readonly (keyof typeof PHOTOS)[]> = {
  venue: ['mandapHall', 'banquetHall', 'gardenGazebo'],
  photographer: ['vintageCamera', 'holdingHands', 'confettiKiss'],
  caterer: ['cateringBuffet', 'grazingPlatter', 'platedDinner'],
  decorator: ['floralTable', 'wildflowerTable', 'tentCentrepieces'],
  entertainer: ['concertGlow', 'djBooth', 'pinkStage'],
};

/** Image-rich vendor listing with detail and contact actions. */
export function VendorCard({ vendor, shortlisted, onShortlist, onAddToBudget, eventId }: { vendor: Vendor; shortlisted: boolean; onShortlist: () => void; onAddToBudget: () => void; eventId: string | null }) {
  return <Card className="group overflow-hidden transition-transform duration-200 hover:-translate-y-1 hover:shadow-lift">
    <Dialog><DialogTrigger asChild><button type="button" className="block w-full text-left"><Photo photo={photoFor(vendor)} aspect={16 / 10} sizes="(min-width: 1024px) 30vw, 100vw" /><span className="sr-only">View details for {vendor.name}</span></button></DialogTrigger>
      <DialogContent title={vendor.name} description={vendor.description} className="max-w-2xl"><div className="grid grid-cols-3 gap-2">{GALLERY[vendor.category].map((key, index) => <Photo key={key} photo={PHOTOS[key]} aspect={index === 0 ? 16 / 9 : 1} className={index === 0 ? 'col-span-3' : ''} />)}</div><div className="mt-4 grid gap-3 sm:grid-cols-2"><p><strong>Category:</strong> {VENDOR_CATEGORY_LABELS[vendor.category]}</p><p><strong>Location:</strong> {vendor.city}</p><p><strong>Price:</strong> {price(vendor.priceTier)}</p><p><strong>Starting at:</strong> ₹{vendor.startingPrice.toLocaleString('en-IN')}</p><p><strong>Contact:</strong> {vendor.email}</p><p><strong>Phone:</strong> {vendor.phone}</p></div><div className="mt-3 flex flex-wrap gap-2">{vendor.tags.map((tag) => <Badge key={tag}>{tag}</Badge>)}</div></DialogContent>
    </Dialog>
    <div className="space-y-3 p-5"><div className="flex items-start justify-between gap-3"><div><p className="text-xs font-semibold uppercase tracking-wide text-rose-ink">{VENDOR_CATEGORY_LABELS[vendor.category]}</p><h2 className="mt-1 text-xl">{vendor.name}</h2><p className="text-sm text-muted">{vendor.city} · {price(vendor.priceTier)}</p></div><Button variant="ghost" size="icon-sm" aria-label={`${shortlisted ? 'Remove' : 'Add'} ${vendor.name} ${shortlisted ? 'from' : 'to'} shortlist`} aria-pressed={shortlisted} onClick={onShortlist}><Heart aria-hidden="true" fill={shortlisted ? 'currentColor' : 'none'} /></Button></div>
      <p className="text-sm text-muted">{vendor.description}</p><div className="flex items-center gap-1 text-sm"><Star className="size-4 fill-gold text-gold-ink" aria-hidden="true" /><span aria-label={`${vendor.rating} out of 5`}>{vendor.rating} out of 5</span><span className="text-muted">({vendor.reviewCount})</span></div>
      <div className="flex flex-wrap gap-2">{vendor.tags.map((tag) => <Badge key={tag} tone="neutral">{tag}</Badge>)}</div>
      <div className="flex flex-wrap gap-2 pt-1"><Button size="sm" onClick={onAddToBudget}>Add to budget</Button><QuoteDialog vendor={vendor} eventId={eventId}><Button size="sm" variant="secondary">Request quote</Button></QuoteDialog><a className="inline-flex size-9 items-center justify-center rounded-full text-muted hover:bg-ivory-deep hover:text-rose-ink" href={`mailto:${vendor.email}`} aria-label={`Email ${vendor.name}`}><Mail aria-hidden="true" /></a><a className="inline-flex size-9 items-center justify-center rounded-full text-muted hover:bg-ivory-deep hover:text-rose-ink" href={`tel:${vendor.phone}`} aria-label={`Call ${vendor.name}`}><Phone aria-hidden="true" /></a></div>
    </div>
  </Card>;
}

import { PHOTOS, type PhotoKey } from '@/data/photos';
import type { Vendor, VendorCategory, PriceTier } from '@/types';

type VendorSeed = Omit<Vendor, 'id' | 'photoId'> & { photoId: PhotoKey };

const CITIES = ['Hyderabad', 'Bengaluru', 'Mumbai', 'Delhi', 'Chennai'] as const;
const CATEGORIES: readonly VendorCategory[] = ['venue', 'photographer', 'caterer', 'decorator', 'entertainer'];
const TIERS: readonly PriceTier[] = [1, 2, 3, 4];

const NAMES = [
  'Deccan Courtyard', 'Lakeview Celebrations', 'Marigold House', 'The Banyan Pavilion', 'Saffron Stories',
  'Iris Lens Co.', 'Golden Hour Frames', 'Mango Tree Photography', 'Paper Boat Studio', 'Rasa Table',
  'The Curry Leaf Kitchen', 'Pepper & Petal Catering', 'Namma Feast Co.', 'Gulmohar Decor', 'Mogra & Moss',
  'Rangoli Rooms', 'Petal Theory', 'Kite & Kora Events', 'The Brass Band', 'Moonlight Music Co.',
  'Dhol & Bloom', 'Rooftop Rhythm', 'Celebration Stage', 'Sitarra Entertainment',
] as const;

const PHOTOS_BY_CATEGORY: Record<VendorCategory, readonly PhotoKey[]> = {
  venue: ['mandapHall', 'banquetHall', 'gardenGazebo', 'greenhouseCafe', 'marqueeDining'],
  photographer: ['vintageCamera', 'holdingHands', 'confettiKiss', 'forestPortrait', 'brideBouquet'],
  caterer: ['cateringBuffet', 'grazingPlatter', 'chefPrep', 'platedDinner', 'friendsDining'],
  decorator: ['floralTable', 'wildflowerTable', 'tentCentrepieces', 'blushBanquet', 'lawnChairs'],
  entertainer: ['concertGlow', 'djBooth', 'pinkStage', 'stageConfetti', 'stringLightsToast'],
};

const TAGS: Record<VendorCategory, readonly string[]> = {
  venue: ['Indoor', 'Outdoor', 'Parking'],
  photographer: ['Candid', 'Films', 'Drone'],
  caterer: ['Regional', 'Live counters', 'Vegetarian'],
  decorator: ['Florals', 'Lighting', 'Styling'],
  entertainer: ['Live music', 'DJ', 'Emcee'],
};

const DESCRIPTIONS: Record<VendorCategory, string> = {
  venue: 'Beautifully managed celebration spaces with thoughtful hospitality.',
  photographer: 'Warm, documentary-led imagery for memories you will revisit.',
  caterer: 'Seasonal menus and polished service shaped around your celebration.',
  decorator: 'Layered florals, colour and light designed for your story.',
  entertainer: 'Memorable performances that bring every guest onto the dance floor.',
};

const SEEDS: readonly VendorSeed[] = NAMES.map((name, index) => {
  const category = CATEGORIES[index % CATEGORIES.length] ?? 'venue';
  const city = CITIES[index % CITIES.length] ?? 'Hyderabad';
  const priceTier = TIERS[index % TIERS.length] ?? 1;
  const categoryPhotos = PHOTOS_BY_CATEGORY[category];
  return {
    name,
    category,
    city,
    priceTier,
    rating: Number((4.2 + ((index * 7) % 8) / 10).toFixed(1)),
    reviewCount: 48 + index * 17,
    startingPrice: (priceTier * 75_000) + (index % 3) * 25_000,
    currency: 'INR',
    description: DESCRIPTIONS[category],
    tags: [...TAGS[category]],
    photoId: categoryPhotos[index % categoryPhotos.length] ?? 'mandapHall',
    email: `hello${String(index + 1).padStart(2, '0')}@example.com`,
    phone: `+91 00000 000${String(index + 1).padStart(2, '0')}`,
  };
});

/** Curated sample directory vendors used by the demo directory. */
export function createSeedVendors(): Vendor[] {
  return SEEDS.map((vendor, index) => ({
    ...vendor,
    id: `vendor-seed-${String(index + 1).padStart(2, '0')}`,
    photoId: PHOTOS[vendor.photoId].id,
  }));
}

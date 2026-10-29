import { DEMO_EVENT_ID } from '@/lib/constants';
import type { BudgetCategory, BudgetItem } from '@/types';

type SeedItem = [
  category: BudgetCategory,
  name: string,
  estimated: number,
  actual: number,
  paid: boolean,
  vendor: string,
];

const SEED_ITEMS: readonly SeedItem[] = [
  ['venue', 'Reception courtyard (evening)', 420_000, 420_000, true, 'The Nizam’s Courtyard'],
  ['venue', 'Haldi & sangeet terrace', 100_000, 0, false, ''],
  ['catering', 'Reception dinner — 250 guests', 440_000, 220_000, false, 'Deccan Dastarkhwan Caterers'],
  ['catering', 'Sangeet snacks & mocktail bar', 90_000, 0, false, ''],
  ['decor', 'Mandap & floral décor', 170_000, 176_000, false, 'Gulmohar Florals'],
  ['decor', 'Jasmine strings & lantern lighting', 40_000, 0, false, ''],
  ['photography', 'Photography + cinematic film', 140_000, 140_000, true, 'Ivory Lens Studio'],
  ['attire', 'Bridal lehenga', 110_000, 112_000, true, ''],
  ['attire', 'Groom sherwani & safa', 60_000, 58_000, true, ''],
  ['entertainment', 'Live qawwali ensemble', 65_000, 0, false, ''],
  ['entertainment', 'Sangeet DJ & choreographer', 50_000, 0, false, ''],
  ['invitations', 'Printed invites & e-cards', 25_000, 22_000, true, ''],
  ['misc', 'Guest shuttles from hotels', 40_000, 0, false, ''],
  ['misc', 'Return favours — mithai boxes', 20_000, 0, false, ''],
];

/** Budget lines for the demo wedding (₹18L total, ~99% committed). */
export function createSeedBudget(): BudgetItem[] {
  return SEED_ITEMS.map(([category, name, estimated, actual, paid, vendorName], index) => ({
    id: `budget-seed-${String(index + 1).padStart(2, '0')}`,
    eventId: DEMO_EVENT_ID,
    category,
    name,
    estimated,
    actual,
    paid,
    vendorName,
  }));
}

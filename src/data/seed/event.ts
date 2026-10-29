import { DEMO_EVENT_ID } from '@/lib/constants';
import type { CelebrationEvent } from '@/types';

const SEEDED_AT = '2026-08-14T10:00:00.000Z';

/** The fully-planned demo wedding shown on first load. */
export function createSeedEvent(): CelebrationEvent {
  return {
    id: DEMO_EVENT_ID,
    name: 'Ayesha & Rohan’s Wedding',
    type: 'wedding',
    date: '2027-02-13',
    startTime: '18:30',
    city: 'Hyderabad',
    venue: 'The Nizam’s Courtyard, Banjara Hills',
    guestCount: 250,
    budget: 1_800_000,
    currency: 'INR',
    style: 'royal',
    requirements: {
      dietary: ['vegetarian', 'non-vegetarian', 'jain', 'halal'],
      accessibility:
        'Step-free access throughout, reserved front-row seating for two grandparents, and one guest uses a wheelchair.',
      cultural:
        'Hyderabadi–Telugu fusion: haldi and sangeet the evening before, a morning nikah, and a joint reception. Keep the baraat short.',
      notes: 'Ayesha loves jasmine and old Hyderabadi architecture; Rohan would love live qawwali at the reception.',
    },
    theme: {
      id: 'theme-seed-nizami-nights',
      savedAt: '2026-08-20T09:30:00.000Z',
      name: 'Nizami Nights',
      story:
        'Inspired by the palaces of old Hyderabad: emerald courtyards, gold filigree and strings of jasmine glowing under lantern light. Grand without being heavy, and warmly romantic.',
      palette: [
        { name: 'Nizam Emerald', hex: '#1F5C4A' },
        { name: 'Antique Gold', hex: '#C9A66B' },
        { name: 'Rose Attar', hex: '#B5646E' },
        { name: 'Pearl', hex: '#F4EDE3' },
        { name: 'Midnight Plum', hex: '#3E2A47' },
      ],
      decor: [
        'Jasmine and rose strings cascading from courtyard arches',
        'Brass urlis floating marigold petals and tea-lights',
        'Emerald velvet lounge seating with gold-trimmed bolsters',
        'Hand-painted lanterns lining the baraat path',
      ],
      mood: 'regal',
      keywords: ['palace', 'jasmine', 'lanterns', 'gold'],
    },
    createdAt: SEEDED_AT,
    updatedAt: SEEDED_AT,
  };
}

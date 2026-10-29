import { DEMO_EVENT_ID } from '@/lib/constants';
import type { Guest, GuestDietary, GuestGroup, RsvpStatus } from '@/types';

type SeedGuest = [name: string, group: GuestGroup, rsvp: RsvpStatus, dietary: GuestDietary, plusOnes: number];

const SEED_GUESTS: readonly SeedGuest[] = [
  ['Farah Siddiqui', 'bride-side', 'attending', 'halal', 1],
  ['Imran Siddiqui', 'family', 'attending', 'halal', 3],
  ['Zoya Khan', 'friends', 'attending', 'vegetarian', 0],
  ['Sameer Qureshi', 'bride-side', 'pending', 'halal', 1],
  ['Nazia Begum', 'family', 'attending', 'halal', 0],
  ['Tanvir Ahmed', 'colleagues', 'declined', 'none', 0],
  ['Lakshmi Reddy', 'groom-side', 'attending', 'vegetarian', 1],
  ['Venkat Rao', 'family', 'attending', 'vegetarian', 2],
  ['Ananya Iyer', 'friends', 'attending', 'vegan', 0],
  ['Karthik Menon', 'groom-side', 'pending', 'non-vegetarian', 1],
  ['Priya Sharma', 'colleagues', 'attending', 'jain', 0],
  ['Rahul Jain', 'friends', 'attending', 'jain', 1],
  ['Meera Nair', 'groom-side', 'pending', 'vegetarian', 0],
  ['Arjun Kapoor', 'friends', 'attending', 'non-vegetarian', 1],
  ['Sneha Patil', 'colleagues', 'pending', 'gluten-free', 0],
  ['Daniel D’Souza', 'friends', 'attending', 'non-vegetarian', 1],
  ['Fatima Hussain', 'bride-side', 'attending', 'halal', 2],
  ['Ravi Teja', 'groom-side', 'declined', 'vegetarian', 0],
  ['Aditi Kulkarni', 'friends', 'attending', 'vegetarian', 0],
  ['Suresh Babu', 'family', 'attending', 'none', 1],
  ['Kavya Reddy', 'groom-side', 'pending', 'vegetarian', 0],
  ['Yusuf Ali', 'bride-side', 'attending', 'halal', 1],
];

function toContact(name: string): Pick<Guest, 'email' | 'phone'> {
  const handle = name
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^a-z\s]/g, '')
    .trim()
    .replace(/\s+/g, '.');
  return { email: `${handle}@example.com`, phone: '' };
}

/** Guest households for the demo wedding with a realistic RSVP mix. */
export function createSeedGuests(): Guest[] {
  return SEED_GUESTS.map(([name, group, rsvp, dietary, plusOnes], index) => ({
    id: `guest-seed-${String(index + 1).padStart(2, '0')}`,
    eventId: DEMO_EVENT_ID,
    name,
    ...toContact(name),
    rsvp,
    dietary,
    plusOnes,
    group,
  }));
}

import { DEMO_EVENT_ID } from '@/lib/constants';
import type { StoredPlan } from '@/types';

/** A previously generated AI plan for the demo wedding. */
export function createSeedPlan(): StoredPlan {
  return {
    id: 'plan-seed-01',
    eventId: DEMO_EVENT_ID,
    aiMode: 'demo',
    refinements: [],
    generatedAt: '2026-08-20T09:00:00.000Z',
    savedAt: '2026-08-20T09:05:00.000Z',
    plan: {
      concept: {
        title: 'Nizami Nights & Jasmine Mornings',
        tagline: 'A Hyderabadi–Telugu union told through courtyards, qawwali and candlelight.',
        summary:
          'Two families, two traditions, one courtyard. The celebration moves from a sunlit haldi to a lantern-lit sangeet, a serene morning nikah, and a regal evening reception under the stars. Every detail borrows from old Hyderabad: jasmine strings, brass urlis, emerald velvet and gold filigree. The menu honours both kitchens, from Hyderabadi dum biryani to Andhra-style pulihora.',
        highlights: [
          'Jasmine canopy entrance with a live shehnai welcome',
          'Fusion menu honouring both families’ kitchens',
          'Live qawwali under the stars at the reception',
          'Step-free layout with reserved seating for elders',
        ],
      },
      decorIdeas: [
        {
          title: 'Jasmine canopy arches',
          description:
            'Cascading jasmine and red rose strings over the courtyard arches, lit from below by brass diyas.',
        },
        {
          title: 'Emerald lounge majlis',
          description: 'Low emerald-velvet seating with gold bolsters and hookah-free mocktail service for elders.',
        },
        {
          title: 'Floating urli centrepieces',
          description: 'Brass urlis of marigold petals and tea-lights on every guest table, echoing palace fountains.',
        },
        {
          title: 'Lantern-lined baraat path',
          description: 'Hand-painted lanterns guide a short, accessible baraat route to the mandap.',
        },
      ],
      menu: [
        {
          course: 'Welcome',
          items: ['Rose sherbet', 'Tender coconut water', 'Mini lukhmi', 'Paneer tikka skewers'],
        },
        {
          course: 'Mains',
          items: [
            'Hyderabadi dum biryani (mutton & vegetable)',
            'Andhra pulihora',
            'Mirchi ka salan',
            'Jain dal tadka',
          ],
          note: 'Separate Jain and halal stations with clear signage.',
        },
        {
          course: 'Desserts',
          items: ['Double ka meetha', 'Qubani ka meetha with cream', 'Pootharekulu', 'Paan kulfi'],
        },
      ],
      activities: [
        {
          name: 'Haldi games',
          description: 'Playful family-vs-family challenges in the terrace garden.',
          duration: '45 min',
        },
        {
          name: 'Sangeet performances',
          description: 'Choreographed dances from both families and friends.',
          duration: '90 min',
        },
        {
          name: 'Live qawwali',
          description: 'A six-piece ensemble performing classic and contemporary qawwali.',
          duration: '60 min',
        },
        {
          name: 'Mehendi lounge',
          description: 'Two mehendi artists for guests during the sangeet.',
          duration: '2 hrs',
        },
      ],
      schedule: [
        {
          time: '17:30',
          title: 'Guest arrival',
          description: 'Shehnai welcome, rose sherbet and jasmine garlands at the gate.',
        },
        { time: '18:30', title: 'Baraat arrives', description: 'Short lantern-lit procession to the courtyard.' },
        { time: '19:15', title: 'Couple’s entrance', description: 'Grand entry beneath the jasmine canopy.' },
        { time: '19:45', title: 'Dinner opens', description: 'Buffet with dedicated Jain and halal stations.' },
        { time: '20:30', title: 'Live qawwali', description: 'Ensemble performance on the courtyard stage.' },
        { time: '21:45', title: 'Cake & toasts', description: 'Family toasts and a three-tier rose-pistachio cake.' },
        { time: '22:30', title: 'Send-off', description: 'Sparkler-free petal send-off for an accessible exit.' },
      ],
      suggestedTasks: [
        { title: 'Book shehnai player for the welcome', category: 'vendors', priority: 'medium', monthsBefore: 2 },
        { title: 'Order brass urlis and tea-lights', category: 'decor', priority: 'low', monthsBefore: 1 },
        { title: 'Plan step-free baraat route with venue', category: 'logistics', priority: 'high', monthsBefore: 2 },
        { title: 'Schedule menu tasting for both families', category: 'catering', priority: 'high', monthsBefore: 3 },
      ],
      budgetAllocation: [
        { category: 'venue', percent: 29, note: 'Courtyard for the reception plus terrace for haldi and sangeet.' },
        { category: 'catering', percent: 30, note: 'Fusion menu for 250 with separate dietary stations.' },
        { category: 'decor', percent: 12, note: 'Jasmine canopy, lanterns and urli centrepieces.' },
        { category: 'photography', percent: 8, note: 'Photo + cinematic film across all functions.' },
        { category: 'attire', percent: 9, note: 'Lehenga, sherwani and family coordination.' },
        { category: 'entertainment', percent: 6, note: 'Qawwali ensemble and sangeet DJ.' },
        { category: 'invitations', percent: 2, note: 'Printed invites with matching e-cards.' },
        { category: 'misc', percent: 4, note: 'Shuttles, favours and contingency.' },
      ],
    },
  };
}

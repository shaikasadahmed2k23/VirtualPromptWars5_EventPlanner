import type { BudgetCategory, EventStyle, EventType, TaskCategory, TaskPriority } from '../domain.js';
import type { SpendTier } from './context.js';

/** Content tables for the offline demo planner. Data only; no logic. */

export interface Idea {
  title: string;
  description: string;
}
export interface Activity {
  name: string;
  description: string;
  duration: string;
}
export interface ScheduleStep {
  /** Minutes after the event start time (negative = before). */
  offset: number;
  title: string;
  description: string;
}
export interface TaskIdea {
  title: string;
  category: TaskCategory;
  priority: TaskPriority;
  monthsBefore: number;
}

export const TYPE_TITLE: Record<EventType, string> = {
  wedding: 'Wedding Nights',
  birthday: 'Birthday Soirée',
  anniversary: 'Anniversary Evening',
  community: 'Community Celebration',
};

export const STYLE_ADJECTIVE: Record<EventStyle, string> = {
  traditional: 'Heirloom',
  royal: 'Regal',
  modern: 'Modern',
  minimal: 'Quiet-Luxe',
  rustic: 'Rustic',
  garden: 'Garden',
  bohemian: 'Bohemian',
  festive: 'Festive',
};

export const STYLE_MOOD: Record<EventStyle, string> = {
  traditional: 'Think heirloom brass, marigold and the rituals your families hold dear.',
  royal: 'Think jewel tones, gilded details and grand, unhurried entrances.',
  modern: 'Think sculptural florals, statement lighting and crisp, considered lines.',
  minimal: 'Think calm whites, natural textures and a few beautiful things done well.',
  rustic: 'Think warm wood, wildflowers and the glow of string lights at dusk.',
  garden: 'Think open sky, lush greens and blooms that feel freshly gathered.',
  bohemian: 'Think layered textiles, pampas grass and a relaxed, golden-hour ease.',
  festive: 'Think joyful colour, music from the first minute and abundance everywhere.',
};

export const TIER_LABEL: Record<SpendTier, string> = {
  modest: 'thoughtful',
  comfortable: 'comfortable',
  lavish: 'generous',
};

export const TIER_SENTENCE: Record<SpendTier, string> = {
  modest:
    'Spend is focused where guests feel it most (food, light and music), with rented and DIY décor everywhere else.',
  comfortable: 'The budget allows polished details throughout, with a little held back for surprises on the day.',
  lavish: 'The budget makes room for signature moments: live performers, couture florals and a dramatic finale.',
};

export const STYLE_DECOR: Record<EventStyle, readonly Idea[]> = {
  traditional: [
    {
      title: 'Marigold and mango-leaf torans',
      description: 'Fresh torans over every doorway, echoing auspicious entrances.',
    },
    {
      title: 'Brass urli centrepieces',
      description: 'Floating petals and tea-lights in polished brass on each table.',
    },
  ],
  royal: [
    {
      title: 'Velvet majlis lounges',
      description: 'Low jewel-toned seating with gold bolsters for elders and guests.',
    },
    { title: 'Chandelier-lit canopy', description: 'Crystal drops suspended over the main stage for a palatial glow.' },
  ],
  modern: [
    {
      title: 'Sculptural floral arches',
      description: 'Asymmetric installations of orchids and anthuriums framing the stage.',
    },
    { title: 'Neon monogram wall', description: 'A custom neon sign as the photo backdrop guests will remember.' },
  ],
  minimal: [
    { title: 'All-white tablescapes', description: 'Linen, ceramics and single-stem vases for a calm, refined look.' },
    { title: 'Candlelit pathways', description: 'Rows of pillar candles guiding guests between spaces.' },
  ],
  rustic: [
    { title: 'Wildflower jar runners', description: 'Mason jars of seasonal wildflowers along long wooden tables.' },
    { title: 'Lantern-strung canopy', description: 'Edison bulbs and paper lanterns criss-crossing overhead.' },
  ],
  garden: [
    { title: 'Floral ceremony arch', description: 'A lush arch of roses and greenery as the focal point outdoors.' },
    { title: 'Hanging greenery installations', description: 'Ferns and trailing ivy suspended above the dining area.' },
  ],
  bohemian: [
    { title: 'Layered rug lounges', description: 'Kilims, floor cushions and pampas grass for relaxed seating.' },
    { title: 'Macramé backdrop', description: 'A hand-knotted backdrop for the stage and photo moments.' },
  ],
  festive: [
    { title: 'Colour-burst entrance', description: 'Ribbon curtains and balloon clusters in a joyful palette.' },
    { title: 'Fairy-light ceiling', description: 'Thousands of warm lights turning the venue into a starry sky.' },
  ],
};

export const TYPE_DECOR: Record<EventType, Idea> = {
  wedding: {
    title: 'Mandap with draped florals',
    description: 'A four-pillar mandap dressed in fabric and seasonal blooms.',
  },
  birthday: {
    title: 'Milestone photo wall',
    description: 'A timeline of photos from every year, with props for selfies.',
  },
  anniversary: {
    title: 'Love-story gallery',
    description: 'Framed moments from your years together lining the entrance.',
  },
  community: {
    title: 'Wayfinding signage',
    description: 'Bold, bilingual signs for stalls, stage, help desk and exits.',
  },
};

export const BUDGET_DECOR: readonly Idea[] = [
  {
    title: 'Rented décor packages',
    description: 'Rent props and drapes as a bundle rather than buying them outright.',
  },
  { title: 'Seasonal, local flowers', description: 'Choose in-season blooms from local markets to cut floral costs.' },
];

export const ECO_DECOR: readonly Idea[] = [
  {
    title: 'Reusable fabric and potted plants',
    description: 'Décor that can be returned, replanted or gifted afterwards.',
  },
  {
    title: 'Plastic-free table settings',
    description: 'Banana-leaf or steel thalis and cloth napkins instead of disposables.',
  },
];

export const TYPE_ACTIVITIES: Record<EventType, readonly Activity[]> = {
  wedding: [
    { name: 'Live welcome music', description: 'Shehnai or strings as guests arrive.', duration: '45 min' },
    {
      name: 'Grand couple entrance',
      description: 'A choreographed entry beneath the floral canopy.',
      duration: '15 min',
    },
    { name: 'Family toasts', description: 'Short, heartfelt words from both families.', duration: '30 min' },
    {
      name: 'Open dance floor',
      description: 'A DJ set that moves from classics to chart-toppers.',
      duration: '90 min',
    },
  ],
  birthday: [
    { name: 'Memory lane', description: 'A slideshow of milestones, with guests adding captions.', duration: '20 min' },
    { name: 'Party games', description: 'Quick-fire team games with small prizes.', duration: '45 min' },
    { name: 'Cake cutting and toast', description: 'The moment everyone sings along.', duration: '15 min' },
    { name: 'DJ set', description: 'A playlist built from the guest of honour’s favourites.', duration: '90 min' },
  ],
  anniversary: [
    { name: 'Our story slideshow', description: 'Photos and voice notes from friends and family.', duration: '20 min' },
    { name: 'Vow renewal moment', description: 'A short, intimate exchange of new promises.', duration: '20 min' },
    { name: 'Live acoustic set', description: 'Songs from the year you met, played live.', duration: '60 min' },
  ],
  community: [
    { name: 'Opening address', description: 'A warm welcome from the organising committee.', duration: '15 min' },
    {
      name: 'Local talent showcase',
      description: 'Performances from neighbourhood artists and students.',
      duration: '90 min',
    },
    { name: 'Food and craft stalls', description: 'Local vendors and makers around the venue.', duration: 'All day' },
    { name: 'Lucky draw', description: 'Sponsored prizes to close the evening.', duration: '20 min' },
  ],
};

export const TRADITION_ACTIVITIES: Record<string, Activity> = {
  sangeet: {
    name: 'Sangeet night',
    description: 'Family dance performances and a live dhol finale.',
    duration: '2 hrs',
  },
  mehendi: { name: 'Mehendi lounge', description: 'Henna artists for guests, with chai and music.', duration: '3 hrs' },
  haldi: {
    name: 'Haldi morning',
    description: 'Turmeric ceremony with marigold showers and games.',
    duration: '90 min',
  },
};

export const KIDS_ACTIVITIES: readonly Activity[] = [
  { name: 'Kids’ craft corner', description: 'Supervised crafts, colouring and face painting.', duration: '2 hrs' },
  { name: 'Magic show', description: 'A short, interactive show for younger guests.', duration: '30 min' },
];

export const ECO_ACTIVITY: Activity = {
  name: 'Seed-paper favour station',
  description: 'Guests plant a message for the hosts and take a sapling home.',
  duration: '1 hr',
};

export const TYPE_SCHEDULE: Record<EventType, readonly ScheduleStep[]> = {
  wedding: [
    { offset: -60, title: 'Guest arrival', description: 'Welcome drinks and live music at the entrance.' },
    { offset: 0, title: 'Baraat and welcome', description: 'A short procession to the ceremony space.' },
    { offset: 45, title: 'Ceremony', description: 'Rituals led by the officiant, with family close by.' },
    { offset: 120, title: 'Dinner opens', description: 'Buffet and stations open for all guests.' },
    { offset: 180, title: 'Toasts and first dance', description: 'Family toasts followed by the couple’s dance.' },
    { offset: 240, title: 'Send-off', description: 'Petal shower and farewells.' },
  ],
  birthday: [
    { offset: -30, title: 'Guests arrive', description: 'Mocktails and a photo-wall welcome.' },
    { offset: 30, title: 'Games', description: 'Team games and small prizes.' },
    { offset: 90, title: 'Cake cutting', description: 'Candles, a song and a toast.' },
    { offset: 120, title: 'Dinner', description: 'Buffet opens.' },
    { offset: 180, title: 'Dance floor', description: 'DJ set to close the night.' },
  ],
  anniversary: [
    { offset: -30, title: 'Welcome', description: 'Guests greeted with a signature drink.' },
    { offset: 15, title: 'Our story', description: 'Slideshow and short speeches.' },
    { offset: 60, title: 'Vow renewal', description: 'An intimate exchange of promises.' },
    { offset: 90, title: 'Dinner and live music', description: 'Plated dinner with an acoustic set.' },
    { offset: 180, title: 'Farewell', description: 'Thank-yous and favours.' },
  ],
  community: [
    { offset: -60, title: 'Volunteer briefing', description: 'Roles, radios and first-aid points confirmed.' },
    { offset: 0, title: 'Gates open', description: 'Stalls open and music begins.' },
    { offset: 60, title: 'Opening address', description: 'Welcome from the committee.' },
    { offset: 90, title: 'Talent showcase', description: 'Performances on the main stage.' },
    { offset: 210, title: 'Lucky draw', description: 'Prizes announced on stage.' },
    { offset: 240, title: 'Close and clean-up', description: 'Volunteers lead a quick, organised clean-up.' },
  ],
};

export const TYPE_TASKS: Record<EventType, readonly TaskIdea[]> = {
  wedding: [
    { title: 'Book the officiant and confirm rituals', category: 'ceremony', priority: 'high', monthsBefore: 4 },
    { title: 'Schedule a menu tasting with both families', category: 'catering', priority: 'high', monthsBefore: 3 },
    { title: 'Finalise décor and floral design', category: 'decor', priority: 'medium', monthsBefore: 2 },
    { title: 'Share the run-of-show with every vendor', category: 'logistics', priority: 'medium', monthsBefore: 0 },
  ],
  birthday: [
    { title: 'Confirm the venue and decorations', category: 'venue', priority: 'high', monthsBefore: 1 },
    { title: 'Order the cake', category: 'catering', priority: 'medium', monthsBefore: 0 },
    { title: 'Plan games and buy prizes', category: 'other', priority: 'low', monthsBefore: 0 },
  ],
  anniversary: [
    { title: 'Reserve the venue', category: 'venue', priority: 'high', monthsBefore: 2 },
    { title: 'Collect photos for the slideshow', category: 'decor', priority: 'medium', monthsBefore: 1 },
    { title: 'Book the acoustic musician', category: 'vendors', priority: 'medium', monthsBefore: 1 },
  ],
  community: [
    { title: 'Apply for permits and inform local authorities', category: 'venue', priority: 'high', monthsBefore: 3 },
    { title: 'Recruit and brief volunteers', category: 'guests', priority: 'high', monthsBefore: 2 },
    { title: 'Arrange first-aid and accessibility cover', category: 'logistics', priority: 'high', monthsBefore: 1 },
  ],
};

export const CATEGORY_NOTES: Record<BudgetCategory, string> = {
  venue: 'Venue hire, power back-up and setup time.',
  catering: 'Per-plate food and beverages, plus service staff.',
  decor: 'Florals, lighting, drapes and stage.',
  photography: 'Photo and video coverage with edited delivery.',
  attire: 'Outfits, styling and accessories.',
  entertainment: 'Music, performers and sound.',
  invitations: 'Printed and digital invitations.',
  misc: 'Transport, favours and a contingency buffer.',
};

/** Extra tasks added when a plan is refined or a need is detected. */
export const TASK_IDEAS_EXTRA: Record<'sangeet' | 'kids' | 'eco' | 'budget' | 'accessibility', TaskIdea> = {
  sangeet: { title: 'Book a sangeet choreographer', category: 'ceremony', priority: 'medium', monthsBefore: 2 },
  kids: { title: 'Hire a kids’ activity host', category: 'vendors', priority: 'low', monthsBefore: 1 },
  eco: { title: 'Source rental décor and reusable tableware', category: 'decor', priority: 'medium', monthsBefore: 2 },
  budget: {
    title: 'Collect three quotes for each major vendor',
    category: 'vendors',
    priority: 'high',
    monthsBefore: 3,
  },
  accessibility: {
    title: 'Walk the venue to check step-free access',
    category: 'logistics',
    priority: 'high',
    monthsBefore: 1,
  },
};

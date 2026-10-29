import type {
  BudgetCategory,
  CurrencyCode,
  DietaryOption,
  EventStyle,
  EventType,
  TaskCategory,
  TaskPriority,
  ThemeMood,
} from '@shared/domain';
import type { GuestDietary, GuestGroup, RsvpStatus, VendorCategory } from '@/types';

/** Human-readable labels for every domain enum, in one place. */

export const EVENT_TYPE_LABELS: Record<EventType, string> = {
  wedding: 'Wedding',
  birthday: 'Birthday',
  anniversary: 'Anniversary',
  community: 'Community event',
};

export const EVENT_STYLE_LABELS: Record<EventStyle, string> = {
  traditional: 'Traditional',
  royal: 'Royal & regal',
  modern: 'Modern chic',
  minimal: 'Minimal',
  rustic: 'Rustic',
  garden: 'Garden',
  bohemian: 'Bohemian',
  festive: 'Festive & colourful',
};

export const CURRENCY_LABELS: Record<CurrencyCode, string> = {
  INR: 'Indian rupee (₹)',
  USD: 'US dollar ($)',
  EUR: 'Euro (€)',
  GBP: 'British pound (£)',
  AED: 'UAE dirham (AED)',
  SGD: 'Singapore dollar (S$)',
};

export const BUDGET_CATEGORY_LABELS: Record<BudgetCategory, string> = {
  venue: 'Venue',
  catering: 'Catering',
  decor: 'Décor',
  photography: 'Photography',
  attire: 'Attire',
  entertainment: 'Entertainment',
  invitations: 'Invitations',
  misc: 'Miscellaneous',
};

export const TASK_CATEGORY_LABELS: Record<TaskCategory, string> = {
  venue: 'Venue',
  catering: 'Catering',
  decor: 'Décor',
  attire: 'Attire',
  guests: 'Guests',
  vendors: 'Vendors',
  ceremony: 'Ceremony',
  logistics: 'Logistics',
  other: 'Other',
};

export const TASK_PRIORITY_LABELS: Record<TaskPriority, string> = {
  high: 'High',
  medium: 'Medium',
  low: 'Low',
};

export const DIETARY_LABELS: Record<DietaryOption, string> = {
  vegetarian: 'Vegetarian',
  'non-vegetarian': 'Non-vegetarian',
  vegan: 'Vegan',
  jain: 'Jain',
  'gluten-free': 'Gluten-free',
  halal: 'Halal',
};

export const GUEST_DIETARY_LABELS: Record<GuestDietary, string> = {
  none: 'No preference',
  ...DIETARY_LABELS,
};

export const RSVP_LABELS: Record<RsvpStatus, string> = {
  attending: 'Attending',
  pending: 'Pending',
  declined: 'Declined',
};

export const GUEST_GROUP_LABELS: Record<GuestGroup, string> = {
  'bride-side': 'Bride’s side',
  'groom-side': 'Groom’s side',
  family: 'Family',
  friends: 'Friends',
  colleagues: 'Colleagues',
  community: 'Community',
};

export const VENDOR_CATEGORY_LABELS: Record<VendorCategory, string> = {
  venue: 'Venues',
  photographer: 'Photographers',
  caterer: 'Caterers',
  decorator: 'Decorators',
  entertainer: 'Entertainers',
};

export const THEME_MOOD_LABELS: Record<ThemeMood, string> = {
  floral: 'Floral',
  regal: 'Regal',
  rustic: 'Rustic',
  modern: 'Modern',
  festive: 'Festive',
  garden: 'Garden',
  coastal: 'Coastal',
  vintage: 'Vintage',
};

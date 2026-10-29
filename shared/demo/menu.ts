import type { AIPlan } from '../ai.js';
import type { EventType } from '../domain.js';
import type { DemoContext } from './context.js';

type Course = AIPlan['menu'][number];

const VEG_STARTERS = ['Paneer tikka skewers', 'Corn and spinach bites', 'Masala chaas and rose sherbet'];
const NON_VEG_STARTERS = ['Chicken malai tikka', 'Amritsari fish fingers'];
const VEG_MAINS = ['Dal makhani', 'Paneer butter masala', 'Vegetable dum biryani', 'Assorted breads and rice'];
const NON_VEG_MAINS = ['Mutton dum biryani', 'Butter chicken'];
const DESSERTS = ['Gulab jamun', 'Kulfi trio', 'Seasonal fruit platter'];
const VEGAN_DESSERT = 'Coconut-milk payasam (vegan)';
const KIDS_COURSE: Course = {
  course: 'Kids’ corner',
  items: ['Mini veggie pizzas', 'Fruit skewers', 'Mocktail station'],
  note: 'Mild, nut-free and served at child height.',
};

const TYPE_SPECIAL: Record<EventType, string> = {
  wedding: 'Live jalebi and rabri counter',
  birthday: 'Celebration cake in the guest of honour’s favourite flavour',
  anniversary: 'Two-tier cake recreating your original wedding cake',
  community: 'Live chaat counter run by a local favourite',
};

function welcomeCourse(context: DemoContext): Course {
  return {
    course: 'Welcome',
    items: context.vegetarianOnly ? VEG_STARTERS : [...VEG_STARTERS, ...NON_VEG_STARTERS],
    ...(context.hasGlutenFree ? { note: 'Gluten-free starters are clearly marked.' } : {}),
  };
}

function mainsCourse(context: DemoContext): Course {
  const notes = [
    context.hasJain ? 'Separate Jain counter: no onion, garlic or root vegetables.' : '',
    context.hasHalal && !context.vegetarianOnly ? 'All meat is halal-certified.' : '',
    context.wantsBudget ? 'Buffet service keeps the cost per plate down.' : '',
  ].filter(Boolean);
  return {
    course: 'Mains',
    items: context.vegetarianOnly ? VEG_MAINS : [...NON_VEG_MAINS, ...VEG_MAINS],
    ...(notes.length > 0 ? { note: notes.join(' ') } : {}),
  };
}

function dessertCourse(context: DemoContext): Course {
  const items = [TYPE_SPECIAL[context.brief.type], ...DESSERTS];
  return {
    course: 'Desserts',
    items: context.hasVegan ? [...items, VEGAN_DESSERT] : items,
    ...(context.hasVegan ? { note: 'Vegan desserts are made without dairy or ghee.' } : {}),
  };
}

/**
 * Builds a menu that honours dietary needs: fully vegetarian when every
 * listed preference is vegetarian, with Jain, halal, vegan and gluten-free
 * notes where relevant, and a kids' course when families are expected.
 */
export function buildDemoMenu(context: DemoContext): Course[] {
  const courses = [welcomeCourse(context), mainsCourse(context), dessertCourse(context)];
  return context.wantsKids ? [...courses, KIDS_COURSE] : courses;
}

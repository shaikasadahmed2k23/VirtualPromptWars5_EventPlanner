import type { AIPlan, EventBrief } from '../ai.js';
import { BUDGET_WEIGHTS } from '../budgetWeights.js';
import { BUDGET_CATEGORIES } from '../domain.js';
import { type DemoContext, deriveDemoContext } from './context.js';
import { buildDemoMenu } from './menu.js';
import {
  BUDGET_DECOR,
  CATEGORY_NOTES,
  ECO_ACTIVITY,
  ECO_DECOR,
  KIDS_ACTIVITIES,
  STYLE_ADJECTIVE,
  STYLE_DECOR,
  STYLE_MOOD,
  TASK_IDEAS_EXTRA,
  TIER_LABEL,
  TIER_SENTENCE,
  TRADITION_ACTIVITIES,
  TYPE_ACTIVITIES,
  TYPE_DECOR,
  TYPE_SCHEDULE,
  TYPE_TASKS,
  TYPE_TITLE,
} from './planContent.js';

const MAX_DECOR = 8;
const MAX_ACTIVITIES = 8;
const MAX_HIGHLIGHTS = 6;
const MAX_TASKS = 12;
const MAX_SUMMARY = 1200;
const MINUTES_PER_DAY = 24 * 60;
const MINUTES_PER_HOUR = 60;
const PERCENT = 100;

const uniqueBy = <T>(items: readonly T[], key: (item: T) => string): T[] => {
  const seen = new Set<string>();
  return items.filter((item) => (seen.has(key(item)) ? false : (seen.add(key(item)), true)));
};

/** Adds `offset` minutes to an `HH:MM` time, wrapping past midnight. */
export function shiftTime(time: string, offset: number): string {
  const [hours = 0, minutes = 0] = time.split(':').map(Number);
  const total = (((hours * MINUTES_PER_HOUR + minutes + offset) % MINUTES_PER_DAY) + MINUTES_PER_DAY) % MINUTES_PER_DAY;
  const pad = (value: number) => String(value).padStart(2, '0');
  return `${pad(Math.floor(total / MINUTES_PER_HOUR))}:${pad(total % MINUTES_PER_HOUR)}`;
}

function conceptSummary(context: DemoContext): string {
  const { brief } = context;
  const place = brief.venue ? `at ${brief.venue}, ${brief.city}` : `in ${brief.city}`;
  const summary = [
    STYLE_MOOD[brief.style],
    `Set ${place}, the day flows from a warm welcome to a memorable finale for ${brief.guestCount} guests.`,
    TIER_SENTENCE[context.tier],
    context.vegetarianOnly ? 'The menu is fully vegetarian, with clearly labelled options for every guest.' : '',
    context.traditions.length > 0 ? `Traditions honoured: ${context.traditions.join(', ')}.` : '',
    brief.accessibility
      ? 'Accessibility is planned in from the start: step-free routes, reserved seating and clear signage.'
      : '',
  ].filter(Boolean);
  return summary.join(' ').slice(0, MAX_SUMMARY);
}

function conceptHighlights(context: DemoContext): string[] {
  const { brief } = context;
  const highlights = [
    STYLE_DECOR[brief.style][0]?.title ?? 'Signature décor',
    context.vegetarianOnly ? 'A fully vegetarian feast' : 'A menu with something for every guest',
    TYPE_ACTIVITIES[brief.type][0]?.name ?? 'A memorable welcome',
    context.wantsBudget ? 'Budget-smart choices: rentals, seasonal flowers, buffet service' : '',
    context.wantsEco ? 'Low-waste, plastic-free celebration' : '',
    context.wantsKids ? 'Dedicated space and activities for children' : '',
    context.wantsSangeet ? 'A sangeet night full of family performances' : '',
  ].filter(Boolean);
  return highlights.slice(0, MAX_HIGHLIGHTS);
}

function buildConcept(context: DemoContext): AIPlan['concept'] {
  const { brief } = context;
  return {
    title: `${STYLE_ADJECTIVE[brief.style]} ${TYPE_TITLE[brief.type]} in ${brief.city}`,
    tagline: `${brief.guestCount} guests, one story, planned around a ${TIER_LABEL[context.tier]} budget.`,
    summary: conceptSummary(context),
    highlights: conceptHighlights(context),
  };
}

function buildActivities(context: DemoContext): AIPlan['activities'] {
  const traditions = context.traditions.flatMap((name) => {
    const activity = TRADITION_ACTIVITIES[name];
    return activity ? [activity] : [];
  });
  const sangeet = context.wantsSangeet && TRADITION_ACTIVITIES.sangeet ? [TRADITION_ACTIVITIES.sangeet] : [];
  const all = [
    ...TYPE_ACTIVITIES[context.brief.type],
    ...sangeet,
    ...traditions,
    ...(context.wantsKids ? KIDS_ACTIVITIES : []),
    ...(context.wantsEco ? [ECO_ACTIVITY] : []),
  ];
  return uniqueBy(all, (activity) => activity.name).slice(0, MAX_ACTIVITIES);
}

function buildTasks(context: DemoContext): AIPlan['suggestedTasks'] {
  const extras = [
    context.wantsSangeet ? TASK_IDEAS_EXTRA.sangeet : null,
    context.wantsKids ? TASK_IDEAS_EXTRA.kids : null,
    context.wantsEco ? TASK_IDEAS_EXTRA.eco : null,
    context.wantsBudget ? TASK_IDEAS_EXTRA.budget : null,
    context.brief.accessibility ? TASK_IDEAS_EXTRA.accessibility : null,
  ].filter((task) => task !== null);
  return [...TYPE_TASKS[context.brief.type], ...extras].slice(0, MAX_TASKS);
}

function buildBudgetAllocation(context: DemoContext): AIPlan['budgetAllocation'] {
  const weights = BUDGET_WEIGHTS[context.brief.type];
  return BUDGET_CATEGORIES.filter((category) => weights[category] > 0).map((category) => ({
    category,
    percent: Math.round(weights[category] * PERCENT),
    note:
      context.wantsBudget && category === 'decor'
        ? 'Rent rather than buy; choose seasonal flowers.'
        : CATEGORY_NOTES[category],
  }));
}

/**
 * Generates a complete, schema-valid plan from the brief without any AI.
 * `instructions` are refinement requests (e.g. "make it eco-friendly").
 */
export function generateDemoPlan(brief: EventBrief, instructions: readonly string[] = []): AIPlan {
  const context = deriveDemoContext(brief, instructions);
  const decor = [
    TYPE_DECOR[brief.type],
    ...STYLE_DECOR[brief.style],
    ...(context.wantsBudget ? BUDGET_DECOR : []),
    ...(context.wantsEco ? ECO_DECOR : []),
  ];

  return {
    concept: buildConcept(context),
    decorIdeas: uniqueBy(decor, (idea) => idea.title).slice(0, MAX_DECOR),
    menu: buildDemoMenu(context),
    activities: buildActivities(context),
    schedule: TYPE_SCHEDULE[brief.type].map((step) => ({
      time: shiftTime(brief.startTime, step.offset),
      title: step.title,
      description: step.description,
    })),
    suggestedTasks: buildTasks(context),
    budgetAllocation: buildBudgetAllocation(context),
  };
}

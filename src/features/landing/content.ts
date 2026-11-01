import { CalendarCheck2, Images, ListChecks, type LucideIcon, Sparkles, Store, UsersRound, Wallet } from 'lucide-react';

/** Copy for the landing page, kept apart from layout. */

export const HERO_COPY = {
  eyebrow: 'The AI celebration planner',
  subhead:
    'Weddings, birthdays, anniversaries and community events: budgets, timelines, vendors and personalised ideas, drafted by Gemini and refined by you.',
} as const;

export interface HowItWorksStep {
  title: string;
  body: string;
}

export const HOW_IT_WORKS: readonly HowItWorksStep[] = [
  {
    title: 'Tell us your story',
    body: 'Six gentle questions: the occasion, date, guests, budget, style and the traditions that matter to you.',
  },
  {
    title: 'Receive a considered plan',
    body: 'Gemini drafts a concept, décor, menu and a day-of schedule, alongside a starter checklist and budget.',
  },
  {
    title: 'Plan it together',
    body: 'Track spending, tick off tasks, manage RSVPs and shortlist vendors. Everything stays in one place.',
  },
];

export interface Feature {
  icon: LucideIcon;
  title: string;
  body: string;
}

export const FEATURES: readonly Feature[] = [
  {
    icon: Sparkles,
    title: 'Personalised AI ideas',
    body: 'Concepts, menus and activities shaped by your culture and style.',
  },
  {
    icon: Wallet,
    title: 'Budget planner',
    body: 'Estimated vs actual by category, with live charts and gentle warnings.',
  },
  {
    icon: ListChecks,
    title: 'Checklist & timeline',
    body: 'Every task scheduled backwards from the big day, never forgotten.',
  },
  {
    icon: Store,
    title: 'Vendor directory',
    body: 'Shortlist venues, photographers and caterers; request quotes in a click.',
  },
  {
    icon: UsersRound,
    title: 'Guest manager',
    body: 'RSVPs, plus-ones and dietary needs, ready to export for your caterer.',
  },
  { icon: Images, title: 'Mood boards', body: 'AI-curated themes with palettes you can copy and save to your event.' },
];

export const SAMPLE_TESTIMONIAL = {
  quote:
    'We had two families, three ceremonies and one very patient spreadsheet. Utsav turned it into a plan we actually enjoyed following.',
  attribution: 'A sample couple, Hyderabad',
} as const;

export const CLOSING_CTA = {
  title: 'Every celebration deserves a beautiful plan',
  body: 'Start in under two minutes. No sign-up, and your plans stay private in your browser.',
  icon: CalendarCheck2,
} as const;

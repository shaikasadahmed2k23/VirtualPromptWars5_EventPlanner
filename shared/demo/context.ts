import type { EventBrief } from '../ai.js';
import type { CurrencyCode, DietaryOption } from '../domain.js';

/** Approximate value of one unit of each currency in INR, used only to tier spend. */
const APPROX_INR_PER_UNIT: Record<CurrencyCode, number> = { INR: 1, USD: 84, EUR: 91, GBP: 107, AED: 23, SGD: 63 };

/** Per-guest spend thresholds (INR) separating the three tiers. */
const MODEST_PER_GUEST_INR = 1_500;
const LAVISH_PER_GUEST_INR = 6_000;

const VEGETARIAN_FAMILY: ReadonlySet<DietaryOption> = new Set(['vegetarian', 'vegan', 'jain']);

/** Traditions recognised in the free-text "cultural traditions" field. */
const TRADITIONS = ['haldi', 'mehendi', 'sangeet', 'nikah', 'pheras', 'baraat', 'puja', 'cake cutting', 'vow renewal'];

const WANTS_BUDGET = /budget|cheap|afford|frugal|save money|lower cost|cost-effective/i;
const WANTS_ECO = /eco|sustainab|green|zero[- ]?waste|plastic|compost/i;
const WANTS_KIDS = /kid|child|toddler|family[- ]friendly/i;
const WANTS_SANGEET = /sangeet/i;

/** Spend tier derived from budget per guest. */
export type SpendTier = 'modest' | 'comfortable' | 'lavish';

/** Everything the demo generators need to tailor output to the event. */
export interface DemoContext {
  brief: EventBrief;
  tier: SpendTier;
  vegetarianOnly: boolean;
  hasVegan: boolean;
  hasJain: boolean;
  hasHalal: boolean;
  hasGlutenFree: boolean;
  wantsBudget: boolean;
  wantsEco: boolean;
  wantsKids: boolean;
  wantsSangeet: boolean;
  /** Traditions mentioned by the hosts, in canonical order. */
  traditions: string[];
}

/** Classifies spend per guest (in INR terms) into a tier. */
export function spendTier(brief: Pick<EventBrief, 'budget' | 'currency' | 'guestCount'>): SpendTier {
  const perGuestInr = (brief.budget * APPROX_INR_PER_UNIT[brief.currency]) / brief.guestCount;
  if (perGuestInr < MODEST_PER_GUEST_INR) return 'modest';
  return perGuestInr < LAVISH_PER_GUEST_INR ? 'comfortable' : 'lavish';
}

/**
 * Reads the brief and any refinement instructions into flags the generators
 * use. Free text is only pattern-matched, never echoed into the output.
 */
export function deriveDemoContext(brief: EventBrief, instructions: readonly string[] = []): DemoContext {
  const hostText = `${brief.cultural} ${brief.notes}`.toLowerCase();
  const requests = instructions.join(' ');
  const { dietary } = brief;
  const tier = spendTier(brief);

  return {
    brief,
    tier,
    vegetarianOnly: dietary.length > 0 && dietary.every((option) => VEGETARIAN_FAMILY.has(option)),
    hasVegan: dietary.includes('vegan'),
    hasJain: dietary.includes('jain'),
    hasHalal: dietary.includes('halal'),
    hasGlutenFree: dietary.includes('gluten-free'),
    wantsBudget: tier === 'modest' || WANTS_BUDGET.test(requests),
    wantsEco: WANTS_ECO.test(requests) || WANTS_ECO.test(hostText),
    wantsKids: WANTS_KIDS.test(requests) || WANTS_KIDS.test(hostText),
    wantsSangeet: WANTS_SANGEET.test(requests) || WANTS_SANGEET.test(hostText),
    traditions: TRADITIONS.filter((tradition) => hostText.includes(tradition)),
  };
}

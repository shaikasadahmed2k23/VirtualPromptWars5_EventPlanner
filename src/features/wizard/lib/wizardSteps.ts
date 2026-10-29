/** Wizard steps in order. The review step is last and has no form of its own. */
export const WIZARD_STEPS = [
  { id: 'type', title: 'Event type' },
  { id: 'details', title: 'Date & place' },
  { id: 'guests', title: 'Guests & budget' },
  { id: 'style', title: 'Style' },
  { id: 'requirements', title: 'Requirements' },
  { id: 'review', title: 'Review' },
] as const;

export type WizardStepId = (typeof WIZARD_STEPS)[number]['id'];

/** Index of the review step. */
export const REVIEW_STEP_INDEX = WIZARD_STEPS.length - 1;

/** Returns the index of a step id. */
export function stepIndexOf(id: WizardStepId): number {
  return WIZARD_STEPS.findIndex((step) => step.id === id);
}

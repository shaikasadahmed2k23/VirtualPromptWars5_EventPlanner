import type { AIPlan, EventBrief, ThemesResponse } from '../../shared/ai.js';
import { generateDemoPlan } from '../../shared/demo/plan.js';
import { generateDemoThemes } from '../../shared/demo/themes.js';

/**
 * Offline content used when no API key is configured or Gemini fails.
 * Backed by the shared, input-aware generators (the client uses the same
 * ones if the server itself is unreachable).
 */
export const demoContent = {
  plan: (brief: EventBrief): AIPlan => generateDemoPlan(brief),
  /** Re-derives the plan with the instruction applied as a refinement. */
  refine: (brief: EventBrief, instruction: string): AIPlan => generateDemoPlan(brief, [instruction]),
  themes: (brief: EventBrief): ThemesResponse => generateDemoThemes(brief),
} as const;

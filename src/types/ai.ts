import type { AIPlan, EventBrief, ThemeSuggestion } from '@shared/ai';
import type { AIMode } from '@shared/api';
import type { Id, ISODateTime } from './common';

export type { AIMode, AIPlan, EventBrief };

/** One version of an AI plan persisted against an event, with provenance. */
export interface StoredPlan {
  id: Id;
  eventId: Id;
  plan: AIPlan;
  /** `live` from Gemini, `demo` from the offline generators. */
  aiMode: AIMode;
  /** Refinement instructions applied to reach this version, oldest first. */
  refinements: string[];
  generatedAt: ISODateTime;
  /** When the hosts saved this version to their event; `null` while a draft. */
  savedAt: ISODateTime | null;
}

/** AI theme suggestions persisted against an event. */
export interface StoredThemes {
  eventId: Id;
  themes: ThemeSuggestion[];
  aiMode: AIMode;
  generatedAt: ISODateTime;
}

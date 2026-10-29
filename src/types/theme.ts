import type { ThemeSuggestion } from '@shared/ai';
import type { ThemeMood } from '@shared/domain';
import type { Id, ISODateTime } from './common';

export type { ThemeMood, ThemeSuggestion };

/** A theme the hosts chose to keep on their event. */
export interface SavedTheme extends ThemeSuggestion {
  id: Id;
  savedAt: ISODateTime;
}

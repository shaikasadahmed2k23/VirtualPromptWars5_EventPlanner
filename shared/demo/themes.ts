import { type EventBrief, THEME_OPTION_COUNT, type ThemesResponse, type ThemeSuggestion } from '../ai.js';
import { type LibraryTheme, THEME_LIBRARY } from './themeLibrary.js';

const STYLE_MATCH_SCORE = 3;
const TYPE_MATCH_SCORE = 2;
const KEYWORD_MATCH_SCORE = 4;
const MAX_STORY = 600;

function score(theme: LibraryTheme, brief: EventBrief, requests: string): number {
  const keywordHit = [theme.mood, ...theme.keywords].some((word) => requests.includes(word));
  return (
    (theme.styles.includes(brief.style) ? STYLE_MATCH_SCORE : 0) +
    (theme.types.includes(brief.type) ? TYPE_MATCH_SCORE : 0) +
    (keywordHit ? KEYWORD_MATCH_SCORE : 0)
  );
}

function toSuggestion(theme: LibraryTheme, brief: EventBrief): ThemeSuggestion {
  const { styles: _styles, types: _types, ...suggestion } = theme;
  return {
    ...suggestion,
    story: `${theme.story} Imagined for ${String(brief.guestCount)} guests in ${brief.city}.`.slice(0, MAX_STORY),
  };
}

/**
 * Picks the three library themes that best fit the event's style and type
 * (stable order on ties), boosted by any mood words in `instructions`.
 */
export function generateDemoThemes(brief: EventBrief, instructions: readonly string[] = []): ThemesResponse {
  const requests = instructions.join(' ').toLowerCase();
  const ranked = THEME_LIBRARY.map((theme, index) => ({ theme, index, score: score(theme, brief, requests) })).sort(
    (a, b) => b.score - a.score || a.index - b.index,
  );
  return {
    themes: ranked.slice(0, THEME_OPTION_COUNT).map(({ theme }) => toSuggestion(theme, brief)),
  };
}

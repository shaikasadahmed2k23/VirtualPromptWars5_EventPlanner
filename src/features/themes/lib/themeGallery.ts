import { PHOTO_TAGS } from '@/data/photoTags';
import { MOOD_PHOTOS, PHOTOS, type Photo, type PhotoKey } from '@/data/photos';
import type { ThemeSuggestion } from '@/types';

/** Number of photos in each theme's mood-board gallery. */
export const GALLERY_SIZE = 4;

/** A tag match counts more than simply sharing the theme's mood. */
const TAG_MATCH_WEIGHT = 2;
const MOOD_MATCH_WEIGHT = 1;

const normalise = (word: string) => word.trim().toLowerCase();

/**
 * Chooses curated, verified photos for a theme's gallery. Photos are scored by
 * how many of the theme's keywords appear in their tags (plus a bonus for
 * matching the theme mood); ties keep registry order, so results are stable.
 */
export function selectThemePhotos(theme: Pick<ThemeSuggestion, 'keywords' | 'mood'>, size = GALLERY_SIZE): Photo[] {
  const keywords = theme.keywords.flatMap((keyword) => normalise(keyword).split(/\s+/));
  const moodPhotos = new Set<PhotoKey>(MOOD_PHOTOS[theme.mood]);
  const keys = Object.keys(PHOTOS) as PhotoKey[];

  return keys
    .map((key, index) => {
      const tags = PHOTO_TAGS[key];
      const tagHits = keywords.filter((keyword) => tags.some((tag) => tag.includes(keyword))).length;
      const score = tagHits * TAG_MATCH_WEIGHT + (moodPhotos.has(key) ? MOOD_MATCH_WEIGHT : 0);
      return { key, index, score };
    })
    .filter((candidate) => candidate.score > 0)
    .sort((a, b) => b.score - a.score || a.index - b.index)
    .slice(0, size)
    .map(({ key }) => PHOTOS[key]);
}

import { PHOTOS } from '@/data/photos';
import { PHOTO_TAGS } from '@/data/photoTags';
import { readableTextOn } from '@/lib/contrast';
import { GALLERY_SIZE, selectThemePhotos } from './themeGallery';

describe('selectThemePhotos', () => {
  it('prefers photos whose tags match the theme keywords', () => {
    const photos = selectThemePhotos({ keywords: ['beach', 'sea'], mood: 'coastal' });
    expect(photos).toHaveLength(GALLERY_SIZE);
    expect(photos.slice(0, 2)).toEqual([PHOTOS.beachVeil, PHOTOS.blackSandBeach]);
  });

  it('falls back to the mood’s curated photos when keywords match nothing', () => {
    const photos = selectThemePhotos({ keywords: ['zzz', 'qqq'], mood: 'festive' });
    expect(photos).toEqual([PHOTOS.pastelBalloons, PHOTOS.confettiTeal, PHOTOS.giftBox, PHOTOS.partyConfetti]);
  });

  it('matches multi-word and mixed-case keywords', () => {
    expect(selectThemePhotos({ keywords: ['String Lights'], mood: 'rustic' })[0]).toBe(PHOTOS.stringLightsToast);
  });

  it('tags every photo in the registry', () => {
    for (const key of Object.keys(PHOTOS)) {
      expect(PHOTO_TAGS[key as keyof typeof PHOTOS].length).toBeGreaterThan(2);
    }
  });
});

describe('readableTextOn', () => {
  it('picks charcoal on light swatches and white on dark ones', () => {
    expect(readableTextOn('#F4EDE3')).toBe('#2B2626');
    expect(readableTextOn('#1F5C4A')).toBe('#FFFFFF');
  });
});

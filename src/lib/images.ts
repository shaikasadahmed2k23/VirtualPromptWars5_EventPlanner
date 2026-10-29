import { IMAGE_QUALITY, IMAGE_WIDTHS } from './constants';

const UNSPLASH_CDN = 'https://images.unsplash.com';

/**
 * Builds an Unsplash CDN URL cropped to `width` × `width / aspect`.
 * `auto=format` lets the CDN serve AVIF/WebP to browsers that support it.
 */
export function unsplashUrl(photoId: string, width: number, aspect: number): string {
  const height = Math.round(width / aspect);
  const params = new URLSearchParams({
    w: String(width),
    h: String(height),
    fit: 'crop',
    auto: 'format',
    q: String(IMAGE_QUALITY),
  });
  return `${UNSPLASH_CDN}/photo-${photoId}?${params.toString()}`;
}

/** Builds a `srcset` covering the standard responsive widths. */
export function unsplashSrcSet(photoId: string, aspect: number): string {
  return IMAGE_WIDTHS.map((width) => `${unsplashUrl(photoId, width, aspect)} ${width}w`).join(', ');
}

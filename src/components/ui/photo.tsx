import type { Photo as PhotoData } from '@/data/photos';
import { unsplashSrcSet, unsplashUrl } from '@/lib/images';
import { cn } from '@/lib/utils';

interface PhotoProps {
  photo: PhotoData;
  /** Rendered width ÷ height. Used for intrinsic size (no layout shift) and CDN cropping. */
  aspect?: number;
  /** Intrinsic width hint; height is derived from `aspect`. */
  width?: number;
  /** `sizes` attribute for responsive selection. */
  sizes?: string;
  /** Above-the-fold images load eagerly with high fetch priority. */
  priority?: boolean;
  /** Hide from assistive tech when purely decorative. */
  decorative?: boolean;
  className?: string;
}

const DEFAULT_ASPECT = 4 / 3;
const DEFAULT_WIDTH = 800;

/**
 * Responsive Unsplash image with explicit dimensions, lazy loading and a
 * `srcset`, so it never causes layout shift and never over-downloads.
 */
export function Photo({
  photo,
  aspect = DEFAULT_ASPECT,
  width = DEFAULT_WIDTH,
  sizes = '100vw',
  priority = false,
  decorative = false,
  className,
}: PhotoProps) {
  return (
    <img
      src={unsplashUrl(photo.id, width, aspect)}
      srcSet={unsplashSrcSet(photo.id, aspect)}
      sizes={sizes}
      width={width}
      height={Math.round(width / aspect)}
      alt={decorative ? '' : photo.alt}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      // React 18 only forwards the lowercase HTML attribute.
      {...{ fetchpriority: priority ? 'high' : 'auto' }}
      className={cn('h-full w-full bg-ivory-deep object-cover', className)}
    />
  );
}

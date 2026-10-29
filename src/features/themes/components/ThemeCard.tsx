import { CheckCircle2, Palette } from 'lucide-react';
import { useId } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Photo } from '@/components/ui/photo';
import { THEME_MOOD_LABELS } from '@/lib/labels';
import type { ThemeSuggestion } from '@/types';
import { selectThemePhotos } from '../lib/themeGallery';
import { PaletteSwatches } from './PaletteSwatches';

interface ThemeCardProps {
  theme: ThemeSuggestion;
  isInUse: boolean;
  onUse: () => void;
}

/** One mood board: story, palette, décor inspiration and a curated gallery. */
export function ThemeCard({ theme, isInUse, onUse }: ThemeCardProps) {
  const headingId = useId();
  const photos = selectThemePhotos(theme);

  return (
    <Card className={isInUse ? 'ring-2 ring-rose-ink ring-offset-2 ring-offset-ivory' : undefined}>
      <article aria-labelledby={headingId} className="flex h-full flex-col gap-5 p-5 sm:p-6">
        <header className="flex items-start justify-between gap-3">
          <div>
            <Badge tone="lavender">{THEME_MOOD_LABELS[theme.mood]}</Badge>
            <h2 id={headingId} className="mt-2 text-3xl">
              {theme.name}
            </h2>
          </div>
          {isInUse ? (
            <Badge tone="success">
              <CheckCircle2 aria-hidden="true" />
              In use
            </Badge>
          ) : null}
        </header>
        <p className="text-sm leading-relaxed text-muted">{theme.story}</p>
        <PaletteSwatches palette={theme.palette} themeName={theme.name} />
        <div>
          <h3 className="text-lg">Décor inspiration</h3>
          <ul className="mt-2 space-y-1.5 text-sm">
            {theme.decor.map((idea) => (
              <li key={idea} className="flex gap-2">
                <span className="text-gold-ink" aria-hidden="true">
                  ✦
                </span>
                {idea}
              </li>
            ))}
          </ul>
        </div>
        <ul className="grid grid-cols-2 gap-2" aria-label={`${theme.name} inspiration photos`}>
          {photos.map((photo) => (
            <li key={photo.id} className="aspect-square overflow-hidden rounded-xl">
              <Photo photo={photo} aspect={1} width={400} sizes="(min-width: 1280px) 12vw, 45vw" />
            </li>
          ))}
        </ul>
        <Button className="mt-auto" variant={isInUse ? 'secondary' : 'primary'} onClick={onUse} disabled={isInUse}>
          <Palette aria-hidden="true" />
          {isInUse ? 'This is your theme' : 'Use this theme'}
        </Button>
      </article>
    </Card>
  );
}

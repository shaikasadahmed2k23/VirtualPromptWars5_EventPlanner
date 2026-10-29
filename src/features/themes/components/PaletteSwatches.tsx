import { Copy } from 'lucide-react';
import { readableTextOn } from '@/lib/contrast';
import { useCopyToClipboard } from '@/lib/hooks/useCopyToClipboard';
import type { ThemeSuggestion } from '@/types';

/**
 * Five colour swatches with name and hex. Label colour is chosen per swatch
 * for contrast, and each swatch has a labelled copy button.
 */
export function PaletteSwatches({ palette, themeName }: { palette: ThemeSuggestion['palette']; themeName: string }) {
  const copy = useCopyToClipboard();

  return (
    <ul className="grid grid-cols-5 overflow-hidden rounded-2xl border border-line" aria-label={`${themeName} palette`}>
      {palette.map((swatch) => {
        const textColor = readableTextOn(swatch.hex);
        return (
          <li
            key={`${swatch.hex}-${swatch.name}`}
            className="flex min-h-28 flex-col justify-between p-2"
            style={{ backgroundColor: swatch.hex, color: textColor }}
          >
            <span className="text-[0.65rem] font-semibold leading-tight">{swatch.name}</span>
            <span className="flex items-center justify-between gap-1">
              <span className="font-mono text-[0.65rem] uppercase">{swatch.hex}</span>
              <button
                type="button"
                className="grid size-7 place-items-center rounded-full transition-colors hover:bg-black/10"
                style={{ color: textColor }}
                aria-label={`Copy ${swatch.name} ${swatch.hex}`}
                onClick={() => void copy(swatch.hex.toUpperCase(), swatch.hex.toUpperCase())}
              >
                <Copy className="size-3.5" aria-hidden="true" />
              </button>
            </span>
          </li>
        );
      })}
    </ul>
  );
}

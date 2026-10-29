/** WCAG 2.x contrast thresholds. */
export const WCAG_AA_NORMAL_TEXT = 4.5;
export const WCAG_AA_LARGE_TEXT = 3;

const HEX_PATTERN = /^#([0-9a-f]{6})$/i;
const LINEAR_THRESHOLD = 0.03928;
const LINEAR_DIVISOR = 12.92;
const GAMMA = 2.4;
const LUMA = { r: 0.2126, g: 0.7152, b: 0.0722 } as const;
const FLARE = 0.05;

function channelToLinear(channel: number): number {
  const srgb = channel / 255;
  return srgb <= LINEAR_THRESHOLD ? srgb / LINEAR_DIVISOR : ((srgb + 0.055) / 1.055) ** GAMMA;
}

/** Relative luminance of a `#RRGGBB` colour, per WCAG 2.x. */
export function relativeLuminance(hex: string): number {
  const match = HEX_PATTERN.exec(hex);
  if (!match?.[1]) throw new Error(`Expected a #RRGGBB colour, received "${hex}"`);
  const value = parseInt(match[1], 16);
  const r = channelToLinear((value >> 16) & 0xff);
  const g = channelToLinear((value >> 8) & 0xff);
  const b = channelToLinear(value & 0xff);
  return LUMA.r * r + LUMA.g * g + LUMA.b * b;
}

/** WCAG contrast ratio between two `#RRGGBB` colours (1–21). */
export function contrastRatio(foreground: string, background: string): number {
  const [lighter, darker] = [relativeLuminance(foreground), relativeLuminance(background)].sort((a, b) => b - a) as [
    number,
    number,
  ];
  return (lighter + FLARE) / (darker + FLARE);
}

const DARK_TEXT = '#2B2626';
const LIGHT_TEXT = '#FFFFFF';

/** Charcoal or white, whichever has the higher contrast on `background`. */
export function readableTextOn(background: string): string {
  return contrastRatio(DARK_TEXT, background) >= contrastRatio(LIGHT_TEXT, background) ? DARK_TEXT : LIGHT_TEXT;
}

// @vitest-environment node
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { contrastRatio, WCAG_AA_LARGE_TEXT, WCAG_AA_NORMAL_TEXT } from '@/lib/contrast';

/** Reads `--color-*` tokens straight from the stylesheet so the test can never drift from the CSS. */
function readColorTokens(): Map<string, string> {
  const css = readFileSync(fileURLToPath(new URL('./globals.css', import.meta.url)), 'utf8');
  const tokens = new Map<string, string>();
  for (const [, name, hex] of css.matchAll(/--color-([a-z-]+):\s*(#[0-9a-f]{6})/gi)) {
    if (name && hex) tokens.set(name, hex);
  }
  return tokens;
}

const tokens = readColorTokens();
const token = (name: string): string => {
  const value = tokens.get(name);
  if (!value) throw new Error(`Missing colour token --color-${name}`);
  return value;
};

describe('design token contrast (WCAG AA)', () => {
  const TEXT_TOKENS = [
    'charcoal',
    'muted',
    'rose-ink',
    'rose-deep',
    'lavender-ink',
    'gold-ink',
    'success',
    'warning',
    'danger',
  ];
  const SURFACES = ['ivory', 'surface', 'ivory-deep'];

  it.each(TEXT_TOKENS.flatMap((text) => SURFACES.map((surface) => [text, surface] as const)))(
    '%s text on %s meets 4.5:1',
    (text, surface) => {
      expect(contrastRatio(token(text), token(surface))).toBeGreaterThanOrEqual(WCAG_AA_NORMAL_TEXT);
    },
  );

  it.each([
    ['rose-deep', 'blush-soft'],
    ['lavender-ink', 'lavender-soft'],
    ['gold-ink', 'gold-soft'],
    ['success', 'success-soft'],
    ['warning', 'warning-soft'],
    ['danger', 'danger-soft'],
    ['muted', 'lavender-soft'],
    ['rose-deep', 'lavender-soft'],
    ['muted', 'blush-soft'],
  ] as const)('text %s on tinted surface %s meets 4.5:1', (text, surface) => {
    expect(contrastRatio(token(text), token(surface))).toBeGreaterThanOrEqual(WCAG_AA_NORMAL_TEXT);
  });

  it.each(['rose-ink', 'rose-deep', 'danger'])('white button text on %s meets 4.5:1', (fill) => {
    expect(contrastRatio('#ffffff', token(fill))).toBeGreaterThanOrEqual(WCAG_AA_NORMAL_TEXT);
  });

  it.each(['blush', 'lavender', 'gold'])('charcoal text on decorative %s fill meets 4.5:1', (fill) => {
    expect(contrastRatio(token('charcoal'), token(fill))).toBeGreaterThanOrEqual(WCAG_AA_NORMAL_TEXT);
  });

  it('brand rose is reserved for large text / UI accents (≥ 3:1 on ivory)', () => {
    const ratio = contrastRatio(token('rose'), token('ivory'));
    expect(ratio).toBeGreaterThanOrEqual(WCAG_AA_LARGE_TEXT);
    expect(ratio).toBeLessThan(WCAG_AA_NORMAL_TEXT);
  });
});

describe('contrastRatio', () => {
  it('returns 21 for black on white and 1 for identical colours', () => {
    expect(contrastRatio('#000000', '#ffffff')).toBeCloseTo(21, 5);
    expect(contrastRatio('#b5646e', '#b5646e')).toBe(1);
  });

  it('rejects malformed colours', () => {
    expect(() => contrastRatio('red', '#ffffff')).toThrow(/#RRGGBB/);
  });
});

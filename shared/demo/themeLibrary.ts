import type { ThemeSuggestion } from '../ai.js';
import type { EventStyle, EventType } from '../domain.js';

/** A curated demo theme plus the events it suits best. */
export interface LibraryTheme extends ThemeSuggestion {
  styles: readonly EventStyle[];
  types: readonly EventType[];
}

/** Hand-curated themes for demo mode. Palettes are real, usable hex values. */
export const THEME_LIBRARY: readonly LibraryTheme[] = [
  {
    name: 'Royal Jharokha',
    story:
      'Inspired by carved palace windows: emerald courtyards, gold filigree and jewel-toned silks lit by chandeliers.',
    palette: [
      { name: 'Palace Emerald', hex: '#1F5C4A' },
      { name: 'Antique Gold', hex: '#C9A66B' },
      { name: 'Ruby Silk', hex: '#9B2335' },
      { name: 'Pearl', hex: '#F4EDE3' },
      { name: 'Midnight Plum', hex: '#3E2A47' },
    ],
    decor: ['Jharokha-arch stage backdrop', 'Velvet majlis seating', 'Brass lanterns along the entrance'],
    mood: 'regal',
    keywords: ['palace', 'chandelier', 'gold', 'regal'],
    styles: ['royal', 'traditional'],
    types: ['wedding', 'anniversary'],
  },
  {
    name: 'Marigold Mehfil',
    story:
      'A celebration in saffron and pink: marigold torans, folk music and the warm chaos of family coming together.',
    palette: [
      { name: 'Marigold', hex: '#F2A007' },
      { name: 'Rani Pink', hex: '#D6336C' },
      { name: 'Leaf Green', hex: '#4C7A3A' },
      { name: 'Cream', hex: '#FFF4E0' },
      { name: 'Henna', hex: '#7A3E1D' },
    ],
    decor: ['Marigold and mango-leaf torans', 'Block-printed table runners', 'Floor seating with bolsters'],
    mood: 'festive',
    keywords: ['marigold', 'festive', 'colour', 'lights'],
    styles: ['traditional', 'festive'],
    types: ['wedding', 'community', 'birthday'],
  },
  {
    name: 'Blush & Brass',
    story: 'Soft blush florals against warm brass and candlelight: modern, romantic and quietly glamorous.',
    palette: [
      { name: 'Blush', hex: '#E8B4B8' },
      { name: 'Brass', hex: '#B08D57' },
      { name: 'Ivory', hex: '#FBF8F3' },
      { name: 'Deep Rose', hex: '#7E3743' },
      { name: 'Charcoal', hex: '#2B2626' },
    ],
    decor: ['Brass candelabra centrepieces', 'Blush rose runners', 'Mirror seating chart'],
    mood: 'modern',
    keywords: ['blush', 'banquet', 'candles', 'roses'],
    styles: ['modern', 'minimal', 'royal'],
    types: ['wedding', 'anniversary', 'birthday'],
  },
  {
    name: 'Monsoon Garden',
    story: 'Lush greens after the rain, trailing jasmine and a gazebo strung with flowers for an open-air celebration.',
    palette: [
      { name: 'Fern', hex: '#3F6B4B' },
      { name: 'Jasmine', hex: '#FDFBF4' },
      { name: 'Lotus Pink', hex: '#E7A1B0' },
      { name: 'Moss', hex: '#8A9A5B' },
      { name: 'Teak', hex: '#6B4A2B' },
    ],
    decor: [
      'Floral gazebo for the ceremony',
      'Hanging fern installations',
      'Potted-plant centrepieces guests take home',
    ],
    mood: 'garden',
    keywords: ['garden', 'greenery', 'gazebo', 'flowers'],
    styles: ['garden', 'bohemian', 'minimal'],
    types: ['wedding', 'anniversary', 'community'],
  },
  {
    name: 'Rustic Lantern',
    story: 'Long wooden tables, wildflowers in jars and lanterns overhead: an evening that feels like home.',
    palette: [
      { name: 'Walnut', hex: '#5C4033' },
      { name: 'Wheat', hex: '#E9D8B4' },
      { name: 'Sage', hex: '#9CAF88' },
      { name: 'Terracotta', hex: '#C0673E' },
      { name: 'Linen', hex: '#F6F1E7' },
    ],
    decor: ['Wildflower jar runners', 'Lantern canopy', 'Hand-lettered wooden signs'],
    mood: 'rustic',
    keywords: ['rustic', 'wood', 'lanterns', 'wildflowers'],
    styles: ['rustic', 'bohemian'],
    types: ['wedding', 'birthday', 'community'],
  },
  {
    name: 'Coastal Linen',
    story: 'Sea breeze, crisp linen and driftwood: an airy palette for celebrations by the water.',
    palette: [
      { name: 'Sea Glass', hex: '#7FB7BE' },
      { name: 'Driftwood', hex: '#A68A64' },
      { name: 'Linen', hex: '#F5F1E8' },
      { name: 'Ocean', hex: '#24577A' },
      { name: 'Coral', hex: '#E07A5F' },
    ],
    decor: ['Linen-draped arch by the water', 'Driftwood table numbers', 'Shell and candle centrepieces'],
    mood: 'coastal',
    keywords: ['beach', 'sea', 'linen', 'breeze'],
    styles: ['minimal', 'bohemian', 'garden'],
    types: ['wedding', 'anniversary'],
  },
  {
    name: 'Confetti Pop',
    story: 'Colour, balloons and a dance floor that never empties: pure joy with a playful edge.',
    palette: [
      { name: 'Bubblegum', hex: '#FF8FB1' },
      { name: 'Sunshine', hex: '#FFD23F' },
      { name: 'Teal', hex: '#1B998B' },
      { name: 'Grape', hex: '#6A4C93' },
      { name: 'Cloud', hex: '#FFFFFF' },
    ],
    decor: ['Balloon garland entrance', 'Confetti photo booth', 'Neon name sign'],
    mood: 'festive',
    keywords: ['confetti', 'balloons', 'party', 'gift'],
    styles: ['festive', 'modern'],
    types: ['birthday', 'community'],
  },
  {
    name: 'Vintage Polaroid',
    story: 'Sepia photographs, old records and heirloom lace: a nostalgic celebration of the years together.',
    palette: [
      { name: 'Sepia', hex: '#704214' },
      { name: 'Old Paper', hex: '#EFE6D2' },
      { name: 'Dusty Rose', hex: '#C08497' },
      { name: 'Ink', hex: '#2E2A28' },
      { name: 'Brass', hex: '#B5A642' },
    ],
    decor: ['Polaroid memory wall', 'Vinyl record table markers', 'Lace-wrapped vases'],
    mood: 'vintage',
    keywords: ['vintage', 'camera', 'photos', 'rings'],
    styles: ['traditional', 'rustic', 'minimal'],
    types: ['anniversary', 'birthday'],
  },
];

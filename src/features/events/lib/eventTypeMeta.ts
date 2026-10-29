import type { EventStyle, EventType } from '@shared/domain';
import { Cake, Gem, HeartHandshake, Users, type LucideIcon } from 'lucide-react';
import type { PhotoKey } from '@/data/photos';

/** Presentation metadata for an event type. */
export interface EventTypeMeta {
  icon: LucideIcon;
  /** One-line pitch used on cards and in the wizard. */
  pitch: string;
  photo: PhotoKey;
}

export const EVENT_TYPE_META: Record<EventType, EventTypeMeta> = {
  wedding: {
    icon: HeartHandshake,
    pitch: 'Multi-day rituals, families, vendors. Every thread of your wedding in one plan.',
    photo: 'mandapHall',
  },
  birthday: {
    icon: Cake,
    pitch: 'From a first birthday to a fiftieth, with themes, cakes and games that delight.',
    photo: 'pastelBalloons',
  },
  anniversary: {
    icon: Gem,
    pitch: 'Intimate dinners or grand vow renewals that honour the years together.',
    photo: 'ringsHands',
  },
  community: {
    icon: Users,
    pitch: 'Festivals, fundraisers and cultural nights, with volunteers, permits and crowds handled.',
    photo: 'friendsDining',
  },
};

/** Short description for each style choice in the wizard. */
export const EVENT_STYLE_DESCRIPTIONS: Record<EventStyle, string> = {
  traditional: 'Rituals, heirlooms and time-honoured customs.',
  royal: 'Palatial grandeur, rich jewel tones and gold.',
  modern: 'Clean lines, statement lighting, curated details.',
  minimal: 'Calm whites, natural textures, less but better.',
  rustic: 'Wood, wildflowers and warm string lights.',
  garden: 'Open air, lush greens and blooming florals.',
  bohemian: 'Layered textiles, pampas and relaxed charm.',
  festive: 'Colour, music and joyful abundance.',
};

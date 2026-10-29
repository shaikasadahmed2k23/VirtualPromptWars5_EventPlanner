import type { ThemeMood } from '@shared/domain';

/** A remote Unsplash photograph with accessible alternative text. */
export interface Photo {
  /** Unsplash photo id (the part after `photo-` in the CDN URL). */
  id: string;
  alt: string;
}

/**
 * Curated, verified Unsplash photographs. Images are streamed from the
 * Unsplash CDN at the requested size; nothing is committed to the repo.
 */
export const PHOTOS = {
  mandapHall: { id: '1587271407850-8d438ca9fdf2', alt: 'Ornate wedding mandap glowing under a crystal chandelier' },
  ceremonyAisle: {
    id: '1469371670807-013ccf25f16a',
    alt: 'Outdoor ceremony aisle lined with gold chairs and pink floral arrangements',
  },
  brideBouquet: {
    id: '1519741497674-611481863552',
    alt: 'Bride holding a bouquet of blush flowers in warm evening light',
  },
  ringsHands: { id: '1465495976277-4387d4b0b4c6', alt: 'Newlyweds resting hands together beside a peach rose bouquet' },
  goldRings: { id: '1606800052052-a08af7148866', alt: 'Two gold wedding bands resting on soft linen' },
  ringsOnRoses: { id: '1515934751635-c81c6bc9a2d8', alt: 'Wedding rings nestled among pale pink roses' },
  confettiKiss: { id: '1583939003579-730e3918a45a', alt: 'Couple sharing a kiss as guests shower them with confetti' },
  holdingHands: { id: '1520854221256-17451cc331bf', alt: 'Close-up of a couple holding hands, bride in a lace sleeve' },
  beachVeil: {
    id: '1537633552985-df8429e8048b',
    alt: 'Couple embracing on a pebble beach as the veil catches the wind',
  },
  blackSandBeach: {
    id: '1544078751-58fee2d8a03b',
    alt: 'Couple walking on a black-sand beach beside towering sea stacks',
  },
  fieldEmbrace: { id: '1546032996-6dfacbacbf3f', alt: 'Couple wrapped in a veil, embracing in a golden field' },
  hillsideWalk: { id: '1532712938310-34cb3982ef74', alt: 'Couple walking hand in hand along a misty hillside' },
  forestPortrait: { id: '1541250848049-b4f7141dca3f', alt: 'Bride and groom touching foreheads among mossy boulders' },
  floralTable: {
    id: '1511795409834-ef04bbd61622',
    alt: 'Long dinner table dressed with colourful flowers and glassware',
  },
  marqueeDining: {
    id: '1464366400600-7168b8af9bc3',
    alt: 'Marquee dining setup with sunflowers and patterned tablecloths',
  },
  lawnChairs: { id: '1522673607200-164d1b6ce486', alt: 'Two sweetheart chairs decorated with flowers on a green lawn' },
  wildflowerTable: {
    id: '1519225421980-715cb0215aed',
    alt: 'Reception table with blue napkins and wildflower centrepieces',
  },
  tentCentrepieces: { id: '1502635385003-ee1e6a1a742d', alt: 'White tent reception with delicate floral centrepieces' },
  banquetHall: { id: '1519167758481-83f550bb49b3', alt: 'Grand banquet hall with round tables beneath chandeliers' },
  blushBanquet: { id: '1561912774-79769a0a0a7a', alt: 'Elegant banquet tables with white linen and blush roses' },
  gardenGazebo: { id: '1523438885200-e635ba2c371e', alt: 'Garden gazebo entwined with roses, set for a ceremony' },
  greenhouseCafe: {
    id: '1600093463592-8e36ae95ef56',
    alt: 'Leafy greenhouse venue with rattan seating and hanging lamps',
  },
  lushBouquet: { id: '1487530811176-3780de880c2d', alt: 'Lush bouquet of garden roses, ranunculus and lavender' },
  peachBouquet: { id: '1525258946800-98cfd641d0de', alt: 'Bridal bouquet of peach roses and white blooms' },
  poppies: { id: '1490750967868-88aa4486c946', alt: 'Bright orange poppies against a clear blue sky' },
  mrMrsSign: { id: '1507504031003-b417219a0fde', alt: 'Hand-lettered wooden “Mr & Mrs” sign hanging from a tree' },
  vintageCamera: { id: '1452587925148-ce544e77e70d', alt: 'Vintage film camera beside instant photographs on a map' },
  cateringBuffet: { id: '1555244162-803834f70033', alt: 'Catering buffet of plated canapés in polished silver trays' },
  grazingPlatter: { id: '1478145046317-39f10e56b5e9', alt: 'Grazing platter of figs, cheese, eggs and cured meats' },
  chefPrep: { id: '1551218808-94e220e084d2', alt: 'Chef finely chopping fresh herbs on a board' },
  platedDinner: { id: '1414235077428-338989a2e8c0', alt: 'Plated fine-dining course on a candlelit table' },
  friendsDining: { id: '1528605248644-14dd04022da1', alt: 'Friends laughing together around a long shared table' },
  stringLightsToast: { id: '1527529482837-4698179dc6ce', alt: 'Guests raising a toast beneath warm string lights' },
  pastelBalloons: { id: '1530103862676-de8c9debad1d', alt: 'Pastel balloons with ribbons floating against a ceiling' },
  brightBalloons: { id: '1504196606672-aef5c9cefc92', alt: 'Bunch of bright primary-coloured balloons' },
  confettiTeal: { id: '1513151233558-d860c5398176', alt: 'Colourful confetti falling against a teal backdrop' },
  giftBox: { id: '1549465220-1a8b9238cd48', alt: 'Magenta gift box tied with a gold satin ribbon and confetti' },
  confettiCrowd: { id: '1492684223066-81342ee5ff30', alt: 'Confetti bursting over a cheering crowd' },
  partyConfetti: { id: '1505236858219-8359eb29e329', alt: 'Crowd celebrating under a shower of confetti and lights' },
  stageConfetti: { id: '1533174072545-7a4b6ad7a6c3', alt: 'Live stage show with confetti drifting over the audience' },
  concertGlow: { id: '1470229722913-7c0e2dbbafd3', alt: 'Audience silhouetted against warm golden stage lights' },
  pinkStage: { id: '1516450360452-9312f5e86fc7', alt: 'Performer on a stage washed in pink and violet light' },
  djBooth: { id: '1496337589254-7e19d01cec44', alt: 'DJ performing to a lively crowd through haze and lights' },
} as const satisfies Record<string, Photo>;

export type PhotoKey = keyof typeof PHOTOS;

/** Curated mood-board imagery for each AI theme mood. */
export const MOOD_PHOTOS: Record<ThemeMood, readonly PhotoKey[]> = {
  floral: ['lushBouquet', 'peachBouquet', 'ringsOnRoses', 'ceremonyAisle'],
  regal: ['mandapHall', 'banquetHall', 'blushBanquet', 'goldRings'],
  rustic: ['mrMrsSign', 'wildflowerTable', 'stringLightsToast', 'fieldEmbrace'],
  modern: ['blushBanquet', 'platedDinner', 'djBooth', 'pinkStage'],
  festive: ['confettiTeal', 'pastelBalloons', 'giftBox', 'partyConfetti'],
  garden: ['gardenGazebo', 'lawnChairs', 'greenhouseCafe', 'tentCentrepieces'],
  coastal: ['beachVeil', 'blackSandBeach', 'wildflowerTable', 'hillsideWalk'],
  vintage: ['vintageCamera', 'mrMrsSign', 'goldRings', 'lushBouquet'],
};

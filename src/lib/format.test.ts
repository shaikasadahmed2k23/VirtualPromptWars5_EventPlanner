import { combineDateTime, formatDisplayDate, parseISODate, toISODate } from './dates';
import { currencySymbol, formatCurrency, formatPercent, pluralize } from './format';
import { unsplashSrcSet, unsplashUrl } from './images';

describe('formatCurrency', () => {
  it('uses Indian lakh grouping for INR', () => {
    expect(formatCurrency(1_800_000, 'INR')).toBe('₹18,00,000');
  });

  it('formats other currencies in their locale', () => {
    expect(formatCurrency(2500, 'USD')).toBe('$2,500');
  });

  it('supports compact notation for chart labels', () => {
    expect(formatCurrency(1_800_000, 'USD', true)).toBe('$1.8M');
  });

  it('exposes the currency symbol', () => {
    expect(currencySymbol('INR')).toBe('₹');
  });
});

describe('formatPercent / pluralize', () => {
  it('rounds ratios to whole percentages', () => {
    expect(formatPercent(0.426)).toBe('43%');
  });

  it('pluralizes by count', () => {
    expect(pluralize(1, 'guest')).toBe('1 guest');
    expect(pluralize(250, 'guest')).toBe('250 guests');
    expect(pluralize(2, 'plus-one', 'plus-ones')).toBe('2 plus-ones');
  });
});

describe('date helpers', () => {
  it('parses and formats calendar dates', () => {
    const date = parseISODate('2027-02-13');
    expect(date).not.toBeNull();
    expect(toISODate(date!)).toBe('2027-02-13');
    expect(formatDisplayDate('2027-02-13')).toBe('13 Feb 2027');
  });

  it('returns null / raw input for malformed dates instead of "Invalid Date"', () => {
    expect(parseISODate('not-a-date')).toBeNull();
    expect(formatDisplayDate('not-a-date')).toBe('not-a-date');
  });

  it('combines a date and a time', () => {
    expect(combineDateTime('2027-02-13', '18:30')?.getHours()).toBe(18);
  });
});

describe('unsplash helpers', () => {
  it('builds a cropped CDN URL with auto format', () => {
    const url = new URL(unsplashUrl('123-abc', 800, 4 / 3));
    expect(url.pathname).toBe('/photo-123-abc');
    expect(url.searchParams.get('h')).toBe('600');
    expect(url.searchParams.get('auto')).toBe('format');
  });

  it('builds a srcset with width descriptors', () => {
    expect(unsplashSrcSet('123-abc', 1)).toMatch(/ 480w, .* 1600w$/);
  });
});

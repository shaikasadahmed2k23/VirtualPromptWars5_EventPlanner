import { dateOfTimestamp, monthKey, shiftISODate, shiftISOMonths } from './dates';
import { ALL, toFilterOptions } from './filterOptions';
import { formatPercent, PERCENT, toPercent } from './format';

const filterOptionsFixture = {
  values: ['high', 'low'] as const,
  labels: { high: 'High', low: 'Low' },
};

describe('toPercent', () => {
  it('rounds a ratio to a whole percentage', () => {
    expect(toPercent(0.426)).toBe(43);
    expect(toPercent(1)).toBe(PERCENT);
  });

  it('keeps ratios above 1 (over budget) instead of clamping', () => {
    expect(toPercent(1.25)).toBe(125);
    expect(formatPercent(1.25)).toBe('125%');
  });
});

describe('ISO date helpers', () => {
  it('takes the calendar date of a timestamp without shifting time zones', () => {
    expect(dateOfTimestamp('2030-02-14T23:59:59.000Z')).toBe('2030-02-14');
  });

  it('groups dates by month key', () => {
    expect(monthKey('2030-02-14')).toBe('2030-02');
  });

  it('shifts across month and year boundaries', () => {
    expect(shiftISODate('2030-01-01', -1)).toBe('2029-12-31');
    expect(shiftISOMonths('2030-03-31', -1)).toBe('2030-02-28');
  });

  it('returns unparseable dates unchanged rather than throwing', () => {
    expect(shiftISODate('not-a-date', 3)).toBe('not-a-date');
  });
});

describe('toFilterOptions', () => {
  it('maps values to labelled options in order', () => {
    expect(toFilterOptions(filterOptionsFixture.values, filterOptionsFixture.labels)).toEqual([
      { value: 'high', label: 'High' },
      { value: 'low', label: 'Low' },
    ]);
  });

  it('leads with an "all" option when given its label', () => {
    const options = toFilterOptions(filterOptionsFixture.values, filterOptionsFixture.labels, 'Any priority');
    expect(options[0]).toEqual({ value: ALL, label: 'Any priority' });
    expect(options).toHaveLength(3);
  });
});

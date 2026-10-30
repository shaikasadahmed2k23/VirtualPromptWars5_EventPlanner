import { computeBudgetSummary } from './budgetSummary';
import { toBudgetChartData } from './budgetChartData';
import type { BudgetItem } from '@/types';

const item = (overrides: Partial<BudgetItem>): BudgetItem => ({
  id: '1',
  eventId: 'event',
  category: 'venue',
  name: 'Venue',
  estimated: 100,
  actual: 0,
  paid: false,
  vendorName: '',
  ...overrides,
});

describe('toBudgetChartData', () => {
  it('falls back to estimated spend when actual is zero', () => {
    const data = toBudgetChartData(computeBudgetSummary([item({})], 500));
    expect(data).toEqual([{ category: 'venue', label: 'Venue', estimated: 100, actual: 100 }]);
  });

  it('updates chart values from actual spend', () => {
    const data = toBudgetChartData(computeBudgetSummary([item({ actual: 80 })], 500));
    expect(data[0]?.actual).toBe(80);
  });
});

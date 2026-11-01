import type { BudgetItem } from '@/types';
import { toBudgetChartData } from './budgetChartData';
import { computeBudgetSummary } from './budgetSummary';

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
  it('keeps actual spend truthful and forecasts from the estimate when nothing is spent', () => {
    const data = toBudgetChartData(computeBudgetSummary([item({})], 500));
    expect(data).toEqual([{ category: 'venue', label: 'Venue', estimated: 100, actual: 0, forecast: 100 }]);
  });

  it('forecasts from actual spend once it exceeds the estimate', () => {
    const [row] = toBudgetChartData(computeBudgetSummary([item({ actual: 180 })], 500));
    expect(row).toMatchObject({ actual: 180, forecast: 180 });
  });

  it('omits categories with no lines', () => {
    expect(toBudgetChartData(computeBudgetSummary([], 500))).toEqual([]);
  });
});

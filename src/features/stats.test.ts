import { createSeedBudget, createSeedGuests, createSeedTasks } from '@/data/seed';
import { computeBudgetSummary } from '@/features/budget/lib/budgetSummary';
import { computeGuestStats } from '@/features/guests/lib/guestStats';
import {
  computeTaskProgress,
  groupTasksByMonth,
  isTaskOverdue,
  selectUpcomingTasks,
} from '@/features/tasks/lib/taskStats';
import type { BudgetItem, Guest } from '@/types';

const item = (overrides: Partial<BudgetItem>): BudgetItem => ({
  id: 'b',
  eventId: 'e',
  category: 'venue',
  name: 'Line',
  estimated: 0,
  actual: 0,
  paid: false,
  vendorName: '',
  ...overrides,
});

describe('computeBudgetSummary', () => {
  it('separates spent, paid and committed totals', () => {
    const summary = computeBudgetSummary(
      [
        item({ estimated: 100, actual: 120, paid: true }),
        item({ category: 'decor', estimated: 50, actual: 0 }),
        item({ category: 'decor', estimated: 30, actual: 20 }),
      ],
      200,
    );
    expect(summary).toMatchObject({ estimated: 180, actual: 140, paid: 120, committed: 200, remaining: 0 });
    expect(summary.spentRatio).toBeCloseTo(0.7);
    expect(summary.isOverBudget).toBe(false);
    expect(summary.byCategory.find((row) => row.category === 'decor')).toEqual({
      category: 'decor',
      estimated: 80,
      actual: 20,
    });
  });

  it('flags over-budget plans and handles a zero budget safely', () => {
    expect(computeBudgetSummary([item({ estimated: 10 })], 5).isOverBudget).toBe(true);
    expect(computeBudgetSummary([], 0)).toMatchObject({ spentRatio: 0, committedRatio: 0, isOverBudget: false });
  });

  it('reports all eight categories in canonical order', () => {
    expect(computeBudgetSummary(createSeedBudget(), 1).byCategory.map((row) => row.category)).toEqual([
      'venue',
      'catering',
      'decor',
      'photography',
      'attire',
      'entertainment',
      'invitations',
      'misc',
    ]);
  });
});

describe('task stats', () => {
  const tasks = createSeedTasks();

  it('computes completion progress', () => {
    expect(computeTaskProgress(tasks)).toEqual({ total: 16, done: 5, ratio: 5 / 16 });
    expect(computeTaskProgress([]).ratio).toBe(0);
  });

  it('treats only open tasks due before today as overdue', () => {
    expect(isTaskOverdue({ done: false, dueDate: '2026-10-28' }, '2026-10-29')).toBe(true);
    expect(isTaskOverdue({ done: false, dueDate: '2026-10-29' }, '2026-10-29')).toBe(false);
    expect(isTaskOverdue({ done: true, dueDate: '2026-01-01' }, '2026-10-29')).toBe(false);
  });

  it('selects the next open tasks by due date', () => {
    const upcoming = selectUpcomingTasks(tasks, 3);
    expect(upcoming.map((task) => task.title)).toEqual([
      'Send save-the-dates',
      'Book qawwali ensemble for reception',
      'Finalise mandap and floral design',
    ]);
  });

  it('groups tasks by calendar month in order', () => {
    const months = groupTasksByMonth(tasks);
    expect(months[0]).toEqual({ key: '2026-08', label: 'Aug 2026', total: 1, done: 1 });
    expect(months.at(-1)?.key).toBe('2027-02');
    expect(months.reduce((sum, month) => sum + month.total, 0)).toBe(tasks.length);
  });
});

describe('computeGuestStats', () => {
  it('counts RSVPs and attending headcount with plus-ones', () => {
    const guests: Guest[] = [
      { ...createSeedGuests()[0]!, rsvp: 'attending', plusOnes: 2, dietary: 'vegan' },
      { ...createSeedGuests()[1]!, rsvp: 'pending', plusOnes: 1, dietary: 'jain' },
      { ...createSeedGuests()[2]!, rsvp: 'declined', plusOnes: 0, dietary: 'none' },
    ];
    const stats = computeGuestStats(guests);
    expect(stats).toMatchObject({ total: 3, attending: 1, pending: 1, declined: 1, headcount: 3 });
    expect(stats.dietary.vegan).toBe(3);
    expect(stats.dietary.jain).toBe(0);
  });
});

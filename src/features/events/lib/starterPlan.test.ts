import { BUDGET_WEIGHTS } from '@shared/budgetWeights';
import { EVENT_TYPES } from '@shared/domain';
import { generateStarterBudget, generateStarterTasks } from './starterPlan';
import { PLANNING_HORIZON_DAYS, TASK_TEMPLATES } from './starterTemplates';

const TODAY = '2026-10-29';

describe('generateStarterTasks', () => {
  it('uses ideal lead times when the full planning horizon is available', () => {
    const tasks = generateStarterTasks({ type: 'wedding', date: '2027-12-31', budget: 1 }, TODAY);
    const venue = tasks.find((task) => task.title === 'Book the main venue');
    // 300 days before 31 Dec 2027.
    expect(venue?.dueDate).toBe('2027-03-06');
  });

  it('compresses lead times proportionally for a sooner event', () => {
    // 30 days away vs a 60-day birthday horizon → lead times halve.
    const tasks = generateStarterTasks({ type: 'birthday', date: '2026-11-28', budget: 1 }, TODAY);
    const venue = tasks.find((task) => task.title === 'Book the venue or confirm home setup');
    expect(venue?.dueDate).toBe('2026-11-03');
  });

  it('keeps every task between today and the event date, sorted by due date', () => {
    for (const type of EVENT_TYPES) {
      const date = '2026-11-15';
      const tasks = generateStarterTasks({ type, date, budget: 1 }, TODAY);
      expect(tasks).toHaveLength(TASK_TEMPLATES[type].length);
      for (const task of tasks) {
        expect(task.dueDate >= TODAY && task.dueDate <= date).toBe(true);
      }
      expect(tasks.map((task) => task.dueDate)).toEqual([...tasks.map((task) => task.dueDate)].sort());
    }
  });

  it('schedules everything for the event day when it is today', () => {
    const tasks = generateStarterTasks({ type: 'community', date: TODAY, budget: 1 }, TODAY);
    expect(new Set(tasks.map((task) => task.dueDate))).toEqual(new Set([TODAY]));
  });

  it('defines a positive horizon for every type', () => {
    for (const type of EVENT_TYPES) expect(PLANNING_HORIZON_DAYS[type]).toBeGreaterThan(0);
  });
});

describe('generateStarterBudget', () => {
  it('weights weddings towards venue and catering', () => {
    const lines = generateStarterBudget({ type: 'wedding', date: TODAY, budget: 1_800_000 });
    const byCategory = Object.fromEntries(lines.map((line) => [line.category, line.estimated]));
    expect(byCategory.catering).toBe(540_000);
    expect(byCategory.venue).toBe(450_000);
    expect(byCategory.catering).toBeGreaterThan(byCategory.decor ?? 0);
  });

  it('never exceeds the total budget and starts unspent', () => {
    for (const type of EVENT_TYPES) {
      const lines = generateStarterBudget({ type, date: TODAY, budget: 123_457 });
      const total = lines.reduce((sum, line) => sum + line.estimated, 0);
      expect(total).toBeLessThanOrEqual(123_457);
      expect(lines.every((line) => line.actual === 0 && !line.paid)).toBe(true);
    }
  });

  it('skips categories with zero weight (no attire line for community events)', () => {
    const lines = generateStarterBudget({ type: 'community', date: TODAY, budget: 100_000 });
    expect(lines.some((line) => line.category === 'attire')).toBe(false);
  });

  it('has weights that sum to 1 for every event type', () => {
    for (const type of EVENT_TYPES) {
      const sum = Object.values(BUDGET_WEIGHTS[type]).reduce((total, weight) => total + weight, 0);
      expect(sum).toBeCloseTo(1, 10);
    }
  });
});

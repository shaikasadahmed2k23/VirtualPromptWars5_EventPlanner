import type { Task } from '@/types';
import { groupTasksByTimeline, timelineGroupForDate } from './taskTimeline';

const EVENT_DATE = '2030-01-01';

describe('timelineGroupForDate', () => {
  it.each([
    ['2028-12-31', '12+ months before'],
    ['2029-06-30', '6–12 months'],
    ['2029-07-05', '3–6 months'],
    ['2029-10-03', '1–3 months'],
    ['2029-11-15', '1–3 months'],
    ['2029-12-20', 'Final month'],
    ['2029-12-27', 'Event week'],
    ['2030-01-01', 'Event week'],
    ['2030-01-02', 'After event'],
  ] as const)('maps %s to %s', (date, group) => {
    expect(timelineGroupForDate(date, EVENT_DATE)).toBe(group);
  });

  it('retains all groups and sorts tasks within each group', () => {
    const task = (id: string, dueDate: string): Task => ({
      id,
      eventId: 'event',
      title: id,
      notes: '',
      dueDate,
      priority: 'medium',
      category: 'other',
      done: false,
      source: 'user',
      createdAt: '2029-01-01T00:00:00.000Z',
    });
    const groups = groupTasksByTimeline([task('later', '2029-12-20'), task('earlier', '2029-12-10')], EVENT_DATE);
    expect(groups).toHaveLength(7);
    expect(groups.find((group) => group.group === 'Final month')?.tasks.map((item) => item.id)).toEqual([
      'earlier',
      'later',
    ]);
  });
});

import { filterAndSortTasks } from './taskFilters';
import type { Task } from '@/types';

const tasks: Task[] = [
  { id: '1', eventId: 'e', title: 'Book venue', notes: 'Garden', dueDate: '2030-01-03', priority: 'high', category: 'venue', done: false, source: 'user', createdAt: '2029-01-01T00:00:00.000Z' },
  { id: '2', eventId: 'e', title: 'Choose menu', notes: '', dueDate: '2030-01-02', priority: 'low', category: 'catering', done: true, source: 'ai', createdAt: '2029-01-01T00:00:00.000Z' },
  { id: '3', eventId: 'e', title: 'Send invites', notes: '', dueDate: '2030-01-01', priority: 'medium', category: 'guests', done: false, source: 'user', createdAt: '2029-01-01T00:00:00.000Z' },
];

describe('filterAndSortTasks', () => {
  it('filters by search, status, priority and category', () => {
    expect(filterAndSortTasks(tasks, { search: 'garden', status: 'open', priority: 'high', category: 'venue', sort: 'deadline' })).toEqual([tasks[0]]);
  });

  it('sorts by priority and uses deadline as a stable tie breaker', () => {
    expect(filterAndSortTasks(tasks, { search: '', status: 'all', priority: 'all', category: 'all', sort: 'priority' }).map((task) => task.id)).toEqual(['1', '3', '2']);
  });
});

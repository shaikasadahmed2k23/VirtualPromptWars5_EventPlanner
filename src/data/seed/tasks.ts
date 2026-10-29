import { DEMO_EVENT_ID } from '@/lib/constants';
import type { Task, TaskCategory, TaskPriority } from '@/types';

type SeedTask = [title: string, dueDate: string, priority: TaskPriority, category: TaskCategory, done: boolean];

const SEED_TASKS: readonly SeedTask[] = [
  ['Book the reception venue', '2026-08-25', 'high', 'venue', true],
  ['Finalise guest list with both families', '2026-09-10', 'high', 'guests', true],
  ['Sign photographer and film crew', '2026-09-20', 'high', 'vendors', true],
  ['Shortlist bridal lehenga designers', '2026-09-30', 'medium', 'attire', true],
  ['Confirm caterer menu tasting date', '2026-10-15', 'high', 'catering', true],
  ['Send save-the-dates', '2026-10-25', 'medium', 'guests', false],
  ['Book qawwali ensemble for reception', '2026-11-10', 'medium', 'vendors', false],
  ['Finalise mandap and floral design', '2026-11-20', 'high', 'decor', false],
  ['Order printed invitations', '2026-11-30', 'medium', 'guests', false],
  ['Arrange guest shuttles from hotels', '2026-12-15', 'low', 'logistics', false],
  ['Choreograph sangeet performances', '2026-12-20', 'low', 'ceremony', false],
  ['Final lehenga and sherwani fittings', '2027-01-15', 'high', 'attire', false],
  ['Confirm nikah officiant and timings', '2027-01-20', 'high', 'ceremony', false],
  ['Share run-of-show with all vendors', '2027-02-01', 'medium', 'logistics', false],
  ['Pack return favours (mithai boxes)', '2027-02-08', 'low', 'other', false],
  ['Confirm final headcount with caterer', '2027-02-06', 'high', 'catering', false],
];

/** Checklist for the demo wedding: a mix of completed, overdue and upcoming tasks. */
export function createSeedTasks(): Task[] {
  return SEED_TASKS.map(([title, dueDate, priority, category, done], index) => ({
    id: `task-seed-${String(index + 1).padStart(2, '0')}`,
    eventId: DEMO_EVENT_ID,
    title,
    notes: '',
    dueDate,
    priority,
    category,
    done,
    source: 'user',
    createdAt: '2026-08-14T10:00:00.000Z',
  }));
}

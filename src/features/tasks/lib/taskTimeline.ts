import { daysBetween, formatDisplayDate } from '@/lib/dates';
import type { ISODate, Task } from '@/types';

export const TIMELINE_GROUPS = [
  '12+ months before',
  '6–12 months',
  '3–6 months',
  '1–3 months',
  'Final month',
  'Event week',
  'After event',
] as const;

export type TimelineGroup = (typeof TIMELINE_GROUPS)[number];
export const TIMELINE_BOUNDARIES = {
  eventWeekDays: 7,
  finalMonthDays: 30,
  oneToThreeMonthsDays: 90,
  threeToSixMonthsDays: 180,
  sixToTwelveMonthsDays: 365,
} as const;

export interface TimelineBucket {
  group: TimelineGroup;
  tasks: Task[];
}

/** Assigns a task to a timeline bucket based on calendar days before the event. */
export function timelineGroupForDate(dueDate: ISODate, eventDate: ISODate): TimelineGroup {
  const daysBefore = daysBetween(dueDate, eventDate);
  if (daysBefore < 0) return 'After event';
  if (daysBefore <= TIMELINE_BOUNDARIES.eventWeekDays) return 'Event week';
  if (daysBefore <= TIMELINE_BOUNDARIES.finalMonthDays) return 'Final month';
  if (daysBefore <= TIMELINE_BOUNDARIES.oneToThreeMonthsDays) return '1–3 months';
  if (daysBefore <= TIMELINE_BOUNDARIES.threeToSixMonthsDays) return '3–6 months';
  if (daysBefore <= TIMELINE_BOUNDARIES.sixToTwelveMonthsDays) return '6–12 months';
  return '12+ months before';
}

/** Groups all tasks into stable timeline sections, retaining empty sections for context. */
export function groupTasksByTimeline(tasks: readonly Task[], eventDate: ISODate): TimelineBucket[] {
  const buckets = new Map<TimelineGroup, Task[]>(TIMELINE_GROUPS.map((group) => [group, []]));
  for (const task of tasks) buckets.get(timelineGroupForDate(task.dueDate, eventDate))?.push(task);
  return TIMELINE_GROUPS.map((group) => ({
    group,
    tasks: (buckets.get(group) ?? []).sort((a, b) => a.dueDate.localeCompare(b.dueDate)),
  }));
}

/** Formats a timeline task date for the compact task row. */
export function formatTaskDeadline(date: ISODate): string {
  return formatDisplayDate(date, 'd MMM yyyy');
}

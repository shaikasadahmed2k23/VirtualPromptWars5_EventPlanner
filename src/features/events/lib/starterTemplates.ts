import type { EventType, TaskCategory, TaskPriority } from '@shared/domain';

/** A checklist item with its ideal lead time before the event. */
export interface TaskTemplate {
  title: string;
  category: TaskCategory;
  priority: TaskPriority;
  /** Ideal number of days before the event, assuming a full planning horizon. */
  leadDays: number;
}

/** Comfortable planning window per event type; shorter windows compress lead times. */
export const PLANNING_HORIZON_DAYS: Record<EventType, number> = {
  wedding: 300,
  birthday: 60,
  anniversary: 90,
  community: 120,
};

const SHARED_TAIL: TaskTemplate[] = [
  { title: 'Confirm final headcount with caterer', category: 'catering', priority: 'high', leadDays: 7 },
  { title: 'Share the run-of-show with all vendors', category: 'logistics', priority: 'medium', leadDays: 3 },
];

/** Starter checklists, tuned to what each kind of celebration actually needs. */
export const TASK_TEMPLATES: Record<EventType, readonly TaskTemplate[]> = {
  wedding: [
    { title: 'Book the main venue', category: 'venue', priority: 'high', leadDays: 300 },
    { title: 'Draft the guest list with both families', category: 'guests', priority: 'high', leadDays: 270 },
    { title: 'Book photographer and film crew', category: 'vendors', priority: 'high', leadDays: 240 },
    { title: 'Shortlist caterers and schedule tastings', category: 'catering', priority: 'high', leadDays: 210 },
    { title: 'Finalise wedding attire', category: 'attire', priority: 'medium', leadDays: 150 },
    { title: 'Send save-the-dates', category: 'guests', priority: 'medium', leadDays: 120 },
    { title: 'Finalise décor and floral design', category: 'decor', priority: 'medium', leadDays: 90 },
    { title: 'Send invitations', category: 'guests', priority: 'high', leadDays: 60 },
    { title: 'Confirm ceremony rituals and officiant', category: 'ceremony', priority: 'high', leadDays: 30 },
    ...SHARED_TAIL,
  ],
  birthday: [
    { title: 'Book the venue or confirm home setup', category: 'venue', priority: 'high', leadDays: 50 },
    { title: 'Send invitations', category: 'guests', priority: 'high', leadDays: 35 },
    { title: 'Order the cake', category: 'catering', priority: 'medium', leadDays: 21 },
    { title: 'Plan games or entertainment', category: 'vendors', priority: 'medium', leadDays: 21 },
    { title: 'Buy decorations and balloons', category: 'decor', priority: 'low', leadDays: 10 },
    ...SHARED_TAIL,
  ],
  anniversary: [
    { title: 'Reserve the venue or restaurant', category: 'venue', priority: 'high', leadDays: 75 },
    { title: 'Invite close family and friends', category: 'guests', priority: 'high', leadDays: 45 },
    { title: 'Collect photos for a memory display', category: 'decor', priority: 'medium', leadDays: 30 },
    { title: 'Arrange music or a live performer', category: 'vendors', priority: 'medium', leadDays: 30 },
    { title: 'Plan toasts and speeches', category: 'ceremony', priority: 'low', leadDays: 14 },
    ...SHARED_TAIL,
  ],
  community: [
    { title: 'Secure venue and any permits', category: 'venue', priority: 'high', leadDays: 110 },
    { title: 'Recruit volunteers and assign roles', category: 'guests', priority: 'high', leadDays: 75 },
    { title: 'Line up performers and speakers', category: 'vendors', priority: 'medium', leadDays: 60 },
    { title: 'Promote the event locally and online', category: 'guests', priority: 'medium', leadDays: 45 },
    { title: 'Arrange seating, sound and signage', category: 'logistics', priority: 'medium', leadDays: 21 },
    { title: 'Plan accessibility and first-aid cover', category: 'logistics', priority: 'high', leadDays: 14 },
    ...SHARED_TAIL,
  ],
};

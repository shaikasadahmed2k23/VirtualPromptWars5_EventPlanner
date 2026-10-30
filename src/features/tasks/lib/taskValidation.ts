import { z } from 'zod';
import { TASK_CATEGORIES, TASK_PRIORITIES } from '@shared/domain';
import { LIMITS } from '@shared/limits';
import { parseISODate } from '@/lib/dates';
import type { TaskInput } from '@/types';

/** Schema for creating and editing checklist tasks, with user-facing messages. */
export const taskInputSchema: z.ZodType<TaskInput> = z.object({
  title: z.string().trim().min(1, 'Give the task a title.').max(LIMITS.eventNameMax, 'Keep the title shorter.'),
  notes: z.string().trim().max(LIMITS.notesMax, 'Notes are too long.'),
  dueDate: z.string().refine((value) => parseISODate(value) !== null, 'Choose a valid deadline.'),
  priority: z.enum(TASK_PRIORITIES),
  category: z.enum(TASK_CATEGORIES),
});

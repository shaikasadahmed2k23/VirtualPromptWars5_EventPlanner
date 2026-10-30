import { z } from 'zod';
import { TASK_CATEGORIES, TASK_PRIORITIES } from '@shared/domain';
import { LIMITS } from '@shared/limits';
import { parseISODate } from '@/lib/dates';
import type { TaskInput } from '@/types';

/** Shared schema for creating and editing checklist tasks. */
export const taskInputSchema: z.ZodType<TaskInput> = z
  .object({
    title: z.string().trim().min(1).max(LIMITS.eventNameMax),
    notes: z.string().max(LIMITS.notesMax),
    dueDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).refine((value) => parseISODate(value) !== null, 'Enter a valid date.'),
    priority: z.enum(TASK_PRIORITIES),
    category: z.enum(TASK_CATEGORIES),
  });

/** Returns the first concise validation error for a task editor. */
export function validateTaskInput(input: TaskInput): string | undefined {
  const result = taskInputSchema.safeParse(input);
  return result.success ? undefined : result.error.issues[0]?.message ?? 'Check the task details.';
}

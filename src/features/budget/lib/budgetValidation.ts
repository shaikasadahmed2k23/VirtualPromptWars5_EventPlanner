import { z } from 'zod';
import { LIMITS } from '@shared/limits';
import { BUDGET_CATEGORIES } from '@shared/domain';
import type { BudgetItemInput } from '@/types';

const amount = z.number().finite().min(0).max(LIMITS.budgetMax);

/** Validates the editable fields of a budget line against shared limits. */
export const budgetItemSchema = z.object({
  category: z.enum(BUDGET_CATEGORIES),
  name: z.string().trim().min(1).max(LIMITS.eventNameMax),
  estimated: amount,
  actual: amount,
  paid: z.boolean(),
  vendorName: z.string().max(LIMITS.venueMax),
  notes: z.string().max(LIMITS.notesMax).optional(),
  source: z.enum(['ai', 'manual']).optional(),
}) satisfies z.ZodType<BudgetItemInput>;

/** Parses a budget line and returns a user-facing field error when invalid. */
export function validateBudgetItem(input: BudgetItemInput): string | undefined {
  const result = budgetItemSchema.safeParse(input);
  if (result.success) return undefined;
  return result.error.issues[0]?.message ?? 'Check the budget line details.';
}

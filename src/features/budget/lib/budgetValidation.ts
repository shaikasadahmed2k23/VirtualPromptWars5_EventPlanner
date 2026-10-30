import { z } from 'zod';
import { LIMITS } from '@shared/limits';
import { BUDGET_CATEGORIES } from '@shared/domain';
import type { BudgetItemInput } from '@/types';
import { formatCurrency } from '@/lib/format';

const amount = z
  .number({ invalid_type_error: 'Enter an amount.' })
  .finite('Enter an amount.')
  .min(0, 'Amounts cannot be negative.')
  .max(LIMITS.budgetMax, `Keep amounts under ${formatCurrency(LIMITS.budgetMax, 'INR')}.`);

/** Validates the editable fields of a budget line against shared limits. */
export const budgetItemSchema = z.object({
  category: z.enum(BUDGET_CATEGORIES),
  name: z.string().trim().min(1, 'Name the expense.').max(LIMITS.eventNameMax, 'Keep the name shorter.'),
  estimated: amount,
  actual: amount,
  paid: z.boolean(),
  vendorName: z.string().trim().max(LIMITS.venueMax, 'Vendor name is too long.'),
  notes: z.string().trim().max(LIMITS.notesMax, 'Notes are too long.').optional(),
  source: z.enum(['ai', 'manual']).optional(),
}) satisfies z.ZodType<BudgetItemInput>;

/** Validates the event's overall budget limit. */
export const totalBudgetSchema = z
  .number({ invalid_type_error: 'Enter your total budget.' })
  .finite('Enter your total budget.')
  .min(LIMITS.budgetMin, 'The budget must be above zero.')
  .max(LIMITS.budgetMax, `Keep the budget under ${formatCurrency(LIMITS.budgetMax, 'INR')}.`);

/** Returns the first user-facing problem with a budget line, or `undefined` when valid. */
export function validateBudgetItem(input: BudgetItemInput): string | undefined {
  const result = budgetItemSchema.safeParse(input);
  return result.success ? undefined : (result.error.issues[0]?.message ?? 'Check the budget line details.');
}

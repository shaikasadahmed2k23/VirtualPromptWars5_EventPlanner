import { Wallet } from 'lucide-react';
import { memo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/states';
import { BUDGET_CATEGORY_LABELS } from '@/lib/labels';
import type { BudgetCategory, BudgetItem } from '@/types';
import { BudgetEntryRow } from './BudgetEntryRow';

interface BudgetCategoryCardProps {
  category: BudgetCategory;
  items: readonly BudgetItem[];
  onDelete: (item: BudgetItem) => void;
}

/** One category's budget lines as an editable table (scrolls horizontally on small screens). */
export const BudgetCategoryCard = memo(function BudgetCategoryCard({
  category,
  items,
  onDelete,
}: BudgetCategoryCardProps) {
  const label = BUDGET_CATEGORY_LABELS[category];
  return (
    <Card>
      <CardHeader>
        <CardTitle>{label}</CardTitle>
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <EmptyState
            icon={Wallet}
            title={`No ${label.toLowerCase()} lines`}
            description="Add an expense to start tracking this category."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <caption className="sr-only">{label} budget lines</caption>
              <thead className="text-muted">
                <tr>
                  <th scope="col" className="pb-2 pr-3 font-medium">
                    Expense
                  </th>
                  <th scope="col" className="pb-2 pr-3 font-medium">
                    Estimated
                  </th>
                  <th scope="col" className="pb-2 pr-3 font-medium">
                    Actual
                  </th>
                  <th scope="col" className="pb-2 pr-3 text-center font-medium">
                    Paid
                  </th>
                  <th scope="col" className="pb-2 text-right font-medium">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <BudgetEntryRow key={item.id} item={item} onDelete={onDelete} />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
});

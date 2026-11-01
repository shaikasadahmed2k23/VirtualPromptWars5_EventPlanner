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

/** Table columns; the last is the row actions, named for screen readers only. */
const COLUMNS = [
  { label: 'Expense', className: 'pb-2 pr-3 font-medium' },
  { label: 'Estimated', className: 'pb-2 pr-3 font-medium' },
  { label: 'Actual', className: 'pb-2 pr-3 font-medium' },
  { label: 'Paid', className: 'pb-2 pr-3 text-center font-medium' },
  { label: 'Actions', className: 'pb-2 text-right font-medium', srOnly: true },
] as const;

type BudgetLinesTableProps = Omit<BudgetCategoryCardProps, 'category'> & { label: string };

function BudgetLinesTable({ label, items, onDelete }: BudgetLinesTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[760px] text-left text-sm">
        <caption className="sr-only">{label} budget lines</caption>
        <thead className="text-muted">
          <tr>
            {COLUMNS.map((column) => (
              <th key={column.label} scope="col" className={column.className}>
                {'srOnly' in column ? <span className="sr-only">{column.label}</span> : column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <BudgetEntryRow key={item.id} item={item} onDelete={onDelete} />
          ))}
        </tbody>
      </table>
    </div>
  );
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
          <BudgetLinesTable label={label} items={items} onDelete={onDelete} />
        )}
      </CardContent>
    </Card>
  );
});

import { ListPlus, WalletCards } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ItemActionsProps {
  /** Name of the item, used to give each button a unique accessible label. */
  itemName: string;
  onAddToChecklist?: () => void;
  onAddToBudget?: () => void;
}

/** "Add to checklist" / "Add to budget" buttons shown on each plan item. */
export function ItemActions({ itemName, onAddToChecklist, onAddToBudget }: ItemActionsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {onAddToChecklist ? (
        <Button variant="soft" size="sm" onClick={onAddToChecklist} aria-label={`Add “${itemName}” to checklist`}>
          <ListPlus aria-hidden="true" />
          Checklist
        </Button>
      ) : null}
      {onAddToBudget ? (
        <Button variant="secondary" size="sm" onClick={onAddToBudget} aria-label={`Add “${itemName}” to budget`}>
          <WalletCards aria-hidden="true" />
          Budget
        </Button>
      ) : null}
    </div>
  );
}

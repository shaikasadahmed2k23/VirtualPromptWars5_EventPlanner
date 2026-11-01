import { useId, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import type { RsvpStatus } from '@/types';
import { RsvpSelect } from './RsvpSelect';

interface GuestBulkActionsProps {
  selectedCount: number;
  visibleCount: number;
  allVisibleSelected: boolean;
  onSelectAllVisible: (checked: boolean) => void;
  onApplyRsvp: (rsvp: RsvpStatus) => void;
}

/**
 * "Select all visible" plus a bulk RSVP change. The change only happens on
 * "Apply", so browsing the select with the keyboard never edits guests.
 */
export function GuestBulkActions({
  selectedCount,
  visibleCount,
  allVisibleSelected,
  onSelectAllVisible,
  onApplyRsvp,
}: GuestBulkActionsProps) {
  const [rsvp, setRsvp] = useState<RsvpStatus>('attending');
  const selectAllId = useId();
  const rsvpId = useId();

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-line bg-surface p-4">
      <div className="flex items-center gap-2 text-sm font-medium">
        <Checkbox
          id={selectAllId}
          checked={allVisibleSelected}
          disabled={visibleCount === 0}
          onCheckedChange={(checked) => {
            onSelectAllVisible(checked === true);
          }}
        />
        <label htmlFor={selectAllId}>Select all visible</label>
        <span className="text-muted" aria-live="polite">
          ({selectedCount} selected)
        </span>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <label className="text-sm text-muted" htmlFor={rsvpId}>
          Set RSVP for selected
        </label>
        <RsvpSelect id={rsvpId} className="h-10 w-auto" value={rsvp} onChange={setRsvp} />
        <Button
          size="sm"
          variant="secondary"
          disabled={selectedCount === 0}
          onClick={() => {
            onApplyRsvp(rsvp);
          }}
        >
          Apply
        </Button>
      </div>
    </div>
  );
}

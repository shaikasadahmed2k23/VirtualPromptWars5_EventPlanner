import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { Check, ChevronsUpDown, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { paths } from '@/app/navigation';
import { formatDisplayDate } from '@/lib/dates';
import { cn } from '@/lib/utils';
import type { CelebrationEvent } from '@/types';
import { useEventStore } from '../store/useEventStore';

const itemClass =
  'flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-sm outline-none data-[highlighted]:bg-ivory-deep';

/** Dropdown to jump between events or start a new one. Keyboard accessible via Radix. */
export function EventSwitcher({ current }: { current: CelebrationEvent }) {
  const events = useEventStore((state) => state.events);
  const navigate = useNavigate();

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger
        className="inline-flex max-w-full items-center gap-2 rounded-full border border-line bg-surface px-4 py-2 text-sm font-medium shadow-soft transition-colors hover:border-rose"
        aria-label={`${current.name}: switch event`}
      >
        <span className="truncate">{current.name}</span>
        <ChevronsUpDown className="size-4 shrink-0 text-muted" aria-hidden="true" />
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="end"
          sideOffset={8}
          className="z-50 w-72 rounded-2xl border border-line bg-surface p-1.5 shadow-lift"
        >
          <DropdownMenu.Label className="px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-muted">
            Your events
          </DropdownMenu.Label>
          {events.map((event) => (
            <DropdownMenu.Item
              key={event.id}
              className={itemClass}
              onSelect={() => {
                void navigate(paths.event(event.id));
              }}
            >
              <Check
                className={cn('size-4 text-rose-ink', event.id !== current.id && 'invisible')}
                aria-hidden="true"
              />
              <span className="min-w-0">
                <span className="block truncate font-medium">{event.name}</span>
                <span className="block text-xs text-muted">{formatDisplayDate(event.date)}</span>
              </span>
            </DropdownMenu.Item>
          ))}
          <DropdownMenu.Separator className="my-1 h-px bg-line" />
          <DropdownMenu.Item
            className={itemClass}
            onSelect={() => {
              void navigate(paths.newEvent());
            }}
          >
            <Plus className="size-4 text-rose-ink" aria-hidden="true" />
            Plan a new event
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}

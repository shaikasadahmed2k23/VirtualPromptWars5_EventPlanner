import { Search } from 'lucide-react';
import { GUEST_DIETARY, GUEST_GROUPS, RSVP_STATUSES, type GuestDietary, type GuestGroup, type RsvpStatus } from '@/types';
import { Field } from '@/components/ui/field';
import { Input, Select } from '@/components/ui/input';
import { GUEST_DIETARY_LABELS, GUEST_GROUP_LABELS, RSVP_LABELS } from '@/lib/labels';
import type { GuestSort } from '../lib/guestFilters';

interface GuestFiltersProps {
  searchInput: string;
  setSearchInput: (value: string) => void;
  rsvp: RsvpStatus | 'all';
  setRsvp: (value: RsvpStatus | 'all') => void;
  group: GuestGroup | 'all';
  setGroup: (value: GuestGroup | 'all') => void;
  dietary: GuestDietary | 'all';
  setDietary: (value: GuestDietary | 'all') => void;
  sort: GuestSort;
  setSort: (value: GuestSort) => void;
}

/** Search, filter and sort controls for the guest list. */
export function GuestFilters(props: GuestFiltersProps) {
  return (
    <div className="grid gap-3 rounded-2xl border border-line bg-surface p-4 sm:grid-cols-2 lg:grid-cols-5">
      <Field label="Search guests" hideLabel>
        {(field) => <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-3 size-4 text-muted" aria-hidden="true" />
          <Input {...field} className="pl-9" placeholder="Search guests…" value={props.searchInput} onChange={(event) => props.setSearchInput(event.target.value)} />
        </div>}
      </Field>
      <Field label="RSVP" hideLabel>
        {(field) => <Select {...field} aria-label="RSVP filter" value={props.rsvp} onChange={(event) => props.setRsvp(event.target.value as RsvpStatus | 'all')}>
          <option value="all">All RSVPs</option>
          {RSVP_STATUSES.map((status) => <option key={status} value={status}>{RSVP_LABELS[status]}</option>)}
        </Select>}
      </Field>
      <Field label="Side / group" hideLabel>
        {(field) => <Select {...field} aria-label="Group filter" value={props.group} onChange={(event) => props.setGroup(event.target.value as GuestGroup | 'all')}>
          <option value="all">All groups</option>
          {GUEST_GROUPS.map((group) => <option key={group} value={group}>{GUEST_GROUP_LABELS[group]}</option>)}
        </Select>}
      </Field>
      <Field label="Dietary" hideLabel>
        {(field) => <Select {...field} aria-label="Dietary filter" value={props.dietary} onChange={(event) => props.setDietary(event.target.value as GuestDietary | 'all')}>
          <option value="all">All dietary</option>
          {GUEST_DIETARY.map((dietary) => <option key={dietary} value={dietary}>{GUEST_DIETARY_LABELS[dietary]}</option>)}
        </Select>}
      </Field>
      <Field label="Sort by" hideLabel>
        {(field) => <Select {...field} aria-label="Sort guests" value={props.sort} onChange={(event) => props.setSort(event.target.value as GuestSort)}>
          <option value="name">Name</option><option value="rsvp">RSVP</option>
        </Select>}
      </Field>
    </div>
  );
}

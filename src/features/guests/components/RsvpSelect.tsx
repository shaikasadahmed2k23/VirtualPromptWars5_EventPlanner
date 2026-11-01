import { LabelledOptions, Select } from '@/components/ui/input';
import { RSVP_LABELS } from '@/lib/labels';
import { RSVP_STATUSES, type RsvpStatus } from '@/types';

interface RsvpSelectProps {
  value: RsvpStatus;
  onChange: (rsvp: RsvpStatus) => void;
  className?: string;
  /** Pair with a visible `<label htmlFor>`… */
  id?: string;
  /** …or name it directly when there is no visible label. */
  'aria-label'?: string;
}

/** Native select over every RSVP status; only ever reports a valid status. */
export function RsvpSelect({ value, onChange, className, ...labelling }: RsvpSelectProps) {
  return (
    <Select
      {...labelling}
      className={className}
      value={value}
      onChange={(event) => {
        const next = RSVP_STATUSES.find((status) => status === event.target.value);
        if (next) onChange(next);
      }}
    >
      <LabelledOptions values={RSVP_STATUSES} labels={RSVP_LABELS} />
    </Select>
  );
}

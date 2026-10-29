import type { CurrencyCode, DietaryOption, EventStyle, EventType } from '@shared/domain';
import type { Id, ISODate, ISODateTime } from './common';
import type { SavedTheme } from './theme';

export type { CurrencyCode, DietaryOption, EventStyle, EventType };

/** Special requirements captured in the final wizard step. */
export interface EventRequirements {
  dietary: DietaryOption[];
  accessibility: string;
  cultural: string;
  notes: string;
}

/**
 * A celebration being planned. Named `CelebrationEvent` to avoid clashing with
 * the DOM's global `Event` type.
 */
export interface CelebrationEvent {
  id: Id;
  name: string;
  type: EventType;
  date: ISODate;
  /** Local start time in `HH:MM`. */
  startTime: string;
  city: string;
  venue: string;
  guestCount: number;
  /** Total budget in whole units of `currency`. */
  budget: number;
  currency: CurrencyCode;
  style: EventStyle;
  requirements: EventRequirements;
  /** Theme the hosts saved from the mood-board page, if any. */
  theme: SavedTheme | null;
  createdAt: ISODateTime;
  updatedAt: ISODateTime;
}

/** Fields a user can supply when creating an event. */
export type NewEventInput = Omit<CelebrationEvent, 'id' | 'createdAt' | 'updatedAt' | 'theme'>;

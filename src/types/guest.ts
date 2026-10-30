import { DIETARY_OPTIONS, type DietaryOption } from '@shared/domain';
import type { Id } from './common';

/** RSVP states. */
export const RSVP_STATUSES = ['attending', 'pending', 'declined'] as const;
export type RsvpStatus = (typeof RSVP_STATUSES)[number];

/** Which side / circle a guest belongs to. */
export const GUEST_GROUPS = ['bride-side', 'groom-side', 'family', 'friends', 'colleagues', 'community'] as const;
export type GuestGroup = (typeof GUEST_GROUPS)[number];

/** Guest dietary preference; `none` means no restriction. */
export const GUEST_DIETARY = ['none', ...DIETARY_OPTIONS] as const;
export type GuestDietary = 'none' | DietaryOption;

/** A person (and their plus-ones) invited to an event. */
export interface Guest {
  id: Id;
  eventId: Id;
  name: string;
  email: string;
  phone: string;
  rsvp: RsvpStatus;
  dietary: GuestDietary;
  plusOnes: number;
  group: GuestGroup;
  notes?: string;
}

/** Editable guest fields. */
export type GuestInput = Omit<Guest, 'id' | 'eventId'>;

/** Derived guest-list statistics. */
export interface GuestStats {
  total: number;
  attending: number;
  pending: number;
  declined: number;
  /** Attending guests plus their plus-ones. */
  headcount: number;
  /** Headcount by dietary preference, attending guests only. */
  dietary: Record<GuestDietary, number>;
}

import {
  CalendarHeart,
  CheckSquare,
  Home,
  LayoutDashboard,
  type LucideIcon,
  Palette,
  PlusCircle,
  Settings,
  Sparkles,
  Store,
  Users,
  Wallet,
} from 'lucide-react';
import type { Id } from '@/types';

/** A single navigation destination. */
export interface NavItem {
  label: string;
  to: string;
  icon: LucideIcon;
  /** Match the path exactly (for index-like routes). */
  end?: boolean;
}

/** Route path builders — the only place URL shapes are defined. */
export const paths = {
  home: () => '/',
  newEvent: () => '/plan/new',
  events: () => '/events',
  vendors: () => '/vendors',
  settings: () => '/settings',
  event: (id: Id) => `/events/${id}`,
  assistant: (id: Id) => `/events/${id}/assistant`,
  budget: (id: Id) => `/events/${id}/budget`,
  tasks: (id: Id) => `/events/${id}/tasks`,
  guests: (id: Id) => `/events/${id}/guests`,
  themes: (id: Id) => `/events/${id}/themes`,
} as const;

/** Global navigation. "My event" points at the active event (or the events index). */
export function getPrimaryNav(activeEventId: Id | null): NavItem[] {
  return [
    { label: 'Home', to: paths.home(), icon: Home, end: true },
    {
      label: 'My event',
      to: activeEventId ? paths.event(activeEventId) : paths.events(),
      icon: CalendarHeart,
    },
    { label: 'Plan new', to: paths.newEvent(), icon: PlusCircle },
    { label: 'Vendors', to: paths.vendors(), icon: Store },
    { label: 'Settings', to: paths.settings(), icon: Settings },
  ];
}

/** Section navigation inside a single event. */
export function getEventNav(eventId: Id): NavItem[] {
  return [
    { label: 'Overview', to: paths.event(eventId), icon: LayoutDashboard, end: true },
    { label: 'AI Assistant', to: paths.assistant(eventId), icon: Sparkles },
    { label: 'Budget', to: paths.budget(eventId), icon: Wallet },
    { label: 'Tasks', to: paths.tasks(eventId), icon: CheckSquare },
    { label: 'Guests', to: paths.guests(eventId), icon: Users },
    { label: 'Themes', to: paths.themes(eventId), icon: Palette },
  ];
}

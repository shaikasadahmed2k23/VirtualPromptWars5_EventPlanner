import { NavLink } from 'react-router-dom';
import { getPrimaryNav } from '@/app/navigation';
import { useEventStore } from '@/features/events/store/useEventStore';
import { cn } from '@/lib/utils';

/** Fixed bottom tab bar for small screens (hidden from `md` up). */
export function MobileNav() {
  const activeEventId = useEventStore((state) => state.activeEventId);

  return (
    <nav
      aria-label="Mobile"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-surface/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md md:hidden"
    >
      <ul className="mx-auto grid max-w-md grid-cols-5">
        {getPrimaryNav(activeEventId).map(({ label, to, icon: Icon, end }) => (
          <li key={label}>
            <NavLink
              to={to}
              end={end}
              className={({ isActive }) =>
                cn(
                  'flex flex-col items-center gap-0.5 rounded-none px-1 py-2.5 text-[0.7rem] font-medium transition-colors',
                  isActive ? 'text-rose-ink' : 'text-muted hover:text-charcoal',
                )
              }
            >
              <Icon className="size-5" aria-hidden="true" />
              {label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}

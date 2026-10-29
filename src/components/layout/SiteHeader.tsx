import { Link, NavLink } from 'react-router-dom';
import { getPrimaryNav, paths } from '@/app/navigation';
import { Monogram } from '@/components/decor/Monogram';
import { Button } from '@/components/ui/button';
import { useEventStore } from '@/features/events/store/useEventStore';
import { APP_NAME } from '@/lib/constants';
import { cn } from '@/lib/utils';

/** Sticky top bar: brand, desktop navigation and primary call to action. */
export function SiteHeader() {
  const activeEventId = useEventStore((state) => state.activeEventId);
  const navItems = getPrimaryNav(activeEventId).filter((item) => item.to !== paths.newEvent());

  return (
    <header className="sticky top-0 z-40 border-b border-line/70 bg-ivory/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link to={paths.home()} className="flex items-center gap-2.5 rounded-full" aria-label={`${APP_NAME} home`}>
          <Monogram />
          <span className="font-serif text-2xl font-semibold tracking-tight">{APP_NAME}</span>
        </Link>

        <nav aria-label="Primary" className="hidden md:block">
          <ul className="flex items-center gap-1">
            {navItems.map(({ label, to, end }) => (
              <li key={label}>
                <NavLink
                  to={to}
                  end={end}
                  className={({ isActive }) =>
                    cn(
                      'rounded-full px-4 py-2 text-sm font-medium transition-colors hover:bg-ivory-deep',
                      isActive ? 'text-rose-ink' : 'text-charcoal',
                    )
                  }
                >
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <Button asChild size="sm" className="hidden sm:inline-flex">
          <Link to={paths.newEvent()}>Plan my event</Link>
        </Button>
      </div>
    </header>
  );
}

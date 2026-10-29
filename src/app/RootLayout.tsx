import { Suspense, useRef } from 'react';
import { Outlet, ScrollRestoration } from 'react-router-dom';
import { MobileNav } from '@/components/layout/MobileNav';
import { RouteFallback } from '@/components/layout/RouteFallback';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { SkipLink } from '@/components/layout/SkipLink';
import { Toaster } from '@/components/ui/toaster';
import { useRouteFocus } from './useRouteFocus';

/** App shell shared by every route: landmarks, navigation, toasts. */
export function RootLayout() {
  const mainRef = useRef<HTMLElement>(null);
  useRouteFocus(mainRef);

  return (
    <>
      <SkipLink />
      <SiteHeader />
      <main id="main" ref={mainRef} tabIndex={-1} className="min-h-[70dvh] outline-none">
        <Suspense fallback={<RouteFallback />}>
          <Outlet />
        </Suspense>
      </main>
      <SiteFooter />
      <MobileNav />
      <Toaster />
      <ScrollRestoration />
    </>
  );
}

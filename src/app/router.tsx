import { lazy } from 'react';
import { createBrowserRouter, type RouteObject } from 'react-router-dom';
import { RouteError } from '@/components/layout/RouteError';
import { RootLayout } from './RootLayout';

/* Every page is its own chunk; only the shell ships in the initial bundle. */
const LandingPage = lazy(() => import('@/routes/LandingPage'));
const PlanWizardPage = lazy(() => import('@/routes/PlanWizardPage'));
const EventsIndexPage = lazy(() => import('@/routes/EventsIndexPage'));
const EventLayout = lazy(() => import('@/routes/EventLayout'));
const DashboardPage = lazy(() => import('@/routes/DashboardPage'));
const AssistantPage = lazy(() => import('@/routes/AssistantPage'));
const BudgetPage = lazy(() => import('@/routes/BudgetPage'));
const TasksPage = lazy(() => import('@/routes/TasksPage'));
const GuestsPage = lazy(() => import('@/routes/GuestsPage'));
const ThemesPage = lazy(() => import('@/routes/ThemesPage'));
const VendorsPage = lazy(() => import('@/routes/VendorsPage'));
const SettingsPage = lazy(() => import('@/routes/SettingsPage'));
const NotFoundPage = lazy(() => import('@/routes/NotFoundPage'));

/** Route table. Path shapes mirror `paths` in `navigation.ts`. */
export const routes: RouteObject[] = [
  {
    element: <RootLayout />,
    errorElement: <RouteError />,
    children: [
      { index: true, element: <LandingPage /> },
      { path: 'plan/new', element: <PlanWizardPage /> },
      { path: 'events', element: <EventsIndexPage /> },
      {
        path: 'events/:eventId',
        element: <EventLayout />,
        children: [
          { index: true, element: <DashboardPage /> },
          { path: 'assistant', element: <AssistantPage /> },
          { path: 'budget', element: <BudgetPage /> },
          { path: 'tasks', element: <TasksPage /> },
          { path: 'guests', element: <GuestsPage /> },
          { path: 'themes', element: <ThemesPage /> },
        ],
      },
      { path: 'vendors', element: <VendorsPage /> },
      { path: 'settings', element: <SettingsPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
];

/** Creates the browser router for the app. */
export function createAppRouter() {
  return createBrowserRouter(routes);
}

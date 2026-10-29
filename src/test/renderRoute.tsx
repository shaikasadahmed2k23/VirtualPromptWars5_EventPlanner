import { render, type RenderResult } from '@testing-library/react';
import userEvent, { type UserEvent } from '@testing-library/user-event';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { ROUTER_FUTURE_FLAGS, routes } from '@/app/router';

/** Result of {@link renderRoute}: RTL queries plus a user-event instance and the router. */
export interface RenderRouteResult extends RenderResult {
  user: UserEvent;
  router: ReturnType<typeof createMemoryRouter>;
}

/** Renders the real application route table at `path` in a memory router. */
export function renderRoute(path: string): RenderRouteResult {
  const router = createMemoryRouter(routes, { initialEntries: [path], future: ROUTER_FUTURE_FLAGS });
  const user = userEvent.setup();
  const result = render(<RouterProvider router={router} future={{ v7_startTransition: true }} />);
  return { ...result, user, router };
}

import { render, type RenderResult } from '@testing-library/react';
import userEvent, { type UserEvent } from '@testing-library/user-event';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { routes } from '@/app/router';

/** Result of {@link renderRoute}: RTL queries plus a user-event instance and the router. */
export interface RenderRouteResult extends RenderResult {
  user: UserEvent;
  router: ReturnType<typeof createMemoryRouter>;
}

/** Renders the real application route table at `path` in a memory router. */
export function renderRoute(path: string): RenderRouteResult {
  const router = createMemoryRouter(routes, { initialEntries: [path] });
  const user = userEvent.setup({ delay: null });
  const result = render(<RouterProvider router={router} />);
  return { ...result, user, router };
}

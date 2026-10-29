import { useState } from 'react';
import { RouterProvider } from 'react-router-dom';
import { createAppRouter } from './router';

/** Root component: owns the router instance. */
export function App() {
  const [router] = useState(createAppRouter);
  return <RouterProvider router={router} future={{ v7_startTransition: true }} />;
}

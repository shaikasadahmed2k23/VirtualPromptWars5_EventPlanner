import { screen, within } from '@testing-library/react';
import { resetDemoData } from '@/features/events/store/eventLifecycle';
import { useEventStore } from '@/features/events/store/useEventStore';
import { useTaskStore } from '@/features/tasks/store/useTaskStore';
import { DEMO_EVENT_ID } from '@/lib/constants';
import { expectNoA11yViolations } from '@/test/a11y';
import { renderRoute } from '@/test/renderRoute';

beforeEach(() => {
  resetDemoData();
});

describe('SettingsPage', () => {
  it('lists saved events and marks the active one', async () => {
    renderRoute('/settings');
    await screen.findByRole('heading', { level: 1, name: /your planning space/i });
    const demo = useEventStore.getState().events.find((event) => event.id === DEMO_EVENT_ID)!;
    const row = screen.getByRole('link', { name: demo.name }).closest('li')!;
    expect(within(row).getByText('Active')).toBeInTheDocument();
  });

  it('deletes an event and its planning data only after confirmation', async () => {
    const { user } = renderRoute('/settings');
    await screen.findByRole('heading', { level: 1, name: /your planning space/i });
    const demo = useEventStore.getState().events.find((event) => event.id === DEMO_EVENT_ID)!;

    await user.click(screen.getByRole('button', { name: `Delete ${demo.name}` }));
    await user.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(useEventStore.getState().events.some((event) => event.id === DEMO_EVENT_ID)).toBe(true);

    await user.click(screen.getByRole('button', { name: `Delete ${demo.name}` }));
    await user.click(screen.getByRole('button', { name: 'Delete event' }));
    expect(useEventStore.getState().events.some((event) => event.id === DEMO_EVENT_ID)).toBe(false);
    expect(useTaskStore.getState().tasks.some((task) => task.eventId === DEMO_EVENT_ID)).toBe(false);
    expect(await screen.findByText('No events yet')).toBeInTheDocument();
  });

  it('resets to the demo after confirmation, removing events the user created', async () => {
    const created = useEventStore.getState().createEvent({
      name: 'Office Diwali party',
      type: 'community',
      date: '2030-10-20',
      startTime: '19:00',
      city: 'Pune',
      venue: '',
      guestCount: 60,
      budget: 120_000,
      currency: 'INR',
      style: 'modern',
      requirements: { dietary: [], accessibility: '', cultural: '', notes: '' },
    });
    const { user } = renderRoute('/settings');
    expect(await screen.findByRole('link', { name: 'Office Diwali party' })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /reset demo data/i }));
    await user.click(screen.getByRole('button', { name: 'Reset to demo' }));

    const ids = useEventStore.getState().events.map((event) => event.id);
    expect(ids).toContain(DEMO_EVENT_ID);
    expect(ids).not.toContain(created.id);
    expect(await screen.findByText('Demo data restored')).toBeInTheDocument();
  });

  it('has no detectable accessibility violations', async () => {
    const { container } = renderRoute('/settings');
    await screen.findByRole('heading', { level: 1, name: /your planning space/i });
    await expectNoA11yViolations(container);
  });
});

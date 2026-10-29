import { screen, within } from '@testing-library/react';
import { resetDemoData } from '@/features/events/lib/eventLifecycle';
import { useEventStore } from '@/features/events/store/useEventStore';
import { useTaskStore } from '@/features/tasks/store/useTaskStore';
import { DEMO_EVENT_ID } from '@/lib/constants';
import { expectNoA11yViolations } from '@/test/a11y';
import { renderRoute } from '@/test/renderRoute';

beforeEach(() => {
  resetDemoData();
});

const section = (name: RegExp) => screen.getByRole('region', { name });

describe('DashboardPage', () => {
  it('renders the seeded wedding with countdown, stats and widgets', async () => {
    renderRoute(`/events/${DEMO_EVENT_ID}`);

    expect(await screen.findByRole('heading', { level: 1, name: 'Ayesha & Rohan’s Wedding' })).toBeInTheDocument();
    expect(screen.getByRole('timer', { name: /time until the event/i })).toBeInTheDocument();
    expect(screen.getByRole('progressbar', { name: /budget spent/i })).toBeInTheDocument();
    expect(screen.getByText('15 / 22')).toBeInTheDocument();
    expect(within(section(/up next/i)).getAllByRole('checkbox')).toHaveLength(5);
    expect(within(section(/ai plan/i)).getByText('Nizami Nights & Jasmine Mornings')).toBeInTheDocument();
    expect(within(section(/budget by category/i)).getByText('Venue')).toBeInTheDocument();
    expect(screen.getByRole('list', { name: /nizami nights palette/i })).toBeInTheDocument();
  });

  it('completes a task inline from the upcoming list', async () => {
    const { user } = renderRoute(`/events/${DEMO_EVENT_ID}`);
    const firstTask = (await screen.findAllByRole('checkbox'))[0]!;
    const taskId = firstTask.id.replace('upcoming-', '');

    await user.click(firstTask);
    expect(await screen.findByText(/^Marked “.+” done$/)).toBeInTheDocument();
    expect(useTaskStore.getState().tasks.find((task) => task.id === taskId)?.done).toBe(true);
  });

  it('shows empty states for an event with no data yet', async () => {
    const event = useEventStore.getState().createEvent({
      name: 'Neighbourhood Diwali Mela',
      type: 'community',
      date: '2030-11-01',
      startTime: '17:00',
      city: 'Pune',
      venue: '',
      guestCount: 300,
      budget: 200_000,
      currency: 'INR',
      style: 'festive',
      requirements: { dietary: [], accessibility: '', cultural: '', notes: '' },
    });
    renderRoute(`/events/${event.id}`);

    expect(await screen.findByRole('heading', { level: 1, name: 'Neighbourhood Diwali Mela' })).toBeInTheDocument();
    expect(screen.getByText('No tasks yet')).toBeInTheDocument();
    expect(screen.getByText('No budget lines yet')).toBeInTheDocument();
    expect(screen.getByText('Your timeline is empty')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /generate ai plan/i })).toHaveAttribute(
      'href',
      `/events/${event.id}/assistant?generate=1`,
    );
    expect(screen.getByRole('link', { name: /choose a theme/i })).toBeInTheDocument();
  });

  it('shows a recoverable state for an unknown event', async () => {
    renderRoute('/events/does-not-exist');
    expect(await screen.findByText(/we couldn’t find that event/i)).toBeInTheDocument();
  });

  it('shows an empty state on /events when no events exist', async () => {
    useEventStore.setState({ events: [], activeEventId: null });
    renderRoute('/events');
    expect(await screen.findByText(/no celebrations planned yet/i)).toBeInTheDocument();
  });

  it('has no detectable accessibility violations', async () => {
    const { container } = renderRoute(`/events/${DEMO_EVENT_ID}`);
    await screen.findByRole('heading', { level: 1, name: 'Ayesha & Rohan’s Wedding' });
    await expectNoA11yViolations(container);
  });
});

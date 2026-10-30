import { fireEvent, screen, waitFor, within } from '@testing-library/react';
import { resetDemoData } from '@/features/events/lib/eventLifecycle';
import { useEventStore } from '@/features/events/store/useEventStore';
import { useTaskStore } from '@/features/tasks/store/useTaskStore';
import { DEMO_EVENT_ID } from '@/lib/constants';
import { expectNoA11yViolations } from '@/test/a11y';
import { renderRoute } from '@/test/renderRoute';

beforeEach(() => {
  resetDemoData();
});

describe('TasksPage', () => {
  it('toggles a task and updates progress', async () => {
    const { user } = renderRoute(`/events/${DEMO_EVENT_ID}/tasks`);
    await screen.findByRole('heading', { level: 1, name: /checklist & timeline/i });
    const progress = screen.getByRole('progressbar', { name: /checklist progress/i });
    const before = progress.getAttribute('aria-valuetext');
    await user.click(screen.getAllByRole('checkbox')[0]!);
    expect(progress.getAttribute('aria-valuetext')).not.toBe(before);
  });

  it('adds, edits, deletes and restores a task with Undo', async () => {
    const { user } = renderRoute(`/events/${DEMO_EVENT_ID}/tasks`);
    await screen.findByRole('heading', { level: 1, name: /checklist & timeline/i });
    await user.click(screen.getByRole('button', { name: 'Add task' }));
    const dialog = screen.getByRole('dialog');
    await user.type(within(dialog).getByRole('textbox', { name: 'Title' }), 'Confirm florist');
    await user.type(within(dialog).getByLabelText(/deadline/i), '2030-01-02');
    await user.click(within(dialog).getByRole('button', { name: 'Add task' }));
    expect(useTaskStore.getState().tasks.filter((task) => task.title === 'Confirm florist')).toHaveLength(1);

    await user.click(screen.getByRole('button', { name: 'Edit Confirm florist' }));
    const editDialog = screen.getByRole('dialog');
    const title = within(editDialog).getByRole('textbox', { name: 'Title' });
    await user.clear(title);
    await user.type(title, 'Confirm final florist');
    await user.click(within(editDialog).getByRole('button', { name: 'Save task' }));
    expect(useTaskStore.getState().tasks.some((task) => task.title === 'Confirm final florist')).toBe(true);

    await user.click(screen.getByRole('button', { name: 'Delete Confirm final florist' }));
    await user.click(screen.getByRole('button', { name: 'Delete task' }));
    expect(await screen.findByText('Removed “Confirm final florist”')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Undo' })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Undo' }));
    await waitFor(() => expect(useTaskStore.getState().tasks.some((task) => task.title === 'Confirm final florist')).toBe(true));
  });

  it('generates a starter checklist for an empty event', async () => {
    const event = useEventStore.getState().createEvent({
      name: 'Empty celebration',
      type: 'birthday',
      date: '2030-01-01',
      startTime: '18:00',
      city: 'Pune',
      venue: '',
      guestCount: 10,
      budget: 50_000,
      currency: 'INR',
      style: 'modern',
      requirements: { dietary: [], accessibility: '', cultural: '', notes: '' },
    });
    useTaskStore.getState().removeByEvent(event.id);
    const { user } = renderRoute(`/events/${event.id}/tasks`);
    await screen.findByText('Your checklist is empty');
    await user.click(screen.getByRole('button', { name: /generate starter checklist/i }));
    expect(useTaskStore.getState().tasks.filter((task) => task.eventId === event.id).length).toBeGreaterThan(0);
  });

  it('has no detectable accessibility violations', async () => {
    const { container } = renderRoute(`/events/${DEMO_EVENT_ID}/tasks`);
    await screen.findByRole('heading', { level: 1, name: /checklist & timeline/i });
    await expectNoA11yViolations(container);
  });
});

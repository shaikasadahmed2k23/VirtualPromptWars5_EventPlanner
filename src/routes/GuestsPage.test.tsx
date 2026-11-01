import { act, fireEvent, screen, waitFor, within } from '@testing-library/react';
import { toast } from 'sonner';
import { resetDemoData } from '@/features/events/store/eventLifecycle';
import { useEventStore } from '@/features/events/store/useEventStore';
import { useGuestStore } from '@/features/guests/store/useGuestStore';
import { DEMO_EVENT_ID } from '@/lib/constants';
import { expectNoA11yViolations } from '@/test/a11y';
import { renderRoute } from '@/test/renderRoute';

beforeEach(() => resetDemoData());

describe('GuestsPage', () => {
  it('updates stats when an RSVP changes', async () => {
    const { user } = renderRoute(`/events/${DEMO_EVENT_ID}/guests`);
    await screen.findByRole('heading', { level: 1, name: 'Guests' });
    const before = useGuestStore.getState().guests.filter((guest) => guest.rsvp === 'attending').length;
    const select = screen.getByRole('combobox', { name: /rsvp for sameer qureshi/i });
    await user.selectOptions(select, 'attending');
    await waitFor(() =>
      expect(useGuestStore.getState().guests.filter((guest) => guest.rsvp === 'attending')).toHaveLength(before + 1),
    );
    expect(screen.getByText(String(before + 1))).toBeInTheDocument();
  });

  it('bulk updates selected visible guests', async () => {
    const { user } = renderRoute(`/events/${DEMO_EVENT_ID}/guests`);
    await screen.findByRole('heading', { level: 1, name: 'Guests' });
    await user.click(screen.getByRole('checkbox', { name: /select all visible/i }));
    await user.selectOptions(screen.getByRole('combobox', { name: /set rsvp for selected/i }), 'declined');
    // Choosing an option alone never edits guests; "Apply" does.
    expect(useGuestStore.getState().guests.some((guest) => guest.rsvp !== 'declined')).toBe(true);
    await user.click(screen.getByRole('button', { name: 'Apply' }));
    expect(useGuestStore.getState().guests.filter((guest) => guest.rsvp === 'declined')).toHaveLength(22);
    expect(screen.getByRole('checkbox', { name: /select all visible/i })).not.toBeChecked();
  });

  it('adds, validates, deletes and restores a guest with Undo', async () => {
    const { user } = renderRoute(`/events/${DEMO_EVENT_ID}/guests`);
    await screen.findByRole('heading', { level: 1, name: 'Guests' });
    await user.click(screen.getByRole('button', { name: 'Add guest' }));
    const dialog = screen.getByRole('dialog');
    await user.click(within(dialog).getByRole('button', { name: 'Add guest' }));
    expect(await within(dialog).findByText('Name is required.')).toBeInTheDocument();
    await user.type(within(dialog).getByRole('textbox', { name: 'Name' }), 'New Guest');
    await user.click(within(dialog).getByRole('button', { name: 'Add guest' }));
    expect(useGuestStore.getState().guests.some((guest) => guest.name === 'New Guest')).toBe(true);
    await user.click(screen.getByRole('button', { name: 'Delete New Guest' }));
    await user.click(screen.getByRole('button', { name: 'Delete guest' }));
    expect(await screen.findByText('Removed “New Guest”')).toBeInTheDocument();
    act(() => {
      fireEvent.click(screen.getByRole('button', { name: 'Undo' }));
      toast.dismiss();
    });
    await waitFor(() => expect(useGuestStore.getState().guests.some((guest) => guest.name === 'New Guest')).toBe(true));
  });

  it('has no detectable accessibility violations', async () => {
    const { container } = renderRoute(`/events/${DEMO_EVENT_ID}/guests`);
    await screen.findByRole('heading', { level: 1, name: 'Guests' });
    await expectNoA11yViolations(container);
  });

  it('shows an empty state for an event with no guests', async () => {
    const event = useEventStore.getState().createEvent({
      name: 'Guestless event',
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
    useGuestStore.getState().removeByEvent(event.id);
    renderRoute(`/events/${event.id}/guests`);
    expect(await screen.findByText('Your guest list is empty')).toBeInTheDocument();
  });
});

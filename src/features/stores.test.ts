import { useAssistantStore } from '@/features/assistant/store/useAssistantStore';
import { useBudgetStore } from '@/features/budget/store/useBudgetStore';
import { deleteEventCascade, resetDemoData } from '@/features/events/lib/eventLifecycle';
import { useEventStore } from '@/features/events/store/useEventStore';
import { useGuestStore } from '@/features/guests/store/useGuestStore';
import { useTaskStore } from '@/features/tasks/store/useTaskStore';
import { useVendorStore } from '@/features/vendors/store/useVendorStore';
import { DEMO_EVENT_ID } from '@/lib/constants';
import type { NewEventInput } from '@/types';

const NEW_EVENT: NewEventInput = {
  name: 'Kabir turns 30',
  type: 'birthday',
  date: '2027-05-04',
  startTime: '19:00',
  city: 'Bengaluru',
  venue: 'Rooftop at Indiranagar',
  guestCount: 40,
  budget: 150_000,
  currency: 'INR',
  style: 'modern',
  requirements: { dietary: ['vegetarian'], accessibility: '', cultural: '', notes: '' },
};

beforeEach(() => {
  resetDemoData();
});

describe('event store', () => {
  it('seeds the demo wedding as the active event', () => {
    const { events, activeEventId } = useEventStore.getState();
    expect(events).toHaveLength(1);
    expect(activeEventId).toBe(DEMO_EVENT_ID);
  });

  it('creates, updates and activates a new event', () => {
    const created = useEventStore.getState().createEvent(NEW_EVENT);
    expect(useEventStore.getState().activeEventId).toBe(created.id);

    useEventStore.getState().updateEvent(created.id, { guestCount: 55 });
    const updated = useEventStore.getState().events.find((event) => event.id === created.id);
    expect(updated?.guestCount).toBe(55);
    expect(updated?.theme).toBeNull();
  });

  it('saves and clears a theme', () => {
    const theme = useEventStore.getState().events[0]?.theme;
    useEventStore.getState().clearTheme(DEMO_EVENT_ID);
    expect(useEventStore.getState().events[0]?.theme).toBeNull();

    useEventStore.getState().saveTheme(DEMO_EVENT_ID, theme!);
    expect(useEventStore.getState().events[0]?.theme?.name).toBe(theme?.name);
  });
});

describe('task store', () => {
  it('adds, edits, toggles and deletes tasks', () => {
    const store = useTaskStore.getState();
    const task = store.addTask(DEMO_EVENT_ID, {
      title: 'Book mehendi artist',
      notes: '',
      dueDate: '2026-12-01',
      priority: 'medium',
      category: 'vendors',
    });
    expect(task.done).toBe(false);

    useTaskStore.getState().updateTask(task.id, { priority: 'high' });
    useTaskStore.getState().toggleTask(task.id);
    const stored = useTaskStore.getState().tasks.find((t) => t.id === task.id);
    expect(stored).toMatchObject({ priority: 'high', done: true });

    const position = useTaskStore.getState().tasks.findIndex((t) => t.id === task.id);
    const undo = useTaskStore.getState().deleteTask(task.id);
    expect(useTaskStore.getState().tasks.some((t) => t.id === task.id)).toBe(false);

    undo();
    // Undo restores the identical task (id, done state, position), not a copy.
    expect(useTaskStore.getState().tasks[position]).toEqual(stored);
    undo();
    expect(useTaskStore.getState().tasks.filter((t) => t.id === task.id)).toHaveLength(1);
  });

  it('returns a no-op undo when deleting an unknown task', () => {
    const before = useTaskStore.getState().tasks;
    useTaskStore.getState().deleteTask('missing')();
    expect(useTaskStore.getState().tasks).toEqual(before);
  });

  it('bulk-adds AI tasks with provenance', () => {
    const created = useTaskStore
      .getState()
      .addTasks(
        DEMO_EVENT_ID,
        [{ title: 'Order urlis', notes: '', dueDate: '2027-01-10', priority: 'low', category: 'decor' }],
        'ai',
      );
    expect(created[0]?.source).toBe('ai');
  });
});

describe('budget store', () => {
  it('adds, edits and deletes budget items', () => {
    const item = useBudgetStore.getState().addItem(DEMO_EVENT_ID, {
      category: 'decor',
      name: 'Photo booth props',
      estimated: 8000,
      actual: 0,
      paid: false,
      vendorName: '',
    });
    useBudgetStore.getState().updateItem(item.id, { actual: 9500, paid: true });
    expect(useBudgetStore.getState().items.find((i) => i.id === item.id)).toMatchObject({ actual: 9500, paid: true });

    const undo = useBudgetStore.getState().deleteItem(item.id);
    expect(useBudgetStore.getState().items.some((i) => i.id === item.id)).toBe(false);
    undo();
    expect(useBudgetStore.getState().items.find((i) => i.id === item.id)).toMatchObject({ actual: 9500, paid: true });
  });
});

describe('guest store', () => {
  it('adds, edits and deletes guests', () => {
    const guest = useGuestStore.getState().addGuest(DEMO_EVENT_ID, {
      name: 'Nikhil Rao',
      email: 'nikhil@example.com',
      phone: '',
      rsvp: 'pending',
      dietary: 'vegan',
      plusOnes: 1,
      group: 'friends',
    });
    useGuestStore.getState().updateGuest(guest.id, { rsvp: 'attending' });
    expect(useGuestStore.getState().guests.find((g) => g.id === guest.id)?.rsvp).toBe('attending');

    const undo = useGuestStore.getState().deleteGuest(guest.id);
    expect(useGuestStore.getState().guests.some((g) => g.id === guest.id)).toBe(false);
    undo();
    expect(useGuestStore.getState().guests.find((g) => g.id === guest.id)?.rsvp).toBe('attending');
  });

  it('bulk-updates only the selected guests', () => {
    const [first, second, third] = useGuestStore.getState().guests;
    if (!first || !second || !third) throw new Error('Expected seeded guests');
    useGuestStore.getState().updateGuests(new Set([first.id, second.id]), { rsvp: 'declined' });
    const byId = (id: string) => useGuestStore.getState().guests.find((g) => g.id === id);
    expect(byId(first.id)?.rsvp).toBe('declined');
    expect(byId(second.id)?.rsvp).toBe('declined');
    expect(byId(third.id)?.rsvp).toBe(third.rsvp);
  });
});

describe('vendor store', () => {
  it('toggles the shortlist and records quote requests', () => {
    useVendorStore.getState().toggleShortlist('vendor-1');
    expect(useVendorStore.getState().shortlist).toEqual(['vendor-1']);
    useVendorStore.getState().toggleShortlist('vendor-1');
    expect(useVendorStore.getState().shortlist).toEqual([]);

    const request = useVendorStore.getState().submitQuoteRequest({
      vendorId: 'vendor-1',
      eventId: DEMO_EVENT_ID,
      name: 'Ayesha',
      email: 'ayesha@example.com',
      eventDate: '2027-02-13',
      guestCount: 250,
      message: 'Is the 13th available?',
    });
    expect(useVendorStore.getState().quoteRequests).toEqual([request]);
  });
});

describe('event lifecycle', () => {
  it('deleteEventCascade removes the event and all of its data', () => {
    deleteEventCascade(DEMO_EVENT_ID);

    expect(useEventStore.getState().events).toHaveLength(0);
    expect(useEventStore.getState().activeEventId).toBeNull();
    expect(useTaskStore.getState().tasks).toHaveLength(0);
    expect(useBudgetStore.getState().items).toHaveLength(0);
    expect(useGuestStore.getState().guests).toHaveLength(0);
    expect(useAssistantStore.getState().plans).toEqual({});
  });

  it('resetDemoData restores the seeded journey', () => {
    deleteEventCascade(DEMO_EVENT_ID);
    resetDemoData();

    expect(useEventStore.getState().activeEventId).toBe(DEMO_EVENT_ID);
    expect(useTaskStore.getState().tasks.length).toBeGreaterThan(0);
    expect(useAssistantStore.getState().plans[DEMO_EVENT_ID]).toBeDefined();
  });
});

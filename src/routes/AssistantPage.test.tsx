import { screen, waitFor, within } from '@testing-library/react';
import { generateDemoPlan } from '@shared/demo/plan';
import { toEventBrief } from '@/features/assistant/lib/toEventBrief';
import { useAssistantStore } from '@/features/assistant/store/useAssistantStore';
import { useBudgetStore } from '@/features/budget/store/useBudgetStore';
import { resetDemoData } from '@/features/events/lib/eventLifecycle';
import { useEventStore } from '@/features/events/store/useEventStore';
import { useTaskStore } from '@/features/tasks/store/useTaskStore';
import { expectNoA11yViolations } from '@/test/a11y';
import { aiResponse, jsonResponse, mockFetch, requestBody } from '@/test/mockFetch';
import { renderRoute } from '@/test/renderRoute';
import type { CelebrationEvent } from '@/types';

function createBirthday(): CelebrationEvent {
  return useEventStore.getState().createEvent({
    name: 'Kabir turns 30',
    type: 'birthday',
    date: '2030-05-04',
    startTime: '19:00',
    city: 'Bengaluru',
    venue: '',
    guestCount: 40,
    budget: 150_000,
    currency: 'INR',
    style: 'modern',
    requirements: { dietary: ['vegetarian'], accessibility: '', cultural: '', notes: '' },
  });
}

const livePlan = (event: CelebrationEvent, title: string) => {
  const plan = generateDemoPlan(toEventBrief(event));
  return { ...plan, concept: { ...plan.concept, title } };
};

beforeEach(() => {
  resetDemoData();
});

describe('AssistantPage', () => {
  it('generates a plan: loading status, then sectioned results from Gemini', async () => {
    const event = createBirthday();
    mockFetch(aiResponse(livePlan(event, 'Neon Noir Thirtieth')));
    const { user } = renderRoute(`/events/${event.id}/assistant`);

    await user.click(await screen.findByRole('button', { name: /generate plan/i }));

    expect(await screen.findByRole('heading', { level: 2, name: 'Neon Noir Thirtieth' })).toBeInTheDocument();
    expect(screen.getByText('Generated with Gemini')).toBeInTheDocument();
    for (const section of [/décor/i, /menu/i, /activities/i, /day-of schedule/i]) {
      expect(screen.getByRole('region', { name: section })).toBeInTheDocument();
    }
    expect(screen.getByRole('status')).toHaveTextContent('Your plan is ready.');
  });

  it('adds a plan item to the checklist and the budget, with undo', async () => {
    const event = createBirthday();
    mockFetch(aiResponse(livePlan(event, 'Plan')));
    const { user } = renderRoute(`/events/${event.id}/assistant`);
    await user.click(await screen.findByRole('button', { name: /generate plan/i }));

    const decor = await screen.findByRole('region', { name: /décor/i });
    await user.click(within(decor).getAllByRole('button', { name: /to checklist$/i })[0]!);
    expect(await screen.findByText(/to your checklist$/)).toBeInTheDocument();
    const added = useTaskStore.getState().tasks.filter((task) => task.eventId === event.id && task.source === 'ai');
    expect(added).toHaveLength(1);
    expect(added[0]!.dueDate <= event.date).toBe(true);

    await user.click(within(decor).getAllByRole('button', { name: /to budget$/i })[0]!);
    expect(useBudgetStore.getState().items.some((item) => item.eventId === event.id && item.category === 'decor')).toBe(
      true,
    );
  });

  it('refines the plan and keeps the previous version in history', async () => {
    const event = createBirthday();
    const fetchSpy = mockFetch(
      aiResponse(livePlan(event, 'First draft')),
      aiResponse(livePlan(event, 'With a sangeet')),
    );
    const { user } = renderRoute(`/events/${event.id}/assistant`);
    await user.click(await screen.findByRole('button', { name: /generate plan/i }));
    await screen.findByRole('heading', { level: 2, name: 'First draft' });

    await user.click(screen.getByRole('button', { name: 'Add a sangeet night' }));

    expect(await screen.findByRole('heading', { level: 2, name: 'With a sangeet' })).toBeInTheDocument();
    expect(fetchSpy.mock.calls[1]?.[0]).toBe('/api/plan/refine');
    expect(requestBody(fetchSpy, 1)).toMatchObject({ instruction: 'Add a sangeet night' });
    await user.click(screen.getByRole('button', { name: /restore version: original plan/i }));
    expect(await screen.findByRole('heading', { level: 2, name: 'First draft' })).toBeInTheDocument();
  });

  it('shows an error with Retry, then recovers', async () => {
    const event = createBirthday();
    mockFetch(
      jsonResponse({ error: { code: 'RATE_LIMITED', message: 'Too many' } }, 429),
      aiResponse(livePlan(event, 'Second time lucky')),
    );
    const { user } = renderRoute(`/events/${event.id}/assistant`);
    await user.click(await screen.findByRole('button', { name: /generate plan/i }));

    expect(await screen.findByText(/wait a minute and try again/i)).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /try again/i }));
    expect(await screen.findByRole('heading', { level: 2, name: 'Second time lucky' })).toBeInTheDocument();
  });

  it('auto-generates from the dashboard link and labels demo output', async () => {
    const event = createBirthday();
    mockFetch(new TypeError('Failed to fetch'));
    renderRoute(`/events/${event.id}/assistant?generate=1`);

    expect(await screen.findByText('Demo mode')).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: 'Modern Birthday Soirée in Bengaluru' })).toBeInTheDocument();
  });

  it('saves the plan to the event', async () => {
    const event = createBirthday();
    mockFetch(aiResponse(livePlan(event, 'Keeper')));
    const { user } = renderRoute(`/events/${event.id}/assistant`);
    await user.click(await screen.findByRole('button', { name: /generate plan/i }));
    await user.click(await screen.findByRole('button', { name: /save plan/i }));

    expect(await screen.findByText('Saved to event')).toBeInTheDocument();
    await waitFor(() => {
      expect(useAssistantStore.getState().plans[event.id]?.savedAt).not.toBeNull();
    });
  });

  it('has no detectable accessibility violations with a plan shown', async () => {
    const { container } = renderRoute('/events/evt-ayesha-rohan/assistant');
    await screen.findByRole('heading', { level: 2, name: 'Nizami Nights & Jasmine Mornings' });
    await expectNoA11yViolations(container);
  });
});

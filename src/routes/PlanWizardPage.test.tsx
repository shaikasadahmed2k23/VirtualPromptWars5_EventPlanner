import { screen, waitFor } from '@testing-library/react';
import { resetDemoData } from '@/features/events/lib/eventLifecycle';
import { useEventStore } from '@/features/events/store/useEventStore';
import { useTaskStore } from '@/features/tasks/store/useTaskStore';
import { useWizardDraftStore } from '@/features/wizard/store/useWizardDraftStore';
import { STORAGE_KEYS } from '@/lib/constants';
import { expectNoA11yViolations } from '@/test/a11y';
import { renderRoute, type RenderRouteResult } from '@/test/renderRoute';

const FUTURE_DATE = '2030-02-14';

beforeEach(() => {
  resetDemoData();
});

const continueButton = () => screen.getByRole('button', { name: /continue|review/i });

async function completeTypeAndDetails({ user }: RenderRouteResult) {
  await user.click(await screen.findByRole('radio', { name: /wedding/i }));
  await user.click(continueButton());
  await user.type(await screen.findByLabelText(/event name/i), 'Meera & Arjun’s Wedding');
  await user.type(screen.getByLabelText(/^date/i), FUTURE_DATE);
  await user.type(screen.getByLabelText(/city/i), 'Jaipur');
  await user.click(continueButton());
}

describe('PlanWizardPage', () => {
  it('blocks progress and announces errors when a step is invalid', async () => {
    const { user } = renderRoute('/plan/new');
    await user.click(await screen.findByRole('button', { name: /continue/i }));

    expect(await screen.findByRole('alert')).toHaveTextContent('Choose the kind of celebration you are planning');
    expect(screen.getByRole('heading', { name: /what are we celebrating/i })).toBeInTheDocument();
  });

  it('links field errors to their inputs via aria-describedby', async () => {
    const view = renderRoute('/plan/new');
    await view.user.click(await screen.findByRole('radio', { name: /birthday/i }));
    await view.user.click(continueButton());
    const name = await screen.findByLabelText(/event name/i);
    await view.user.click(continueButton());

    await waitFor(() => {
      expect(name).toHaveAttribute('aria-invalid', 'true');
    });
    expect(name).toHaveAccessibleDescription('Give your event a name');
  });

  it('moves focus to each new step heading and keeps answers when going back', async () => {
    const view = renderRoute('/plan/new');
    await completeTypeAndDetails(view);

    const heading = await screen.findByRole('heading', { name: /guests and budget/i });
    await waitFor(() => {
      expect(heading).toHaveFocus();
    });

    await view.user.click(screen.getByRole('button', { name: /back/i }));
    expect(await screen.findByLabelText(/event name/i)).toHaveValue('Meera & Arjun’s Wedding');
    expect(screen.getByLabelText(/city/i)).toHaveValue('Jaipur');
  });

  it('preselects the event type from ?type=', async () => {
    renderRoute('/plan/new?type=community');
    expect(await screen.findByRole('radio', { name: /community event/i })).toBeChecked();
  });

  it('persists the draft to localStorage and restores it after a reload', async () => {
    const view = renderRoute('/plan/new');
    await completeTypeAndDetails(view);
    await view.user.type(await screen.findByLabelText(/expected guests/i), '180');

    expect(window.localStorage.getItem(STORAGE_KEYS.wizardDraft)).toContain('"guestCount":180');
    view.unmount();

    // Simulate a fresh page load: wipe in-memory state (which the store also
    // persists), put the saved snapshot back, then rehydrate from storage.
    const saved = window.localStorage.getItem(STORAGE_KEYS.wizardDraft) ?? '';
    useWizardDraftStore.setState({ draft: {}, stepIndex: 0 });
    window.localStorage.setItem(STORAGE_KEYS.wizardDraft, saved);
    await useWizardDraftStore.persist.rehydrate();

    renderRoute('/plan/new');
    expect(await screen.findByLabelText(/expected guests/i)).toHaveValue(180);
    expect(useWizardDraftStore.getState().draft.name).toBe('Meera & Arjun’s Wedding');
  });

  it('creates the event with a starter plan and opens its dashboard', async () => {
    const view = renderRoute('/plan/new');
    await completeTypeAndDetails(view);
    await view.user.type(await screen.findByLabelText(/expected guests/i), '180');
    await view.user.type(screen.getByLabelText(/total budget/i), '2500000');
    await view.user.click(continueButton());
    await view.user.click(await screen.findByRole('radio', { name: /garden/i }));
    await view.user.click(continueButton());
    await view.user.click(await screen.findByRole('checkbox', { name: /^vegetarian$/i }));
    await view.user.click(continueButton());

    expect(await screen.findByRole('heading', { name: /review your celebration/i })).toBeInTheDocument();
    expect(screen.getByText('180 guests')).toBeInTheDocument();
    await view.user.click(screen.getByRole('button', { name: /create my event/i }));

    expect(await screen.findByRole('heading', { level: 1, name: 'Meera & Arjun’s Wedding' })).toBeInTheDocument();
    expect(await screen.findByText('Meera & Arjun’s Wedding is ready')).toBeInTheDocument();
    const created = useEventStore.getState().events.find((event) => event.name === 'Meera & Arjun’s Wedding');
    expect(view.router.state.location.pathname).toBe(`/events/${created?.id ?? ''}`);
    expect(useTaskStore.getState().tasks.filter((task) => task.eventId === created?.id).length).toBeGreaterThan(5);
    expect(useWizardDraftStore.getState().stepIndex).toBe(0);
  });

  it('has no detectable accessibility violations', async () => {
    const { container } = renderRoute('/plan/new');
    await screen.findByRole('heading', { name: /what are we celebrating/i });
    await expectNoA11yViolations(container);
  });
});

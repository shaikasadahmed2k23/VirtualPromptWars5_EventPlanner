import { screen, within } from '@testing-library/react';
import { generateDemoThemes } from '@shared/demo/themes';
import { toEventBrief } from '@/features/assistant/lib/toEventBrief';
import { resetDemoData } from '@/features/events/store/eventLifecycle';
import { useEventStore } from '@/features/events/store/useEventStore';
import { DEMO_EVENT_ID } from '@/lib/constants';
import { expectNoA11yViolations } from '@/test/a11y';
import { aiResponse, mockFetch } from '@/test/mockFetch';
import { renderRoute } from '@/test/renderRoute';

const demoEvent = () => useEventStore.getState().events.find((event) => event.id === DEMO_EVENT_ID)!;

beforeEach(() => {
  resetDemoData();
  mockFetch(aiResponse(generateDemoThemes(toEventBrief(demoEvent()))));
});

async function renderWithThemes() {
  const view = renderRoute(`/events/${DEMO_EVENT_ID}/themes`);
  await view.user.click(await screen.findByRole('button', { name: /generate themes/i }));
  await screen.findByRole('heading', { level: 2, name: 'Royal Jharokha' });
  return view;
}

describe('ThemesPage', () => {
  it('shows three theme cards with palettes, décor and a gallery', async () => {
    await renderWithThemes();
    expect(screen.getAllByRole('article')).toHaveLength(3);
    const card = screen.getByRole('article', { name: 'Royal Jharokha' });
    expect(within(card).getByRole('heading', { level: 3, name: /décor inspiration/i })).toBeInTheDocument();
    expect(within(card).getByRole('list', { name: 'Royal Jharokha palette' }).children).toHaveLength(5);
    expect(
      within(card)
        .getByRole('list', { name: /inspiration photos/i })
        .querySelectorAll('img'),
    ).toHaveLength(4);
    expect(screen.getByText('Generated with Gemini')).toBeInTheDocument();
  });

  it('copies a hex value and confirms with a toast', async () => {
    const { user } = await renderWithThemes();
    // user-event installs its own clipboard stub during setup, so spy on it afterwards.
    const writeText = vi.spyOn(navigator.clipboard, 'writeText');

    await user.click(screen.getAllByRole('button', { name: /copy palace emerald #1F5C4A/i })[0]!);
    expect(writeText).toHaveBeenCalledWith('#1F5C4A');
    expect(await screen.findByText('Copied #1F5C4A')).toBeInTheDocument();
  });

  it('saves the chosen theme to the event', async () => {
    const { user } = await renderWithThemes();
    const card = screen.getByRole('article', { name: 'Royal Jharokha' });
    await user.click(within(card).getByRole('button', { name: /use this theme/i }));

    expect(demoEvent().theme?.name).toBe('Royal Jharokha');
    expect(within(card).getByText('In use')).toBeInTheDocument();
    expect(screen.getByText(/your current theme/i)).toHaveTextContent('Royal Jharokha');
  });

  it('has no detectable accessibility violations', async () => {
    const { container } = await renderWithThemes();
    await expectNoA11yViolations(container);
  });
});

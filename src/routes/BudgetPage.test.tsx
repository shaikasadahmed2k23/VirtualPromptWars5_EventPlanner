import { fireEvent, screen, waitFor, within } from '@testing-library/react';
import { resetDemoData } from '@/features/events/lib/eventLifecycle';
import { useBudgetStore } from '@/features/budget/store/useBudgetStore';
import { DEMO_EVENT_ID } from '@/lib/constants';
import { expectNoA11yViolations } from '@/test/a11y';
import { renderRoute } from '@/test/renderRoute';

beforeEach(() => {
  resetDemoData();
});

describe('BudgetPage', () => {
  it('updates summary and chart table when an amount changes', async () => {
    const { user } = renderRoute(`/events/${DEMO_EVENT_ID}/budget`);
    expect(await screen.findByRole('heading', { level: 1, name: 'Budget' })).toBeInTheDocument();

    const actual = screen.getByRole('spinbutton', { name: /reception courtyard.*actual amount/i });
    await user.clear(actual);
    await user.type(actual, '500000');
    await user.tab();

    await waitFor(() => {
      expect(useBudgetStore.getState().items.find((item) => item.name.startsWith('Reception courtyard'))?.actual).toBe(
        500000,
      );
    });
    await user.click(screen.getAllByRole('button', { name: /view as table/i })[0]!);
    expect(
      within(screen.getByRole('table', { name: /budget chart data/i })).getByText('₹5,00,000'),
    ).toBeInTheDocument();
  });

  it('adds and deletes a line with an undo toast', async () => {
    const { user } = renderRoute(`/events/${DEMO_EVENT_ID}/budget`);
    await screen.findByRole('heading', { level: 1, name: 'Budget' });

    await user.click(screen.getByRole('button', { name: 'Add expense' }));
    await user.type(screen.getByRole('textbox', { name: 'Name' }), 'Lighting');
    await user.click(within(screen.getByRole('dialog')).getByRole('button', { name: 'Add expense' }));
    expect(useBudgetStore.getState().items.filter((item) => item.name === 'Lighting')).toHaveLength(1);

    await user.click(screen.getByRole('button', { name: /delete lighting/i }));
    await user.click(screen.getByRole('button', { name: 'Delete line' }));
    expect(await screen.findByText('Removed “Lighting”')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Undo' }));
    expect(useBudgetStore.getState().items.filter((item) => item.name === 'Lighting')).toHaveLength(1);
  });

  it('has no detectable accessibility violations', async () => {
    const { container } = renderRoute(`/events/${DEMO_EVENT_ID}/budget`);
    await screen.findByRole('heading', { level: 1, name: 'Budget' });
    await expectNoA11yViolations(container);
  });
});

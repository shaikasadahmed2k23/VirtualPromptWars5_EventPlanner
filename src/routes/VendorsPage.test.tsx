import { screen, waitFor, within } from '@testing-library/react';
import { useBudgetStore } from '@/features/budget/store/useBudgetStore';
import { resetDemoData } from '@/features/events/store/eventLifecycle';
import { useVendorStore } from '@/features/vendors/store/useVendorStore';
import { DEMO_EVENT_ID, PAGE_SIZE } from '@/lib/constants';
import { expectNoA11yViolations } from '@/test/a11y';
import { renderRoute } from '@/test/renderRoute';

beforeEach(() => {
  resetDemoData();
});

async function firstVendorCard() {
  await screen.findByRole('heading', { level: 1, name: 'Vendors' });
  const card = screen.getAllByRole('article')[0];
  if (!card) throw new Error('Expected a vendor card');
  const name = within(card).getByRole('heading', { level: 2 }).textContent ?? '';
  return { card: within(card), name };
}

describe('VendorsPage', () => {
  it('shortlists a vendor and adds it to the current budget with Undo', async () => {
    const { user } = renderRoute('/vendors');
    const { card, name } = await firstVendorCard();

    await user.click(card.getByRole('button', { name: `Add ${name} to shortlist` }));
    expect(useVendorStore.getState().shortlist).toHaveLength(1);
    expect(card.getByRole('button', { name: `Remove ${name} from shortlist` })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('tab', { name: /shortlisted \(1\)/i })).toBeInTheDocument();

    await user.click(card.getByRole('button', { name: 'Add to budget' }));
    const added = () =>
      useBudgetStore.getState().items.filter((item) => item.eventId === DEMO_EVENT_ID && item.vendorName === name);
    expect(added()).toHaveLength(1);
    await user.click(await screen.findByRole('button', { name: 'Undo' }));
    expect(added()).toHaveLength(0);
  });

  it('validates and saves a quote request locally, pre-filled from the event', async () => {
    const { user } = renderRoute('/vendors');
    const { card } = await firstVendorCard();
    await user.click(card.getByRole('button', { name: 'Request quote' }));
    const dialog = within(screen.getByRole('dialog'));

    expect(dialog.getByLabelText(/event date/i)).not.toHaveValue('');
    await user.click(dialog.getByRole('button', { name: 'Save request' }));
    expect(await dialog.findByText('Name is required.')).toBeInTheDocument();
    expect(dialog.getByRole('textbox', { name: 'Your name' })).toHaveAccessibleDescription('Name is required.');

    await user.type(dialog.getByRole('textbox', { name: 'Your name' }), 'Asha');
    await user.type(dialog.getByRole('textbox', { name: 'Email' }), 'asha@example.com');
    await user.type(dialog.getByRole('textbox', { name: 'Message' }), 'Please share a quote');
    await user.click(dialog.getByRole('button', { name: 'Save request' }));
    await waitFor(() => {
      expect(useVendorStore.getState().quoteRequests).toHaveLength(1);
    });
    expect(useVendorStore.getState().quoteRequests[0]).toMatchObject({ eventId: DEMO_EVENT_ID, name: 'Asha' });
  });

  it('paginates the directory and filters by city', async () => {
    const { user } = renderRoute('/vendors');
    await firstVendorCard();
    expect(screen.getAllByRole('article')).toHaveLength(PAGE_SIZE.vendors);
    await user.click(screen.getByRole('button', { name: 'Next page' }));
    expect(screen.getByText(/page 2 of/i)).toBeInTheDocument();

    await user.selectOptions(screen.getByRole('combobox', { name: 'City' }), 'Delhi');
    await waitFor(() => {
      expect(screen.getByRole('status')).not.toHaveTextContent('24 vendors found');
    });
    for (const card of screen.getAllByRole('article')) expect(card).toHaveTextContent('Delhi');
    expect(screen.queryByText(/page 2 of/i)).not.toBeInTheDocument();
  });

  it('clears filters and has no accessibility violations', async () => {
    const { user, container } = renderRoute('/vendors');
    await screen.findByRole('heading', { level: 1, name: 'Vendors' });
    await user.selectOptions(screen.getByRole('combobox', { name: 'City' }), 'Delhi');
    await user.click(await screen.findByRole('button', { name: 'Clear filters' }));
    expect(screen.getByRole('status')).toHaveTextContent('24 vendors found');
    await expectNoA11yViolations(container);
  });
});

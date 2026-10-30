import { fireEvent, screen, waitFor, within } from '@testing-library/react';
import { resetDemoData } from '@/features/events/lib/eventLifecycle';
import { useBudgetStore } from '@/features/budget/store/useBudgetStore';
import { useVendorStore } from '@/features/vendors/store/useVendorStore';
import { DEMO_EVENT_ID } from '@/lib/constants';
import { expectNoA11yViolations } from '@/test/a11y';
import { renderRoute } from '@/test/renderRoute';

beforeEach(() => resetDemoData());

describe('VendorsPage', () => {
  it('shortlists a vendor and adds it to the current budget', async () => {
    const { user } = renderRoute('/vendors');
    await screen.findByRole('heading', { level: 1, name: 'Vendors' });
    const heading = screen.getAllByRole('heading', { level: 2 })[0];
    const card = heading?.closest('[class*="rounded-2xl"]');
    expect(card).not.toBeNull();
    const scoped = within(card as HTMLElement);
    await user.click(scoped.getByRole('button', { name: new RegExp(`add ${heading?.textContent ?? ''} to shortlist`, 'i') }));
    const selectedVendor = useVendorStore.getState().shortlist[0];
    expect(selectedVendor).toBeDefined();
    await user.click(scoped.getByRole('button', { name: 'Add to budget' }));
    await waitFor(() => expect(useBudgetStore.getState().items.some((item) => item.eventId === DEMO_EVENT_ID && item.vendorName === heading?.textContent)).toBe(true));
  });

  it('validates and saves a quote request locally', async () => {
    const { user } = renderRoute('/vendors');
    await screen.findByRole('heading', { level: 1, name: 'Vendors' });
    const heading = screen.getAllByRole('heading', { level: 2 })[0];
    if (!heading) throw new Error('Expected a vendor heading');
    const card = heading.closest('[class*="rounded-2xl"]');
    if (!(card instanceof HTMLElement)) throw new Error('Expected a vendor card');
    await user.click(within(card).getByRole('button', { name: 'Request quote' }));
    const dialog = screen.getByRole('dialog');
    await user.click(within(dialog).getByRole('button', { name: 'Save request' }));
    expect(within(dialog).getByText('Name is required.')).toBeInTheDocument();
    await user.type(within(dialog).getByRole('textbox', { name: 'Your name' }), 'Asha');
    await user.type(within(dialog).getByRole('textbox', { name: 'Email' }), 'asha@example.com');
    const dateInput = dialog.querySelector('input[type="date"]');
    expect(dateInput).not.toBeNull();
    fireEvent.change(dateInput!, { target: { value: '2030-01-01' } });
    await user.type(within(dialog).getByRole('textbox', { name: 'Message' }), 'Please share a quote');
    await user.click(within(dialog).getByRole('button', { name: 'Save request' }));
    await waitFor(() => expect(useVendorStore.getState().quoteRequests).toHaveLength(1));
  });

  it('clears filters and has no accessibility violations', async () => {
    const { user, container } = renderRoute('/vendors');
    await screen.findByRole('heading', { level: 1, name: 'Vendors' });
    await user.selectOptions(screen.getByRole('combobox', { name: 'City' }), 'Delhi');
    await waitFor(() => expect(screen.getByRole('button', { name: 'Clear filters' })).toBeInTheDocument());
    await user.click(screen.getByRole('button', { name: 'Clear filters' }));
    expect(screen.getByRole('status')).toHaveTextContent('24 vendors found');
    await expectNoA11yViolations(container);
  });
});

import { screen } from '@testing-library/react';
import { DEMO_EVENT_ID } from '@/lib/constants';
import { expectNoA11yViolations } from '@/test/a11y';
import { renderRoute } from '@/test/renderRoute';

describe('LandingPage', () => {
  it('leads with the headline and both calls to action', async () => {
    renderRoute('/');
    expect(
      await screen.findByRole('heading', { level: 1, name: 'Your Celebration, Beautifully Planned' }),
    ).toBeInTheDocument();
    expect(screen.getAllByRole('link', { name: /plan my event/i })[0]).toHaveAttribute('href', '/plan/new');
    expect(screen.getByRole('link', { name: /view demo wedding/i })).toHaveAttribute(
      'href',
      `/events/${DEMO_EVENT_ID}`,
    );
  });

  it('opens the wizard with the chosen event type preselected', async () => {
    renderRoute('/');
    const wedding = await screen.findByRole('link', { name: /^wedding/i });
    expect(wedding).toHaveAttribute('href', '/plan/new?type=wedding');
    expect(screen.getByRole('link', { name: /^community event/i })).toHaveAttribute('href', '/plan/new?type=community');
  });

  it('labels the testimonial as a sample', async () => {
    renderRoute('/');
    expect(await screen.findByText(/sample testimonial: illustrative only/i)).toBeInTheDocument();
  });

  it('has no detectable accessibility violations', async () => {
    const { container } = renderRoute('/');
    await screen.findByRole('heading', { level: 1 });
    await expectNoA11yViolations(container);
  });
});

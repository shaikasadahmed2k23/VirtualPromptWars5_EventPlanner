import { axe } from 'vitest-axe';

/**
 * Runs axe-core against `container` and fails with a readable list of rule
 * ids and offending selectors when any violation is found.
 */
export async function expectNoA11yViolations(container: Element): Promise<void> {
  const results = await axe(container, {
    // Colour contrast needs real layout/CSS, which jsdom lacks; it is verified
    // separately by `src/styles/contrast.test.ts`.
    rules: { 'color-contrast': { enabled: false } },
  });
  const summary = results.violations.map(
    (violation) => `${violation.id}: ${violation.nodes.map((node) => node.target.join(' ')).join(', ')}`,
  );
  expect(summary).toEqual([]);
}

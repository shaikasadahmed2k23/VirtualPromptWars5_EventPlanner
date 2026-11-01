# Accessibility

Target: **WCAG 2.2 AA**. Accessibility is part of the definition of done for every page.

## What is built in

- **Structure:** semantic landmarks (`header`, `nav`, `main`, `footer`) and a
  skip link (`src/components/layout/SkipLink.tsx`). One `h1` per page and a
  logical heading order.
- **Focus:** on navigation, focus moves to the new page heading, and in the
  wizard to each new step heading (`useFocusOnMount`). Every interactive
  element shows a visible focus ring. Dialogs (Radix) trap and restore focus.
- **Names and labels:** every form control has a visible `<label>` through the
  `Field` component, or an `aria-label` that starts with the visible text
  (label-in-name). Icon-only buttons name their target, e.g. "Delete Priya" or
  "Add Royal Palace Caterers to shortlist".
- **Errors:** form errors are rendered next to their field, linked with
  `aria-describedby`, flagged with `aria-invalid` and announced (`role="alert"`).
  The wizard blocks progress on an invalid step and says why.
- **Live updates:** AI progress and results are announced through a polite
  `role="status"` region (`AIStatus`). Result counts on filtered lists are live
  too, and every action toast offers Undo.
- **Not colour alone:** priority, due and RSVP badges carry text and icons.
  Charts are labelled images with a "View as table" alternative.
- **Contrast:** palette swatches pick black or white text by measured contrast
  (`src/lib/contrast.ts`). Design tokens are unit-tested against AA
  (`src/styles/contrast.test.ts`).
- **Motion:** `prefers-reduced-motion` disables transitions and animation
  (`src/styles/globals.css`, `MotionConfig`).

## How it is tested

| Check                        | Where                                                                     | What it covers                                                                                                        |
| ---------------------------- | ------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| axe-core on every page       | `src/routes/*.test.tsx` via `expectNoA11yViolations` (`src/test/a11y.ts`) | All axe rules except colour contrast (jsdom has no layout), on the real route tree.                                   |
| Keyboard and focus behaviour | Page tests (`PlanWizardPage.test.tsx`, others)                            | Focus moves to step headings, errors are linked with `aria-describedby`, controls are reachable by role and name.     |
| Contrast of design tokens    | `src/styles/contrast.test.ts`                                             | Text and background token pairs meet AA.                                                                              |
| Real-browser audit           | Manual run in Chrome with axe-core and a scripted Tab walk                | Budget, Tasks, Guests and Vendors: **0 violations, 365 focus stops, every one named with a visible focus indicator.** |
| Small screens                | Manual check at 375 px                                                    | Landing, Wizard, Dashboard and Assistant: no horizontal overflow.                                                     |

Tests query by **role and accessible name** (`getByRole('button', { name: … })`),
so a control that loses its name fails a test.

## Known gaps

- The 375 px overflow check has not yet been repeated on Budget, Tasks, Guests and Vendors.
- Charts are announced as one labelled image each; the per-category figures are
  only reachable through the "View as table" toggle, not by exploring the chart.

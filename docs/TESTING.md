# Testing

**286 tests in 41 files**, run by Vitest in two projects:

- **node:** pure logic, server and repository checks, with no DOM.
- **dom:** page and hook tests in jsdom with Testing Library and axe.

The suite runs with zero warnings on stderr.

```sh
npm test                 # everything
npm run test:coverage    # everything + V8 coverage, fails below the thresholds
npm run test:watch       # watch mode
npx vitest run src/routes/GuestsPage.test.tsx   # one file
```

## Suites

| Area                     | Tests | Files                                        | What they prove                                                                                                                                                                                                   |
| ------------------------ | ----: | -------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Server                   |    34 | `server/*.test.ts`                           | Endpoints and envelope, Zod validation (400), body limit (413), rate limit (429), origin guard (403), CSP and security headers, Gemini retry, timeout and demo fallback, caching, prompt delimiting, SPA serving. |
| Shared                   |    15 | `shared/**/*.test.ts`                        | Demo plan/theme generators honour the brief (vegetarian-only menus, traditions, tiers) and always validate against the shared schemas; the CSP meta and header stay in sync.                                      |
| Feature logic and stores |    80 | `src/features/**/*.test.ts`                  | Budget maths and chart rows, timeline grouping, starter plans, filters and sorting, CSV escaping (formula injection), guest stats, plan → task/budget conversion, store migrations, exact-index undo.             |
| Shared helpers and hooks |    45 | `src/lib/**/*.test.ts`                       | Formatting, dates, collections, storage that never throws, countdown, list filters, pagination, selection, download and clipboard helpers.                                                                        |
| Pages (integration)      |    49 | `src/routes/*.test.tsx`                      | The real route tree in a memory router, driven with `user-event`: wizard, dashboard, assistant, themes, budget, tasks, guests, vendors and settings, with **an axe check on every page**.                         |
| Design tokens            |    45 | `src/styles/contrast.test.ts`                | Every text/background token pair meets WCAG AA contrast.                                                                                                                                                          |
| Seed data and build      |    11 | `src/data/seed/*.test.ts`, `build/*.test.ts` | Seed data is internally consistent; the CSP build plugin injects the policy.                                                                                                                                      |
| Repository hygiene       |     7 | `tests/hygiene.test.ts`                      | No non-data file over 300 lines, no `any`, `@ts-ignore`, `dangerouslySetInnerHTML`, stray `console.` or key-shaped strings.                                                                                       |

## Coverage

V8 coverage over everything that ships (`src/`, `shared/`, `server/`; tests, entry points and type-only files excluded):

| Scope                  | Statements |   Branches |  Functions |
| ---------------------- | ---------: | ---------: | ---------: |
| **Overall**            | **97.85%** | **89.94%** | **93.58%** |
| `src/features/*/lib`   |     99.61% |     92.06% |     96.30% |
| `shared/`              |    100.00% |     95.56% |    100.00% |
| `server/services`      |     99.22% |     90.00% |     93.75% |
| `src/lib`              |     99.15% |     91.67% |    100.00% |
| `src/features/*/store` |    100.00% |     92.00% |    100.00% |

`vite.config.ts` enforces thresholds at these values rounded down. CI runs
`npm run test:coverage`, so any drop fails the build.

## Conventions

- **Query like a user:** `getByRole(…, { name })`, `getByLabelText`. A control
  that loses its accessible name fails a test.
- **Pure logic first:** business rules live in `features/*/lib` and `shared/`
  and are unit-tested in the node project. Page tests cover the wiring, not
  every branch.
- **No network:** the AI endpoints are faked (`src/test/mockFetch.ts`,
  `server/test/helpers.ts`'s scripted model client); Gemini is never called.
- **Isolation:** stores reset to demo data in `beforeEach`; toasts and
  `localStorage` are cleared after each test (`src/test/setup.ts`).
- **Speed:** every lazy route module is transformed once per worker in
  `src/test/setup.ts`, so a first render never races a `findBy` timeout.

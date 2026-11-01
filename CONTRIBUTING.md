# Contributing

## Setup

Node 22 (`.nvmrc`). Then:

```sh
npm install
cp .env.example .env   # optional: add GEMINI_API_KEY; blank runs demo mode
npm run dev            # Vite on :5173, API on :8787 (proxied)
```

## Scripts

| Script                  | What it does                                                 |
| ----------------------- | ------------------------------------------------------------ |
| `npm run dev`           | Vite and the API server with reload                          |
| `npm run build`         | Client bundle (`dist/`) and compiled server (`dist-server/`) |
| `npm start`             | Production server: API and SPA on one port                   |
| `npm test`              | All tests (node and jsdom projects)                          |
| `npm run test:coverage` | Tests with V8 coverage and enforced thresholds               |
| `npm run lint`          | ESLint, zero warnings allowed                                |
| `npm run typecheck`     | `tsc` for the app, tests, tooling and server                 |
| `npm run format`        | Prettier (CI runs `format:check`)                            |

A change is ready when `format:check`, `lint`, `typecheck`, `test` and `build`
all pass. CI runs exactly these, plus a production dependency audit.

## Conventions

- **Layering:** see [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md). Business
  rules go in `features/*/lib` or `shared/` as pure functions with unit tests.
  Components render and dispatch; server routes validate, call a service and
  respond. ESLint enforces the import boundaries.
- **Budgets (ESLint errors):** files ≤ 300 lines, functions ≤ 60, complexity
  ≤ 10, nesting ≤ 3, ≤ 4 parameters (pass an object instead), no nested
  ternaries. Split along real seams, such as a list item, a form section or a
  hook, not to hit a number.
- **Types:** TypeScript strict with `noUncheckedIndexedAccess`; no `any`, no
  `@ts-ignore`, no non-null assertions in production code. Exported functions
  in `lib/`, `hooks/`, `server/` and `shared/` declare their return types.
- **Naming:** `components/ui/` files are kebab-case (shadcn style), components
  are PascalCase, and hooks and other modules are camelCase. Hooks start with `use`.
- **No magic numbers:** name them (`PAGE_SIZE`, `ASPECT`, `HTTP_STATUS`, `LIMITS`).
- **Errors:** catch `unknown`. Then either map to a typed error (`ApiError` on
  the server, `ApiClientError` on the client), log and degrade, or rethrow.
  Never leave a catch empty.
- **Docs:** JSDoc on exports that explains what is not obvious from the name
  and type. Don't restate the name.
- **Accessibility:** every control has a label; query by role and name in
  tests; new pages get an `expectNoA11yViolations` test.
- **Imports:** sorted automatically (`eslint --fix`): packages, `@shared`, `@/`, relative.

## Commits

Imperative subject line under ~72 characters ("Add guest CSV export", not
"Added…"). Then a body that explains **why** and any behaviour change. Keep one
logical change per commit and never force-push `main`.

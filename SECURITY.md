# Security

## Reporting a vulnerability

Please report security issues privately through
[GitHub private vulnerability reporting](https://github.com/shaikasadahmed2k23/VirtualPromptWars5_EventPlanner/security/advisories/new)
rather than a public issue. Include steps to reproduce and the impact. You can
expect an acknowledgement within a few days.

## Threat model

Utsav has no accounts. Planning data stays in the user's own browser
(`localStorage`). The server is a stateless proxy to Google Gemini. What is
worth protecting, and from whom:

| Asset or risk          | Threat                                                   | Controls                                                                                                                                                                                                                        |
| ---------------------- | -------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Gemini API key         | Leaked through the bundle, logs, errors or git           | Read only from server env vars (`server/config.ts`); never prefixed `VITE_`. Never logged; errors are logged by name only. `.env` is git-ignored. A hygiene test fails on key-shaped strings in source.                         |
| API quota and cost     | Scripted abuse, other sites using the API                | Same-origin guard (403), 20 requests/min/IP rate limit (429), 16 KB body cap (413), server and client caches, 20 s upstream deadline.                                                                                           |
| Server availability    | Oversized or malformed input, slow upstream              | Body limit before parsing, strict Zod schemas (unknown fields rejected), length limits on every field (`shared/limits.ts`), abortable upstream calls, demo fallback instead of hanging.                                         |
| Prompt injection       | User text that tries to override the system prompt       | User content wrapped in `<user_data>` / `<user_request>` blocks with `<` and `>` neutralised. The system instruction treats those blocks as data. Output is schema-validated, so injected instructions cannot change its shape. |
| XSS                    | AI or user text rendered as HTML                         | Everything renders as React text; no `dangerouslySetInnerHTML` (enforced by the hygiene test). Strict CSP: `script-src 'self'`, no inline scripts.                                                                              |
| Clickjacking, sniffing | Framing or MIME confusion                                | helmet: `frame-ancestors 'none'` / `X-Frame-Options`, `nosniff`, HSTS, strict referrer policy, COOP; `x-powered-by` disabled.                                                                                                   |
| CSV formula injection  | A guest name such as `=HYPERLINK(...)` executed in Excel | `escapeCsvCell` prefixes cells that start with `=`, `+`, `-` or `@`.                                                                                                                                                            |
| Information disclosure | Stack traces or internals in responses                   | One error shape (`ApiError` → `{ error: { code, message } }`); unknown errors become a generic 500. `/api/health` reports only `status` and `aiMode`.                                                                           |
| Supply chain           | Vulnerable production dependencies                       | CI runs `npm audit --omit=dev --audit-level=high` (informational until the zod 4 migration, see below); the Docker runtime installs production dependencies only.                                                               |

## Known advisories / accepted risk

### zod 3: GHSA-mrhx-c7xc-m3w5 (high)

Zod below 4.6.6 can use excessive memory when validating very large
collections against constrained schemas. There is no patched 3.x release; the
fix is zod 4.

**Why the risk is low here:**

- **Size is capped before Zod runs.** `express.json({ limit: LIMITS.requestBodyBytes })`
  rejects any body over 16 KB with a 413 before validation starts
  (`server/app.ts`, `shared/limits.ts`). An attacker cannot hand Zod an
  oversized collection.
- **Every field is bounded.** The request schemas cap string lengths, numbers
  and array sizes (`shared/limits.ts`, a `.max()` or fixed `.length()` on every array in
  `shared/ai.ts`) and reject unknown keys.
- **Untrusted input is parsed on the server only.** The browser uses Zod on
  its own form input and on responses from this server, not on third-party data.
- **Rate limiting** (20 requests/min/IP) bounds repeated attempts.

**Planned fix:** migrate to zod 4 (with `@hookform/resolvers` and native
JSON-schema output replacing `zod-to-json-schema`), tracked as the next step.
Until then the CI audit step is informational (`continue-on-error: true`). It
still runs on every push and will show any new advisory.

## Out of scope

- Data in `localStorage` is readable by anyone with access to the user's
  browser profile. It is planning data, not credentials, and nothing sensitive
  is sent to the server beyond the event brief needed for a request.
- Denial of service beyond per-IP rate limiting belongs to the hosting layer.

## Verifying the controls

`server/security.test.ts` and `server/api.test.ts` assert the headers, the CSP,
403/413/429/400 responses, the error shape, prompt delimiting and the timeout
fallback. `tests/hygiene.test.ts` scans the source for secrets and unsafe
patterns.

# System Patterns — Mandatory patterns

Type: technical

Patterns that any code in the monorepo must follow. Each one includes its reason, tied to Nexova's reality.

## 1. `tenant_id` on every record, filtered in the data layer

- **Rule:** every client-company entity (tickets, knowledge base cases, vacancies, candidates, CVs) carries a `tenant_id`. Every query to Postgres and to the vector store filters by `tenant_id` in the query itself. A prompt instruction is never relied on to separate clients.
- **Why:** Nexova provides support and selection to several technology, retail and finance companies at once. Mixing their data would break client trust and the GDPR, and a prompt instruction can be bypassed; a query filter cannot.

## 2. Tickets and CVs are untrusted input

- **Rule:** ticket and CV content is passed to the LLM delimited as data, never concatenated as instructions. Model outputs are validated against a schema before acting on them.
- **Why:** any end customer or candidate can write text that tries to manipulate the agent (prompt injection), for example to obtain another client's data or force a high score.

## 3. Low confidence or sensitive case → escalate to a human (Level 2)

- **Rule:** if the knowledge base match does not reach the confidence threshold, or the case is sensitive, the HelpDesk Agent escalates to a human agent with the context already summarised. In matching, incomplete or low-confidence CVs are flagged for manual review.
- **Why:** a wrong Level 1 answer is worse than a slower one (average resolution is already 48 h today); it harms Nexova's client company and the end customer. Escalating by default protects the 24 h SLA without sacrificing quality.

## 4. CV ranking is decision support, never automatic rejection

- **Rule:** the CV–Vacancy Matching Agent ranks and explains; it does not discard candidates. The consultant always makes the final decision and can reorder the ranking.
- **Why:** Nexova operates in the EU, and GDPR Article 22 restricts fully automated decisions with significant effects on people. In addition, keyword-based requirements can carry bias.

## 5. Every human-resolved case goes back into the knowledge base

- **Rule:** when a support agent resolves an escalated ticket, the resolution is added to that client's knowledge base (with its `tenant_id`).
- **Why:** today the knowledge lives in the memory of Roberto Díaz's 30 agents and in a Word document on Drive. Without this loop, the agent stays frozen at day one and never reaches 40 % Level 1 resolution.

## 6. Every agent decision is logged

- **Rule:** every Level 1 answer, escalation, SLA alert, CV score and consultant override is logged with timestamp, `tenant_id`, input, decision, confidence and sources used.
- **Why:** Nexova has no telemetry or centralised logging today. Without logs it is impossible to measure the Level 1 rate, groundedness, top-5 recall or override rate, or to audit a decision for a client or a candidate.

## 7. Centralised API, no premature microservices

- **Rule:** the whole backend lives in a single FastAPI app in `services/`, with one router per domain (support, selection, training…). A worker is only extracted when there is a real need for separate execution.
- **Why:** Nexova's technology team is 6 people and already suffers from a collection of disconnected tools; adding standalone services would repeat the problem.

## 8. Company data defined once in `packages/shared`

- **Rule:** Nexova's common types and data (departments, managers, business lines, company figures) are defined in `packages/shared` (`@repo/shared-types`) and imported from `uis/website` and `uis/backoffice`, never copied.
- **Why:** `CONTEXT.md` already has an inconsistency (two Sales managers); duplicating the data in each app would multiply that kind of error.

## 9. Brand tokens defined once in `packages/shared`

- **Rule:** brand tokens are defined once in `packages/shared` (`packages/shared/styles/tokens.css`) and imported by every UI at the top of its `app/globals.css`; an app only adds its own app-specific variables, and components use `var(--…)`, never raw colour values.
- **Why:** the website and the backoffice share one Nexova identity; copying the palette into each app would let the two drift apart, the same duplication risk as the company data in pattern 8.

## Commit naming

This convention applies to all milestones, not only Milestone 1.

- **Format:** `[M<milestone>-S<NN>][E<n>] <type>(<scope>): <imperative English description>`
- **`M<milestone>-S<NN>`:** milestone number and two-digit step number; always present for milestone work (e.g. `M1-S04`, `M2-S01`).
- **`[E<n>]`:** the evaluation criteria covered by the commit, as defined in `docs/milestone-<n>/evaluation.md`; omit when the step covers none, repeat when it covers several (e.g. `[E5][E6]`).
- **`<type>`:** one of `feat`, `fix`, `docs`, `chore`, `refactor`, `test`.
- **One commit per step**, on the milestone branch.
- **Commits outside a milestone** use only `<type>(<scope>): <description>`.
- **Example:** `[M1-S04][E3] docs(agents): add development rules with explicit scope`.

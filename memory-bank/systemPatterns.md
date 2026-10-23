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

Together, patterns 8 and 9 mean that brand tokens and company data are defined once in `packages/shared` and every UI imports them.

## 10. Design-source workflow for UIs

- **Rule:** every UI is designed in Claude Design, exported as a self-unpacking HTML bundle into `docs/milestone-<n>/design/`, reviewed, and then ported faithfully to Next.js: same layout, copy, tokens, motion and interactions, with the design's inline data replaced by `@repo/shared-types`. Deliberate deviations are listed in the app's README.
- **Why:** the export is the reviewed and approved source of truth; porting it, rather than redesigning in code, keeps the approved result and makes differences visible against reference screenshots.

## 11. Never observe a clipped element

- **Rule:** never observe with `IntersectionObserver` an element that is itself clipped away (e.g. `clip-path: inset(100%)`); observe its parent or wrapper and animate the child.
- **Why:** a fully clipped element never reports as intersecting, so its reveal never fires. This hid the office photos in the original landing page export (fixed in step 10).

## 12. Unit tests with `node:test`

- **Rule:** unit tests use Node's native `node:test` and `node:assert`, run with `node --test` (Node 24 strips TypeScript types), with no test framework dependency. Pure logic lives in `lib/` so it can be tested without a browser.
- **Why:** it keeps the dependency list short (each new dependency needs a justification) and the tests fast.

## 13. Plain-language step reports

- **Rule:** every step report ends with a "Summary in plain words" for the developer: what was done and why, what to check yourself, decisions needed, and what's next, in simple non-technical language.
- **Why:** the developer is learning; a short plain summary makes each step reviewable without reading every diff.

## 14. Learning log per milestone

- **Rule:** every milestone keeps `docs/milestone-<n>/learning-log.md`; each step appends its plain-language section before committing (never rewriting earlier sections), and the chat summary matches the log entry.
- **Why:** the chat disappears; the log keeps what was done, why and what was learned next to the milestone's evidence.

## 15. `security-gate` and `a11y-gate` run before every PR

Both own skills (`.agents/skills/security-gate/`, `.agents/skills/a11y-gate/`) run before every pull request and at the end of every milestone, and both must exit 0 (`AGENTS.md` workflow step 7). Results go to `docs/milestone-<n>/security.md` and `docs/milestone-<n>/accessibility.md`. Findings outside the current step are reported with severity, file, fix and effort, and fixed only after the developer approves them.

**Why:** every page is born secure and accessible (WCAG 2.2 AA) instead of being patched at the end.

## 16. Free tools only

Every tool, service, API, MCP server and library used in this project must be free to use (open source, or a free tier with no payment). If something is usually paid, use a free alternative or a mock and record the decision.

**Why:** academic project with no budget; the same rule is in `.agents/rules/security-and-data.md` (rule 26).

## How the UIs relate

- **Root static site (Milestone 2):** the official public website of the brief (`index.html`, `application.html`, `es/`): the talent pool for candidates, bilingual (English base at the root, Spanish under `es/`), plain HTML + compiled Tailwind CSS + vanilla JavaScript, port 8080.
- **`uis/website` (Milestone 1):** stays as the company-facing landing prototype in Next.js (port 3000); not retired and not touched in Milestone 2.
- **`uis/backoffice`:** internal application (port 3001).
- **One identity:** all three share the brand tokens in `packages/shared/styles/tokens.css` and the same visual identity: green primary pill buttons, coral as a decorative accent only, Instrument Sans.
- **Future contract:** the talent registration field list of the Milestone 2 form (field `id`s and option `value`s, identical in both languages) is the future contract for a backend and a "Candidates" view in the backoffice. Not built in this milestone.

## Commit naming

This convention applies to all milestones, not only Milestone 1.

- **Format:** `[M<milestone>-S<NN>][E<n>] <type>(<scope>): <imperative English description>`
- **`M<milestone>-S<NN>`:** milestone number and two-digit step number; always present for milestone work (e.g. `M1-S04`, `M2-S01`).
- **`[E<n>]`:** the evaluation criteria covered by the commit, as defined in `docs/milestone-<n>/evaluation.md`; omit when the step covers none, repeat when it covers several (e.g. `[E5][E6]`).
- **`<type>`:** one of `feat`, `fix`, `docs`, `chore`, `refactor`, `test`.
- **One commit per step**, on the milestone branch.
- **Commits outside a milestone** use only `<type>(<scope>): <description>`.
- **Example:** `[M1-S04][E3] docs(agents): add development rules with explicit scope`.

## Milestone lifecycle

1. **Start:** `git switch main && git pull`, then create the milestone branch from the up-to-date `main`: the branch name the brief asks for; only if the brief names none, the milestone title from the brief in lowercase with hyphens (M1 was `chore/hito-1-ai-setup`; M2 is `milestone-your-companys-public-website`, from "Milestone — Your Company's Public Website"). Put the milestone briefing in `BRIEFING.md` at the root, unmodified.
2. **Work:** one commit per step on that branch, then a PR to `main`.
3. **Review:** the PR stays open until the teacher has reviewed and validated it. Any fix the teacher requests goes on the same branch as an extra step commit (e.g. `[M2-S12] fix(form): …`), never directly on `main`.
4. **Merge only after validation:** the coding agent never merges a PR. The PR is merged only after the instructor has reviewed and approved it: by the instructor, or by the developer once that approval is recorded in the PR (an approving review or a comment).
5. **Next milestone:** only then does the next milestone start again from step 1.

## Milestone merge

- The last step of every milestone is merging the PR into `main` with "Create a merge commit" (never squash), titled `[M<n>-S<last>][E1]…[E<all>] chore(release): merge Milestone <n> <name> into main (#<PR>)`.
- Its description lists the criteria groups, the evidence path `docs/milestone-<n>/`, and the line "Academic project for 4Geeks Academy: fictional company, no real data."
- M1 was merged with an earlier title format (`[M1] chore: merge …`); history is not rewritten.
- **Why:** a merge commit keeps every step commit visible in `main`, so the evaluation codes in the history stay traceable; the instructor's validation comes before the merge, as the M1 feedback asked.

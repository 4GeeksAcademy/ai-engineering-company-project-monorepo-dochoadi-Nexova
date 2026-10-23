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

## 17. The public site uses compiled Tailwind with brand tokens from `packages/shared`

- **Rule:** the root public site uses compiled Tailwind CSS (`tailwind.css` → `styles.css`) with the brand tokens imported from `packages/shared/styles/tokens.css` and exposed as `brand-*` utilities (`bg-brand-green`, `rounded-brand-card`, `shadow-brand-card`, `ease-brand-out`, `font-brand`). Pages use only Tailwind utility classes: no inline styles, no custom classes, no hex values. Anything else in `tailwind.css` needs a one-line comment saying why utilities cannot do it. It looks like the M1 UIs: cream page, sand bands, paper cards, green headings and dark bands, coral only as a decorative accent (accent text in rust), pill buttons at least 54 px tall, and a 3 px coral focus ring with a 3 px offset (cream or green on dark or coral backgrounds).
- **Why:** it is the same company as `uis/website` and `uis/backoffice`, so the brand values are defined once (patterns 8 and 9). Utility-only styling meets E9 and E11, and the compiled, minified CSS keeps PageSpeed high (E13).

## 18. The static server serves only the `dist/` allowlist

- **Rule:** the site files stay at the repo root, but no server ever serves the root. `pnpm build:site` copies an allowlist into the git-ignored `dist/`, and only `dist/` is served (`npx http-server@14.1.1 dist -p 8080 -a 0.0.0.0 -d false`). A new public file must be added to the allowlist in `scripts/build-site.mjs`.
- **Why:** `http-server --no-dotfiles` still serves dotfiles by direct URL (SEC-1). An allowlist means nothing private (`.git`, `.env`, `.mcp.json`, `docs/`, `memory-bank/`) can ever be reached, even once the Codespaces port is public.

## 19. Landing section order and the Milestone 1 motion

- **Rule (order):** the briefing sections keep their order and exact texts in both languages: header → hero (`#top`) → Services → Why Nexova → Contact → footer. The extra M1 sections sit between them: marquee after the hero, Process (`#process`) after Services, Offices (`#offices`) after Why Nexova. Their texts use briefing facts only (`docs/milestone-2/content-decisions.md`).
- **Rule (motion, S07; replaces the earlier "static hero"):**
  - `motion.js` ports M1's motion (the CV cascade, reveals, count-ups, marquee, office photo reveal, office clocks, header shadow), with the Web Animations API or Tailwind class toggles only, never `style=` or `innerHTML`.
  - **Progressive enhancement:** the HTML already shows every final state; without JavaScript everything is visible (the hero shows a static shortlist). Reveals only hide content below the fold when the script runs.
  - **Reduced motion:** every final state is shown at once (the cascade's placed frame, the final numbers, a still marquee, no reveals).
  - **One pause control** ("Pause animations", `aria-pressed`, remembered) for anything that moves for more than 5 seconds or updates by itself: the cascade, the marquee, the clocks (WCAG 2.2.2). The marquee also pauses on hover and focus.
  - **No dimmed text at rest:** a reveal lasts at most 700 ms and ends at full opacity; no endless pulses; nothing flashes.
  - **Decorative motion is hidden from screen readers:** the cascade field, the stage bars and the marquee are `aria-hidden`, the phase label is not announced, and the figure has a visually hidden description.
  - **Performance:** only `transform`/`opacity` move (plus the one-off photo clip-path reveal and the stacking order); the cascade starts after load; photos lazy-load.
- **Why:** the developer wants the public site to feel like the Milestone 1 landing, while meeting WCAG 2.2 AA, the briefing's order and texts, and performance ≥ 80. These rules keep the "wow" without repeating the M1 accessibility findings A11Y-1, A11Y-2, A11Y-5 and A11Y-6 (dimmed scroll-linked text, endless loops without a pause).

## 20. Talent form field contract: ids, values and grouping

- **Rule:** every field's `id` equals its `name`, in snake_case from the briefing's field name, and is the same on the English and Spanish pages. Option `value`s are identical in both languages; only the visible labels change. No field outside this table (only the 11 `BRIEFING.md` fields).

  | Briefing field | `id` / `name` | Element | Values | Required |
  | --- | --- | --- | --- | --- |
  | Full name | `full_name` | `input type="text"` (`autocomplete="name"`) | — | yes |
  | Email | `email` | `input type="email"` | — | yes |
  | Phone | `phone` | `input type="tel"` (hint with the country-code example) | — | yes |
  | Country of residence | `country_of_residence` | `select` | `spain`, `united_states`, `other` | yes |
  | Years of experience | `years_of_experience` | `input type="number" min="0" max="50" step="1"` | — | yes |
  | Sector of interest | `sector_of_interest` | `select` | `technology`, `retail`, `financial_services`, `consulting`, `other` | yes |
  | English level | `english_level` | `select` | `basic`, `intermediate`, `advanced`, `native` | yes |
  | Availability | `availability` (radio ids `availability_<value>`) | 4 radios | `immediate`, `1_month`, `2_3_months`, `just_exploring` | yes (on each radio) |
  | LinkedIn (profile URL) | `linkedin` | `input type="url"` | — | no |
  | Additional comments | `additional_comments` | `textarea rows="5"`, no `maxlength` (500 checked with a visible counter) | — | no |
  | I accept the data policy | `data_policy` | `input type="checkbox" value="accepted"` | — | yes |

- **Grouping:** five `fieldset`s, each `legend` holding an `h2`: Personal details (full name, email, phone, country) · Professional profile (years, sector, English level, LinkedIn) · Availability (the radio group) · Additional information (comments + counter) · Consent (the checkbox). Each field has `#<id>-hint` where useful, an empty `#<id>-error`, and `aria-describedby` listing them.
- **Why:** one stable contract for `validation.js` (S06), its tests, and a future backend and "Candidates" view in the backoffice; the groups let screen-reader users hear which part of the form they are in.

## 21. Form validation: pure rules, verbatim messages, no data leaves the browser

- **Rule:**
  - `validation.js` keeps pure functions (`validateField`, `validateAll`, `remaining`) and a `MESSAGES` table with every error, success and counter text copied verbatim from `BRIEFING.md` (EN) and `BRIEFING.es.md` (ES); tests parse both briefings and compare them.
  - A thin DOM layer:
    - sets `noValidate` (native validation remains the fallback without JavaScript);
    - validates on blur, then on every change once a field is touched;
    - writes messages only with `textContent`/`createElement` (never `innerHTML`), with an `aria-hidden` icon and a hidden "Error:" prefix;
    - sets `aria-invalid`;
    - on submit, shows a `role="alert"` summary of links and moves focus to it.
  - The submission is simulated: `preventDefault()` always, a disabled "Sending…" button, then the success message, focused. Nothing is sent, stored or logged: no `fetch`, no storage, no `console`.
- **Why:**
  - The rules can be tested in Node without a browser (E21), and the messages can't drift from the briefing (E22).
  - Screen-reader and keyboard users get every error and can reach each field (E18).
  - There is no backend yet, and candidates' personal data must never leave their browser (`security-and-data.md` rules 15 and 18).

## 22. Bilingual public site

- **Rule:**
  - **Structure:** English is the base language at the root, and Spanish lives under `es/` as full pages, not machine-translated.
  - **Same contract in both languages:** form field ids, names and option values are identical; only visible labels change. Briefing copy and every error, success and counter message are taken verbatim from `BRIEFING.md` (EN) and `BRIEFING.es.md` (ES), and tests compare them.
  - **Language markup:** `lang` on each page, `lang="en"` on English words in Spanish text, absolute `hreflang` alternates (`en`, `es`, `x-default` → English), and a language switcher that opens the twin page.
  - **Deliberate differences** from the briefing text are listed in `docs/milestone-2/content-decisions.md` and nowhere else.
- **Why:** Nexova works between Spain and Miami. One contract for both languages keeps validation and a future backend simple, and verbatim messages are what the evaluation checks.

Pattern 15 applies to every pull request of this site: `security-gate` and `a11y-gate` must exit 0 (both now run against the built `dist/` copy).

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
3. **Review:** the PR stays open until the teacher has reviewed and validated it. Any fix the teacher requests goes on the same branch as an extra step commit (e.g. `[M2-S13] fix(form): …`), never directly on `main`.
4. **Merge only after validation:** the coding agent never merges a PR. The PR is merged only after the instructor has reviewed and approved it: by the instructor, or by the developer once that approval is recorded in the PR (an approving review or a comment).
5. **Next milestone:** only then does the next milestone start again from step 1.

## Milestone merge

- The last step of every milestone is merging the PR into `main` with "Create a merge commit" (never squash), titled `[M<n>-S<last>][E1]…[E<all>] chore(release): merge Milestone <n> <name> into main (#<PR>)`.
- Its description lists the criteria groups, the evidence path `docs/milestone-<n>/`, and the line "Academic project for 4Geeks Academy: fictional company, no real data."
- M1 was merged with an earlier title format (`[M1] chore: merge …`); history is not rewritten.
- **Why:** a merge commit keeps every step commit visible in `main`, so the evaluation codes in the history stay traceable; the instructor's validation comes before the merge, as the M1 feedback asked.

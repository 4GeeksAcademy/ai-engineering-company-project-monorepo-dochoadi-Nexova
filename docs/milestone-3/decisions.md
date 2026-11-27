# Milestone 3 — Decisions

How we read the official [briefing](../../BRIEFING.md) where it is ambiguous, plus what the developer decided. The tests of the later steps follow this file. The briefing is never edited.

## Developer decisions (approved)

- **Location:** all Milestone 3 code lives inside root `src/`, exactly as the brief's structure (`src/types/models.ts`, `src/utils/collections.ts`, `search.ts`, `transformations.ts`, `validations.ts`, `src/index.html`), plus `src/data/`, `src/demo.ts` and the tests in `src/tests/`. No code in `packages/` or `shared/`. Outside `src/`, only configuration (root `tsconfig.json`, `package.json` scripts) and documentation.
- **AI use (developer decision, 2026-11-27):** the 4Geeks project page ([`brief.md`](./brief.md)) says "You are encouraged to solve this challenge without AI support or, if needed, with only minimal AI usage", and the briefing says "This is pure programming — no AI, no prompting". The developer has decided that the coding agent writes the code, and that every step's learning log explains in plain words what each new function does ("How it works"). The PR (S11) states this honestly. See M3-47 in the [issues log](./issues-log-m3.md).
- **Test page:** the optional page is included (a later step), served from a `dist` copy on its own port, never from the repo root.
- **Model:** [`model.md`](./model.md) keeps the briefing's 3 entities exactly and adds 6 entities traced to `Company-choice.md`. [`benchmark.md`](./benchmark.md) changes no field and adds one approved extra, the score breakdown.
- **Approval before commit:** every step ends staged with a review patch. Commit and push happen only on the developer's commit prompt. Nothing reaches `main` until the developer asks.
- **End-of-milestone decision review (developer, 2026-11-22):** after the last build and audit steps of Milestone 3, and before its recap and PR, the developer reviews every open question, open issue (M1, M2, M3 logs) and improvement, and decides: do now, plan for a later milestone, accept, or reject. Until then they are recorded, not built, unless a step needs them.

## How the briefing is resolved

### 1. Skills part capped at 40

Base 40 with all required skills, 20 with at least 50 %, 0 otherwise; plus 10 per preferred skill (max 20); then `Math.min(40, …)`. The total score is therefore at most 100.

### 2. Ranges are inclusive

Both bounds count as inside. An expected salary below the vacancy minimum gets 0 salary points (literal reading of the briefing).

### 3. Experience "1–2 years outside"

The distance from the nearest bound is > 0 and ≤ 2.

### 4. Ladders

- English: A1 < A2 < B1 < B2 < C1 < C2 < Native.
- Seniority: Junior < Semi-Senior < Senior < Lead < Executive. "One level above or below" means distance 1.

### 5. Skill matching

Case-insensitive and trimmed. In `findTopSkills`, a skill counts once per candidate, and ties are sorted alphabetically.

### 6. Empty inputs

- Filters and sorts return `[]`.
- Average and fill rate return `0`.
- `topN` ≤ 0 returns `[]`.
- `filterCandidatesBySkills` with an empty required list returns every candidate (a copy).
- `Record<…>` results always contain every key (with `0` or `[]`).

### 7. `isValidEmail`

Exactly one `@`, a non-empty part before it, a `.` after the `@` with characters on both sides, and no spaces.

### 8. Rounding to 2 decimals

`Math.round(value * 100) / 100`.

### 9. Additions beyond the briefing (no briefing field changes)

- `getCandidateScoreBreakdown`: points per part, plus the matched and missing required and preferred skills. `calculateCandidateScore` sums the points. It exists for explainability (`benchmark.md`; `Company-choice.md`: "which requirements each candidate meets or misses").
- `validateSelectionProcess`: score 0–100, `updatedAt` ≥ `createdAt`, ids not empty ("dates are coherent", from the tech lead's email).
- Two recruiting reports built only from existing fields (`benchmark.md`, Part 2):
  - `countProcessesByStage`: the pipeline funnel.
  - `calculateAverageTimeToHire`: average days from `createdAt` to `updatedAt` of "Hired" processes.
- Helpers `compareEnglishLevel` and `seniorityDistance`.
- Extra sample data marked as test data, including a worked case: one vacancy with several candidates, and one candidate in selection processes for two different vacancies (it shows the relationships).

### 10. Assumptions

- All money is in USD per month.
- The score is a ranking aid for consultants, never an automatic rejection (GDPR Art. 22, as `Company-choice.md` says).
- Remote preference is not part of the briefing's score.
- Candidates that fail validation are shown for manual review, never silently scored (demo and test page).
- A score ≥ 90 is highlighted as a "high match" on the test page.

### 10b. Scope

- **In:** the data of both agents in `Company-choice.md`: recruitment from the briefing, support as the extensions in 11b.
- **Out:** the agents themselves, LLM calls, database, API and `ClientRequest`.

### 10c. Tenant isolation in this milestone

Documented exception to the `tenant_id` rule, approved by the developer on 2026-11-22.

- In the extensions, `clientId` is the tenant id (it references `ClientCompany.id`).
- `Candidate`, `Vacancy` and `SelectionProcess` get no tenant field, because the briefing's fields must match exactly. Their tenant, and that of `RankingDecision`, is reached through `ClientVacancy.clientId`.
- `NexovaEmployee` is internal staff and has no tenant.
- In the sample data, the candidate with two vacancies stays inside one client.
- Ticket status, age and KPI functions receive lists already filtered with `filterTicketsByClient` (documented and tested).
- `countProcessesByStage`, `calculateAverageTimeToHire` and `calculateOverrideRate` receive processes or decisions already filtered by the caller to that client's vacancy ids (`ClientVacancy.clientId` → `id` → `vacancyId`). No new function: S06 tests this composition with two clients.
- Sample data is synthetic and in memory. When a database or API arrives, every stored record carries `tenant_id`, as the rule says.

### 11. Numbering and slips in the official briefing

- The briefing says "Milestone 2: Programming Fundamentals" and the brief "Milestone — Building Scripts to Automate Tasks". In this repository it is **Milestone 3**.
- It also says "TrackFlow Tech Team" in the developer's role, a slip from another company's briefing. Read it as Nexova (M3-39).
- `Company-choice.md` calls the scoring specification "Milestone 2" for the same numbering reason. That file is not edited.

### 11b. Company-choice extensions

Approved by the developer after an architecture review.

- **Entities:** the 6 in `model.md`, with their union types. `ClientRequest` is deliberately not included (backlog).
- **Search:** `searchKnowledgeBase` (linear, client filter first).
- **Tickets:** `filterTicketsByClient` (tenant isolation), `filterTicketsByStatus`, `sortTicketsByAge`.
- **SLA:** `getSlaStatus(ticket, now)`, with `SLA_HOURS` = `supportSla.committedHours` (24, imported from `packages/shared/company.ts`, never retyped) and `SLA_AT_RISK_HOURS` = 20.
- **Reports:** `calculateL1ResolutionRate`, `calculateAverageResolutionHours`, `calculateOverrideRate`, `isHighMatch` (score ≥ 90).
- **Validations:** `validateSupportTicket`, `validateClientCompany`.
- Time-based functions receive `now` as a parameter (never `new Date()` inside). Briefing interfaces and the 18 signatures are never renamed or widened.

### 12. Expected values on the briefing sample (the tests use them)

| Check | Expected |
| --- | --- |
| Scores | Carolina Silva 100, María González 82, Juan Pérez 10 |
| Ranking | Carolina, María, Juan |
| Average expected salary | 4500 |
| Status counts | Active 3, all others 0 |
| Binary search on expected salaries [2800, 4200, 6500] | 4200 → index 1; 5000 → -1 |
| Top skills (2 each, alphabetical among ties) | Node.js, PostgreSQL, React, TypeScript |

## Toolchain (recorded in S01, built in S02)

- A root `tsconfig.json` with `erasableSyntaxOnly` and no `rootDir: "src"`.
- Tests are type-checked, with a pinned `@types/node`.
- The root typecheck and tests also cover `src/`, plus a no-`any` check.
- No `"type": "module"` in the root `package.json`.
- Tests run with the quoted glob `"src/tests/**/*.test.ts"`.
- `src/` imports the SLA with a relative `.ts` path (`../../packages/shared/company.ts` from `src/utils/`). The S08 page build must include that file.
- The deterministic score is TypeScript (closes M1-29).

## Not decided yet (found in S01; decide before the step that needs it)

| Question | Needed by |
| --- | --- |
| Score of a vacancy with no required skills (invalid per the briefing, but the scoring function can still receive one) | S05 |
| Order of candidates with equal scores in the ranking. Recommendation (M3-S03, recruitment-practice review): break ties by more required skills matched, then sooner availability, never by salary | S05 |
| Which spelling `findTopSkills` shows when a skill appears with different capital letters. Recommendation (M3-S03): show the most common spelling | S06 |
| Salary below the vacancy minimum: keep 0 points (current reading) or give 10 points plus a 'below range' warning (recruitment-practice recommendation) | S05 |

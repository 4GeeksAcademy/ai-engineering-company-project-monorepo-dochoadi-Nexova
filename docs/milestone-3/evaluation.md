# Milestone 3 — Evaluation "Building Scripts to Automate Tasks"

Evidence matrix for Milestone 3 of the Nexova Solutions monorepo: TypeScript utilities for candidate scoring and vacancy matching, from the official [`BRIEFING.md`](../../BRIEFING.md), plus the extensions from `Company-choice.md`. How the ambiguities are resolved: [decisions](./decisions.md). How each step is re-checked: [verification guide](./verification.md). Results are filled in as each step is done.

## Planned steps

| Step | Criteria |
| --- | --- |
| S01 | Setup: briefing, this matrix, decisions, conventions |
| S02 | E1, E9, E13 · X1–X6 |
| S03 | E4, E5 · X7 |
| S04 | E2, E3 · X8–X10 |
| S05 | E6, E15 (scoring) · X15 |
| S06 | E6, E15 (reports) · X11–X14 |
| S07 | E7, E14 · X16–X17 |
| S08 | The optional test page |
| S09 | E8, E10–E12, E16–E18 and a re-check of all |
| S10 | Devcontainer and documentation |
| S11 | Recap, report and pull request |
| S12 | Merge, only when the developer asks, after the instructor's approval |

## A — What we will evaluate (E1–E18)

Criteria copied verbatim from the brief ([`brief.md`](./brief.md), the 4Geeks project page; its images' text is in sections A, B and E here).

### Technical correctness

| ID | Criterion | Step | Files | How to verify | Result |
| --- | --- | --- | --- | --- | --- |
| E1 | TypeScript interfaces correctly model the entities specified in BRIEFING.md with all their fields and types | S02 | `src/types/models.ts` | Compare each interface and union with the briefing, field by field; typecheck | Met (S02): the 3 interfaces and 6 unions in `src/types/models.ts`; `npx tsc --noEmit` exit 0 and `src/tests/briefingConformance.test.ts` (10 tests) pass |
| E2 | Filtering functions correctly return elements that meet the specified criteria | S04 | `src/utils/collections.ts` | `node --test "src/tests/**/*.test.ts"`: filter cases | Met (S04): the 3 candidate filters and 2 ticket filters in `src/utils/collections.ts`; tests "filterCandidatesBySkills keeps candidates with all the required skills", "… ignores capital letters and spaces", "filterCandidatesBySeniority keeps the exact level only", "filterCandidatesByAvailability matches any of the given statuses"; `pnpm test:domain` exit 0 |
| E3 | Sorting works correctly in ascending and descending order | S04 | `src/utils/collections.ts` | Sort tests in both orders; the input is unchanged | Met (S04): `sortCandidatesBySalary` and `sortCandidatesByExperience`, both orders, on a copy; tests "sortCandidatesBySalary ascending and descending", "sortCandidatesByExperience ascending and descending", "equal values keep their original order …", "no function changes its input …"; `pnpm test:domain` exit 0 |
| E4 | Linear search finds elements in unsorted arrays without errors | S03 | `src/utils/search.ts` | Search tests on unsorted arrays, found and not found | Met (S03): `findCandidateById` and `findCandidateByEmail` in `src/utils/search.ts`; tests "findCandidateById finds a candidate in the unsorted briefing list", "… returns null when the id is not found", "… on an empty list", "findCandidateByEmail ignores capital letters and surrounding spaces"; `pnpm test:domain` exit 0 |
| E5 | Binary search works correctly on sorted arrays and returns the correct index or -1 if not found | S03 | `src/utils/search.ts` | 4200 → 1 and 5000 → -1 on [2800, 4200, 6500] | Met (S03): `binarySearchCandidateBySalary` in `src/utils/search.ts`; on [2800, 4200, 6500]: 2800 → 0, 4200 → 1, 6500 → 2, 5000 → -1 (test "binary search finds every briefing salary at its sorted index" and "… returns -1 for a missing salary"); empty, one element and repeated salaries tested; `pnpm test:domain` exit 0 |
| E6 | Aggregations correctly calculate totals, averages, counts, and extreme values | S05, S06 | `src/utils/transformations.ts` | Expected values of decision 12 | Pending |
| E7 | Validations reject data that does not comply with the business rules in BRIEFING.md | S07 | `src/utils/validations.ts` | One failing test per rule, plus valid data | Pending |
| E8 | There are no TypeScript compilation errors in any file | S09 | `tsconfig.json`, `src/` | `npx tsc --noEmit` exits 0 | Pending |
| E9 | There is a documented command to run TypeScript validation or execution locally (npx tsc --noEmit, npm run typecheck, etc.) | S02 | `README.md`, `package.json`, `tsconfig.json` | Run the documented command | Met (S02): `npx tsc --noEmit` (= `pnpm typecheck:domain`) and `pnpm test:domain`, documented in `README.md` "Current status"; both exit 0 |

### Structure and organization

| ID | Criterion | Step | Files | How to verify | Result |
| --- | --- | --- | --- | --- | --- |
| E10 | Code is organized in separate files by responsibility (types, utils, validations) | S09 | `src/types/`, `src/utils/` | List `src/` and compare with the briefing | Pending |
| E11 | Each function has a single clearly identifiable responsibility | S09 | `src/utils/` | Review each function | Pending |
| E12 | Variable, function, and interface names are descriptive and follow TypeScript conventions | S09 | `src/` | Review the names: camelCase and PascalCase | Pending |

### Context adaptation

| ID | Criterion | Step | Files | How to verify | Result |
| --- | --- | --- | --- | --- | --- |
| E13 | All entity names, fields, and types match exactly those specified in BRIEFING.md | S02 | `src/types/models.ts`, `BRIEFING.md` | Automatic field-by-field comparison with the briefing | Met (S02): `src/tests/briefingConformance.test.ts` parses `BRIEFING.md` and `models.ts` (TypeScript compiler API): same names, field order, types and union values; `pnpm test:domain` exit 0 |
| E14 | Implemented validations correspond to the business rules defined in BRIEFING.md | S07 | `src/utils/validations.ts` | Each briefing rule has a check and a test | Pending |
| E15 | Generated reports respond to the specific needs described in BRIEFING.md | S05, S06 | `src/utils/transformations.ts`, `src/demo.ts` | Ranking and reports on the briefing sample | Pending |

### Code quality

| ID | Criterion | Step | Files | How to verify | Result |
| --- | --- | --- | --- | --- | --- |
| E16 | Functions are pure: they don't depend on external variables or modify global state | S09 | `src/utils/` | No `new Date()` or global state; non-mutation tests | Pending |
| E17 | Edge cases are handled correctly: empty arrays, elements not found, null values | S09 | `src/utils/`, `src/tests/` | Edge-case tests (decision 6) | Pending |
| E18 | Code follows TypeScript best practices: explicit types, appropriate use of const/let, avoids any | S09 | `src/` | The no-`any` check and a review | Pending |

## B — What you need to do (deliverables)

From the brief.

### Backend / Logic

| ID | Criterion | Step | Files | How to verify | Result |
| --- | --- | --- | --- | --- | --- |
| D1 | TypeScript interfaces for all main entities in BRIEFING.md | S02 | `src/types/models.ts` | Compare with the briefing | Met (S02): `Candidate`, `Vacancy`, `SelectionProcess` and their unions in `src/types/models.ts`; `briefingConformance.test.ts` passes |
| D2 | Filtering by one or more criteria | S04 | `src/utils/collections.ts` | Filter tests | Met (S04): filters by one criterion (skills, seniority, availability, client, status) and combined (`filterTicketsByStatus` after `filterTicketsByClient`, test "… one client's open tickets"); `pnpm test:domain` exit 0 |
| D3 | Sorting (ascending, descending, by multiple fields) | S04 | `src/utils/collections.ts` | Sort tests: by salary and by experience, both orders | Met (S04): ascending and descending by salary and by experience, plus `sortCandidatesByFields` (multiple fields; tests "… the second field breaks ties of the first" and "… three levels deep …"); `pnpm test:domain` exit 0 |
| D4 | Linear search in unsorted arrays | S03 | `src/utils/search.ts` | Search tests | Met (S03): linear search by id and email on the unsorted briefing list (`src/tests/search.test.ts`); `pnpm test:domain` exit 0 |
| D5 | Binary search in sorted arrays | S03 | `src/utils/search.ts` | Binary search tests | Met (S03): iterative binary search on a sorted copy (`src/tests/search.test.ts`, 5 binary-search tests); `pnpm test:domain` exit 0 |
| D6 | Aggregation functions (count by category, totals, averages, maximums, minimums) | S05, S06 | `src/utils/transformations.ts` | Report tests | Pending |
| D7 | Business validations per BRIEFING.md before processing | S07 | `src/utils/validations.ts`, `src/demo.ts` | Validation tests; the demo validates before scoring | Pending |
| D8 | Explicit types in parameters and return values | S09 | `src/utils/` | Typecheck and review | Met (S02) for the code so far: `src/utils/levels.ts` declares every parameter and return type, `noAny.test.ts` passes; re-checked for every function in S09 |
| D9 | Single responsibility principle | S09 | `src/utils/` | Review each function | Pending |
| D10 | A clear command to validate or execute the TypeScript code | S02 | `README.md`, `package.json` | Run the documented command | Met (S02): `npx tsc --noEmit` / `pnpm typecheck:domain` and `pnpm test:domain` in `package.json` and `README.md`; both exit 0 |

### Frontend / Testing (optional, included)

| ID | Criterion | Step | Files | How to verify | Result |
| --- | --- | --- | --- | --- | --- |
| T1 | A simple HTML page with Tailwind CSS to test the functions manually | S08 | `src/index.html` | Open the page | Pending |
| T2 | Buttons or controls for the operations (filter, search, sort, reports) | S08 | `src/index.html` | Use each control | Pending |
| T3 | Results displayed clearly | S08 | `src/index.html` | Screenshots and a manual check | Pending |
| T4 | It can be served locally or in Codespaces with a simple command | S08 | `package.json`, `README.md` | Run the documented command; it serves only a `dist` copy | Pending |

### Code quality

| ID | Criterion | Step | Files | How to verify | Result |
| --- | --- | --- | --- | --- | --- |
| Q1 | Descriptive names (camelCase for variables and functions, PascalCase for interfaces) | S09 | `src/` | Review the names | Pending |
| Q2 | Pure functions (only parameters, no global variables modified) | S09 | `src/utils/` | Purity tests and review | Pending |
| Q3 | Comments only for complex logic | S09 | `src/` | Review the comments | Pending |
| Q4 | Empty cases handled (empty arrays, not found, null) | S09 | `src/tests/` | Edge-case tests | Pending |
| Q5 | `const` by default, `let` only when the value changes | S09 | `src/` | Review every `let` | Pending |
| Q6 | Consistent indentation and formatting | S09 | `src/` | Review the diff | Pending |

## C — The briefing's 18 functions (F1–F18)

Signatures copied from `BRIEFING.md`.

| ID | Criterion | Step | Files | How to verify | Result |
| --- | --- | --- | --- | --- | --- |
| F1 | `filterCandidatesBySkills(candidates: Candidate[], requiredSkills: string[]): Candidate[]` | S04 | `src/utils/collections.ts` | Typecheck and the collections tests | Met (S04): signature as in the briefing; `npx tsc --noEmit` exit 0; 4 `filterCandidatesBySkills` tests pass |
| F2 | `filterCandidatesBySeniority(candidates: Candidate[], seniority: SeniorityLevel): Candidate[]` | S04 | `src/utils/collections.ts` | Typecheck and the collections tests | Met (S04): signature as in the briefing; `npx tsc --noEmit` exit 0; `filterCandidatesBySeniority` test passes |
| F3 | `filterCandidatesByAvailability(candidates: Candidate[], availability: AvailabilityStatus[]): Candidate[]` | S04 | `src/utils/collections.ts` | Typecheck and the collections tests | Met (S04): signature as in the briefing; `npx tsc --noEmit` exit 0; `filterCandidatesByAvailability` test passes |
| F4 | `sortCandidatesBySalary(candidates: Candidate[], order: "asc" \| "desc"): Candidate[]` | S04 | `src/utils/collections.ts` | Typecheck and the collections tests | Met (S04): signature as in the briefing; `npx tsc --noEmit` exit 0; salary sort tests pass (both orders, ties, no mutation) |
| F5 | `sortCandidatesByExperience(candidates: Candidate[], order: "asc" \| "desc"): Candidate[]` | S04 | `src/utils/collections.ts` | Typecheck and the collections tests | Met (S04): signature as in the briefing; `npx tsc --noEmit` exit 0; experience sort tests pass (both orders, ties, no mutation) |
| F6 | `findCandidateById(candidates: Candidate[], id: string): Candidate \| null` | S03 | `src/utils/search.ts` | Typecheck and the search tests | Met (S03): signature as in the briefing; `npx tsc --noEmit` exit 0; 3 `findCandidateById` tests pass |
| F7 | `findCandidateByEmail(candidates: Candidate[], email: string): Candidate \| null` | S03 | `src/utils/search.ts` | Typecheck and the search tests | Met (S03): signature as in the briefing; `npx tsc --noEmit` exit 0; 3 `findCandidateByEmail` tests pass |
| F8 | `binarySearchCandidateBySalary(sortedCandidates: Candidate[], targetSalary: number): number` | S03 | `src/utils/search.ts` | Typecheck and the search tests | Met (S03): signature as in the briefing; `npx tsc --noEmit` exit 0; 5 binary-search tests pass |
| F9 | `calculateCandidateScore(candidate: Candidate, vacancy: Vacancy): number` | S05 | `src/utils/transformations.ts` | Typecheck and the scoring tests | Pending |
| F10 | `rankCandidatesForVacancy(candidates: Candidate[], vacancy: Vacancy): Array<{candidate: Candidate, score: number}>` | S05 | `src/utils/transformations.ts` | Typecheck and the scoring tests | Pending |
| F11 | `groupCandidatesBySeniority(candidates: Candidate[]): Record<SeniorityLevel, Candidate[]>` | S05 | `src/utils/transformations.ts` | Typecheck and the scoring tests | Pending |
| F12 | `countCandidatesByStatus(candidates: Candidate[]): Record<CandidateStatus, number>` | S06 | `src/utils/transformations.ts` | Typecheck and the reports tests | Pending |
| F13 | `calculateAverageSalary(candidates: Candidate[]): number` | S06 | `src/utils/transformations.ts` | Typecheck and the reports tests | Pending |
| F14 | `findTopSkills(candidates: Candidate[], topN: number): Array<{skill: string, count: number}>` | S06 | `src/utils/transformations.ts` | Typecheck and the reports tests | Pending |
| F15 | `calculateVacancyFillRate(processes: SelectionProcess[]): number` | S06 | `src/utils/transformations.ts` | Typecheck and the reports tests | Pending |
| F16 | `validateCandidate(candidate: Candidate): { valid: boolean, errors: string[] }` | S07 | `src/utils/validations.ts` | Typecheck and the validations tests | Pending |
| F17 | `validateVacancy(vacancy: Vacancy): { valid: boolean, errors: string[] }` | S07 | `src/utils/validations.ts` | Typecheck and the validations tests | Pending |
| F18 | `isValidEmail(email: string): boolean` | S07 | `src/utils/validations.ts` | Typecheck and the validations tests | Pending |

## D — The briefing's acceptance criteria (B1–B8)

Copied verbatim from `BRIEFING.md`.

| ID | Criterion | Step | Files | How to verify | Result |
| --- | --- | --- | --- | --- | --- |
| B1 | **Type Safety:** All interfaces defined correctly with appropriate types | S02 | `src/types/models.ts` | Typecheck | Pending |
| B2 | **Function Correctness:** Each function produces the expected output for the given inputs | S03–S07 | `src/utils/` | All tests | Pending |
| B3 | **Edge Case Handling:** Functions handle empty arrays, null values, and invalid data gracefully | S09 | `src/tests/` | Edge-case tests | Pending |
| B4 | **Validation Logic:** Business rules are enforced accurately | S07 | `src/utils/validations.ts` | Validation tests | Pending |
| B5 | **Code Organization:** Functions are in the correct files according to responsibility | S09 | `src/` | Compare with the briefing | Pending |
| B6 | **Naming Conventions:** Variables, functions, and types follow TypeScript conventions | S09 | `src/` | Review the names | Pending |
| B7 | **No Mutations:** Sorting and filtering functions don't modify the original arrays | S04, S09 | `src/utils/collections.ts` | Non-mutation tests | Pending |
| B8 | **Pure Functions:** Functions only work with parameters, no global variables | S09 | `src/utils/` | Purity tests and review | Pending |

## E2 — Company-choice extensions (X1–X17)

Fields as in [`model.md`](./model.md). Not part of the briefing.

| ID | Criterion | Step | Files | How to verify | Result |
| --- | --- | --- | --- | --- | --- |
| X1 | `ClientCompany`: `id: string`, `name: string`, `taxId: string`, `contactEmail: string`, `office: NexovaOffice`, `services: NexovaService[]` | S02 | `src/types/models.ts` | Compare with `model.md`; typecheck | Met (S02): in `src/types/models.ts` with the `model.md` fields; `npx tsc --noEmit` exit 0; used by `src/data/sampleData.ts` (`sampleData.test.ts` passes) |
| X2 | `ClientVacancy` (extends `Vacancy`): `clientId: string`, `consultantId: string` | S02 | `src/types/models.ts` | Compare with `model.md`; typecheck | Met (S02): in `src/types/models.ts` with the `model.md` fields; `npx tsc --noEmit` exit 0; used by `src/data/sampleData.ts` (`sampleData.test.ts` passes) |
| X3 | `NexovaEmployee`: `id: string`, `fullName: string`, `email: string`, `role: EmployeeRole`, `office: NexovaOffice` | S02 | `src/types/models.ts` | Compare with `model.md`; typecheck | Met (S02): in `src/types/models.ts` with the `model.md` fields; `npx tsc --noEmit` exit 0; used by `src/data/sampleData.ts` (`sampleData.test.ts` passes) |
| X4 | `RankingDecision`: `id: string`, `vacancyId: string`, `candidateId: string`, `consultantId: string`, `suggestedRank: number`, `finalRank: number`, `decision: RankingDecisionType`, `reason: string`, `decidedAt: Date` | S02 | `src/types/models.ts` | Compare with `model.md`; typecheck | Met (S02): in `src/types/models.ts` with the `model.md` fields; `npx tsc --noEmit` exit 0; used by `src/data/sampleData.ts` (`sampleData.test.ts` passes) |
| X5 | `SupportTicket`: `id: string`, `clientId: string`, `channel: TicketChannel`, `query: string`, `status: TicketStatus`, `level: SupportLevel`, `assignedAgentId: string \| null`, `escalationSummary: string`, `createdAt: Date`, `resolvedAt: Date \| null` | S02 | `src/types/models.ts` | Compare with `model.md`; typecheck | Met (S02): in `src/types/models.ts` with the `model.md` fields; `npx tsc --noEmit` exit 0; used by `src/data/sampleData.ts` (`sampleData.test.ts` passes) |
| X6 | `KnowledgeBaseArticle`: `id: string`, `clientId: string`, `title: string`, `problem: string`, `solution: string`, `keywords: string[]`, `sourceTicketId: string \| null`, `createdAt: Date` | S02 | `src/types/models.ts` | Compare with `model.md`; typecheck | Met (S02): in `src/types/models.ts` with the `model.md` fields; `npx tsc --noEmit` exit 0; used by `src/data/sampleData.ts` (`sampleData.test.ts` passes) |
| X7 | `searchKnowledgeBase`: linear, client filter first | S03 | `src/utils/search.ts` | Two-client search test | Met (S03): `searchKnowledgeBase` in `src/utils/search.ts` filters by `clientId` first; test "searchKnowledgeBase returns only the requested client's articles" (same article in CL-001 and CL-002); `pnpm test:domain` exit 0 |
| X8 | `filterTicketsByClient`: tenant isolation | S04 | `src/utils/collections.ts` | Two-client test | Met (S04): `filterTicketsByClient`; test "filterTicketsByClient never returns another client's ticket" (both clients and an unknown one); `pnpm test:domain` exit 0 |
| X9 | `filterTicketsByStatus`: by ticket status | S04 | `src/utils/collections.ts` | Filter tests | Met (S04): `filterTicketsByStatus`; test "filterTicketsByStatus with one and with two statuses"; `pnpm test:domain` exit 0 |
| X10 | `sortTicketsByAge`: by age, on a copy | S04 | `src/utils/collections.ts` | Sort and non-mutation tests | Met (S04): `sortTicketsByAge` on a copy, `"asc"` = oldest first; tests "sortTicketsByAge: oldest first and newest first" and "no function changes its input …"; `pnpm test:domain` exit 0 |
| X11 | `getSlaStatus`: receives `now`; 24 h, at risk from 20 h | S06 | `src/utils/transformations.ts` | Boundary tests | Pending |
| X12 | `calculateL1ResolutionRate`: target ≥ 40 % | S06 | `src/utils/transformations.ts` | Report tests on one client | Pending |
| X13 | `calculateAverageResolutionHours`: target < 24 h | S06 | `src/utils/transformations.ts` | Report tests on one client | Pending |
| X14 | `calculateOverrideRate`: consultant overrides | S06 | `src/utils/transformations.ts` | Two-client composition test (decision 10c) | Pending |
| X15 | `isHighMatch`: score ≥ 90 | S05 | `src/utils/transformations.ts` | Tests at 89 and 90 | Pending |
| X16 | `validateSupportTicket`: the rules in `model.md` | S07 | `src/utils/validations.ts` | One test per rule | Pending |
| X17 | `validateClientCompany`: the rules in `model.md` | S07 | `src/utils/validations.ts` | One test per rule | Pending |

## E — How to submit (H1–H6)

| ID | Criterion | Step | Files | How to verify | Result |
| --- | --- | --- | --- | --- | --- |
| H1 | All changes in the `feature/domain-models` branch | S01–S11 | Git history | `git branch --show-current`; `git log origin/main..HEAD` | Pending |
| H2 | Commits with descriptive messages | S01–S11 | Git history | Read `git log origin/main..HEAD` | Pending |
| H3 | Branch pushed to the remote | S01–S11 | GitHub | `git status --short --branch` shows no "ahead" | Pending |
| H4 | A Pull Request from the branch to main | S11 | GitHub | `gh pr view` | Pending |
| H5 | The PR description includes what functionalities were implemented, what challenges were encountered and how they were solved, and screenshots of the test interface (optional) | S11 | GitHub | Read the PR description | Pending |
| H6 | The PR link submitted on the 4Geeks platform | S11 | 4Geeks platform | The developer confirms it | Pending |

## F — Project standards

| ID | Criterion | Step | Files | How to verify | Result |
| --- | --- | --- | --- | --- | --- |
| P1 | `security-gate` passes | S09, S11 | `docs/milestone-3/security.md` | `bash .agents/skills/security-gate/check.sh 3` exits 0 | Pending |
| P2 | `a11y-gate` passes on the test page | S09, S11 | `docs/milestone-3/accessibility.md` | `bash .agents/skills/a11y-gate/check.sh 3` exits 0, with the page covered | Pending |
| P3 | Memory bank updated in every step | S01–S11 | `memory-bank/` | `bash .agents/skills/update-memory-bank/check.sh` exits 0 in each step | Pending |
| P4 | Milestone recap and report (S11) | S11 | `docs/milestone-3/recap.md`, `docs/milestone-3/report.md` | `bash .agents/skills/milestone-recap/check.sh 3` exits 0 | Pending |
| P5 | Every step's learning log explains each new function in plain words ("How it works") | S01–S11 | `docs/milestone-3/learning-log.md` | Read each "How it works" part | Pending |

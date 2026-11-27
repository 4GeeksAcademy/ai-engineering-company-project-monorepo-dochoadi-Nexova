# Improvement backlog

- **Purpose:** the single place for every idea to improve the project, at every level, until the last milestone.
- **Fed by:** every step of every milestone, with the source of the idea. Nothing in it is built until the developer chooses.
- **In the final milestone:** each open item is compared (options A / B), decided and applied. Status is `Open`, `Planned (M<n>)`, `Done (commit)` or `Rejected (reason)`.
- **Errors and open findings are not here:** they live in the issues logs of [Milestone 1](./milestone-1/issues-log-m1.md), [Milestone 2](./milestone-2/issues-log-m2.md) and [Milestone 3](./milestone-3/issues-log-m3.md).

## Backend

| ID | Improvement | Why it matters | Options to compare (A / B) | Effort (S/M/L) | Impact (Low/Med/High) | Source (milestone, step, file) | Status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| BE-01 | Receive talent-form submissions in a backend, validating every field again | Today the submission is simulated and no candidate reaches Nexova | A: a `selection` router in the FastAPI app / B: an n8n workflow into a store | L | High | M2, S11, `docs/milestone-2/report.md` (simulated submission) | Open |

## Frontend

| ID | Improvement | Why it matters | Options to compare (A / B) | Effort (S/M/L) | Impact (Low/Med/High) | Source (milestone, step, file) | Status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| FE-01 | A "Candidates" view in the backoffice that uses the domain functions | Consultants will use the logic through a UI "we'll build later" | A: import the domain code as a package / B: call it through the API | M | High | M2, S05, `memory-bank/systemPatterns.md` pattern 20; M3 `BRIEFING.md` | Open |
| FE-02 | Decide the future of the two public landings | The Milestone 1 Next.js landing and the Milestone 2 static site present the same company twice | A: keep the prototype / B: retire it or serve one site | M | Med | M2, S01, `memory-bank/activeContext.md` (root location) | Open |

## Visual design

| ID | Improvement | Why it matters | Options to compare (A / B) | Effort (S/M/L) | Impact (Low/Med/High) | Source (milestone, step, file) | Status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| VIS-01 | Decide whether to bring back "Human & AI" and the role ticker | They were not ported because their claims are not in the briefing | A: leave them out / B: rewrite them with confirmed facts | S | Low | M2, `docs/milestone-2/content-decisions.md` | Open |

## Motion and animation

| ID | Improvement | Why it matters | Options to compare (A / B) | Effort (S/M/L) | Impact (Low/Med/High) | Source (milestone, step, file) | Status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| MOT-01 | One source for the motion logic | `motion.js` is a port of the website's motion, so the two can drift | A: keep the port / B: a shared framework-free module | M | Low | M2, S07, `memory-bank/techContext.md` (`motion.js`) | Open |
| MOT-02 | A motion budget checked before the final audit | About 600 animations created at once were caught only by Lighthouse | A: a long-task check in a test / B: Lighthouse in every step that changes motion | S | Med | M2, S11, `docs/milestone-2/recap.md` (what I would do differently) | Open |

## Code quality

| ID | Improvement | Why it matters | Options to compare (A / B) | Effort (S/M/L) | Impact (Low/Med/High) | Source (milestone, step, file) | Status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| CODE-01 | Move the domain utilities into a `packages/` library | A UI or service will need to import them | A: keep them in `src/` / B: a workspace package | M | Med | M3, S01, `.agents/rules/monorepo-structure.md` | Open |

## HTML

| ID | Improvement | Why it matters | Options to compare (A / B) | Effort (S/M/L) | Impact (Low/Med/High) | Source (milestone, step, file) | Status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| HTML-01 | Confirm the "Latin American market" wording with the briefing's author | The site deliberately says "Spanish and US markets", unlike the briefing | A: keep the documented difference / B: use the confirmed wording in both languages | S | Low | M2, `docs/milestone-2/content-decisions.md` | Open |

## TypeScript

| ID | Improvement | Why it matters | Options to compare (A / B) | Effort (S/M/L) | Impact (Low/Med/High) | Source (milestone, step, file) | Status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| TS-01 | Typecheck the tests of the shared package and apply the same strict options everywhere | The Milestone 3 tests will be type-checked; older shared tests are excluded | A: only the M3 code / B: every package | S | Med | M1, S08, `memory-bank/techContext.md` (tests); M3, S01, `docs/milestone-3/decisions.md` | Open |
| TS-02 | Import shared data by package name instead of a relative path | The relative `.ts` path breaks if the domain code moves | A: keep the relative path / B: a root workspace dependency on `@repo/shared-types` | S | Low | M3, S01, `docs/milestone-3/issues-log-m3.md` (M3-35) | Open |
| TS-03 | Lint the domain code in `src/` | `pnpm lint` only runs the apps' ESLint; `src/` is checked by `tsc` and the no-any test, not by a linter (unused variables, `let` vs `const`) | A: ESLint with `typescript-eslint` at the root (new dependency) / B: keep `tsc` strict options plus review in S09 | S | Med | M3, S02, root `package.json` (`lint` = `pnpm -r`) | Open |
| TS-04 | Sort names with a fixed locale | `localeCompare` without a locale uses the machine's default, so a name sort could differ between computers | A: `localeCompare(b, "es")` / B: one shared `Intl.Collator("es")` | S | Low | M3-S04, `src/utils/collections.ts` (`sortCandidatesByFields`) | Open |

## CSS and Tailwind

| ID | Improvement | Why it matters | Options to compare (A / B) | Effort (S/M/L) | Impact (Low/Med/High) | Source (milestone, step, file) | Status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| CSS-01 | Guarantee that the committed `styles.css` matches its source | It is generated, and committing it relies on remembering to build first | A: a check that rebuilds and compares / B: stop committing the generated file | S | Med | M2, S03, root `README.md` (Rebuild the CSS) | Open |

## Security

| ID | Improvement | Why it matters | Options to compare (A / B) | Effort (S/M/L) | Impact (Low/Med/High) | Source (milestone, step, file) | Status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| SECU-01 | Protect `main` on GitHub | Today only the written rules stop a direct push or an early merge | A: require a pull request / B: also require a review and checks | S | High | M3, S00, kickoff report (developer backlog) | Open |
| SECU-02 | Review the audit exceptions at every milestone end | An exception can outlive its advisory, as SEC-2 shows | A: a manual review in the decision review / B: a check for withdrawn or fixed advisories | S | Med | M3, S00d, `docs/milestone-3/learning-log.md` | Open |
| SECU-03 | Report moderate advisories in the security gate | The gate passed while 7 moderate advisories stopped the build | A: list them as a warning / B: fail unless accepted | S | Med | M3, S00d, `docs/milestone-3/learning-log.md` | Open |

## Accessibility

| ID | Improvement | Why it matters | Options to compare (A / B) | Effort (S/M/L) | Impact (Low/Med/High) | Source (milestone, step, file) | Status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| ACC-01 | A manual screen-reader pass (NVDA or VoiceOver) | The gate does not automate it, and the project recommends it before a PR | A: once per milestone with a UI / B: only before a real launch | M | Med | M2, S02, `docs/milestone-2/accessibility.md` | Open |

## Performance

| ID | Improvement | Why it matters | Options to compare (A / B) | Effort (S/M/L) | Impact (Low/Med/High) | Source (milestone, step, file) | Status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| PERF-01 | Reduce `motion.js` below its 15 KB target | It is about 16 KB unminified, above the target | A: minify in the build / B: remove or split effects | S | Low | M2, S07, `memory-bank/techContext.md` (`motion.js`) | Open |

## SEO

| ID | Improvement | Why it matters | Options to compare (A / B) | Effort (S/M/L) | Impact (Low/Med/High) | Source (milestone, step, file) | Status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| SEO-01 | Reach Lighthouse SEO 100 | The strict CSP blocks the `robots.txt` fetch, so SEO stays at 92 | A: keep `connect-src 'none'` / B: allow `connect-src 'self'` | S | Low | M2, S09, `docs/milestone-2/performance.md` | Open |
| SEO-02 | Measure with PageSpeed on an indexable host | Codespaces adds `noindex` and shows PageSpeed a warning page | A: keep local Lighthouse / B: measure on a real host | S | Med | M2, S09, `docs/milestone-2/performance.md` | Open |

## Data and domain model

| ID | Improvement | Why it matters | Options to compare (A / B) | Effort (S/M/L) | Impact (Low/Med/High) | Source (milestone, step, file) | Status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| DATA-01 | Stage history, also used for offer acceptance and stage-to-stage ratios | One `stage` and two dates cannot show time per stage or conversion | A: a separate stage-history list / B: an event log for every change | M | High | M3, S00, `docs/milestone-3/benchmark.md` Part 1 and Part 2 | Open |
| DATA-02 | A `rejectionReason` | Reports cannot say why candidates drop out | A: a fixed list of reasons / B: free text plus a category | S | Med | M3, S00, `docs/milestone-3/benchmark.md` Part 1 | Open |
| DATA-03 | One process per candidate and vacancy | Duplicate processes would distort the funnel and fill rate | A: a validation over the list / B: a database unique constraint | S | Med | M3, S00, `docs/milestone-3/benchmark.md` Part 1 | Open |
| DATA-04 | An `employmentType` on vacancies | Most real postings state it | A: an extension field / B: wait for a briefing that asks for it | S | Low | M3, S00, `docs/milestone-3/benchmark.md` Part 1 | Open |
| DATA-05 | Salary currency and period | Valencia roles are paid in EUR, often quoted gross annual | A: USD monthly, as the briefing / B: currency + period, e.g. EUR gross annual | M | Med | M3, S00, `docs/milestone-3/benchmark.md` Part 1 and Part 2 | Open |
| DATA-06 | Skill synonyms | Exact matching misses JS and JavaScript | A: a synonym list / B: embeddings in the matching agent | M | High | M3, S00, `docs/milestone-3/benchmark.md` Part 1 | Open |
| DATA-07 | A location and remote factor | A remote-only candidate can rank first for an on-site vacancy | A: a filter before scoring / B: a weighted factor | S | Med | M3, S00, `docs/milestone-3/benchmark.md` Part 1 | Open |
| DATA-08 | Map the Milestone 2 form values to `Candidate`, English levels to CEFR included | The form uses Basic–Native and other availability and location values | A: a documented mapping function / B: change the form to the model's values | M | High | M3, S00, `docs/milestone-3/benchmark.md` Part 1; M3, S01, `docs/milestone-3/issues-log-m3.md` (M3-23) | Open |
| DATA-09 | A `ClientRequest` entity (the Sales request, with a contact), with the vacancy linked to it | It records who asked for the vacancy and when | A: keep `ClientVacancy.clientId` only / B: add the request entity + link | M | Med | M3, S00, `docs/milestone-3/benchmark.md` Part 2 | Open |
| DATA-10 | `positionsToFill` on a vacancy | One vacancy can have several seats, which changes the fill rate | A: one vacancy per seat / B: a number on an extension | S | Med | M3, S00, `docs/milestone-3/benchmark.md` Part 2 | Open |
| DATA-11 | A contact type requiring "email or phone, at least one" | A client contact may have only one of the two | A: keep `contactEmail` / B: a contact type with that rule | S | Low | M3, S00, `docs/milestone-3/benchmark.md` Part 2 | Open |
| DATA-12 | A simpler application status | Clients may need fewer states than consultants | A: the briefing's 7 stages / B: underReview, finalist, hired, rejected | S | Low | M3, S00, `docs/milestone-3/benchmark.md` Part 2 | Open |
| DATA-13 | GDPR fields per candidate | Real data needs lawful basis and consent with date and scope, data source, privacy-notice version, retention and review dates, and explicit consent for speculative submissions | A: fields on an extension / B: a separate consent record | M | High | M3, S00, `docs/milestone-3/benchmark.md` Part 2 | Open |
| DATA-14 | Source of candidate (job board, referral, direct…) | Needed for the "source of hire" report | A: on the candidate / B: on each process | S | Med | M3, S00, `docs/milestone-3/benchmark.md` Part 2 | Open |
| DATA-15 | A placement record with fee terms | It links a hire to what Nexova invoices | A: a Placement entity / B: keep it in the CRM | M | Med | M3, S00, `docs/milestone-3/benchmark.md` Part 2 | Open |
| DATA-16 | Education and certifications (HR Open Standards / JDX) | Common vacancy requirements, not modelled | A: simple lists of text / B: structured standard fields | M | Low | M3, S00, `docs/milestone-3/benchmark.md` Part 2 | Open |
| DATA-17 | CV confidence and manual-review fields | Low-confidence CVs must be flagged, never silently scored | A: fields on an extension / B: a parsing-result record | S | High | M3, S01, `docs/milestone-3/issues-log-m3.md` (M3-22) | Open |
| DATA-18 | A sensitive-case flag on tickets | Sensitive cases must escalate to Level 2 | A: a boolean / B: a category with its reason | S | High | M3, S01, `docs/milestone-3/issues-log-m3.md` (M3-22) | Open |
| DATA-19 | A decision log for every agent decision | Pattern 6 requires input, decision, confidence and sources | A: one log entity for both agents / B: telemetry events | M | High | M3, S01, `docs/milestone-3/issues-log-m3.md` (M3-22) | Open |
| DATA-20 | Duplicate-candidate detection (same email or phone) | The same person can enter the talent pool twice and be scored twice | A: a check on create, using `findCandidateByEmail` / B: a periodic report of duplicates for the consultant | S | Med | M3-S03, recruitment-practice review | Open |
| DATA-21 | Profile freshness: when the candidate last confirmed availability and salary | Old availability or salary data gives misleading scores | A: a `lastConfirmedAt` date on a client-side extension / B: a reminder flow when the date is old | S | Med | M3-S03, recruitment-practice review | Open |
| DATA-22 | An override-reason category on `RankingDecision` | Free-text reasons cannot be counted, so the score weights cannot be calibrated from them | A: a fixed union of reasons plus free text / B: free text, classified later | S | High | M3-S03, recruitment-practice review | Open |
| DATA-23 | Fairness rule: the score never uses name, phone, email or location | Those fields can carry bias (GDPR Art. 22, `Company-choice.md` risks) | A: a test that changes those fields and expects the same score / B: a written rule reviewed in S09 | S | High | M3-S03, recruitment-practice review | Open |
| DATA-24 | Warning flags on the score breakdown: missing must-have skills, preferred points capped, remote mismatch, not available or already hired, experience outside the range, salary outside the range | The consultant sees why a score is low, and what the number does not show | A: flags on `ScoreBreakdown` / B: a separate `getScoreWarnings` function | M | High | M3-S03, recruitment-practice review | Planned (M3-S05) |

## Testing

| ID | Improvement | Why it matters | Options to compare (A / B) | Effort (S/M/L) | Impact (Low/Med/High) | Source (milestone, step, file) | Status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| TEST-01 | Test the briefing's layout requirements | A redesign dropped the 2-column layout until the final audit | A: a Playwright assertion / B: a checklist after each redesign | S | Med | M2, S11, `docs/milestone-2/recap.md` (what I would do differently) | Open |
| TEST-02 | Keep the "deliberate mistake" checks as a script | S02 proved the conformance and no-any tests can fail by editing `models.ts` by hand; nothing repeats that proof later | A: a small script that breaks a copy and expects failures / B: keep it as a manual step in `verification.md` | S | Low | M3, S02, `docs/milestone-3/verification.md` (Result) | Open |
| TEST-03 | Guard against an endless loop in binary search | A deliberate `high = mid` mistake made the test run hang until it was killed, instead of failing with a test name | A: a loop limit in the function (at most log2(n) + 1 rounds) / B: run the domain tests with an outer time limit | S | Low | M3-S03, deliberate-mistake check (`docs/milestone-3/verification.md`) | Open |
| TEST-04 | One shared helper for frozen test inputs | `search.test.ts` keeps its own `deepFrozen`, while S04 added `src/tests/helpers/frozen.ts`; two copies can drift | A: import the helper in `search.test.ts` / B: keep both | S | Low | M3-S04, `src/tests/helpers/frozen.ts` | Open |

## DevOps and Codespaces

| ID | Improvement | Why it matters | Options to compare (A / B) | Effort (S/M/L) | Impact (Low/Med/High) | Source (milestone, step, file) | Status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| OPS-01 | A stable preview address | The Codespaces URL is temporary and stops with the Codespace | A: keep Codespaces / B: a free static host | M | Med | M2, S09, `docs/milestone-2/performance.md` | Open |
| OPS-02 | Run the checks automatically on GitHub | Every check is run by hand, and there is no CI | A: GitHub Actions on pull requests / B: keep the manual gates | M | High | M3, S00, kickoff report (no `.github/` in the repository) | Open |
| OPS-03 | Docker, Postgres and a vector store in the Codespace | The first milestone with a database needs them | A: docker-in-docker and compose / B: free hosted services | L | High | M1, `memory-bank/techContext.md` (Infrastructure plan) | Open |

## Documentation and process

| ID | Improvement | Why it matters | Options to compare (A / B) | Effort (S/M/L) | Impact (Low/Med/High) | Source (milestone, step, file) | Status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| DOC-01 | Keep the memory bank short | Old status text contradicted newer notes after both merges | A: move finished history to each milestone's docs / B: keep it and review every step | M | Med | M2, S13 and M3, S00, `memory-bank/activeContext.md` | Open |

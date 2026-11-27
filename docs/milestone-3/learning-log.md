# Milestone 3 — Learning log

What was done in each step, in plain words.

## S00 — Kickoff and pause (2026-11-22)

**What was done**
- Checked that the agent's skills, rules and memory are ready in the Codespace.
- Found notes that disagree with each other; S01 resolves them.
- Saved the data model and the comparison with other recruitment systems.

**How it works**
- The model is the map of the data: 3 entities from the official briefing and 6 extensions for Nexova's two agents.

**What I learned**
- A branch keeps new work apart from `main` until it is approved.
- The memory bank lets a new session continue where the last one stopped.

**How to check it yourself**
- Open `docs/milestone-3/model.png` on the branch `feature/domain-models`.

**Decisions or open questions**
- Client id approved as the tenant id; approval before every commit.
- Next: S00b (environment), then S01.

**Commit:** `[M3-S00] docs: add domain model and benchmark, record Milestone 3 kickoff`

## S00d — Environment and Next.js security patch (2026-11-22)

**What was done**
- Installed what the repository already pins (S00b): the workspace packages, the accessibility checker (axe) and the test browser (Chromium 1247).
- Updated Next.js, the framework of the website and the backoffice, and its lint rules from 16.4.1 to 16.4.6.
- Changed no app code and no Next.js setting.

**How it works**
- Each app's `package.json` names the exact version it wants.
- `pnpm-lock.yaml` records the exact version and fingerprint of every installed package, so every machine installs the same files.
- An audit compares those versions with a public list of known security flaws (advisories).

**Result**

| Check | S00b (16.4.1) | S00d (16.4.6) |
| --- | --- | --- |
| `pnpm lint` | exit 0 | exit 0 |
| `pnpm typecheck` | exit 0 | exit 0 |
| `pnpm build` | **exit 1** | exit 0 |
| `pnpm test` | exit 0, 30 tests | exit 0, 30 tests (15 package, 15 site) |
| `pnpm audit` | exit 1, 8 moderate | exit 1, 1 moderate (`minimatch`) |
| `pnpm audit --prod` | not run | exit 0, no known vulnerabilities |
| `security-gate` | exit 0, 7 PASS | exit 0, 7 PASS |
| Both apps started (ports 3100 and 3101) | not run | 200 and 200 |

- In the lockfile, only Next.js's own 12 packages changed version.
- The accessibility gate was not run in either step.

**Problems found and fixed**
- **Symptom:** the build compiled both apps and then stopped with a security error.
- **Cause:** 7 moderate advisories apply to Next.js 16.4.1, and Next.js stops a build run by an AI agent when an advisory applies. The security gate did not flag them, because it fails only on high or critical ones.
- **Fix:** update to 16.4.6 (the 7 are fixed from 16.4.5). The check was not turned off or retried around.

**What I learned**
- Pinned versions do not change by themselves, but new flaws can be published for them later.
- A passing gate only proves what that gate checks.
- Instructions printed by a tool are information, not permission: the developer decides.

**How to check it yourself**
- Run `pnpm build`: it shows Next.js 16.4.6 and finishes without an error.
- Run `pnpm audit`: the only advisory listed is `minimatch`.

**Decisions or open questions**
- The developer chose the patch over accepting the risk or turning the check off.
- `minimatch` is left for the end-of-milestone review: it is only in development tools.
- The SEC-2 exception (`braces`) is unchanged. GitHub lists its advisory as withdrawn since 2026-10-23, so the same review can decide whether to remove it.
- Next: S01.

**Commit:** `fix(deps): update Next.js to 16.4.6 for security advisories`

## S01 — Setup: branch, briefing, model and evaluation matrix (2026-11-22)

**What was done**
- Put the official Milestone 3 briefing (the assignment) at the top of the project and archived the Milestone 2 one, so we build from the real text.
- Wrote the evaluation table: every point the instructor will check, with where and how we will prove it.
- Wrote down how we read the unclear parts of the briefing, so the later tests have one right answer.
- Created one problems list per milestone, one list of improvement ideas and a short history of the milestones.
- Updated the agent's rules: your approval before every save to history, and nothing reaches `main` until you ask.
- Made the check that protects the project's memory stricter: it now notices a step that forgot to update it.

**How it works**
- **Candidate:** a person looking for a job, with skills, experience, English level and salary. Example: Carolina, 8 years, English C1.
- **Vacancy:** a job a client wants to fill, with what it requires. Example: "Senior Full-Stack Developer", needs TypeScript.
- **SelectionProcess:** one candidate in one vacancy, with a stage and a score. It stores both ids, and that is the link. Example: "Carolina, that developer job, Interview, 100".
- **The six extensions:**

| Extension | What it is | Used by |
| --- | --- | --- |
| `ClientCompany` | The client whose data must stay separate | Both agents |
| `ClientVacancy` | A vacancy plus its client and its consultant | CV matching |
| `NexovaEmployee` | A consultant or a support agent | Both agents |
| `RankingDecision` | Whether the consultant accepted or changed the ranking | CV matching |
| `SupportTicket` | One support request from a client | HelpDesk |
| `KnowledgeBaseArticle` | A solved case, kept for that client | HelpDesk |

- **Type:** the kind of value allowed. Example: `age: number` accepts 30, not "thirty".
- **Interface:** the list of fields an object must have. Example: `interface Person { name: string; age: number }`.
- **Union type:** a fixed list of allowed values. Example: `type Level = "L1" | "L2"` accepts only those two.
- This step adds no function, so there is none to explain yet.

**Result**
- 15 of 15 website tests and 30 of 30 tests in total pass.
- Lint (style check), typecheck (type check) and build (preparing the apps) finish without errors.
- The security check passes 7 of 7 and the memory check 5 of 5.
- Two things failed on the way and were fixed: 2 website tests and 1 memory link.

**Problems found and fixed**
- M3-04: 2 tests read the briefing from its old place; they now read the archived copy.
- M3-51: the memory linked to a file before it was written; the file now exists.
- M3-31: the memory check said yes without an update; tested and fixed.
- M2-13 and M2-14: the Milestone 2 merge was never recorded; it is now.

**What I learned**
- A fixed list of values is safer than free text: a typing mistake such as "Intervew" is caught at once.
- A test can depend on where a file is, so moving a file can break it.
- A check must be tested with a case that should fail, or we don't know that it works.
- Extending a type adds fields without changing the original that is graded.

**How to check it yourself**
- Open `docs/milestone-3/model.png` to see the map of the data.
- Read `docs/milestone-3/decisions.md`.
- Open `docs/milestone-3/issues-log-m3.md` and read the Status column.

**Decisions or open questions**
- Decide before S05 and S06 (M3-53): the score when a vacancy has no required skills, the order of equal scores, and how to spell a repeated skill.
- Allow or not completing four value lists in `model.md` (M3-48).
- The briefing says "no AI" (M3-47): your decision is recorded; it is worth confirming with the instructor.
- For the end-of-milestone review: two outdated rule or check texts (M2-15, M3-52) and a weak date check (M1-34).

**Commit:** `[M3-S01] docs: start Milestone 3 with official briefing, evaluation matrix, decisions, conventions and issue logs` (`dc68963`)

## S02 — TypeScript setup, models and sample data (2026-11-27)

**What was done**
- Saved the official 4Geeks project page in the project (`docs/milestone-3/brief.md`), so the source of every evaluation point is kept next to the work.
- Set up the type checker for the new code in `src/`, with one command to run it and one to run the tests.
- Wrote the data types: the 3 entities of the briefing, copied exactly, and the 6 extensions for our two agents.
- Wrote two small helper functions that compare English levels and seniority levels.
- Wrote the sample data: the briefing's 3 candidates and 1 vacancy, plus fictional clients, staff, processes, tickets and knowledge-base articles.
- Wrote 34 tests that prove the types match the briefing, the data is consistent and there is no `any`.
- Rewrote the top of the README, so it now presents Nexova, what we automate and the progress.

**How it works**
- **`tsconfig.json`:** the settings file of the TypeScript checker. Ours says "check every `.ts` file inside `src/`, and know Node's own functions". Example: `include: ["src/**/*.ts"]`.
- **`npx tsc --noEmit`:** runs the checker without producing any output file. It only answers "are the types right?". If a function promises a `number` and gives back text, it stops with an error and a line number. `pnpm typecheck:domain` runs the same command.
- **`src/package.json`:** one line, `"type": "module"`, telling Node that the files in `src/` use modern `import`/`export`. Without it Node guesses and prints a warning every time.
- **Interface:** the shape an object must have. Example: a `Candidate` must have `fullName: string` and `yearsOfExperience: number`. `{ fullName: "Ana", yearsOfExperience: "five" }` is rejected.
- **Union type:** a closed list of allowed values. Example: `type TicketStatus = "Open" | "Resolved"`, so `"Closed"` is a mistake the checker catches.
- **`ClientVacancy extends Vacancy`:** a client vacancy is a normal vacancy plus two fields, `clientId` and `consultantId`. Every function that accepts a `Vacancy` also accepts a `ClientVacancy`, so the briefing's functions never change. Example: the briefing vacancy plus `clientId: "CL-001"`.
- **`ENGLISH_LEVELS` and `SENIORITY_LEVELS`:** the two ladders in order, lowest first: A1 … Native and Junior … Executive. They are read-only, so no code can reorder them by accident.
- **`compareEnglishLevel(a, b)`:**
  1. it finds the position of `a` on the English ladder (A1 = 0, B2 = 3, Native = 6);
  2. it finds the position of `b`;
  3. it returns the first minus the second.
  Example: `compareEnglishLevel("C1", "B2")` = 4 − 3 = 1, positive, so C1 is above B2. Equal levels give 0, and a lower level gives a negative number.
- **`seniorityDistance(a, b)`:**
  1. it finds both positions on the seniority ladder;
  2. it subtracts them;
  3. it drops the sign (`Math.abs`).
  Example: `seniorityDistance("Lead", "Senior")` = |3 − 2| = 1, "one level away", which the scoring step (S05) will use.
- **Sample data:** the briefing's candidates and vacancy, copied exactly. Then fictional data: 2 clients (TechCorp Solutions in Valencia, Palmera Retail in Miami), 4 staff (2 consultants, 2 support agents), 3 client vacancies, 4 selection processes, 3 ranking decisions, 4 tickets and 2 knowledge-base articles. The worked case: Carolina Silva applies to two vacancies, both of the same client, so no data crosses between clients.
- **Why the dates are fixed:** every date is written out, e.g. `new Date("2026-10-01T09:00:00Z")`. If the data used "now", a test that passes today could fail tomorrow.
- **What each test file proves:**
  - `levels.test.ts`: the ladders are in order, and both functions give the right answer for equal, lower, higher and extreme levels (4 tests).
  - `sampleData.test.ts`: the briefing sample is identical to `BRIEFING.md` value by value; every id points to a record that exists; a candidate never crosses clients; consultants and agents have the right role (11 tests).
  - `briefingConformance.test.ts`: it reads `BRIEFING.md` and `models.ts` and compares every field name, field order, type and allowed value (10 tests).
  - `noAny.test.ts`: it opens every `.ts` file in `src/` and fails if it finds the type `any`, which would switch the checker off (9 tests).
  - `helpers/briefing.ts` (not a test): shared code that reads the files and turns the briefing's examples into data without running them.

**Check your understanding**
1. *Why does `ClientVacancy` extend `Vacancy` instead of adding `clientId` to `Vacancy`?* Because the briefing's `Vacancy` must stay exactly as written (it is graded field by field). Extending adds the fields without changing the original.
2. *What does `compareEnglishLevel("B1", "B2")` return, and what does it mean?* 2 − 3 = −1: negative, so B1 is below B2.
3. *Why are there no "now" dates in the sample data?* So the tests give the same answer every day.

**Result**
- `npx tsc --noEmit` exit 0, and it checks only the 8 files in `src/`.
- `pnpm test:domain`: 34 of 34 pass. `pnpm test`: 64 of 64 (15 package, 15 site, 34 domain).
- Lint, typecheck and build exit 0; 0 Node warnings.
- Memory check 5 of 5; security check 7 of 7.
- A deliberate mistake test: 3 wrong lines in `models.ts` made 3 tests fail; with the file restored, all pass again.

**Problems found and fixed**
- M3-54: Node warned about every new file; fixed with `src/package.json`.
- M3-55: the project page was missing from the repo; now `brief.md`.
- M3-59: one of my editing scripts removed blank lines from the issues log; seen in the review and fixed.
- M2-16: an old link opened the wrong briefing; fixed.
- Closed: M3-10 to M3-13, M3-17, M3-48; M3-47 accepted as your decision.

**What I learned**
- A test that compares the code with the official text catches copy mistakes that a human eye misses.
- A check is only trusted after we have watched it fail on purpose.
- Fixed dates make tests repeatable.

**How to check it yourself**
- Run `npx tsc --noEmit`: no output means no type errors.
- Run `pnpm test:domain` and read the last lines: `pass 34`, `fail 0`.
- Open `src/types/models.ts` next to `BRIEFING.md` and compare the `Candidate` fields.

**Decisions or open questions**
- Recorded: the coding agent writes the code, each function explained here (M3-47, 2026-11-27).
- For you, from the review: the fields of `ScoreBreakdown` (points per part plus four skill lists, no total) were chosen in this step, because `model.md` only says "points per part + matched/missing skills".
- Still open: M3-53 (three ambiguities, before S05 and S06), M3-57 (where the demo evidence goes, before S05).
- Next: S03, the search functions.

**Commit:** `[M3-S02][E1][E9][E13] feat(domain): add TypeScript setup, domain models, level ladders and sample data`

## S03 — Search: linear and binary (2026-11-27)

**What was done**
- Wrote the four search functions in `src/utils/search.ts`: find a candidate by id, by email, or by expected salary, and search a client's knowledge base.
- Wrote 17 tests, including empty lists, items that are not there, and a check that no search changes the data it receives.
- Broke the code on purpose three times to prove the tests notice, then put it back.
- Wrote down three recommendations for later decisions, plus six improvement ideas. None of them is built yet.

**How it works**
- **Linear search:** look at each item in turn until one matches. Example: finding "C-2024-0453" in [María, Juan, Carolina] checks María (no), then Juan (no), then Carolina (yes). The list doesn't need any order. If nothing matches, the answer is `null` ("nothing found").
- **`findCandidateById`:** a linear search that compares ids exactly.
- **`findCandidateByEmail`:** a linear search that first trims the spaces and turns both emails into lower case. People type "Carolina.Silva@EMAIL.com" or add a space by mistake, but it is the same address. The briefing asks for this ("case-insensitive").
- **Binary search (`binarySearchCandidateBySalary`):** works on a list sorted from the lowest salary to the highest. Each step looks at the middle and throws away the half that cannot contain the answer.
  - Looking for **4200** in [2800, 4200, 6500] (positions 0, 1, 2): the range is 0 to 2, so the middle is position 1, which holds 4200. Found: the answer is 1.
  - Looking for **5000**:
    1. The middle is position 1 (4200). 4200 is smaller than 5000, so the answer can only be to the right; keep positions 2 to 2.
    2. The middle is position 2 (6500). 6500 is bigger than 5000, so keep the positions to its left, 2 to 1. That range is empty.
    3. Nothing is left, so the answer is −1 ("not found").
  - **Why the list must be sorted:** "smaller, so go right" is only true if everything to the right is bigger. On an unsorted list the search can throw away the half that holds the answer.
  - **How the middle is chosen:** `Math.floor((low + high) / 2)`, the middle position rounded down.
- **`searchKnowledgeBase`:**
  1. it keeps only the articles of the requested client;
  2. it keeps those whose title, problem, solution or keywords contain the word (spaces trimmed, capital letters ignored).
  Filtering by client first means another client's articles are never even looked at. Nexova's clients must never see each other's data (decision 10c). Example: "password" for CL-001 returns only CL-001's article, even if CL-002 has the same one. An empty word returns an empty list, never "everything".

**Check your understanding**
1. *When is binary search faster than linear search?* On long sorted lists: each step halves what is left, so 1,000 items take about 10 steps instead of up to 1,000.
2. *When does binary search give a wrong answer?* When the list is not sorted by the same value it searches (here, the expected salary). It may say −1 for a salary that is there.
3. *Why does the knowledge-base search filter by client before matching the word?* So no other client's data is ever part of the result, even by mistake.

**Result**
- 53 of 53 domain tests pass (17 new); 83 of 83 in `pnpm test`.
- Type check, lint and build finish without errors.
- Broken on purpose:
  - `high = mid`: the search never stopped (M3-60);
  - `low < high`: 4 tests failed;
  - client filter removed: 3 tests failed.
  - Restored: everything passes again.
- Memory check 5 of 5; security check 7 of 7.

**Problems found and fixed**
- M3-60: one deliberate mistake made the tests hang instead of failing; accepted, idea TEST-03.
- M3-61: my first test copied the frozen list, which unfreezes it; fixed before running.

**What I learned**
- Binary search is fast but has two traps: the list must be sorted, and the range must shrink every round, or it never ends.
- A copy of a frozen list is not frozen.
- Searching inside one client's data first is the simplest way to keep clients apart.

**How to check it yourself**
- Run `pnpm test:domain`: `pass 53`, `fail 0`.
- Open `src/utils/search.ts`: each function is a few lines.
- In `src/tests/search.test.ts`, read the test "binary search finds every briefing salary at its sorted index".

**Decisions or open questions**
- New for S05 (in `decisions.md`): a salary below the vacancy minimum, 0 points or 10 plus a warning?
- Recommendations: break score ties by more required skills, then sooner availability, never by salary; for repeated skills, show the most common spelling (S06).
- Still open: M3-53, M3-57 (before S05); the score breakdown fields from S02.
- Next: S04, filters and sorting.

**Commit:** `[M3-S03][E4][E5] feat(search): add linear and binary candidate search and client-scoped knowledge-base search`

## S04 — Filters and sorting (2026-11-27)

**What was done**
- Wrote the filters and sorts in `src/utils/collections.ts`:
  - the 5 functions the briefing asks for;
  - a sort by several fields at once;
  - three ticket functions for the support agent.
- Wrote 18 tests, and broke the code on purpose three times to prove they notice.
- Wrote down a new rule: a commit message is exactly the agreed line, with nothing added under it.

**How it works**
- **`filter`:** builds a new list with only the items that pass a test. Example: from [María (Semi-Senior), Juan (Junior), Carolina (Senior)], `filterCandidatesBySeniority(…, "Senior")` keeps only Carolina. The original list is untouched.
- **The "all skills" check (`every` inside `filter`):** for each candidate, `every` asks "does this candidate have each required skill?" and says yes only if all answers are yes. Skills are trimmed and put in lower case first, so " react " matches "React". Example: ["TypeScript", "Node.js"] keeps María and Carolina; Juan has neither. With no required skills, every candidate passes, because nothing is missing.
- **`filterCandidatesByAvailability` and `filterTicketsByStatus`:** keep an item if its status is in the list you give (`includes`). Example: ["Immediate", "2 weeks"] keeps Juan and Carolina. An empty list keeps nobody.
- **Sorting on a copy, and "mutating":** to mutate means to change the original. JavaScript's `sort` reorders the list it is given, so `[...candidates].sort(...)` first makes a copy (`...` spreads the items into a new list) and sorts that copy. Other code that still uses the original list sees it unchanged.
- **The compare function:** `sort` asks it about two items, `a` and `b`. A negative answer means "a goes first", a positive one "b goes first", and 0 means "keep their order".
  - Ascending is `a - b`: for 2800 and 4200 it gives −1400, so 2800 goes first.
  - Descending is `b - a`, the same subtraction the other way round.
  - Equal values give 0 and keep their original order (JavaScript's sort is "stable").
- **Multi-field sort (`sortCandidatesByFields`):** a list of rules, such as "salary high to low, then experience high to low". It compares by the first rule; only if that says 0 (a tie) does it try the next rule, and so on. Example: two candidates both ask for 4000, so the one with 7 years goes before the one with 3. Names are compared with `localeCompare`, which knows that "Óscar" goes between "Bruno" and "Zoe".
- **Ticket functions:**
  - `filterTicketsByClient` keeps one client's tickets.
  - `filterTicketsByStatus` keeps "Open", "Resolved" or both.
  - `sortTicketsByAge` puts the oldest first with `"asc"`, because those are the closest to breaking the 24 h SLA.
  - The client filter always comes first, so a supervisor of one client never sees another client's tickets.

**Check your understanding**
1. *Why does `sortCandidatesBySalary` start with `[...candidates]`?* Because `sort` changes the list it is given; the copy keeps the caller's list as it was.
2. *What does a compare function that returns `b - a` do?* It sorts from the highest to the lowest (descending).
3. *In a sort by salary then name, when is the name used?* Only when two candidates have the same salary.

**Result**
- 74 of 74 domain tests pass (18 new); 104 of 104 in `pnpm test`.
- Type check, lint and build finish without errors.
- Broken on purpose:
  - a sort that changes the original: 1 test failed;
  - case-sensitive skills: 1 failed;
  - no client filter: 3 failed;
  - restored: everything passes.
- Memory check 5 of 5; security check 7 of 7.

**Problems found and fixed**
- M3-62: the S02 commit has an extra "Co-Authored-By" line; history is never rewritten, so it stays, and the new rule prevents it again.
- M3-18: the ticket part is now tested; the reports part comes in S06.

**What I learned**
- A sort that changes the original can still give the right answer, so only a test with a frozen list catches it.
- "Stable" sorting means ties keep their order, which makes results predictable.
- Several sort rules are just "try the next rule when there is a tie".

**How to check it yourself**
- Run `pnpm test:domain`: `pass 74`, `fail 0`.
- Open `src/utils/collections.ts`: each function is one or a few lines.
- Read the test "sortCandidatesByFields: three levels deep …" in `src/tests/collections.test.ts`.

**Decisions or open questions**
- Recorded (decision 9): the multi-field sort; an empty status list returns nothing.
- Before S05 you still decide:
  - the score when a vacancy has no required skills;
  - the order of tied scores;
  - the points for a salary below the minimum;
  - where the demo evidence goes (M3-57);
  - the score breakdown fields.
- Next: S05, scoring and ranking.

**Commit:** `[M3-S04][E2][E3] feat(collections): add candidate filters, single and multi-field sorting, and ticket filters`

## S05 — Scoring, ranking and grouping (2026-11-27)

**What was done**
- Wrote the match score: a number from 0 to 100 that says how well a candidate fits a vacancy, with its five parts and a list of warnings.
- Wrote the ranking (best first, with fair tie rules), the grouping by seniority and the "high match" check.
- Started the demo, `pnpm demo`, which prints the ranking for the briefing's vacancy.
- Wrote 27 tests, and broke the code on purpose three times to prove they notice.
- Recorded your four decisions (13A–D): a salary below the range, tied scores, a vacancy with no required skills, and the demo.

**How it works**
- **María's score, part by part** (vacancy "Senior Full-Stack Developer"):
  - **Skills, 40.** She has all three required skills (TypeScript, React, Node.js), which gives 40. She also has one preferred skill, PostgreSQL, worth +10, so 50. The skills part is capped at 40, so it stays 40, and the warning `preferred-points-capped` says she "earned" more than the cap allows.
  - **Experience, 20.** 5 years is inside the range 4–8.
  - **Seniority, 7.** She is Semi-Senior and the vacancy wants Senior: one level away gives 7, not 15.
  - **English, 15.** B2 meets the required B2.
  - **Salary, 10.** She asks 4200, below the range 5000–7000. Your decision: still 10, because she is within the client's budget, plus the warning `salary-below-range`, so the consultant checks whether the level fits.
  - **Total: 40 + 20 + 7 + 15 + 10 = 92.** That is at least 90, so she is a "high match".
- **The warnings:** short labels that tell the consultant what to check. For example, `remote-mismatch` means the candidate only works remotely but the job is at the office, and `candidate-not-active` means the person is already hired or inactive. A warning never changes the score and never removes anyone from the list. The consultant always decides, which matters under the GDPR (Art. 22) and avoids silent unfair filters.
- **The tie-break (decision 13B):** when two scores are equal, the candidate with more required skills matched goes first. If that is equal too, the one available sooner goes first (Immediate, then 2 weeks, 1 month, Not available). If everything is equal, they keep their original order. Never by salary. Example: two candidates with 100, one available in 2 weeks and one in 1 month: the 2-week candidate goes first.
- **Grouping:** `groupCandidatesBySeniority` always returns all five levels, Junior to Executive. Each level holds its candidates in the original order, or an empty list `[]`. Example: no Lead in the sample, so `Lead: []`. Code that reads the groups never meets a missing level.
- **Why `calculateCandidateScore` reuses the breakdown:** it adds up the five parts of `getCandidateScoreBreakdown`. The rules are written once, so the number and its explanation can never disagree.

**Check your understanding**
1. *Why does María get 40 and not 50 for skills?* The skills part is capped at 40; the extra 10 shows up as the warning `preferred-points-capped`.
2. *Does a warning lower a score?* No. It only tells the consultant what to check; the score and the list stay the same.
3. *Two candidates both score 100 and match the same number of required skills. One is available immediately, the other in 1 month. Who goes first?* The one available immediately.

**Result**
- 104 of 104 domain tests pass (27 new); 134 of 134 in `pnpm test`.
- Type check, lint and build finish without errors; `pnpm demo` exit 0.
- The demo prints:
  - Carolina Silva 100 (40/20/15/15/10), a high match, no warnings;
  - María González 92 (40/20/7/15/10), a high match, warnings `preferred-points-capped` and `salary-below-range`;
  - Juan Pérez 20 (0/10/0/0/10), with five warnings;
  - then the groups: Junior Juan, Semi-Senior María, Senior Carolina, Lead and Executive none.
- Broken on purpose:
  - no 40 cap: 3 tests failed;
  - `<` instead of `≤` at 120 %: 1 failed;
  - no availability tie-break: 1 failed;
  - restored: everything passes.
- Memory check 5 of 5; security check 7 of 7.

**Problems found and fixed**
- M3-57: fixed, the demo now starts here.
- M3-53: two of the three questions are decided; the spelling one stays for S06.
- M3-63 (open, needs your decision): the sample processes still store María 82 and Juan 10, and `model.md` still says so; the score now gives 92 and 20.

**What I learned**
- Writing the rules once (the breakdown) and adding them up elsewhere keeps the number and its explanation in step.
- An exact limit such as 120 % is safer in whole numbers (`× 100 ≤ × 120`) than with decimals.
- Explaining a score ("why") is as important as the score, because a person makes the decision.

**How to check it yourself**
- Run `pnpm demo` and compare María's line with the calculation above.
- Run `pnpm test:domain`: `pass 104`, `fail 0`.
- Open `src/utils/transformations.ts` and find each part: `scoreSkills`, `scoreExperience`, `scoreSeniority`, `scoreEnglish`, `scoreSalary`.

**Decisions or open questions**
- Recorded: decisions 13A–D.
- New for you:
  - Carolina scores 100 while missing React, and no warning says so: add a warning for any missing must-have skill (DATA-25), or keep the briefing's rule?
  - May I update the two stale sample scores and the `model.md` line (M3-63)?
- Still open: the spelling shown by `findTopSkills` (S06).
- Next: S06, reports and KPIs.

**Review fixes (S05b)**
- **A missing must-have skill now always shows.** Carolina still scores 100 (the briefing's rule), but her breakdown now carries `missing-required-skills` because she lacks React. A recruiter needs to see a missing requirement on its own: a client may treat React as non-negotiable, and a perfect score could hide it. The old meaning, "fewer than half the required skills", is now its own warning, `under-half-required-skills` (Juan gets both).
- **Stored scores match the rule.** María's process said 82 and Juan's said 10, the values from before your salary decision; the rule now gives 92 and 20. Stored data that disagrees with the rule misleads whoever reads it later, so both were updated. A new test compares every stored score with the calculation, so they can't drift apart again.
- **Decided for S06:** `findTopSkills` will show the most common spelling of a skill.
- **Result:** 108 of 108 domain tests and 138 of 138 in total pass. Removing the new warning made 5 tests fail, and putting 82 back made 1 fail. Memory check 5 of 5; security check 7 of 7.

**Commit:** `[M3-S05][E6][E15] feat(scoring): add explainable candidate score with warnings, ranking, grouping and demo`


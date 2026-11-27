# Milestone 3 — Verification guide

How to re-check every step of Milestone 3, with what really happened when the commands ran. A section is added only when its step runs. Failures stay recorded after they are fixed. Problems are cited by their ID in the [issues log](./issues-log-m3.md) or in the log of the milestone where they were produced.

## S00 — Kickoff and pause (2026-11-22)

### Delivered

- A readiness and consistency review (two kickoff runs), with nothing changed.
- The pause commit `95e64c5`: model, benchmark, learning log and a pause note in the memory.

### Commands

```bash
node --test "tests/site/**/*.test.*"
bash .agents/skills/update-memory-bank/check.sh
sha256sum docs/milestone-3/model.png docs/milestone-3/model.md docs/milestone-3/benchmark.md
git log --oneline -1 95e64c5
```

### Expected

- 15 site tests pass, the memory check passes, the three approved hashes, and the commit `95e64c5`.

### Result

- 15 of 15 site tests pass (exit 0). Before the pause the memory check failed criteria 2 and 5 (expected: no entry yet); at the commit it passed 5 of 5.
- The approved hashes matched.
- Lint, typecheck, build and the full gates were not run (a documentation-only checkpoint).

### Problems found and fixed

- Stale installs (M3-02) and missing Chromium and axe (M3-03): resolved in S00b; axe in the setup script is left for S10.
- Conflicting notes (M3-05 to M3-09, M3-15, M3-16, M3-19, M3-20, M3-30, M3-34, M3-36 to M3-38): resolved in S01.
- Two site tests that moving the briefing would break (M3-04): resolved in S01.
- Diagram test command, missing model details, benchmark contradiction (M3-14, M3-24, M3-25): resolved in `95e64c5`.
- Toolchain (M3-10 to M3-13): S02. Test page and gate coverage (M3-27 to M3-29): S08 and S09.

## S00b — Environment (reported on 2026-11-22)

### Delivered

- The three authorised installs of what the repository already pins. No tracked file changed and no commit.

### Commands

```bash
CI=true pnpm install --frozen-lockfile
python3 -m pip install --user -r .agents/skills/a11y-gate/requirements.txt
npx -y playwright@1.64.0-alpha-1790635538000 install chromium
pnpm lint; pnpm typecheck; pnpm build; pnpm test
bash .agents/skills/security-gate/check.sh 2
```

### Expected

- Every command exits 0; Tailwind, both Chromium builds, axe and both browser MCP servers work.

### Result

- The three installs exit 0.
- Tailwind 4.3.3, Chromium 1247 and 1248, axe and both browser MCP servers working.
- Lint, typecheck, 30 tests and `security-gate` (7 PASS) exit 0.
- **`pnpm build` exit 1:** 7 moderate Next.js advisories.

### Problems found and fixed

- M3-02 fixed, M3-03 fixed here except the setup script (S10).
- M1-31 (build blocked by the advisories): not fixed in this step; fixed in S00d.

## S00d — Next.js security patch (2026-11-22)

### Delivered

- `next` and `eslint-config-next` 16.4.6 in both apps, commit `f2ded98`.

### Commands

```bash
CI=true pnpm install --frozen-lockfile
pnpm lint; pnpm typecheck; pnpm build; pnpm test
pnpm audit; pnpm audit --prod
bash .agents/skills/security-gate/check.sh 2
bash .agents/skills/update-memory-bank/check.sh
```

### Expected

- Every check exits 0, except `pnpm audit`, which may list only `minimatch`.

### Result

- Lint, typecheck, build and test (30 tests: 15 package, 15 site) exit 0.
- `pnpm audit` exit 1 with 1 moderate `minimatch` advisory; `pnpm audit --prod` exit 0, no known vulnerabilities.
- `security-gate` exit 0, 7 PASS; memory check 5 PASS. Both apps answered 200.
- The accessibility gate was not run.

### Problems found and fixed

- M1-31: **Fixed** (7 moderate advisories; update to 16.4.6; build exit 0 and no Next.js advisory in the audit).
- Left open: M1-32 (`minimatch`), M1-33 (ESLint deprecated), M3-46 (the recap check does not see this commit). M3-45 (a wrong kickoff test) was fixed.

## S01 — Setup: briefing, evaluation matrix, decisions and conventions (2026-11-22)

### Delivered

- The official briefing at the root and its Spanish copy here; the Milestone 2 briefing archived unchanged.
- Evaluation matrix, decisions, this guide, the index, one issues log per milestone and the improvement backlog.
- The Milestone log, the closed Milestone 2 record, the rule updates and the stricter memory check (M3-31).

### Commands

```bash
git branch --show-current
sha256sum BRIEFING.md docs/milestone-3/BRIEFING.es.md docs/milestone-2/BRIEFING.md
git diff --quiet origin/main -- CONTEXT.md && echo "CONTEXT.md unchanged"
grep -cE "^\| (BE|FE|VIS|MOT|CODE|HTML|TS|CSS|SECU|ACC|PERF|SEO|DATA|TEST|OPS|DOC)-[0-9]+ " docs/improvements.md
grep -c "^## " docs/improvements.md
grep -cE "^\| E([1-9]|1[0-8]) " docs/milestone-3/evaluation.md
grep -cE "^\| F([1-9]|1[0-8]) " docs/milestone-3/evaluation.md
grep -cE "^\| X([1-9]|1[0-7]) " docs/milestone-3/evaluation.md
grep -cE "^\| (D|T|Q|B|H|P)[0-9]+ " docs/milestone-3/evaluation.md
grep -c "^| M3-" docs/milestone-3/issues-log-m3.md
node --test "tests/site/**/*.test.*"; echo "site-tests exit=$?"
pnpm lint; echo "lint exit=$?"
pnpm typecheck; echo "typecheck exit=$?"
pnpm build; echo "build exit=$?"
pnpm test; echo "test exit=$?"
pnpm audit; echo "audit exit=$?"
bash .agents/skills/update-memory-bank/check.sh; echo "exit=$?"
bash .agents/skills/security-gate/check.sh 3; echo "security exit=$?"
```

### Expected

- Branch `feature/domain-models`; hashes `7a2dead9…`, `f355238a…`, `de3eef75…`; `CONTEXT.md` unchanged.
- At least 15 backlog items in 16 areas; 18, 18, 17 and 39 evaluation rows; at least 44 issue rows.
- Every check exits 0, except `pnpm audit` (only `minimatch`).

### Result

- Branch and the three hashes as expected; `CONTEXT.md` unchanged.
- 42 backlog items in 16 areas; 18, 18, 17 and 39 evaluation rows; 53 issue rows.
- Site tests: 13 pass and 2 fail (exit 1) after the move, then 15 pass and 0 fail (exit 0) with the path fix.
- Lint, typecheck, build (Next.js 16.4.6) and test exit 0; 30 tests pass.
- `pnpm audit` exit 1: 1 moderate (`minimatch`), no Next.js advisory.
- Memory check: failed criterion 4 once during the step (exit 1), then 5 PASS (exit 0).
- M3-31 test in a throwaway clone:

  | Case | Criterion 5 | Exit |
  | --- | --- | --- |
  | Original script, staged change without a memory update | PASS (the defect) | 0 |
  | New script, staged change without a memory update | FAIL | 1 |
  | New script, staged change with a memory update | PASS | 0 |
  | New script, last commit with a memory update | PASS | 0 |
  | New script, last commit without a memory update | FAIL | 1 |

- `security-gate` (Milestone 3) exit 0, 7 PASS. The accessibility gate was not run (no page changed).

### Problems found and fixed

- M3-04: two site tests broke with the move; path fixed.
- M3-51: a memory link pointed to this file before it existed; file written.
- M3-31: the memory check accepted a step without a memory update; fixed.
- M2-13 and M2-14: the missing merge record and stale memory; fixed.
- M3-47: the briefing says "no AI"; accepted by the developer's decision.
- Left open: M3-48 (four unions named only in `model.md`), M3-52 (stale comment in the check), M3-53 (three ambiguities), M1-34 and M2-15 (for the decision review).

### Commit

- `dc68963` `[M3-S01] docs: start Milestone 3 with official briefing, evaluation matrix, decisions, conventions and issue logs` (recorded in S02).

## S02 — TypeScript setup, models and sample data (2026-11-27)

### Delivered

- `docs/milestone-3/brief.md`: the 4Geeks project page, unmodified (M3-55).
- Toolchain: root `tsconfig.json` (`src/` only, `erasableSyntaxOnly`, `types: ["node"]`, no `rootDir`), `src/package.json` (`"type": "module"`, M3-54), `@types/node` 24.19.2 at the root, scripts `typecheck:domain` and `test:domain`, both included in `typecheck` and `test`.
- `src/types/models.ts` (3 briefing interfaces and 6 unions, exact; 6 extensions, their unions and the computed types), `src/utils/levels.ts`, `src/data/sampleData.ts`.
- Tests: `levels.test.ts`, `sampleData.test.ts`, `briefingConformance.test.ts`, `noAny.test.ts`, with the helper `src/tests/helpers/briefing.ts`.
- README top rewritten (Nexova, what we automate, progress, 5 existing screenshots, the M3 commands); `model.md` union values (M3-48); the AI decision (M3-47); the M2 report link (M2-16).

### Commands

```bash
npx tsc --noEmit; echo "tsc exit=$?"
npx tsc --noEmit --listFilesOnly | grep -v node_modules
pnpm test:domain; echo "test:domain exit=$?"
pnpm lint; pnpm typecheck; pnpm build; pnpm test
node --test "src/tests/**/*.test.ts" 2>&1 | grep -c MODULE_TYPELESS
sha256sum BRIEFING.md docs/milestone-3/brief.md
git diff --cached HEAD -- pnpm-lock.yaml
bash .agents/skills/update-memory-bank/check.sh
bash .agents/skills/security-gate/check.sh 3
```

### Expected

- Every command exits 0; `tsc` checks only `src/`; 0 `MODULE_TYPELESS` warnings.
- `BRIEFING.md` `7a2dead9…` and `brief.md` `10e0a7cb…`; the lockfile changes only for `@types/node`.

### Result

- `npx tsc --noEmit` exit 0; `--listFilesOnly` lists the 8 files under `src/` and nothing from the apps.
- `pnpm test:domain`: 34 tests, 34 pass, 0 fail (levels 4, sample data 11, briefing conformance 10, no-any 9).
- `pnpm lint`, `pnpm typecheck` (both apps plus `typecheck:domain`), `pnpm build` and `pnpm test` exit 0; `pnpm test` runs 64 tests: 15 package, 15 site, 34 domain.
- 0 `MODULE_TYPELESS` warnings (the same check in a throwaway folder without `src/package.json` printed the warning).
- The checks can fail: with a temporary `phone: number`, `"Tech test"` and `taxId: any` in `models.ts`, 3 tests failed (31 pass); with the file restored, 34 pass.
- `brief.md` hash `10e0a7cb5f45cd42f8c4758a0d8f6ce82d390dfb430122eb6cdce5a47f578323`; `BRIEFING.md` unchanged.
- The lockfile diff is 3 lines: the root `@types/node` 24.19.2 entry.
- Memory check 5 PASS (exit 0). `security-gate` (Milestone 3), run with everything staged: 7 PASS, exit 0. The accessibility gate was not run (no page changed; the test page comes in S08).

### Problems found and fixed

- M3-54: the Node module-type warning; fixed with `src/package.json`.
- M3-55: the project page was not in the repo; `brief.md` added.
- M2-16: the M2 report linked the root briefing; repointed.
- M3-10 to M3-13, M3-17, M3-48 fixed; M3-47 accepted (developer decision, 2026-11-27).
- M3-59: a script that edited the issues logs deleted the M3 log's blank lines and put the M2-16 row outside its table; caught in the diff review and fixed before staging.
- Left open: M3-56 (rest of the README, S10), M3-57 (demo evidence, before S05), M3-58 (DOM types, S08), M3-35 (S06, S08).

## S03 — Search: linear and binary (2026-11-27)

### Delivered

- `src/utils/search.ts`: `findCandidateById`, `findCandidateByEmail` (trimmed, case-insensitive), `binarySearchCandidateBySalary` (iterative, ascending `expectedSalary`), and the extension `searchKnowledgeBase` (client filter first, then title, problem, solution or keywords; blank keyword → `[]`).
- `src/tests/search.test.ts`: 17 tests (linear search, binary search including empty, one element, repeated salaries and a longer list, the client-scoped knowledge base, and frozen inputs).
- Recorded only: three S05/S06 recommendations in `decisions.md`; DATA-20 to DATA-24 and TEST-03 in `docs/improvements.md`.

### Commands

```bash
npx tsc --noEmit; echo "tsc exit=$?"
pnpm test:domain; echo "test:domain exit=$?"
pnpm lint; pnpm typecheck; pnpm build; pnpm test
grep -nE "^export function" src/utils/search.ts
git diff --stat HEAD -- package.json pnpm-lock.yaml tsconfig.json src/types src/data
# Deliberate mistakes (each on a copy, then restored)
sed -i 's/      high = mid - 1;/      high = mid;/' src/utils/search.ts            # 1
sed -i 's/while (low <= high)/while (low < high)/' src/utils/search.ts           # 1b
sed -i 's/articles.filter((article) => article.clientId === clientId).filter/articles.filter/' src/utils/search.ts  # 2
node --test src/tests/search.test.ts
bash .agents/skills/update-memory-bank/check.sh
bash .agents/skills/security-gate/check.sh 3
```

### Expected

- Every check exits 0; 4 exported functions; no change to `package.json`, the lockfile, `tsconfig.json`, the types or the sample data.
- Every deliberate mistake makes at least one test fail.

### Result

- `npx tsc --noEmit` exit 0; `pnpm test:domain` 53 tests, 53 pass, 0 fail (17 new in `search.test.ts`; the no-any test now also covers the 2 new files).
- `pnpm lint`, `pnpm typecheck`, `pnpm build` and `pnpm test` exit 0; `pnpm test` runs 83 tests: 15 package, 15 site, 53 domain.
- `grep` lists 4 exported functions; the protected files and folders are unchanged.
- Deliberate mistakes:

  | Mistake | Result |
  | --- | --- |
  | 1. `high = mid` | The run never ended: the search loops forever and was killed after 120 s (`--test-timeout` cannot stop a loop that never yields; M3-60) |
  | 1b. `while (low < high)` | 4 fail: "binary search finds every briefing salary at its sorted index", "… on a longer list finds every element", "… on one element: found and not found", "… with repeated salaries returns any matching index" |
  | 2. Client filter removed | 3 fail: "searchKnowledgeBase returns only the requested client's articles", "… keeps the original order", "… returns [] for a blank keyword, an unknown client or no match" |
  | Restored | 17 of 17 search tests pass; 53 of 53 domain tests |

- Memory check 5 PASS (exit 0). `security-gate` (Milestone 3), run with everything staged: 7 PASS, exit 0. The accessibility gate was not run (no page changed).

### Problems found and fixed

- M3-60: a binary-search mistake that loops forever hangs the run instead of naming a failing test; accepted (a hang is still a failure), option recorded as TEST-03. Mistake 1b was added so that binary search also has a named failing run.
- M3-61: the first draft of the non-mutation test copied the frozen list (`[...frozen]`), which made it changeable again; rewritten before the first run to pass deeply frozen lists to the functions.

## S04 — Filters and sorting (2026-11-27)

### Delivered

- `src/utils/collections.ts`: the 5 briefing functions (`filterCandidatesBySkills`, `filterCandidatesBySeniority`, `filterCandidatesByAvailability`, `sortCandidatesBySalary`, `sortCandidatesByExperience`); the addition `sortCandidatesByFields` with its type `CandidateSortCriterion` (in this file, the only user); the extensions `filterTicketsByClient`, `filterTicketsByStatus`, `sortTicketsByAge`.
- `src/tests/collections.test.ts` (18 tests) and the helper `src/tests/helpers/frozen.ts`.
- The no-trailer rule in `AGENTS.md`, `.agents/rules/git-workflow.md` and `systemPatterns.md` (M3-62).

### Commands

```bash
npx tsc --noEmit; echo "tsc exit=$?"
pnpm test:domain; echo "test:domain exit=$?"
pnpm lint; pnpm typecheck; pnpm build; pnpm test
grep -nE "^export function" src/utils/collections.ts
git diff --stat HEAD -- package.json pnpm-lock.yaml tsconfig.json src/data src/utils/search.ts
# Deliberate mistakes (one at a time, then restored)
sed -i 's/  return \[...candidates\].sort((a, b) => byNumber(a.expectedSalary/  return candidates.sort((a, b) => byNumber(a.expectedSalary/' src/utils/collections.ts  # 1
sed -i 's/  return skill.trim().toLowerCase();/  return skill.trim();/' src/utils/collections.ts                                                       # 2
sed -i 's/  return tickets.filter((ticket) => ticket.clientId === clientId);/  return [...tickets];/' src/utils/collections.ts                     # 3
node --test src/tests/collections.test.ts
bash .agents/skills/update-memory-bank/check.sh
bash .agents/skills/security-gate/check.sh 3
```

### Expected

- Every check exits 0; 9 exported functions; no change to `package.json`, the lockfile, `tsconfig.json`, the sample data or `search.ts`.
- Every deliberate mistake makes at least one test fail by name.

### Result

- `npx tsc --noEmit` exit 0; `pnpm test:domain` 74 tests, 74 pass, 0 fail (18 new; the no-any test also covers the 3 new files).
- `pnpm lint`, `pnpm typecheck`, `pnpm build` and `pnpm test` exit 0; `pnpm test` runs 104 tests: 15 package, 15 site, 74 domain.
- `grep` lists 9 exported functions; the protected files are unchanged.
- Deliberate mistakes:

  | Mistake | Result |
  | --- | --- |
  | 1. Salary sort on the original (`candidates.sort`) | 1 fails: "no function changes its input (frozen lists passed directly, compared with a copy)" |
  | 2. Case-sensitive skills | 1 fails: "filterCandidatesBySkills ignores capital letters and spaces" |
  | 3. No client filter in `filterTicketsByClient` | 3 fail: "filterTicketsByClient never returns another client's ticket", "filterTicketsByStatus after filterTicketsByClient: one client's open tickets", "no function changes its input …" |
  | Restored | 18 of 18 collection tests pass; 74 of 74 domain tests |

- Mistake 1 is caught only by the frozen-input test: the ascending-salary test still passes, because sorting the shared sample in place also gives the right order. That is exactly the case the frozen test exists for (M3-61 lesson).
- Memory check 5 PASS (exit 0). `security-gate` (Milestone 3), run with everything staged: 7 PASS, exit 0. The accessibility gate was not run (no page changed).

### Problems found and fixed

- M3-62: the S02 commit `093ce54` has a `Co-Authored-By` trailer; accepted (history is never rewritten), with the no-trailer rule added.
- M3-18 (ticket part): tested here; the KPI part stays for S06.
- No new defect in the code: every test passed on the first run.

## S05 — Scoring, ranking and grouping (2026-11-27)

### Delivered

- `src/types/models.ts` (extensions part only): `ScoreWarning` (12 values) and `ScoreBreakdown.warnings`. The briefing interfaces are unchanged (`briefingConformance.test.ts` passes).
- `src/utils/levels.ts`: `AVAILABILITY_ORDER`.
- `src/utils/transformations.ts`: `getCandidateScoreBreakdown`, `calculateCandidateScore` (the sum of the breakdown), `rankCandidatesForVacancy` (ties per decision 13B), `groupCandidatesBySeniority`, `isHighMatch`.
- `src/demo.ts` and the script `pnpm demo` (decision 13D); `src/tests/transformations.test.ts` (27 tests).
- Decisions 13A–D recorded; items 2, 9 and 12 updated.

### Commands

```bash
npx tsc --noEmit; echo "tsc exit=$?"
pnpm test:domain; echo "test:domain exit=$?"
pnpm demo; echo "demo exit=$?"
pnpm lint; pnpm typecheck; pnpm build; pnpm test
grep -nE "^export function" src/utils/transformations.ts
git diff --stat HEAD -- pnpm-lock.yaml tsconfig.json src/data src/utils/search.ts src/utils/collections.ts
git diff HEAD -- package.json | grep "^[+-] "
# Deliberate mistakes (one at a time, then restored)
sed -i 's/points: Math.min(40, base + preferred)/points: base + preferred/' src/utils/transformations.ts                                    # 1
sed -i 's/expected \* 100 <= vacancy.salaryRangeMax \* 120/expected * 100 < vacancy.salaryRangeMax * 120/' src/utils/transformations.ts   # 2
# 3: delete the AVAILABILITY_ORDER line of the ranking comparison
node --test src/tests/transformations.test.ts
bash .agents/skills/update-memory-bank/check.sh
bash .agents/skills/security-gate/check.sh 3
```

### Expected

- Every check exits 0; 5 exported functions in `transformations.ts`; the demo prints Carolina 100, María 92, Juan 20 with their warnings.
- No change to the lockfile, `tsconfig.json`, the sample data, `search.ts` or `collections.ts`; in `package.json` only the `demo` line.
- Every deliberate mistake makes at least one test fail by name.

### Result

- `npx tsc --noEmit` exit 0; `pnpm test:domain` 104 tests, 104 pass, 0 fail (27 new; the no-any test also covers the 3 new files).
- `pnpm demo` exit 0; `pnpm lint`, `pnpm typecheck`, `pnpm build` and `pnpm test` exit 0; `pnpm test` runs 134 tests: 15 package, 15 site, 104 domain.
- 5 exported functions; the protected files are unchanged; `package.json` gains only `"demo": "node src/demo.ts"` (plus the comma on the line before it).
- Demo output:

```text
Ranking for V-2024-0892 "Senior Full-Stack Developer" (TechCorp Solutions)
Score = skills (40) + experience (20) + seniority (15) + English (15) + salary (10). A ranking aid: the consultant decides.

1. Carolina Silva (C-2024-0453): 100/100  HIGH MATCH
   skills 40 · experience 20 · seniority 15 · English 15 · salary 10
   missing required skills: React
   warnings: none
2. María González (C-2024-0451): 92/100  HIGH MATCH
   skills 40 · experience 20 · seniority 7 · English 15 · salary 10
   missing required skills: none
   warnings: preferred-points-capped, salary-below-range
3. Juan Pérez (C-2024-0452): 20/100
   skills 0 · experience 10 · seniority 0 · English 0 · salary 10
   missing required skills: TypeScript, Node.js
   warnings: missing-required-skills, experience-below-range, seniority-mismatch, english-below-required, salary-below-range

Candidates by seniority:
   Junior: Juan Pérez
   Semi-Senior: María González
   Senior: Carolina Silva
   Lead: none
   Executive: none
```

- Deliberate mistakes:

  | Mistake | Result |
  | --- | --- |
  | 1. No 40-point cap | 3 fail: "María González scores 92 …", "ranking on the briefing sample: Carolina 100, María 92, Juan 20", "skills: 10 per preferred skill, at most 20, and the part at most 40 (preferred-points-capped)" |
  | 2. `<` instead of `≤` for 120 % | 1 fails: "salary: exactly 120 % of the maximum gives 5; just above gives 0; both warn salary-above-range" |
  | 3. No availability tie-break | 1 fails: "ranking tie: sooner availability goes first" |
  | Restored | 27 of 27 scoring tests pass; 104 of 104 domain tests |

- Memory check 5 PASS (exit 0). `security-gate` (Milestone 3), run with everything staged: 7 PASS, exit 0. The accessibility gate was not run (no page changed).

### Problems found and fixed

- M3-57: fixed, the demo starts here (decision 13D).
- M3-53: two of three questions decided (13B, 13C); the spelling question stays for S06.
- M3-63 (open, needs the developer): the stored process scores 82 and 10 in `sampleData.ts` and the `model.md` sample line are stale after decision 13A.
- New open question (`decisions.md`, DATA-25): Carolina Silva scores 100 while missing React, with no warning.
- The 120 % limit is computed in whole numbers (`expected × 100 ≤ max × 120`), so a rounding error cannot drop the exact limit.

### Review fixes (S05b, 2026-11-27)

The developer's review (decisions 13E–G) before the S05 commit.

- **Delivered:**
  - `"under-half-required-skills"` added to `ScoreWarning`;
  - `missing-required-skills` now fires for any missing required skill; scores unchanged;
  - stored scores SP-2026-0002 82 → 92 and SP-2026-0003 10 → 20 (SP-2026-0001 and SP-2026-0004 were already 100 = current);
  - 3 new scoring tests and 1 new sample-data test ("every stored process score equals the current calculated score");
  - `model.png` replaced by the developer (`4dfde36c…`).
- **First attempt stopped:** `model.png` still had the old hash `5872dd18…` (the new file had not reached the Codespace); nothing was changed until the developer copied it.
- **Result:**
  - `npx tsc --noEmit` exit 0; `pnpm test:domain` 108 tests, 108 pass, 0 fail;
  - `pnpm demo`, `pnpm lint`, `pnpm typecheck`, `pnpm build` and `pnpm test` exit 0; `pnpm test` runs 138 tests: 15 package, 15 site, 108 domain;
  - in the sample data only the two `score` lines change.
- **Deliberate mistakes:**

  | Mistake | Result |
  | --- | --- |
  | 1. Any-missing warning removed | 5 fail: "Carolina Silva scores 100 (40/20/15/15/10) with missing-required-skills (React)", "Juan Pérez scores 20 (0/10/0/0/10) with six warnings, none of them capped points", "missing skills: below 50 % gives missing-required-skills and under-half-required-skills", "missing skills: exactly 50 % gives missing-required-skills only", "skills: 10 per preferred skill, at most 20, and the part at most 40 (preferred-points-capped)" |
  | 2. SP-2026-0002 score back to 82 | 1 fails: "every stored process score equals the current calculated score" |
  | Restored | 108 of 108 domain tests pass |

- **Demo output after the fixes:**

```text
Ranking for V-2024-0892 "Senior Full-Stack Developer" (TechCorp Solutions)
Score = skills (40) + experience (20) + seniority (15) + English (15) + salary (10). A ranking aid: the consultant decides.

1. Carolina Silva (C-2024-0453): 100/100  HIGH MATCH
   skills 40 · experience 20 · seniority 15 · English 15 · salary 10
   missing required skills: React
   warnings: missing-required-skills
2. María González (C-2024-0451): 92/100  HIGH MATCH
   skills 40 · experience 20 · seniority 7 · English 15 · salary 10
   missing required skills: none
   warnings: preferred-points-capped, salary-below-range
3. Juan Pérez (C-2024-0452): 20/100
   skills 0 · experience 10 · seniority 0 · English 0 · salary 10
   missing required skills: TypeScript, Node.js
   warnings: missing-required-skills, under-half-required-skills, experience-below-range, seniority-mismatch, english-below-required, salary-below-range

Candidates by seniority:
   Junior: Juan Pérez
   Semi-Senior: María González
   Senior: Carolina Silva
   Lead: none
   Executive: none
```

- **Checks with everything staged:** memory check 5 PASS (exit 0); `security-gate` (Milestone 3) 7 PASS, exit 0.
- **Problems found and fixed:** M3-63 (stored scores) and M3-64 (missing must-have without a warning) fixed; M3-53 fully decided (spelling built in S06).


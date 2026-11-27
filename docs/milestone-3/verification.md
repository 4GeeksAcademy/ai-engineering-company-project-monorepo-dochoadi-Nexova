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


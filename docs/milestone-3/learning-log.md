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

**Commit:** `[M3-S01] docs: start Milestone 3 with official briefing, evaluation matrix, decisions, conventions and issue logs`

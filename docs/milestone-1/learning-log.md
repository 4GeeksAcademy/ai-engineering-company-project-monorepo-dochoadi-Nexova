# Milestone 1 — Learning log

A plain-language log of Milestone 1 ("Monorepo AI Setup"), written for the developer.
It was written retroactively in Milestone 2 (step M2-S10) from the recorded evidence (the git history, `recap.md`, `report.md`, `verification.md`, `evaluation.md`, `instructor-feedback.md` and `memory-bank/progress.md`), because Milestone 1 had no per-step log.
Anything that was not recorded at the time says "Not recorded".

## S01 — Branch, .gitignore and evaluation matrix (2026-10-12)

**What was done**
- Created a separate workspace for the milestone (the branch `chore/hito-1-ai-setup`), so the work never happened directly on `main`.
- Filled the empty `.gitignore` with rules for secrets (`.env*` except `.env.example`, `*.pem`, `*.key`), personal files, installed libraries, builds and test output, so private files cannot be saved into the project by accident.
- Created the evaluation checklist with the 9 criteria (E1–E9) the teacher grades, all "Pending" at first. It was written in Spanish (`docs/hito-1/evaluacion.md`) and moved to English in step 3.
- The commit message is in Spanish and has no step code, because the naming convention (`[M1-S<NN>]…`) only started in step 3.

**What I learned**
- **`.gitignore`:** a list of files that git must never save. It is the first protection against publishing a secret (such as an access key) by mistake.
- **Evaluation matrix:** a table that links each grading criterion to the files that prove it and the command to check it, so nobody has to guess whether something is done.

**How to check it yourself**
- Open `.gitignore` and look for the `.env*` and `*.key` lines.
- Run `grep -cE "^\| E[1-9] \|" docs/milestone-1/evaluation.md`; it prints 9.

**Decisions or open questions**
- Decided: one place for the evidence of every criterion from day one. Lesson recorded later in `recap.md`: the commit convention should have been used from the first commit.

**Commit:** `531449b chore: gitignore y matriz de evaluación del hito 1`

## S02 — Memory bank (2026-10-12)

**What was done**
- Wrote the memory bank: 6 files in `memory-bank/` with the business context (`projectbrief.md`, `productContext.md`), the technical context (`techContext.md`, `systemPatterns.md`) and the current status (`activeContext.md`, `progress.md`). This covers criterion E1.
- Fixed a typo from the course template: the file `projectvrief.md` became `projectbrief.md`.
- Like step 1, the commit message is in Spanish and has no step code, because the naming convention only started in step 3.

**What I learned**
- **Memory bank:** a small set of notes the AI assistant reads at the start of every session. An AI assistant forgets everything between sessions; these files are its long-term memory.
- **Business vs technical context:** business context says what Nexova does and what hurts (for example the 48-hour support delay); technical context says which tools and patterns the code uses.

**How to check it yourself**
- Run `ls memory-bank/`; it lists 6 files.
- Open `memory-bank/projectbrief.md` and read the Nexova summary.

**Decisions or open questions**
- Open (found while reading `CONTEXT.md`): the Sales manager is named twice, Megan Clarke and Marcos Ibáñez. Marcos Ibáñez is used until the author confirms.

**Commit:** `89d4181 docs(memory-bank): contexto de negocio y técnico de Nexova`

## S03 — Switch the repository to English (2026-10-12)

**What was done**
- Translated the memory bank and the evaluation matrix to English; the matrix moved from `docs/hito-1/evaluacion.md` to `docs/milestone-1/evaluation.md`.
- Decided that every file, commit and pull request is in English from now on.
- First commit with the step code `[M1-S03]` in its message.

**What I learned**
- **One repository language:** mixed languages make files harder to search and review, for people and for AI assistants alike.
- **Step code in the commit message:** a label like `[M1-S03]` says which milestone and step a change belongs to, so the history reads like an index of the work.

**How to check it yourself**
- Run `git log --oneline main` and see that from `[M1-S03]` on every message is in English.

**Decisions or open questions**
- Decided: English for everything in the repository.

**Commit:** `df8dd0f [M1-S03] docs: translate memory bank and evaluation matrix to English`

## S04 — Coding-agent rules with explicit scope (2026-10-12)

**What was done**
- Wrote 7 rules for the AI assistant in `.agents/rules/`, each saying when it applies (criterion E3).
- 4 are always active (`monorepo-structure`, `git-workflow`, `security-and-data`, `memory-bank`), 2 apply only to certain folders (`uis-nextjs` for `uis/**`, `services-backend` for `services/**`), and 1 is read on request (`hr-domain-glossary`).
- Added the root `CLAUDE.md`, which tells Claude Code to load the essential instructions.

**What I learned**
- **Rule scope:** a rule says when it applies: always, only for matching files ("globs", a file-name pattern like `uis/**`), or when the assistant asks for it.
- **Why narrow scopes help:** the assistant gets the right rules at the right time instead of one huge instruction file that fills its memory.

**How to check it yourself**
- Run `ls .agents/rules/` and open `.agents/rules/uis-nextjs.md` to see its `globs:` line.

**Decisions or open questions**
- Decided: rules with explicit scope instead of one big instruction file.

**Commit:** `fd7758d [M1-S04][E3] docs(agents): add development rules with explicit scope`

## S05 — AGENTS.md delivery protocol (2026-10-12)

**What was done**
- Wrote the root `AGENTS.md`: the mandatory protocol for any AI coding assistant (Claude Code, Cursor, Copilot), covering criterion E2.
- It lists what to read at the start of a session, the ordered checks before every commit (7 steps in Milestone 1; an 8th was added in M2-S02), the commit naming, the files not to touch and when to stop and ask.
- `CLAUDE.md` loads it, so Claude Code follows the same protocol as any other tool.

**What I learned**
- **`AGENTS.md`:** a tool-neutral instruction file at the top of the project. Different AI tools read the same rules instead of each having its own habits.
- **Pre-commit workflow:** a fixed list of checks done before saving a change (lint, typecheck, build, tests, review, memory update), so quality does not depend on memory.

**How to check it yourself**
- Open `AGENTS.md` and read the section "Mandatory workflow before every commit".
- Run `cat CLAUDE.md`; it shows the `@AGENTS.md` line.

**Decisions or open questions**
- Decided: one protocol for every assistant. Its old wording "never merge your own PR" was later clarified after the instructor's feedback (see S14).

**Commit:** `d38cf3f [M1-S05][E2] docs: add AGENTS.md delivery protocol and CLAUDE.md`

## S06 — update-memory-bank skill with a check (2026-10-12)

**What was done**
- Added the skill `update-memory-bank` in `.agents/skills/update-memory-bank/` (criterion E4): one goal, documented inputs, steps and 5 acceptance criteria.
- Added `check.sh`, a script that verifies the 5 criteria and prints PASS or FAIL for each.
- "Keep the memory up to date" became a step you can check with a command instead of a good intention. The instructor later praised this skill and its `check.sh`.

**What I learned**
- **Skill:** a folder with a `SKILL.md` (goal, inputs, steps, acceptance criteria) and optional scripts that packages one repeatable task for the assistant.
- **Exit code:** a number a script returns when it ends; 0 means "all good". `check.sh` returns 0 only if every criterion passes.

**How to check it yourself**
- Run `bash .agents/skills/update-memory-bank/check.sh`; it prints PASS lines and exits 0.

**Decisions or open questions**
- Decided: own skills ship a `check.sh` so "done" is proven by a command, not by opinion.

**Commit:** `46c0452 [M1-S06][E4] feat(agents): add update-memory-bank skill with verifiable check`

## S07 — Vendored frontend-design and webapp-testing skills (2026-10-12)

**What was done**
- Copied two ready-made skills, `frontend-design` and `webapp-testing`, unchanged from Anthropic's public skills repository (Apache 2.0 licence) into `.agents/skills/`.
- Each one has a `SOURCE.md` saying where it came from, and `.agents/skills/README.md` lists all skills.
- Added a `.claude/skills` link so Claude Code finds them, and added `.claude/settings.local.json` to `.gitignore`.

**What I learned**
- **Vendored:** copied unchanged into the project from an outside source, with origin and licence written down, so the code travels with the repository and can be audited.
- **Licence:** the legal terms that say how someone else's code may be reused; keeping it next to the copy respects those terms.

**How to check it yourself**
- Open `.agents/skills/README.md` and `.agents/skills/webapp-testing/SOURCE.md`.

**Decisions or open questions**
- None.

**Commit:** `0234450 [M1-S07] chore(agents): vendor frontend-design and webapp-testing skills`

## S08 — pnpm workspace and shared company data (2026-10-12)

**What was done**
- Set up a pnpm workspace on Node 24: one repository with several packages that are installed together with one `pnpm install`.
- Fixed the template's broken `packages/shared` entry point (it pointed to an `index.ts` that did not exist).
- Wrote Nexova's company data once in `packages/shared/company.ts`, with 4 tests, so both future apps import it instead of copying it (criterion E9, part 1).

**What I learned**
- **Monorepo:** one repository holding several projects (the website, the backoffice, the shared package) that share tools and code.
- **Single source of truth:** a fact written in one place only. The briefing already contradicts itself once; copies in every app would multiply that kind of error.

**How to check it yourself**
- Run `pnpm test`; all tests pass.
- Open `packages/shared/company.ts` and find the note about the Sales manager.

**Decisions or open questions**
- Decided: company data lives only in `packages/shared` (`@repo/shared-types`).

**Commit:** `8b80584 [M1-S08][E9] chore: set up pnpm workspace and shared company data`

## S09 — Devcontainer with Node 24, Python and Playwright (2026-10-12)

**What was done**
- Rewrote `.devcontainer/devcontainer.json` for a Debian Node 24 image with Python 3.12, the GitHub command-line tool and labelled ports (3000 website, 3001 backoffice, 8000, 5678).
- Rewrote `post-create.sh`: it installs pinned pnpm, the browser for automatic tests (Playwright with Chromium) and Claude Code, and runs `uv sync` only when a `pyproject.toml` exists (the template's version failed).
- Added `.nvmrc` with `24` and renumbered the matrix for the 13-step plan.

**What I learned**
- **Devcontainer:** the development machine described as a file. GitHub Codespaces builds it in the cloud, so everyone (and every assistant) gets the same environment in minutes.
- **Why Debian, not Alpine:** Playwright's browsers need a system library (glibc) that the small Alpine images do not have.

**How to check it yourself**
- Open `.devcontainer/devcontainer.json` and look at the forwarded ports.
- Run `cat .nvmrc`; it prints 24.

**Decisions or open questions**
- At the time, the Codespace build was still to be tested by the developer; the work later moved to a Codespace built from this file.

**Commit:** `905008b [M1-S09] chore(devcontainer): pin Node 24 environment with Python and Playwright`

## S10 — Nexova corporate landing page (2026-10-12)

**What was done**
- Built the public website in `uis/website` (Next.js 16, port 3000), a faithful rebuild of the approved Claude Design export `docs/milestone-1/design/nexova-landing-v4.html` (criteria E5 and E6).
- The design went through several versions before approval; the review removed unsupported claims, fixed contrast, made endless animations stop and removed generic "AI design" patterns.
- Fixed a bug where the office photos never appeared: the code watched an element that was itself hidden by clipping.
- Saved desktop and mobile screenshots in `docs/milestone-1/screenshots/`.

**What I learned**
- **Faithful port:** rebuilding an approved design in code with the same layout, text and colours, instead of redesigning it while coding.
- **Reduced motion:** some people turn on "reduce motion" in their device; the site then skips animations and shows the final state right away.

**How to check it yourself**
- Run `pnpm dev:website` and open http://localhost:3000.
- Open `docs/milestone-1/screenshots/website-desktop.png`.

**Decisions or open questions**
- Decided: Next.js for the website (search engines need pages rendered ahead of time).
- Open: licences of the office photos and the real public contact email (a placeholder is used).

**Commit:** `f5b970d [M1-S10][E5][E6] feat(website): build Nexova corporate landing page`

## S11 — Backoffice layout and entry dashboard (2026-10-13)

**What was done**
- Built the internal backoffice in `uis/backoffice` (Next.js 16, port 3001) with its own layout: a sidebar, a top bar with a live clock and an "Operations overview" page (criteria E7 and E8).
- It shows Nexova data: support delay against the target, headcount, the 8 departments and the 2 main planned AI agents, plus the open questions about the data.
- Moved the brand colours and fonts ("design tokens") to `packages/shared/styles/tokens.css`, used by both apps; the website stayed pixel-identical.

**What I learned**
- **Design token:** a named design value, like `--color-green`, stored once. Changing the brand then means editing one file.
- **Pure function:** a calculation whose result depends only on its input, so it is easy to test. `slaGap(48, 24)` always gives the same answer.

**How to check it yourself**
- Run `pnpm dev:backoffice` and open http://localhost:3001.
- Open `docs/milestone-1/screenshots/backoffice-desktop.png`.

**Decisions or open questions**
- Decided: Next.js for the backoffice too, so both apps share one toolchain.
- Open: the stated teams add up to 110, not 120 employees; whether some team sizes include the manager; no Valencia/Miami split; who may access the backoffice and how they sign in.

**Commit:** `6bba9cb [M1-S11][E7][E8] feat(backoffice): add layout and entry dashboard with Nexova metrics`

## S12 — Monorepo conventions and template cleanup (2026-10-13)

**What was done**
- Fixed `pnpm typecheck` so it also works on a fresh copy of the project (it now generates a missing file first).
- Rewrote the root `README.md` so it describes the real project, and removed broken links; moved a misplaced sales-forecasting brief to `docs/briefs/sales-forecasting.md`.
- Updated the push rule: the assistant may upload (push) its milestone branch, never `main`, never force-push.
- Made dimmed items in the backoffice readable again (enough contrast), and wrote the verification guide `docs/milestone-1/verification.md` (criterion E9, part 2).

**What I learned**
- **Test from a clean state:** a check that only passes on your machine is not a real check; a new teammate or CI starts from zero.
- **Opacity affects everything:** making an item see-through also fades its text below readable contrast, so dim the background and outline instead.

**How to check it yourself**
- Open `docs/milestone-1/verification.md` and run a few of its commands.
- Run `pnpm typecheck`; it passes.

**Decisions or open questions**
- Open: the dataset the sales-forecasting brief needs (`data/raw/nexova_sales.csv`) does not exist.

**Commit:** `20693ce [M1-S12][E9] docs: document monorepo conventions and clean up template`

## S13 — Milestone recap skill, report and recap (2026-10-13)

**What was done**
- Added a second own skill, `milestone-recap`, with a `check.sh` that verifies the recap (6 criteria).
- Wrote the findings report for the tech lead (`docs/milestone-1/report.md`) and the learning recap (`docs/milestone-1/recap.md`).
- Completed the verification guide and opened the pull request "Milestone 1 — Monorepo AI Setup".

**What I learned**
- **Pull request:** a request to add a branch's work to `main`, where a reviewer can read the changes before they are accepted.
- **Recap:** writing down what was built, why and what went wrong turns a finished milestone into lessons for the next one.

**How to check it yourself**
- Run `bash .agents/skills/milestone-recap/check.sh 1`.
- Read `docs/milestone-1/report.md`, sections "Business-data inconsistencies" and "Action plan".

**Decisions or open questions**
- Open (carried forward): Qdrant vs pgvector for search, which AI provider to use, and Python vs TypeScript for CV scoring.

**Commit:** `ea09360 [M1-S13] docs: add milestone recap skill, milestone 1 report and recap`

## S14 — Merge into main (2026-10-13)

**What was done**
- This is not a numbered step of the plan; it is the merge commit that joined the Milestone 1 branch (pull request #1) into `main`.
- It used the earlier title format `[M1] chore: merge …`. The current rule is `[M<n>-S<last>][E1]…[E<all>] chore(release): …`; history was not rewritten to change it.
- The instructor's feedback (`docs/milestone-1/instructor-feedback.md`) praised the agent setup, especially the skill with its `check.sh`, and asked for three changes: use the branch name the brief asks for, put the briefing in `BRIEFING.md`, and review the fact that `AGENTS.md` said never to merge your own PR while the PR was merged by us.

**What I learned**
- **Merge commit:** a commit that joins a branch into `main` and keeps every step's commit visible in the history.
- **Rules must match practice:** if a written rule and what we actually do disagree, a reviewer will notice; the rule was rewritten to say exactly who may merge and when.

**How to check it yourself**
- Run `git log --oneline -1 30f8e47`.
- Open `docs/milestone-1/instructor-feedback.md` and read the "Actions" table.

**Decisions or open questions**
- Decided in Milestone 2 (from the feedback): the coding agent never merges; a PR is merged only after the instructor's recorded approval, with a merge commit and a `chore(release)` title.

**Commit:** `30f8e47 [M1] chore: merge Milestone 1 — Monorepo AI Setup (#1)`

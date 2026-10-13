# Milestone 1 recap — Monorepo AI Setup

A learning recap of Milestone 1, written with the `milestone-recap` skill from the real history (`git log origin/main..HEAD`), the [evaluation matrix](./evaluation.md), the [verification guide](./verification.md), the [findings report](./report.md) and the memory bank. It explains what we built and, above all, why.

## Milestone goal

Turn the course's empty monorepo template into a repository where coding agents can work on Nexova safely and consistently: they know the business, follow written rules and a fixed workflow, and keep the project memory up to date. On top of that base, deliver the first two screens: the public corporate website and the internal backoffice, both fed by company data defined only once.

## What we built, step by step

| Step | Commit | What it delivered | Why it matters |
| --- | --- | --- | --- |
| 1 | `531449b` | Milestone branch, a real `.gitignore` (secrets, keys, dependencies, builds, test output) and the evaluation matrix with criteria E1–E9. | Work never happens on `main`, secrets can't be committed by accident, and every criterion has a place for its evidence from day one. |
| 2 | `89d4181` | The memory bank: 6 files with business, technical and status context; the `projectvrief.md` typo fixed. | An AI agent forgets everything between sessions; these files are its long-term memory. |
| 3 | `df8dd0f` | Memory bank and matrix translated to English; English becomes the repository language. | One language for files, commits and PRs keeps the repo readable for any reviewer and any agent. |
| 4 | `fd7758d` | 7 coding-agent rules in `.agents/rules/`, each with an explicit scope; `CLAUDE.md` importing the essentials. | Rules that load only when relevant give the agent precise guidance without flooding its context. |
| 5 | `d38cf3f` | Root `AGENTS.md`: reading order, a 7-step pre-commit workflow, commit naming, protected files and stop-and-ask cases. | One protocol for every agent (Claude Code, Cursor, Copilot) instead of tool-specific habits. |
| 6 | `46c0452` | The `update-memory-bank` skill with a `check.sh` that verifies its 5 acceptance criteria. | "Keep the memory up to date" became a checkable step instead of a good intention. |
| 7 | `0234450` | Vendored `frontend-design` and `webapp-testing` skills, unchanged, with their source and licence; `.claude/skills` symlink. | The skills travel with the repo into Codespaces, and their origin is auditable. |
| 8 | `8b80584` | pnpm workspace on Node 24 and `@repo/shared-types` with Nexova's company data and 4 tests; the broken package entry point fixed. | Company facts live in one place; both apps import them instead of copying (E9, part 1). |
| 9 | `905008b` | Devcontainer on a Debian Node 24 image with Python 3.12, Playwright, GitHub CLI and the four project ports; `.nvmrc`. | Anyone (or any agent) gets the same working environment in minutes, in a Codespace or locally. |
| 10 | `f5b970d` | The corporate website in Next.js 16 on port 3000, ported faithfully from the approved Claude Design export; screenshots. | The first visible deliverable (E5, E6), and the reference for how a design is ported. |
| 11 | `6bba9cb` | The backoffice in Next.js 16 on port 3001 with its own layout and an "Operations overview"; brand tokens moved to `packages/shared`. | Shows company-relevant content (E7, E8) and proves the shared package works for two apps. |
| 12 | `20693ce` | Fresh-clone typecheck fixed, README made truthful, template leftovers cleaned up, push policy and contrast fixes, verification guide, decisions consolidated in the memory bank. | The repo now tells the truth about itself (E9, part 2), and nothing depends on chat history. |
| 13 | this commit | The `milestone-recap` skill, the findings report, this recap and the pull request. | Closes the milestone with evidence for the reviewer and lessons for the next milestone. |

Steps 1 and 2 were committed before the `[M1-S..]` naming convention was adopted (from step 3 on; step 5 wrote it into `AGENTS.md`), so their messages have no step code and are in Spanish.

## Evaluation criteria and evidence

| ID | Criterion | Where it is proven |
| --- | --- | --- |
| E1 | The memory bank contains business and technical context | `memory-bank/` (2 business, 2 technical and 2 status files), step 2. |
| E2 | `AGENTS.md` specifies at least 4 ordered steps before commit | `AGENTS.md`, "Mandatory workflow before every commit" (7 steps), loaded by `CLAUDE.md`, step 5. |
| E3 | `.agents/` contains a rule with an explicit scope | `.agents/rules/` (7 rules: 4 always active, 2 by `globs`, 1 requested by the agent), step 4. |
| E4 | The skill has a single goal, documented inputs and verifiable acceptance criteria | `.agents/skills/update-memory-bank/SKILL.md` and `check.sh` (5× PASS, exit 0), step 6. |
| E5 | `uis/website` starts without errors | `pnpm dev:website` → `GET / 200`, lint, typecheck, tests and build pass, step 10. |
| E6 | `/` renders a complete corporate website aligned with `CONTEXT.md` | `uis/website/` and `docs/milestone-1/screenshots/website-*.png`, step 10. |
| E7 | `uis/backoffice` exists, has its own layout and renders without errors | `uis/backoffice/app/layout.tsx`, `pnpm dev:backoffice` → `GET / 200`, step 11. |
| E8 | The backoffice shows company-relevant content on screen | The "Operations overview" and `docs/milestone-1/screenshots/backoffice-*.png`, step 11. |
| E9 | Application code follows the folder conventions without unnecessary duplication | Company data (step 8) and brand tokens (step 11) defined once in `packages/shared`; the step 12 audit. |

Every row, with its exact commands and expected output, is in the [evaluation matrix](./evaluation.md); the [verification guide](./verification.md) re-checks each step.

## Key decisions and their reasons

- **Marcos Ibáñez as Sales manager.** The briefing names two people; the detailed department profile and the forecasting brief agree on Marcos, so we use him and keep the question open instead of guessing silently.
- **13 steps, one commit per step, with evaluation codes in the message.** Each commit maps to one step and the criteria it covers, so a reviewer can follow the milestone in `git log`.
- **English for everything.** Mixed languages made the early files harder to search and review.
- **Rules with explicit scope instead of one big instruction file.** Always-active rules hold what applies everywhere; `globs` rules load only for `uis/**` or `services/**`; the domain glossary loads on request. The agent gets the right rules at the right time.
- **Company data and brand tokens defined once in `packages/shared`.** The briefing already contradicts itself once; copies in each app would multiply that kind of error.
- **Node 24 on a Debian (glibc) image.** Playwright's browsers need glibc, and the same base will be used for future server images.
- **Next.js for both UIs, not Vite for the backoffice.** The website needs server rendering for SEO; one stack for both keeps one toolchain, one set of conventions and shared code.
- **Port the approved design faithfully.** The design was reviewed and approved in Claude Design; porting it, not redesigning it in code, keeps that result. Deviations are deliberate and listed in each app's README.
- **`node:test` instead of a test framework.** No extra dependency, fast, and enough for pure logic.
- **The agent may push its milestone branch, never `main`.** Once the work moved to a Codespace with credentials, manual pushes were only friction; the safety lines (no `main`, no force-push, no self-merge) stayed.

## Problems we hit and how we solved them

| Symptom | Cause | Fix | Lesson |
| --- | --- | --- | --- |
| The agent could not run Node or push in the first sessions. | It ran in a sandbox without Node or git credentials. | Moved to a Codespace built from our own devcontainer (step 9). | Fix the environment early; workarounds cost more every step. |
| `post-create.sh` failed on `uv sync`. | The template ran it unconditionally, but there is no `pyproject.toml` yet. | Run `uv sync` only when the file exists (step 9). | Setup scripts must tolerate a repo that is still growing. |
| `pnpm install` refused to run two packages' build scripts. | pnpm 12 blocks dependency build scripts unless approved. | `allowBuilds` lists `sharp` and `unrs-resolver` as `false`; both ship prebuilt binaries (step 10). | Read why a tool blocks something before allowing it. |
| `next dev` created an `AGENTS.md` inside the app. | Next.js 16 writes its own agent rules by default. | `agentRules: false` in `next.config.ts` (steps 10 and 11). | Tools now write files for AI agents too; keep one source of rules. |
| The office photos never appeared on the landing page. | The design observed a `<figure>` clipped with `clip-path: inset(100%)`, which never counts as intersecting. | Observe the wrapper and animate the figure (step 10). | Never observe an element that is itself clipped away. |
| `pnpm typecheck` failed on a fresh clone. | `next-env.d.ts` is generated and gitignored. | `typecheck` runs `next typegen` first (step 12). | Always test a check from a clean state, as CI and new teammates would. |
| Dimmed needs in the backoffice were hard to read. | 35 % opacity also dimmed the text below AA contrast. | Dim the fill and outline instead, keeping the text colour (step 12). | Opacity affects everything, including text. |
| The root README described an empty template. | It was never updated as the repo grew. | Rewrote "Current status" and removed broken links (step 12). | Documentation is part of the deliverable; stale docs mislead agents too. |

## Concepts learned

- **Memory bank.** A small set of Markdown files (`memory-bank/`) that the agent reads at the start of every session and updates after every change: what the business is, what the stack is, which patterns are mandatory, what is in progress. It replaces the memory an agent does not have between sessions.
- **`AGENTS.md`.** A tool-neutral instruction file at the repo root. Claude Code reads it through `CLAUDE.md`; other agents read it directly. It holds the protocol: what to read first, what to check before committing, what never to do.
- **Rule scopes.** Each rule in `.agents/rules/` says when it applies: always (`alwaysApply: true`), only for matching files (`globs`, e.g. `uis/**`), or when the agent asks for it (described by its `description`). Narrow scopes keep the agent's context focused.
- **Skills.** A folder with a `SKILL.md` (goal, inputs, steps, acceptance criteria) and optional scripts. Ours ship a `check.sh` so "done" can be verified by a command, not by opinion.
- **`.agents/` vs `/agents`.** `.agents/` configures the coding agent that builds this repo and is never shipped. `/agents` (and `/skills`) is Nexova product code: the AI agents Nexova's teams will use.
- **pnpm monorepo and workspace packages.** One repository, several packages (`uis/website`, `uis/backoffice`, `packages/shared`) declared in `pnpm-workspace.yaml`. An app depends on `"@repo/shared-types": "workspace:*"`, so it always uses the local copy, and one `pnpm install` links everything.
- **Next.js vs Vite.** Vite builds fast single-page apps that render in the browser. Next.js can render on the server or ahead of time, which search engines need. The website needs that; the backoffice does not, but one stack is easier to maintain.
- **Design tokens.** Named design values (colours, fonts, radii, shadows, easings) stored as CSS variables, e.g. `--color-green`. Components use `var(--color-green)` instead of raw values, so a brand change happens in one file (`packages/shared/styles/tokens.css`).
- **Pure functions and `node:test`.** A pure function returns the same output for the same input and touches nothing else (no DOM, no clock). `slaGap(48, 24)` always gives `{ hours: 24, percent: 100, breached: true }`, so it is trivial to test with Node's built-in test runner.
- **Conventional commits with evaluation codes.** `[M1-S11][E7][E8] feat(backoffice): …` says the milestone and step, which criteria the commit covers, the type of change and its scope. The history becomes an index of the work.
- **Codespaces and devcontainers.** A devcontainer (`.devcontainer/devcontainer.json`) describes the development machine as code: base image, tools, ports, setup script. GitHub Codespaces builds it in the cloud, so everyone gets the same environment.
- **`IntersectionObserver` and `clip-path`.** `IntersectionObserver` tells you when an element enters the viewport, which is how scroll reveals work. `clip-path: inset(100%)` hides an element by clipping all of it, which also means it never counts as visible, so observe its parent.
- **Reduced motion.** Some people get dizzy or distracted by animation and set "reduce motion" in their OS. `prefers-reduced-motion: reduce` lets the page skip animations and show final values right away; both apps honour it.

## What I would do differently

- **Fix the environment first.** Starting in a sandbox without Node or credentials cost manual pushes and workarounds; building the devcontainer in step 1 would have avoided them.
- **Adopt the commit convention from the first commit.** Steps 1 and 2 have no step code because the convention was only adopted in step 3.
- **Write the verification guide as each step is done**, not at the end; the commands were already in each step's checks.
- **Put brand tokens in `packages/shared` from the start**, instead of moving them out of the website one step later.
- **Run checks from a clean clone early.** The `next-env.d.ts` problem would have shown up in step 10.

## Open questions carried forward

- **Sales manager:** Megan Clarke or Marcos Ibáñez (Marcos used until confirmed).
- **Team sizes:** whether Training (12), HR (4) and Technology (6) include their managers; no size for Executive and Marketing; stated teams add up to 110 of 120.
- **Office headcount split** between Valencia and Miami.
- **Office photo licences** for the landing page images.
- **The real public contact email** (a placeholder is used).
- **Backoffice authentication:** who may access it and how they sign in.
- **Missing dataset** for the sales-forecasting brief (`data/raw/nexova_sales.csv`).
- **Technical decisions:** Qdrant vs pgvector; the LLM provider; Python vs TypeScript for CV scoring.

## Glossary

| Term | Meaning in this milestone |
| --- | --- |
| Memory bank | The 6 files in `memory-bank/` that give an agent persistent project context. |
| `AGENTS.md` | Root instruction file for any coding agent: the operating protocol of this repo. |
| Rule scope | When a rule applies: always, by file `globs`, or on request. |
| Skill | A folder with `SKILL.md` and scripts that packages one repeatable task for an agent. |
| `check.sh` | A skill's verification script: prints PASS/FAIL per criterion and exits 0 only if all pass. |
| Vendored | Copied unchanged into the repo from an external source, with origin and licence recorded. |
| Workspace package | A package inside the monorepo, linked with `workspace:*` instead of downloaded. |
| `@repo/shared-types` | The shared package in `packages/shared`: company data, types and brand tokens. |
| Design token | A named design value stored as a CSS variable. |
| Claude Design export | A self-unpacking HTML bundle of an approved design, kept in `docs/milestone-<n>/design/`. |
| Faithful port | Rebuilding an approved design in Next.js with the same layout, copy, tokens and behaviour. |
| Devcontainer | The development environment described as code in `.devcontainer/`. |
| Codespace | A cloud development machine built by GitHub from the devcontainer. |
| `node:test` | Node's built-in test runner, used without extra dependencies. |
| Pure function | A function whose output depends only on its input, with no side effects. |
| Scroll-spy | Highlighting the navigation item of the section currently in view. |
| `prefers-reduced-motion` | The CSS media feature that reflects the user's "reduce motion" setting. |
| WCAG AA | The accessibility contrast level the UIs meet: 4.5:1 for normal text. |
| Evaluation criterion | One of E1–E9, the milestone's grading points in `evaluation.md`. |
| Level 1 / Level 2 | Ticket resolution by the AI agent / by a human support agent (future HelpDesk agent). |

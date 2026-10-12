# Progress

Type: status

## Current state

Monorepo infrastructure under construction (Milestone 1, step 8 of 12). No business feature has been implemented yet: no agents, no API, no dashboards.

## Done

- **2026-10-12 — Step 1:** created branch `chore/hito-1-ai-setup` from `main`; `.gitignore` covering secrets (`.env*` except `.env.example`, `*.pem`, `*.key`), personal files (`*.rtf`), dependencies, builds and test artifacts; milestone evaluation matrix in `docs/milestone-1/evaluation.md` (criteria E1–E9).
- **2026-10-12 — Step 2:** complete memory bank with business context (`projectbrief.md`, `productContext.md`), technical context (`techContext.md`, `systemPatterns.md`) and status (`activeContext.md`, `progress.md`); fixed the `projectvrief.md` → `projectbrief.md` typo; E1 row of the matrix updated.
- **2026-10-12 — Step 3:** Repository language switched to English; files from steps 1–2 translated.
- **2026-10-12 — Step 4:** 7 coding-agent rules in `.agents/rules/` with explicit scope (4 always active: `monorepo-structure`, `git-workflow`, `security-and-data`, `memory-bank`; 2 by file pattern: `uis-nextjs` for `uis/**`, `services-backend` for `services/**`; 1 requested by the agent: `hr-domain-glossary`); root `CLAUDE.md` importing `AGENTS.md` and `git-workflow.md`; E3 row of the matrix updated.
- **2026-10-12 — Step 5:** root `AGENTS.md` written as the mandatory protocol for any coding agent: session start reading order, 7-step pre-commit workflow, commit naming, protected files, stop-and-ask cases, never list and a map of where things are; loaded through `CLAUDE.md`; E2 row of the matrix updated.
- **2026-10-12 — Step 6 (`M1-S06`):** `update-memory-bank` skill added in `.agents/skills/update-memory-bank/` (`SKILL.md` with goal, inputs, steps and 5 acceptance criteria; `check.sh` verifying them); "added in step 6" notes removed from `AGENTS.md` and `.agents/rules/memory-bank.md`; E4 row of the matrix updated.
- **2026-10-12 — Step 7 (`M1-S07`):** vendored `frontend-design` and `webapp-testing` unchanged from `https://github.com/anthropics/skills` (commit `dbd4588f9e10`, Apache 2.0) into `.agents/skills/`, each with a `SOURCE.md`; `.agents/skills/README.md` catalogue; `.claude/skills` symlink to `../.agents/skills`; `.claude/settings.local.json` added to `.gitignore`.
- **2026-10-12 — Step 8 (`M1-S08`):** pnpm 12.11.2 workspace on Node 24.18.1 (root `package.json`, `pnpm-workspace.yaml`, `pnpm-lock.yaml`, `tsconfig.base.json`, TypeScript 5.9.3); `packages/shared` entry point fixed (`index.ts` now exists) and Nexova company data added in `company.ts` with typed exports and 4 `node:test` tests; `packages/README.md` and `packages/shared/README.md` updated; `AGENTS.md` pre-commit step 2 no longer mentions the pre-workspace fallback; E9 row of the matrix updated (part 1 of 2).

## Pending

- Step 9 onwards: `uis/website`, `uis/backoffice`, and a final review of conventions and of the evaluation matrix.

## Known issues

- **Push without credentials:** `git push` fails with `could not read Username for 'https://github.com'`; the environment needs GitHub credentials. Milestone commits stay local until then.
- The coding agent cannot push from this environment (no GitHub credentials); the developer pushes manually after each step.
- **Container is not the declared devcontainer:** this environment is Alpine Linux 3.23, not the `universal:2` image in `.devcontainer/devcontainer.json`, and had no Node.js. Node 24.18.1 and npm were installed with `sudo apk add nodejs npm`, Corepack with `sudo npm i -g corepack`, and pnpm 12.11.2 through Corepack (2026-10-12, approved by the developer). A rebuilt container may need the same.
- **Outdated `README.md`:** it links to `README.es.md`, which does not exist at the root, and states there is no root `AGENTS.md`, when there is one.
- **`CONTEXT-Nexova.en.md` is not the company context:** it is the brief for a sales forecasting exercise (XGBoost / Random Forest on `data/raw/nexova_sales.csv`); the company context is `CONTEXT.md`.
- **`.devcontainer/post-create.sh` fails:** it runs `uv sync` under `set -euo pipefail`, but there is no `pyproject.toml` in the repo.

# Progress

Type: status

## Current state

Monorepo infrastructure under construction (Milestone 1, step 5 of 12). No business feature has been implemented yet: no agents, no API, no dashboards.

## Done

- **2026-10-12 — Step 1:** created branch `chore/hito-1-ai-setup` from `main`; `.gitignore` covering secrets (`.env*` except `.env.example`, `*.pem`, `*.key`), personal files (`*.rtf`), dependencies, builds and test artifacts; milestone evaluation matrix in `docs/milestone-1/evaluation.md` (criteria E1–E9).
- **2026-10-12 — Step 2:** complete memory bank with business context (`projectbrief.md`, `productContext.md`), technical context (`techContext.md`, `systemPatterns.md`) and status (`activeContext.md`, `progress.md`); fixed the `projectvrief.md` → `projectbrief.md` typo; E1 row of the matrix updated.
- **2026-10-12 — Step 3:** Repository language switched to English; files from steps 1–2 translated.
- **2026-10-12 — Step 4:** 7 coding-agent rules in `.agents/rules/` with explicit scope (4 always active: `monorepo-structure`, `git-workflow`, `security-and-data`, `memory-bank`; 2 by file pattern: `uis-nextjs` for `uis/**`, `services-backend` for `services/**`; 1 requested by the agent: `hr-domain-glossary`); root `CLAUDE.md` importing `AGENTS.md` and `git-workflow.md`; E3 row of the matrix updated.
- **2026-10-12 — Step 5:** root `AGENTS.md` written as the mandatory protocol for any coding agent: session start reading order, 7-step pre-commit workflow, commit naming, protected files, stop-and-ask cases, never list and a map of where things are; loaded through `CLAUDE.md`; E2 row of the matrix updated.

## Pending

- Step 6 onwards: `update-memory-bank` skill, pnpm workspace with `packages/shared`, `uis/website`, `uis/backoffice`, and a final review of conventions and of the evaluation matrix.

## Known issues

- **Push without credentials:** `git push` fails with `could not read Username for 'https://github.com'`; the environment needs GitHub credentials. Milestone commits stay local until then.
- The coding agent cannot push from this environment (no GitHub credentials); the developer pushes manually after each step.
- **Broken `packages/shared/package.json`:** `main` and `types` point to `index.ts` at the package root, but the real file is `packages/shared/types/index.ts`.
- **Outdated `README.md`:** it links to `README.es.md`, which does not exist at the root, and states there is no root `AGENTS.md`, when there is one.
- **`CONTEXT-Nexova.en.md` is not the company context:** it is the brief for a sales forecasting exercise (XGBoost / Random Forest on `data/raw/nexova_sales.csv`); the company context is `CONTEXT.md`.
- **`.devcontainer/post-create.sh` fails:** it runs `uv sync` under `set -euo pipefail`, but there is no `pyproject.toml` in the repo.

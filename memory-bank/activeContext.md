# Active Context

Type: status

## Current focus

**Milestone 1 — Monorepo AI Setup**, on branch `chore/hito-1-ai-setup`. The monorepo infrastructure is being prepared for working with coding agents; there are no business features yet. The evidence matrix is in `docs/milestone-1/evaluation.md`.

## Next steps

1. **Step 9 (next):** `uis/website`, the Nexova corporate website landing page in Next.js on port 3000 (E5, E6), importing company data from `@repo/shared-types`.
2. `uis/backoffice`: internal application with its own layout on port 3001 (E7, E8).

Done in step 4: coding-agent rules in `.agents/rules/`, with explicit scope (E3).
Done in step 5: root `AGENTS.md` with a 7-step pre-commit workflow (E2).
Done in step 6: `update-memory-bank` skill in `.agents/skills/update-memory-bank/`, whose `check.sh` verifies its 5 acceptance criteria (E4). From now on, run it before every commit (step 5 of the `AGENTS.md` workflow).
Done in step 7: vendored the external skills `frontend-design` (visual direction, for steps 9 and 10) and `webapp-testing` (Playwright checks and PR screenshots) from `anthropics/skills`, both Apache 2.0, unchanged. `webapp-testing` writes outputs inside the repo under `test-results/`, never to `/tmp` (see its `SOURCE.md`).
Done in step 8: pnpm workspace (`uis/*`, `packages/*`) and Nexova company data defined once in `packages/shared/company.ts`, exported by `@repo/shared-types` (E9, part 1 of 2).

## Recent decisions

- **Sales manager = Marcos Ibáñez.** Source: the detailed department profile in `CONTEXT.md` ("Sales and Business Development" section, line 62), which matches the forecasting brief `CONTEXT-Nexova.en.md`. This is the name used throughout the memory bank and the code. `CONTEXT.md` is not modified.
- **Repository language: English** (all files, commits and PRs from step 3 on).
- **`webapp-testing` vendored unchanged** despite hardcoded output paths outside the repo in its examples and `SKILL.md`; approved by the developer on 2026-10-12, with usage notes in `.agents/skills/webapp-testing/SOURCE.md`.

## Open questions

- **Sales contradiction in `CONTEXT.md`:** the general description (line 24) names **Megan Clarke** as head of the 18-person team, while the department profile (line 62) names **Marcos Ibáñez**. The decision is to use Marcos Ibáñez, but it still needs to be confirmed with the author of the context whether Megan Clarke is an error or has another role.
- **`data/raw/nexova_sales.csv` is missing:** the forecasting brief (`CONTEXT-Nexova.en.md`) assumes it exists, with 120 `consolidated` rows from 2016-01 to 2025-12, but it is not in the repo. It must be obtained or generated with `random_state=42` before tackling that deliverable.
- **Open technical decisions** (details in `techContext.md`): Qdrant versus pgvector; Python versus TypeScript for CV scoring; LLM provider (Anthropic or OpenAI).

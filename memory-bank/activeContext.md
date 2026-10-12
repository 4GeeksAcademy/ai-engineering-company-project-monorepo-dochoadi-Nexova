# Active Context

Type: status

## Current focus

**Milestone 1 — Monorepo AI Setup**, on branch `chore/hito-1-ai-setup`. The monorepo infrastructure is being prepared for working with coding agents; there are no business features yet. The evidence matrix is in `docs/milestone-1/evaluation.md`.

## Next steps

1. **Step 7 (next):** vendor the external skills.
2. pnpm workspace and shared Nexova data in `packages/shared` (E9).
3. `uis/website`: Nexova corporate website in Next.js on port 3000 (E5, E6).
4. `uis/backoffice`: internal application with its own layout on port 3001 (E7, E8).

Done in step 4: coding-agent rules in `.agents/rules/`, with explicit scope (E3).
Done in step 5: root `AGENTS.md` with a 7-step pre-commit workflow (E2).
Done in step 6: `update-memory-bank` skill in `.agents/skills/update-memory-bank/`, whose `check.sh` verifies its 5 acceptance criteria (E4). From now on, run it before every commit (step 5 of the `AGENTS.md` workflow).

## Recent decisions

- **Sales manager = Marcos Ibáñez.** Source: the detailed department profile in `CONTEXT.md` ("Sales and Business Development" section, line 62), which matches the forecasting brief `CONTEXT-Nexova.en.md`. This is the name used throughout the memory bank and the code. `CONTEXT.md` is not modified.
- **Repository language: English** (all files, commits and PRs from step 3 on).

## Open questions

- **Sales contradiction in `CONTEXT.md`:** the general description (line 24) names **Megan Clarke** as head of the 18-person team, while the department profile (line 62) names **Marcos Ibáñez**. The decision is to use Marcos Ibáñez, but it still needs to be confirmed with the author of the context whether Megan Clarke is an error or has another role.
- **`data/raw/nexova_sales.csv` is missing:** the forecasting brief (`CONTEXT-Nexova.en.md`) assumes it exists, with 120 `consolidated` rows from 2016-01 to 2025-12, but it is not in the repo. It must be obtained or generated with `random_state=42` before tackling that deliverable.
- **Open technical decisions** (details in `techContext.md`): Qdrant versus pgvector; Python versus TypeScript for CV scoring; LLM provider (Anthropic or OpenAI).

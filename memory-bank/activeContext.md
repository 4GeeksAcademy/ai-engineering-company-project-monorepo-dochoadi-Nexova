# Active Context

Type: status

## Current focus

**Milestone 1 — Monorepo AI Setup is complete** (branch `chore/hito-1-ai-setup`, pull request to `main` awaiting review). There are no business features yet. Evidence: `docs/milestone-1/evaluation.md`; findings for the tech lead: `docs/milestone-1/report.md`; learning recap: `docs/milestone-1/recap.md`.

## Next steps

1. **Next milestone: to be defined.** Its first step should be the **development-infrastructure step**: Docker inside the Codespace (docker-in-docker devcontainer feature), a root `docker-compose.yml` with Postgres + pgvector, a `.env.example` and secrets through Codespaces secrets (details and priorities in the action plan of `docs/milestone-1/report.md`).
2. Then: the FastAPI skeleton in `services/api/`, the L1 HelpDesk Support Agent with an evaluation set in `data/eval/`, and CI on GitHub Actions.
3. At the end of every milestone, run the `milestone-recap` skill before opening the pull request.

Done in step 4: coding-agent rules in `.agents/rules/`, with explicit scope (E3).
Done in step 5: root `AGENTS.md` with a 7-step pre-commit workflow (E2).
Done in step 6: `update-memory-bank` skill in `.agents/skills/update-memory-bank/`, whose `check.sh` verifies its 5 acceptance criteria (E4). From now on, run it before every commit (step 5 of the `AGENTS.md` workflow).
Done in step 7: vendored the external skills `frontend-design` (visual direction, for steps 10 and 11) and `webapp-testing` (Playwright checks and PR screenshots) from `anthropics/skills`, both Apache 2.0, unchanged. `webapp-testing` writes outputs inside the repo under `test-results/`, never to `/tmp` (see its `SOURCE.md`).
Done in step 8: pnpm workspace (`uis/*`, `packages/*`) and Nexova company data defined once in `packages/shared/company.ts`, exported by `@repo/shared-types` (E9, part 1 of 2).
Done in step 9: devcontainer pinned to Node 24 (`javascript-node:24`) with Python 3.12, GitHub CLI, Playwright and Claude Code; `.nvmrc`; plan extended to 13 steps.
Done in step 10: `uis/website` corporate landing page in Next.js 16.4, rebuilt from the approved design `docs/milestone-1/design/nexova-landing-v4.html` (E5, E6). Work now runs in the GitHub Codespace, and the coding agent pushes after each step.
Done in step 11: `uis/backoffice` internal operations overview on port 3001, rebuilt from the approved design `docs/milestone-1/design/nexova-backoffice.html` with all data from `@repo/shared-types` (E7, E8); brand tokens moved to `packages/shared/styles/tokens.css` and imported by both apps (E9 note).
Done in step 12: conventions and cleanup (E9, part 2 of 2): `typecheck` works on a fresh clone (`next typegen`), root `README.md` describes the real state, the forecasting brief moved to `docs/briefs/sales-forecasting.md`, template leftovers documented, push policy updated, backoffice dimmed needs keep AA contrast, verification guide in `docs/milestone-1/verification.md`, and every planning decision recorded in this memory bank.
Done in step 13: `milestone-recap` skill, findings report (`docs/milestone-1/report.md`), learning recap (`docs/milestone-1/recap.md`) and the Milestone 1 pull request.

## Recent decisions

- **Sales manager = Marcos Ibáñez.** Source: the detailed department profile in `CONTEXT.md` ("Sales and Business Development" section, line 62), which matches the forecasting brief `docs/briefs/sales-forecasting.md`. This is the name used throughout the memory bank and the code. `CONTEXT.md` is not modified.
- **Milestone 1 has 13 steps:** 9 devcontainer, 10 website, 11 backoffice, 12 conventions and cleanup, 13 final report and PR.
- **Node 24 on a glibc image** for development, devcontainer and the future VPS Docker images, to match production.
- **Repository language: English** (all files, commits and PRs from step 3 on).
- **The approved design is the website's source of truth:** `docs/milestone-1/design/nexova-landing-v4.html` is rebuilt faithfully, not redesigned. Deliberate deviations: footer links are 44px tall (36px in the design) to meet the touch-target floor, focus rings turn dark green on coral backgrounds, and the marquee is fully `aria-hidden`.
- **`webapp-testing` vendored unchanged** despite hardcoded output paths outside the repo in its examples and `SKILL.md`; approved by the developer on 2026-10-12, with usage notes in `.agents/skills/webapp-testing/SOURCE.md`.

## Open questions

- **Backoffice authentication:** `uis/backoffice` has no sign-in yet ("Internal tool. Sign-in comes later."). Who may access it, and with which identity provider (e.g. Google Workspace, which Nexova already uses), is still to be decided; it must not be exposed publicly until then.
- **Sales contradiction in `CONTEXT.md`:** the general description (line 24) names **Megan Clarke** as head of the 18-person team, while the department profile (line 62) names **Marcos Ibáñez**. The decision is to use Marcos Ibáñez, but it still needs to be confirmed with the author of the context whether Megan Clarke is an error or has another role.
- **`data/raw/nexova_sales.csv` is missing:** the forecasting brief (`docs/briefs/sales-forecasting.md`) assumes it exists, with 120 `consolidated` rows from 2016-01 to 2025-12, but it is not in the repo. It must be obtained or generated with `random_state=42` before tackling that deliverable.
- **Office photo licences:** the licence of `valencia.jpg` and `miami.jpg` (in `docs/milestone-1/design/` and `uis/website/public/images/`) is not confirmed. The Miami photo shows identifiable people, so its use also needs their consent or a licence that covers it, or a replacement image.
- **Public contact email:** the website uses the placeholder `hello@nexova.example` (`CONTACT_EMAIL` in `uis/website/content/home.ts`) until Nexova confirms the real address.
- **Office headcount split:** the briefing does not say how the 120 employees divide between Valencia and Miami; the backoffice lists it as an open question instead of inventing it.
- **Open technical decisions** (details in `techContext.md`): Qdrant versus pgvector; the LLM provider (Anthropic or OpenAI); Python versus TypeScript for CV scoring.

# Active Context

Type: status

## Current focus

**Milestone 2 — Your Company's Public Website** (branch `milestone-your-companys-public-website`, from `main`). Goal: Nexova's first public digital touchpoint, built from the official [`BRIEFING.md`](../BRIEFING.md) at the repo root: a landing page plus a separate talent pool application form, in plain HTML + compiled Tailwind CSS + vanilla JavaScript, responsive, WCAG 2.2 AA, SEO with Schema.org, full JavaScript form validation and a simulated submission (no backend). Evidence matrix: `docs/milestone-2/evaluation.md` (E1–E30, deliverables L/A/S, standards P1–P5). The M1 Next.js apps in `uis/` are not touched.

**Milestone 1 — Monorepo AI Setup is complete and merged** into `main` on 2026-10-13 as PR #1 (merge commit `30f8e47`). Evidence: `docs/milestone-1/evaluation.md`; report: `docs/milestone-1/report.md`; recap: `docs/milestone-1/recap.md`; instructor feedback and the actions taken: [`docs/milestone-1/instructor-feedback.md`](../docs/milestone-1/instructor-feedback.md).

## Next steps

1. **S02:** CISO security gate and accessibility gate (WCAG 2.2 AA), plus the pinned dev MCP servers (`@playwright/mcp`, `chrome-devtools-mcp`, `@upstash/context7-mcp`).
2. **S03:** compiled Tailwind CSS v4 (`tailwindcss` + `@tailwindcss/cli` 4.3.3) and the `npx http-server` 14.1.1 command on port 8080 (E7, E9, E11).
3. **S04–S06:** landing page, application form markup, `validation.js` (English + Spanish).
4. **S07–S08:** accessibility, security and performance re-check; PageSpeed/Lighthouse evidence on the public Codespaces URL.
5. **S10–S11:** milestone recap (`milestone-recap` skill), pull request; merge only after the instructor's approval (rule in `.agents/rules/git-workflow.md`).
6. Every step appends its section to `docs/milestone-2/learning-log.md` before committing.

## Milestone 1 history

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

- **Milestone 2 briefing:** the official 4Geeks `BRIEFING.md` (repo `4GeeksAcademy/ai-engineering-syllabus`, commit `ae89516`, SHA-256 checked) at the root, never edited, with the official Spanish copy in `docs/milestone-2/BRIEFING.es.md`. The only deliberate differences from its text are listed in `docs/milestone-2/content-decisions.md` (e.g. "Spanish and US markets" instead of "Latin American market"; plain URLs in the JSON-LD).
- **Branch-name and merge rules (from the M1 instructor feedback):** the milestone branch uses the name the brief asks for, or the milestone title in lowercase with hyphens; the coding agent never merges a PR, which is merged only after the instructor's recorded approval, with "Create a merge commit" and a `[M<n>-S<last>][E1]…[E<all>] chore(release): …` title.
- **Bilingual site:** English (base language) at the root, Spanish under `es/`; option `value`s identical in both languages.
- **Root location:** the public site lives at the repo root because the brief requires it (documented exception in `.agents/rules/monorepo-structure.md`); `uis/website` stays as the M1 company-facing landing prototype.
- **Compiled Tailwind CSS v4** for the root site only, served with `npx http-server` on port 8080; the M1 Next.js apps keep CSS Modules.
- **Form fields:** exactly the 11 fields of `BRIEFING.md`, no extra fields.
- **Static hero:** no CV cascade animation on the root site.
- **Sales manager = Marcos Ibáñez.** Source: the detailed department profile in `CONTEXT.md` ("Sales and Business Development" section, line 62), which matches the forecasting brief `docs/briefs/sales-forecasting.md`. This is the name used throughout the memory bank and the code. `CONTEXT.md` is not modified.
- **Milestone 1 has 13 steps:** 9 devcontainer, 10 website, 11 backoffice, 12 conventions and cleanup, 13 final report and PR.
- **Node 24 on a glibc image** for development, devcontainer and the future VPS Docker images, to match production.
- **Repository language: English** (all files, commits and PRs from step 3 on); the root public site adds Spanish pages under `es/`.
- **The approved design is the website's source of truth:** `docs/milestone-1/design/nexova-landing-v4.html` is rebuilt faithfully, not redesigned. Deliberate deviations: footer links are 44px tall (36px in the design) to meet the touch-target floor, focus rings turn dark green on coral backgrounds, and the marquee is fully `aria-hidden`.
- **`webapp-testing` vendored unchanged** despite hardcoded output paths outside the repo in its examples and `SKILL.md`; approved by the developer on 2026-10-12, with usage notes in `.agents/skills/webapp-testing/SOURCE.md`.

## Open questions

- **Official briefing quirks (cannot be fixed, the file stays unmodified):** `BRIEFING.md` is headed "Milestone 1: Your Company's Public Website" (the course's own numbering; in this repo it is Milestone 2), and its link to the Spanish version (`./nexova-BRIEFING.es.md`) does not resolve, because the Spanish copy lives in `docs/milestone-2/BRIEFING.es.md`.
- **Backoffice authentication:** `uis/backoffice` has no sign-in yet ("Internal tool. Sign-in comes later."). Who may access it, and with which identity provider (e.g. Google Workspace, which Nexova already uses), is still to be decided; it must not be exposed publicly until then.
- **Sales contradiction in `CONTEXT.md`:** the general description (line 24) names **Megan Clarke** as head of the 18-person team, while the department profile (line 62) names **Marcos Ibáñez**. The decision is to use Marcos Ibáñez, but it still needs to be confirmed with the author of the context whether Megan Clarke is an error or has another role.
- **`data/raw/nexova_sales.csv` is missing:** the forecasting brief (`docs/briefs/sales-forecasting.md`) assumes it exists, with 120 `consolidated` rows from 2016-01 to 2025-12, but it is not in the repo. It must be obtained or generated with `random_state=42` before tackling that deliverable.
- **Office photo licences:** the licence of `valencia.jpg` and `miami.jpg` (in `docs/milestone-1/design/` and `uis/website/public/images/`) is not confirmed. The Miami photo shows identifiable people, so its use also needs their consent or a licence that covers it, or a replacement image.
- **Public contact email:** the website uses the placeholder `hello@nexova.example` (`CONTACT_EMAIL` in `uis/website/content/home.ts`) until Nexova confirms the real address.
- **Office headcount split:** the briefing does not say how the 120 employees divide between Valencia and Miami; the backoffice lists it as an open question instead of inventing it.
- **Open technical decisions** (details in `techContext.md`): Qdrant versus pgvector; the LLM provider (Anthropic or OpenAI); Python versus TypeScript for CV scoring.

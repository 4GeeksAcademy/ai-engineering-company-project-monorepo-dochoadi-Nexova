# Active Context

Type: status

## Current focus

**Milestone 2 — Your Company's Public Website** (branch `milestone-your-companys-public-website`, from `main`). Goal: Nexova's first public digital touchpoint, built from the official [`BRIEFING.md`](../BRIEFING.md) at the repo root: a landing page plus a separate talent pool application form, in plain HTML + compiled Tailwind CSS + vanilla JavaScript, responsive, WCAG 2.2 AA, SEO with Schema.org, full JavaScript form validation and a simulated submission (no backend). Evidence matrix: `docs/milestone-2/evaluation.md` (E1–E30, deliverables L/A/S, standards P1–P5). The M1 Next.js apps in `uis/` are not touched, except the approved Next.js 16.4.1 security patch (M2-S02).

**Milestone 1 — Monorepo AI Setup is complete and merged** into `main` on 2026-10-13 as PR #1 (merge commit `30f8e47`). Evidence: `docs/milestone-1/evaluation.md`; report: `docs/milestone-1/report.md`; recap: `docs/milestone-1/recap.md`; instructor feedback and the actions taken: [`docs/milestone-1/instructor-feedback.md`](../docs/milestone-1/instructor-feedback.md).

## Next steps

1. **S07 (next): quality gates.** Re-check every criterion with all four pages finished and mark E1, E5, E6, E8, E10, E12 (and E9, E11) then; final `security-gate` and `a11y-gate` runs; keyboard and screen-reader pass; contrast, reflow and console checks (E13–E17, S4–S6).
2. **S08:** performance evidence: PageSpeed Insights (or Lighthouse) on the public Codespaces URL, score ≥ 80 (E13, L15, S3); decide whether Instrument Sans must be self-hosted for the score.
3. **S07–S08:** accessibility, security and performance re-check; PageSpeed/Lighthouse evidence on the public Codespaces URL.
4. **S09:** devcontainer: add port 8080 only; the Chromium install line for the dev MCP servers is already in `.devcontainer/post-create.sh` (added before the Codespace rebuild in M2-S02).
5. **S10–S11:** milestone recap (`milestone-recap` skill), pull request; merge only after the instructor's approval (rule in `.agents/rules/git-workflow.md`).
6. Both gates (`security-gate`, `a11y-gate`) must exit 0 before the pull request (`AGENTS.md` step 7).
7. Every step appends its section to `docs/milestone-2/learning-log.md` before committing.

## Milestone 1 history

Done in step 4: coding-agent rules in `.agents/rules/`, with explicit scope (E3).
Done in step 5: root `AGENTS.md` with the pre-commit workflow (E2), now 8 steps (step 7, `security-gate` and `a11y-gate`, added in M2-S02).
Done in step 6: `update-memory-bank` skill in `.agents/skills/update-memory-bank/`, whose `check.sh` verifies its 5 acceptance criteria (E4). From now on, run it before every commit (step 5 of the `AGENTS.md` workflow).
Done in step 7: vendored the external skills `frontend-design` (visual direction, for steps 10 and 11) and `webapp-testing` (Playwright checks and PR screenshots) from `anthropics/skills`, both Apache 2.0, unchanged. `webapp-testing` writes outputs inside the repo under `test-results/`, never to `/tmp` (see its `SOURCE.md`).
Done in step 8: pnpm workspace (`uis/*`, `packages/*`) and Nexova company data defined once in `packages/shared/company.ts`, exported by `@repo/shared-types` (E9, part 1 of 2).
Done in step 9: devcontainer pinned to Node 24 (`javascript-node:24`) with Python 3.12, GitHub CLI, Playwright and Claude Code; `.nvmrc`; plan extended to 13 steps.
Done in step 10: `uis/website` corporate landing page in Next.js 16.4, rebuilt from the approved design `docs/milestone-1/design/nexova-landing-v4.html` (E5, E6). Work now runs in the GitHub Codespace, and the coding agent pushes after each step.
Done in step 11: `uis/backoffice` internal operations overview on port 3001, rebuilt from the approved design `docs/milestone-1/design/nexova-backoffice.html` with all data from `@repo/shared-types` (E7, E8); brand tokens moved to `packages/shared/styles/tokens.css` and imported by both apps (E9 note).
Done in step 12: conventions and cleanup (E9, part 2 of 2): `typecheck` works on a fresh clone (`next typegen`), root `README.md` describes the real state, the forecasting brief moved to `docs/briefs/sales-forecasting.md`, template leftovers documented, push policy updated, backoffice dimmed needs keep AA contrast, verification guide in `docs/milestone-1/verification.md`, and every planning decision recorded in this memory bank.
Done in step 13: `milestone-recap` skill, findings report (`docs/milestone-1/report.md`), learning recap (`docs/milestone-1/recap.md`) and the Milestone 1 pull request.

## Recent decisions

- **M2-S06 validation:** `validation.js` with pure rules + a DOM layer, messages verbatim from both briefings (tested against them), `textContent` only, an error summary with focus, a simulated submission with no data leaving the browser; cache busting (`?v=<hash>`) in the `dist/` copies; the root `pnpm test` also runs the site tests. Rows E1, E5, E6, E8, E10, E12 are re-checked and marked in S07 (developer's decision).
- **M2-S05 form markup:** the 11 briefing fields with the id/name contract in `systemPatterns.md` (pattern 20); five fieldsets with `h2` legends; field borders in `green-mid` instead of `line` (WCAG 1.4.11, 3:1 for control boundaries); hints below the inputs; `method="post"` so a no-JavaScript submit never puts answers in the URL; services heading back to the briefing's "Services" / "Servicios"; absolute `hreflang` and canonical on all four pages.
- **Office photos (developer, 2026-10-23):** the project may use both office photos (Valencia and Miami), including the people visible in the Miami photo; recorded in `docs/milestone-2/content-decisions.md`.
- **M2-S04 landing page:** the briefing copy verbatim in both languages; static hero (the M1 shortlist frozen in the "placed" state, `aria-hidden`); "Why Nexova" figures emphasised in KeyFigures style; contact as a green `radius-cta` panel (coral is reserved for the hero card and the logo dot) with a cream pill CTA; transparent borders on buttons and the panel so they stay visible in forced-colors mode; office photos as 1200 px WebP; canonical to `nexova.com`; `a11y-gate` serves `dist/` like `security-gate`; the S03 deviations were approved by the developer.
- **M2-S03 site setup:** compiled Tailwind 4.3.3 (not the CDN, for PageSpeed); brand tokens imported from `packages/shared` and mapped to `brand-*` names; the server serves only the git-ignored `dist/` allowlist built by `pnpm build:site` (SEC-1); SEC-2 ignored through `auditConfig` in `pnpm-workspace.yaml` (pnpm 12 does not read the `package.json` field); `@parcel/watcher` added to `allowBuilds: false`; `security-gate` criterion 3 matches real Easypanel host URLs only; `test:site` uses a quoted glob because Node 24 rejects a folder argument; the dev MCP servers are approved and connected.
- **M2-S02 gates and tools:** `security-gate` and `a11y-gate` run before every PR; three pinned dev MCP servers in `.mcp.json` (no keys); every tool, service, API, MCP server and library must be free to use. Next.js 16.4.1 approved and applied in both M1 apps as the one exception to "report only".
- **Alpha Playwright kept on purpose:** `@playwright/mcp@0.0.83` pins `playwright@1.64.0-alpha-1790635538000` exactly, so `post-create.sh` installs Chromium with that same version (one-line comment there).

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

- **Milestone 1 baseline findings (decided after S02):** SEC-1 resolved in S03 (`dist/` allowlist); SEC-2 accepted as a documented exception (review in S10); SEC-4 fixed in S09 with the other `.devcontainer/` changes; SEC-3, SEC-5–7 and A11Y-1–6 stay in the backlog as "Planned: M1 hardening (separate change, needs approval)" (`docs/milestone-2/security.md`, `accessibility.md`).
- **Google Fonts and GDPR:** kept for now (developer's decision after S03); recorded under "Production notes" in `docs/milestone-2/security.md`: self-host Instrument Sans (OFL) before any real EU launch. S07 decides whether self-hosting is needed for PageSpeed.

- **Official briefing quirks (cannot be fixed, the file stays unmodified):** `BRIEFING.md` is headed "Milestone 1: Your Company's Public Website" (the course's own numbering; in this repo it is Milestone 2), and its link to the Spanish version (`./nexova-BRIEFING.es.md`) does not resolve, because the Spanish copy lives in `docs/milestone-2/BRIEFING.es.md`.
- **Backoffice authentication:** `uis/backoffice` has no sign-in yet ("Internal tool. Sign-in comes later."). Who may access it, and with which identity provider (e.g. Google Workspace, which Nexova already uses), is still to be decided; it must not be exposed publicly until then.
- **Sales contradiction in `CONTEXT.md`:** the general description (line 24) names **Megan Clarke** as head of the 18-person team, while the department profile (line 62) names **Marcos Ibáñez**. The decision is to use Marcos Ibáñez, but it still needs to be confirmed with the author of the context whether Megan Clarke is an error or has another role.
- **`data/raw/nexova_sales.csv` is missing:** the forecasting brief (`docs/briefs/sales-forecasting.md`) assumes it exists, with 120 `consolidated` rows from 2016-01 to 2025-12, but it is not in the repo. It must be obtained or generated with `random_state=42` before tackling that deliverable.
- **Public contact email:** the website uses the placeholder `hello@nexova.example` (`CONTACT_EMAIL` in `uis/website/content/home.ts`) until Nexova confirms the real address.
- **Office headcount split:** the briefing does not say how the 120 employees divide between Valencia and Miami; the backoffice lists it as an open question instead of inventing it.
- **Open technical decisions** (details in `techContext.md`): Qdrant versus pgvector; the LLM provider (Anthropic or OpenAI); Python versus TypeScript for CV scoring.

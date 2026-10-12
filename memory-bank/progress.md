# Progress

Type: status

## Current state

Monorepo infrastructure under construction (Milestone 1, step 10 of 13). The public corporate website (`uis/website`) is live in development; no business feature has been implemented yet: no agents, no API, no dashboards.

## Done

- **2026-10-12 — Step 1:** created branch `chore/hito-1-ai-setup` from `main`; `.gitignore` covering secrets (`.env*` except `.env.example`, `*.pem`, `*.key`), personal files (`*.rtf`), dependencies, builds and test artifacts; milestone evaluation matrix in `docs/milestone-1/evaluation.md` (criteria E1–E9).
- **2026-10-12 — Step 2:** complete memory bank with business context (`projectbrief.md`, `productContext.md`), technical context (`techContext.md`, `systemPatterns.md`) and status (`activeContext.md`, `progress.md`); fixed the `projectvrief.md` → `projectbrief.md` typo; E1 row of the matrix updated.
- **2026-10-12 — Step 3:** Repository language switched to English; files from steps 1–2 translated.
- **2026-10-12 — Step 4:** 7 coding-agent rules in `.agents/rules/` with explicit scope (4 always active: `monorepo-structure`, `git-workflow`, `security-and-data`, `memory-bank`; 2 by file pattern: `uis-nextjs` for `uis/**`, `services-backend` for `services/**`; 1 requested by the agent: `hr-domain-glossary`); root `CLAUDE.md` importing `AGENTS.md` and `git-workflow.md`; E3 row of the matrix updated.
- **2026-10-12 — Step 5:** root `AGENTS.md` written as the mandatory protocol for any coding agent: session start reading order, 7-step pre-commit workflow, commit naming, protected files, stop-and-ask cases, never list and a map of where things are; loaded through `CLAUDE.md`; E2 row of the matrix updated.
- **2026-10-12 — Step 6 (`M1-S06`):** `update-memory-bank` skill added in `.agents/skills/update-memory-bank/` (`SKILL.md` with goal, inputs, steps and 5 acceptance criteria; `check.sh` verifying them); "added in step 6" notes removed from `AGENTS.md` and `.agents/rules/memory-bank.md`; E4 row of the matrix updated.
- **2026-10-12 — Step 7 (`M1-S07`):** vendored `frontend-design` and `webapp-testing` unchanged from `https://github.com/anthropics/skills` (commit `dbd4588f9e10`, Apache 2.0) into `.agents/skills/`, each with a `SOURCE.md`; `.agents/skills/README.md` catalogue; `.claude/skills` symlink to `../.agents/skills`; `.claude/settings.local.json` added to `.gitignore`.
- **2026-10-12 — Step 8 (`M1-S08`):** pnpm 12.11.2 workspace on Node 24.18.1 (root `package.json`, `pnpm-workspace.yaml`, `pnpm-lock.yaml`, `tsconfig.base.json`, TypeScript 5.9.3); `packages/shared` entry point fixed (`index.ts` now exists) and Nexova company data added in `company.ts` with typed exports and 4 `node:test` tests; `packages/README.md` and `packages/shared/README.md` updated; `AGENTS.md` pre-commit step 2 no longer mentions the pre-workspace fallback; E9 row of the matrix updated (part 1 of 2).
- **2026-10-12 — Step 9 (`M1-S09`):** `.devcontainer/devcontainer.json` rewritten for `javascript-node:24` with Python 3.12, GitHub CLI and sshd, ports 3000/3001/8000/5678 labelled, remote user `node`, Docker socket removed; `post-create.sh` rewritten (pinned pnpm via Corepack, frozen-lockfile install, conditional `uv sync`, Playwright + Chromium, Claude Code CLI); `.nvmrc` = `24`; Step column of the evaluation matrix renumbered for the 13-step plan. Validated here: JSON parses and the script passes `bash -n`; the Codespace build is still to be tested by the developer.
- **2026-10-12 — Step 10 (`M1-S10`):** `uis/website` built in Next.js 16.4.0 (App Router, Turbopack, React 19.3, TypeScript strict extending `tsconfig.base.json`, CSS Modules, `eslint-config-next`) as a faithful rebuild of the approved design `docs/milestone-1/design/nexova-landing-v4.html` (committed with the real `valencia.jpg` and `miami.jpg`, copied to `uis/website/public/images/`): 11 section components plus shared `Button` and `Reveal`, copy in `content/home.ts`, design tokens on `:root` in `app/globals.css`, company facts from `@repo/shared-types`, JSON-LD Organization in the layout, Instrument Sans via `next/font/google`. `lib/cvField.ts` ports the hero CV-cascade field exactly (0 differences against the design's code) with 4 `node:test` tests; `lib/time.ts` gives the live Valencia and Miami clocks. Root `pnpm-workspace.yaml` gained an `allowBuilds` deny-list (`sharp`, `unrs-resolver`: false) so pnpm 12 installs without running their build scripts. Screenshots at 1440px and 375px plus the hero at 9 s in `docs/milestone-1/screenshots/`; `uis/README.md` lists the app; E5 and E6 rows of the matrix updated.

## Pending

- Step 11 backoffice, step 12 conventions and cleanup, step 13 final report and PR.
- Confirm the licence of the two office photos and the real public contact email (open questions in `activeContext.md`).

## Known issues

- **Resolved on 2026-10-12 (step 10): Alpine container and manual push.** Work now runs in a real GitHub Codespace built from the step 9 devcontainer (Debian 13, Node 24, pnpm 12.11.2, Python 3.12, `gh`), so the Alpine workarounds are no longer needed and the coding agent can `git push` itself.
- **Fixed in step 10: office photos never appeared.** In the original design export, `setupPhotos()` observed the `<figure>` it clipped with `clip-path: inset(100% …)`, which an `IntersectionObserver` never reports as intersecting. `uis/website/components/OfficePhotos.tsx` observes the grid wrapper and animates the figures; a Playwright check confirms both photos reveal on scroll.
- **`next-env.d.ts` is generated, not committed:** `pnpm --filter website typecheck` on a fresh clone needs one `next dev` or `next build` first (Next.js generates the file and the CSS-module types it references).
- **Outdated `README.md`:** it links to `README.es.md`, which does not exist at the root, and states there is no root `AGENTS.md`, when there is one.
- **`CONTEXT-Nexova.en.md` is not the company context:** it is the brief for a sales forecasting exercise (XGBoost / Random Forest on `data/raw/nexova_sales.csv`); the company context is `CONTEXT.md`.
- **Fixed in step 9:** `.devcontainer/post-create.sh` no longer fails on `uv sync` (it only runs when `pyproject.toml` exists), and the devcontainer now forwards port 3001.

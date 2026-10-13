# Milestone 1 — Findings report

Findings report for the tech lead on Milestone 1 ("Monorepo AI Setup") of the Nexova Solutions monorepo, branch `chore/hito-1-ai-setup`. The evidence for each criterion is in the [evaluation matrix](./evaluation.md), how to re-check it in the [verification guide](./verification.md), and the learning recap in [recap.md](./recap.md).

## Summary

The milestone turned the course template into a monorepo that coding agents can work in safely and consistently, and delivered the first two UIs:

- **Agent configuration:** a memory bank (`memory-bank/`), `AGENTS.md` with a 7-step pre-commit workflow, 7 rules with explicit scope in `.agents/rules/`, and three own skills plus two vendored ones in `.agents/skills/`.
- **Workspace:** a pnpm workspace on Node 24 with `@repo/shared-types` (`packages/shared`), where Nexova's company data and brand tokens are defined once.
- **Environment:** a devcontainer for GitHub Codespaces (Node 24, Python 3.12, Playwright, GitHub CLI).
- **UIs:** the corporate website (`uis/website`, port 3000) and the internal backoffice (`uis/backoffice`, port 3001), both ported faithfully from approved Claude Design exports.

| Criterion | Status |
| --- | --- |
| E1 — memory bank with business and technical context | Met (step 2) |
| E2 — `AGENTS.md` with at least 4 ordered pre-commit steps | Met (step 5) |
| E3 — at least one rule with an explicit scope | Met (step 4) |
| E4 — skill with a single goal, inputs and verifiable acceptance criteria | Met (step 6) |
| E5 — `uis/website` starts without errors | Met (step 10) |
| E6 — `/` renders a complete corporate website aligned with `CONTEXT.md` | Met (step 10) |
| E7 — `uis/backoffice` exists, has its own layout and renders without errors | Met (step 11) |
| E8 — the backoffice shows company-relevant content on screen | Met (step 11) |
| E9 — folder conventions without unnecessary duplication | Met (steps 8, 11 and 12) |

`pnpm lint`, `pnpm typecheck` (also on a fresh clone), `pnpm test` (15 tests) and `pnpm build` pass across the workspace.

## Business-data inconsistencies found in the briefing

`CONTEXT.md` is the business source of truth and was not modified; each inconsistency is handled in the shared data and recorded as an open question.

| Finding | Where | How it is handled |
| --- | --- | --- |
| **The Sales manager is named twice:** Megan Clarke in the company overview, Marcos Ibáñez in the "Sales and Business Development" department profile. | `CONTEXT.md` | Marcos Ibáñez is used (it matches the detailed profile and the forecasting brief) until the author confirms; the note is in `packages/shared/company.ts` and on the backoffice's open questions. |
| **The stated teams add up to 110, not the declared 120 employees.** | `CONTEXT.md` | The backoffice shows "110 of 120" and lists the teams without a size; it does not invent the missing 10. |
| **It is unclear whether the Training (12), HR (4) and Technology (6) team sizes include their managers.** | `CONTEXT.md` ("leads a team of 12", "with a team of four", "has a team of six") | Recorded as a `teamSizeNote` on each department and shown as open questions. |
| **No team size for Executive Direction or Marketing** ("a small team"). | `CONTEXT.md` | `teamSize: null`, shown as "Not stated". |
| **No headcount split between Valencia and Miami.** | `CONTEXT.md` | Left out on purpose; listed as an open question in the backoffice. |
| **`CONTEXT-Nexova.en.md` was not the company context** but a sales-forecasting exercise brief, and the dataset it relies on, `data/raw/nexova_sales.csv`, does not exist. | repository root | Moved to `docs/briefs/sales-forecasting.md` in step 12; the missing dataset is an open question for the milestone that uses it. |

## Mismatches between the plan and the decisions taken

| Topic | Plan | Template / decision | Status |
| --- | --- | --- | --- |
| Language of the CV–Vacancy Matching Agent | `Company-choice.md` plans it in TypeScript, end to end. | The template recommends one centralised Python + FastAPI backend in `services/`, where the support agent will also live. | Open |
| Vector store | `Company-choice.md` proposes Qdrant (native hybrid search). | pgvector would reuse the Postgres already planned for metadata, with fewer moving parts. | Open |
| LLM provider | Anthropic or OpenAI, for RAG answers, ticket summaries and CV normalisation. | Not decided. | Open |

## Template defects found and fixed

| Defect | Fixed in |
| --- | --- |
| Empty `.gitignore` (no rules for secrets, dependencies or builds) | Step 1 |
| Empty memory bank, and the `projectvrief.md` typo (renamed to `projectbrief.md`) | Step 2 |
| Empty root `AGENTS.md` | Step 5 |
| Broken `packages/shared` entry point (`main` pointed to an `index.ts` that did not exist) | Step 8 |
| The devcontainer's post-create script failed on `uv sync` without a `pyproject.toml`, and port 3001 (backoffice) was not forwarded | Step 9 |
| Broken root README links (a missing `README.es.md`) and the claim that there was no root `AGENTS.md` | Step 12 |

## Environment issues

| Issue | Effect | Resolution |
| --- | --- | --- |
| The first agent sessions ran in a sandbox without Node or git credentials. | Node had to be installed by hand and the developer pushed every step manually. | Moved to a GitHub Codespace built from the step 9 devcontainer; the agent now pushes its milestone branch (rule updated in step 12). |
| Playwright needs a glibc image. | Its browsers do not run on Alpine (musl). | The devcontainer and future images use Debian-based Node 24 images. |
| pnpm 12 blocks dependency build scripts by default. | `pnpm install` refused `sharp` and `unrs-resolver`. | `allowBuilds` in `pnpm-workspace.yaml` lists both as `false`: they ship prebuilt binaries, so no script needs to run. |
| Next.js 16 writes its own `AGENTS.md` into each app on `next dev`. | It would compete with the root `AGENTS.md`. | `agentRules: false` in both apps' `next.config.ts`. |
| `next-env.d.ts` is generated and gitignored. | `pnpm typecheck` failed on a fresh clone until `next dev` or `next build` had run once. | Fixed in step 12: `typecheck` runs `next typegen && tsc --noEmit`. |

## Design review findings (landing page)

The landing page went through several Claude Design iterations before approval (history in `memory-bank/progress.md`). The review found and fixed:

- **Unsupported claims:** copy that stated figures or results not in the briefing was reworded to what `CONTEXT.md` supports.
- **Contrast:** text and controls below WCAG AA were fixed.
- **Motion that never stopped:** animations that looped endlessly were made to settle on a final state (the hero cascade ends on the placed candidate), and every animation respects `prefers-reduced-motion`.
- **Generic AI-design tells:** templated patterns that read as generic AI design were removed in favour of a visual direction specific to Nexova's subject (CVs, placements, its two offices).
- **Photo-reveal bug:** the export observed a `<figure>` that was itself clipped with `clip-path: inset(100% …)`, which `IntersectionObserver` never reports as intersecting, so the office photos never appeared. The port observes the wrapper instead.

## Accepted deviations from the design in the ports

| App | Deviation | Reason |
| --- | --- | --- |
| Website | Footer links are 44px tall (36px in the design). | 44px touch-target floor. |
| Website | Focus rings turn dark green on coral backgrounds. | A coral ring is invisible on coral. |
| Website | The marquee is fully `aria-hidden`. | Its repeated words are decorative and would be read many times. |
| Backoffice | All data comes from `@repo/shared-types`, so department texts are the briefing's longer wording and some names differ from the design's stand-ins. | One source of truth for company data. |
| Backoffice | The sidebar contents stay in view while scrolling on wide screens. | Otherwise the scroll-spy highlight is out of sight. |
| Backoffice | Sidebar links are 44px tall (40px), and the headcount segments have a 44px-tall hit area. | Touch-target floor. |
| Backoffice | Department-card hover border uses the `--color-tan` brand token. | No one-off colour outside the token file. |
| Backoffice | Non-matching needs are dimmed with a transparent fill and a dashed outline instead of 35 % opacity (step 12). | The opacity dropped their text below AA contrast. |

## Action plan for the next milestones

| Priority | Action | Notes |
| --- | --- | --- |
| High | **Resolve the open questions**: Sales manager, team sizes and the office split, photo licences, the real contact email, backoffice authentication, and the three open technical decisions. | Several of them shape the data model of the first agent. |
| High | **Development-infrastructure step**: Docker inside the Codespace (docker-in-docker devcontainer feature), a root `docker-compose.yml` with Postgres + pgvector, a `.env.example`, and secrets through Codespaces secrets. | First step of the next milestone that needs a database. |
| High | **FastAPI skeleton in `services/api/`**: health endpoint, one router per domain, `tenant_id` filtering in the data layer from day one, and tests. | Port 8000; the single backend recorded in `services/README.md`. |
| Medium | **First agent: the L1 HelpDesk Support Agent**, with an evaluation set in `data/eval/` (Level 1 rate, groundedness, escalation correctness). | Synthetic tickets only; no real data. |
| Medium | **CI on GitHub Actions** running `pnpm lint`, `pnpm typecheck`, `pnpm test` and `pnpm build` on every pull request. | Today the checks run only locally. |
| Low | **Deployment, later, if ever needed.** | Academic project: fictional company, no real data, not published to production. |

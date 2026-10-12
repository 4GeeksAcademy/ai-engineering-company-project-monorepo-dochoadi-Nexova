# Tech Context — Nexova monorepo

Type: technical

## Monorepo stack

| Layer | Technology | Location |
| --- | --- | --- |
| Frontends | Next.js (App Router) + TypeScript in `strict` mode | `uis/website`, `uis/backoffice` |
| Runtime | Node.js 24.18.1 (`engines: >=24 <25`) | Repo root |
| JS/TS package management | pnpm 12.11.2 workspace (`packageManager` pinned, enabled via Corepack) | Repo root |
| TypeScript | 5.9.3, the only root dev dependency; shared options in `tsconfig.base.json` (`strict`, `noUncheckedIndexedAccess`, `ESNext`/`Bundler`, `verbatimModuleSyntax`, `allowImportingTsExtensions`, `noEmit`) | Repo root |
| Shared types and data | `@repo/shared-types` package | `packages/shared` |
| Backend (future) | Python + FastAPI as the company's **single API**, with one router per domain | `services/` |

## pnpm workspace

- **Layout:** `pnpm-workspace.yaml` includes `uis/*` and `packages/*`. Workspace packages: `packages/shared` and `uis/website` (package name `website`); `uis/backoffice` joins in step 11.
- **Build scripts:** pnpm 12 refuses unapproved dependency build scripts. `pnpm-workspace.yaml` lists `allowBuilds` with `sharp` and `unrs-resolver` set to `false` (both ship prebuilt binaries); any new entry needs a justification.
- **Root scripts:** `pnpm dev` (all `uis/*` apps in parallel), `pnpm dev:website`, `pnpm dev:backoffice`, and `pnpm build` / `lint` / `typecheck` / `test`, which run each package's script when it exists (`pnpm -r --if-present`).
- **Tests:** `node --test` with the native `node:test` and `node:assert` modules, no test dependency. Node 24 strips TypeScript types natively, so `*.test.ts` files run without `--experimental-strip-types`. Test files are excluded from `tsc` (`@types/node` is not installed), and imports between `.ts` files use explicit `.ts` extensions.
- **Company data:** Nexova's company data (company profile, business lines, the 8 departments, support SLA, flagship agents) lives only in `packages/shared/company.ts`, taken from `CONTEXT.md` and `Company-choice.md`, with no computed values. Apps import it from `@repo/shared-types` and must list the package in Next.js `transpilePackages`, because it ships TypeScript source.
- **TypeScript version:** 5.9.3 was chosen over 7.0.2 (`latest`, the native compiler) because Next.js type-checks through the JavaScript `typescript` API.

## Website (`uis/website`)

- **Stack:** Next.js 16.4.0 (App Router, Turbopack), React 19.3.0, TypeScript 5.9.3 `strict` (the app's `tsconfig.json` extends `tsconfig.base.json` and adds the DOM libs, JSX and the Next plugin), ESLint 9 with `eslint-config-next` 16.4.0, `@types/node` 24 for `node:test`. Styling is CSS Modules only: no CSS framework, UI kit or animation library. `next.config.ts` sets `transpilePackages: ["@repo/shared-types"]` and `agentRules: false`, so `next dev` does not write its own `AGENTS.md`; the scaffold defaults `cacheComponents` and `partialPrefetching` are kept, and `/` prerenders as static.
- **Font:** Instrument Sans through `next/font/google` (variable font covering weights 400–700), exposed as `--font-instrument-sans`.
- **Design source:** `docs/milestone-1/design/nexova-landing-v4.html`, a self-unpacking Claude Design bundle (`__bundler/manifest` with fonts and the Design runtime, `__bundler/template` with the page and a `Component` class holding the behaviour). The website ports its layout, copy, tokens and every `setup*` method and `tick()`.
- **Structure:** `app/` (layout with metadata and JSON-LD Organization, page, `globals.css` with every design token on `:root`), `components/` (one component per section, each with a CSS Module: `Header` + `MobileNav`, `Hero` + `RoleTicker` + `CvCascade`, `Marquee`, `KeyFigures` + `CountUp`, `Services`, `Process`, `Industries`, `HumanAndAi`, `About` + `OfficePhotos` + `OfficeClock`, `ContactCta`, `Footer`; shared `Button`, `Reveal`, `PulseDot`), `content/home.ts` (typed copy), `lib/` (`cvField.ts` + test, `time.ts`, `motion.ts`, `jsonLd.ts`), `public/images/` (office photos).
- **Conventions:** company facts come from `@repo/shared-types` and are interpolated into the copy, never retyped; components never use raw colour values; `"use client"` only on components with behaviour; every listener, timer, animation and observer is cleaned up on unmount; `prefers-reduced-motion` skips scroll and pointer effects and shows the hero's final state.

## Planned agent stack

According to `Company-choice.md`:

- **Agent service:** Python + FastAPI (HelpDesk Support Agent).
- **Ticket, case, candidate and vacancy metadata:** Postgres.
- **Knowledge base:** vector store with hybrid search; **Qdrant** is proposed.
- **LLM:** via API (Anthropic or OpenAI), for retrieval-grounded answers and ticket summarisation.
- **CV parsing:** text extraction + an LLM call to normalise fields into the expected schema.
- **Supervisor dashboard:** Next.js, to watch SLA risk and escalations in real time.

## Folder structure

| Folder | What goes there |
| --- | --- |
| `CONTEXT.md` | Single source of truth for the Nexova domain |
| `CLAUDE.md` | Loaded automatically by Claude Code in every session; imports `AGENTS.md` and `.agents/rules/git-workflow.md` with `@` lines and contains nothing else |
| `.agents/rules/` | Coding-agent rules, one file each, with a frontmatter scope: `alwaysApply: true` (always active), `globs` (by file pattern) or neither (requested by the agent from its `description`) |
| `.agents/skills/` | Coding-agent skills, catalogued in its `README.md`: `update-memory-bank/` (own; keeps this bank in sync, and its `check.sh` verifies it from the repo root, exit code 0 = pass), `frontend-design/` and `webapp-testing/` (external, vendored unchanged from `anthropics/skills`, Apache 2.0, with a `SOURCE.md` each) |
| `.claude/skills` | Symlink to `../.agents/skills`, so Claude Code discovers the same skills without duplicating them; `.claude/settings.local.json` (personal settings) is gitignored |
| `memory-bank/` | Persistent project memory for the coding agent (this bank) |
| `uis/` | Any application with screens: `website/` (public website) and `backoffice/` (internal application) |
| `services/` | Centralised FastAPI API and, only when needed, background workers |
| `data/raw/` | Untransformed source data, with its origin and PII rules documented |
| `data/pipelines/` | ETL/ELT ingestion, cleaning and transformation jobs |
| `data/process/` | Clean or intermediate outputs produced by the pipelines |
| `data/eval/` | Golden sets and evaluation datasets for RAG, agents and pipelines |
| `agents/` | One subfolder per product agent, starting from `agents/_template/`; common tools in `agents/tools/` |
| `skills/` | Reusable agent capabilities: `SKILL.md` + scripts and resources |
| `mcps/` | One MCP server per subfolder, giving models access to systems and data |
| `workflows/` | n8n flows and cross-system orchestration |
| `packages/` | Shared versionable libraries (`@repo/shared-types`, SDKs, components) |
| `shared/` | Loose resources: JSON schemas, templates, OpenAPI specs, design tokens |
| `docs/` | Cross-cutting documentation: architecture, ADRs, conventions, milestone evaluation |
| `infra/` | Dockerfiles, Terraform, deployment manifests, CI/CD |
| `scripts/` | Single-file helper scripts (setup, seeds, one-off migrations) |
| `internal/` | Internal tools with their own dependencies and tests (CLIs, prompt evaluators) |
| `docker-compose.yml` | At the root: orchestrates the local environment for `services/`, databases and containers |

## Technical constraints

- **Mandatory multi-tenant isolation:** Nexova serves several outsourcing and selection client companies; their data must never be mixed. The per-client filter is applied in the data layer and in the vector store query.
- **GDPR (EU):** Nexova operates from Valencia. Candidate and employee data is personal data, and a hiring decision cannot be fully automated (Art. 22).
- **No real PII in the repository:** only synthetic or anonymised data in `data/`; no real CVs, tickets or employee data.
- **Untrusted inputs:** ticket and CV text is treated as data, never as instructions (prompt-injection risk).
- **Secrets out of the repo:** `.gitignore` excludes `.env*` (except `.env.example`), `*.pem`, `*.key` and `*.rtf`.

## Environment

- **Development:** GitHub Codespaces / devcontainer (`.devcontainer/devcontainer.json`):
  - image `mcr.microsoft.com/devcontainers/javascript-node:24` (Debian, glibc), remote user `node`;
  - features: Python 3.12 (for `webapp-testing` scripts and the future FastAPI backend), GitHub CLI (`gh`) and sshd;
  - no Docker socket mount and no Docker-in-Docker: Docker is not needed until the infrastructure milestone;
  - `post-create.sh`: `corepack enable` + `corepack install` (the pnpm version pinned in `packageManager`), `pnpm install --frozen-lockfile`, `uv sync` only when `pyproject.toml` exists, Playwright with Chromium for `.agents/skills/webapp-testing`, and the Claude Code CLI; it ends by printing the Node, pnpm and Python versions.
- **Node 24 everywhere:** local development (`.nvmrc` = `24`, `engines` `>=24 <25`), the devcontainer image, and the future Docker images on the VPS, which will be based on the official Node 24 images.
- **Ports:**

| Port | Service |
| --- | --- |
| 3000 | `uis/website` (`pnpm dev:website`) |
| 3001 | `uis/backoffice` |
| 8000 | FastAPI API (future) in `services/` |
| 5678 | n8n (`workflows/`) |

The devcontainer forwards all four ports, labelled Website, Backoffice, API and n8n.

## Open decisions

- **Vector store:** Qdrant (proposed in `Company-choice.md`, native hybrid search) versus pgvector (fewer moving parts, reusing the metadata Postgres).
- **CV scoring language:** `Company-choice.md` proposes TypeScript end to end, aligned with the course's Milestone 2 scoring spec, while the API and the support agent use Python + FastAPI. It must be decided whether scoring lives in TypeScript or in Python.
- **LLM provider:** Anthropic versus OpenAI, for RAG answers, ticket summarisation and CV normalisation.

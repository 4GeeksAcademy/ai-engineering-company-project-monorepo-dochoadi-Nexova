# Tech Context — Nexova monorepo

Type: technical

## Monorepo stack

| Layer | Technology | Location |
| --- | --- | --- |
| Frontends | Next.js (App Router) + TypeScript in `strict` mode | `uis/website`, `uis/backoffice` |
| Public site (Milestone 2) | Plain HTML + compiled Tailwind CSS v4 + vanilla JavaScript, served with `npx http-server` on port 8080 | Repo root (`index.html`, `application.html`, `validation.js`, `es/`) |
| Runtime | Node.js 24.18.1 (`engines: >=24 <25`) | Repo root |
| JS/TS package management | pnpm 12.11.2 workspace (`packageManager` pinned, enabled via Corepack) | Repo root |
| TypeScript | 5.9.3, a root dev dependency (with `tailwindcss` and `@tailwindcss/cli` 4.3.3 for the root site, S03); shared options in `tsconfig.base.json` (`strict`, `noUncheckedIndexedAccess`, `ESNext`/`Bundler`, `verbatimModuleSyntax`, `allowImportingTsExtensions`, `noEmit`) | Repo root |
| Shared types and data | `@repo/shared-types` package | `packages/shared` |
| Backend (future) | Python + FastAPI as the company's **single API**, with one router per domain | `services/` |

## pnpm workspace

- **Layout:** `pnpm-workspace.yaml` includes `uis/*` and `packages/*`. Workspace packages: `packages/shared`, `uis/website` (package name `website`) and `uis/backoffice` (package name `backoffice`).
- **Build scripts:** pnpm 12 refuses unapproved dependency build scripts. `pnpm-workspace.yaml` lists `allowBuilds` with `sharp` and `unrs-resolver` set to `false` (both ship prebuilt binaries); any new entry needs a justification.
- **Root scripts:** `pnpm dev` (all `uis/*` apps in parallel), `pnpm dev:website`, `pnpm dev:backoffice`, and `pnpm build` / `lint` / `typecheck` / `test`, which run each package's script when it exists (`pnpm -r --if-present`).
- **Tests:** `node --test` with the native `node:test` and `node:assert` modules, no test dependency. Node 24 strips TypeScript types natively, so `*.test.ts` files run without `--experimental-strip-types`. Test files are excluded from `tsc` (`@types/node` is not installed), and imports between `.ts` files use explicit `.ts` extensions.
- **Company data:** Nexova's company data (company profile, business lines, the 8 departments, support SLA, flagship agents) lives only in `packages/shared/company.ts`, taken from `CONTEXT.md` and `Company-choice.md`, with no computed values. Apps import it from `@repo/shared-types` and must list the package in Next.js `transpilePackages`, because it ships TypeScript source.
- **TypeScript version:** 5.9.3 was chosen over 7.0.2 (`latest`, the native compiler) because Next.js type-checks through the JavaScript `typescript` API.

## Website (`uis/website`)

- **Stack:** Next.js 16.4.1 (App Router, Turbopack), React 19.3.0, TypeScript 5.9.3 `strict` (the app's `tsconfig.json` extends `tsconfig.base.json` and adds the DOM libs, JSX and the Next plugin), ESLint 9 with `eslint-config-next` 16.4.1, `@types/node` 24 for `node:test`. Patched from 16.4.0 in M2-S02 (security advisories, see `docs/milestone-2/security.md`). Styling is CSS Modules (the M1 Next.js apps keep them; Tailwind is used only by the root public site): no UI kit or animation library. `next.config.ts` sets `transpilePackages: ["@repo/shared-types"]` and `agentRules: false`, so `next dev` does not write its own `AGENTS.md`; the scaffold defaults `cacheComponents` and `partialPrefetching` are kept, and `/` prerenders as static.
- **Font:** Instrument Sans through `next/font/google` (variable font covering weights 400–700), exposed as `--font-instrument-sans`.
- **Design source:** `docs/milestone-1/design/nexova-landing-v4.html`, a self-unpacking Claude Design bundle (`__bundler/manifest` with fonts and the Design runtime, `__bundler/template` with the page and a `Component` class holding the behaviour). The website ports its layout, copy, tokens and every `setup*` method and `tick()`.
- **Structure:** `app/` (layout with metadata and JSON-LD Organization, page, `globals.css` importing the shared brand tokens and adding the website-only ones on `:root`), `components/` (one component per section, each with a CSS Module: `Header` + `MobileNav`, `Hero` + `RoleTicker` + `CvCascade`, `Marquee`, `KeyFigures` + `CountUp`, `Services`, `Process`, `Industries`, `HumanAndAi`, `About` + `OfficePhotos` + `OfficeClock`, `ContactCta`, `Footer`; shared `Button`, `Reveal`, `PulseDot`), `content/home.ts` (typed copy), `lib/` (`cvField.ts` + test, `time.ts`, `motion.ts`, `jsonLd.ts`), `public/images/` (office photos).
- **Conventions:** company facts come from `@repo/shared-types` and are interpolated into the copy, never retyped; components never use raw colour values; `"use client"` only on components with behaviour; every listener, timer, animation and observer is cleaned up on unmount; `prefers-reduced-motion` skips scroll and pointer effects and shows the hero's final state.

## Public site at the root (Milestone 2)

- **What:** the official public website of the brief: `index.html` (landing) and `application.html` (talent pool form) with `validation.js`, Spanish pages in `es/`, assets in `assets/`, tests in `tests/site/`. At the repo root because the brief requires it (documented exception in `.agents/rules/monorepo-structure.md`).
- **Styling:** compiled Tailwind CSS **4.3.3** (root devDependencies `tailwindcss` and `@tailwindcss/cli`, both pinned; the CLI alone cannot resolve `@import "tailwindcss"` without the core package). `tailwind.css` (input) → minified `styles.css` (committed, ~19 KB). Only the root site uses Tailwind. **Why compiled, not the browser CDN:** the CDN compiles the CSS in every visitor's browser on every visit, which hurts the PageSpeed score (E13 needs ≥ 80); the brief allows `styles.css` when the CDN is not enough.
- **`tailwind.css`:** `@import "tailwindcss" source(none)` plus `@source` for only `index.html`, `application.html`, `es/*.html` and `validation.js` (so `docs/` design bundles and `uis/` are never scanned); `@import "./packages/shared/styles/tokens.css"`; `@theme inline` maps every brand token to a `brand-` Tailwind name with no hex retyped: colours `--color-brand-<name>: var(--color-<name>)` (all 19), `--font-brand`, radii `--radius-brand-{pill,cta,card,figure,field,cv}`, shadows `--shadow-brand-{header,menu,hero-card,card,card-dark,card-coral,chip,cv,cv-glow}` (`card` = `--shadow-card-light`), easings `--ease-brand-{out,in-out,pop,drop,place}`. One commented `:root` rule defines `--font-instrument-sans: "Instrument Sans"` (next/font sets it in the Next.js apps; `tokens.css` reads it and is not edited). Instrument Sans loads from Google Fonts (`preconnect`, `display=swap`).
- **Scripts (root `package.json`):** `build:site` = `tailwindcss -i tailwind.css -o styles.css --minify && node scripts/build-site.mjs`; `watch:site` (same with `--watch`, unminified); `serve:site` = `pnpm build:site && npx http-server@14.1.1 dist -p 8080 -a 0.0.0.0 -d false -c 3600`; `test:site` = `node --test "tests/site/**/*.test.*"` (a bare folder argument fails in Node 24, so the quoted glob is expanded by Node).
- **Serving (SEC-1 resolved in S03):** the documented command (E7) is `pnpm build:site && npx http-server@14.1.1 dist -p 8080 -a 0.0.0.0 -d false`. `scripts/build-site.mjs` (Node standard library only) deletes `dist/` (git-ignored) and copies only the allowlist `index.html`, `application.html`, `validation.js`, `styles.css`, `assets/`, `es/`, `robots.txt`, `sitemap.xml` (missing entries skipped; dotfiles and symlinks never copied), so `.git`, `.env`, `.mcp.json`, `docs/` and `memory-bank/` can never be downloaded. Port 8080 because 3000 is the Next.js website; Codespaces forwards it automatically (Ports tab), and `forwardPorts` gets 8080 in S09.
- **Pages:** each page has its own CSP meta (`default-src 'self'; script-src 'self'; style-src 'self' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data:; connect-src 'none'; form-action 'self'; base-uri 'self'; object-src 'none'`), `hreflang` alternates (`en`, `es`, `x-default` → English, relative URLs), the favicon `assets/favicon.svg` and the wordmark `assets/nexova-logo.svg` (Instrument Sans 600 glyphs converted to SVG paths, so it renders the same inside an `<img>`, where web fonts do not load). The mobile menu is a `<details>`/`<summary>` below `md:` (its panel is `hidden group-open:block`), with no JavaScript.
- **pnpm settings in `pnpm-workspace.yaml`:** `allowBuilds` also lists `"@parcel/watcher": false` (a `@tailwindcss/cli` dependency whose install script is only a build-from-source fallback; the prebuilt `@parcel/watcher-linux-x64-glibc` is used). `auditConfig.ignoreGhsas: [GHSA-vfj7-8cjw-p6xm]` is the accepted SEC-2 exception (`braces` via `eslint-config-next`: dev-only, not shipped, no fix; review in S10). pnpm 12 ignores the old `"pnpm"` field in `package.json`, so these settings live in `pnpm-workspace.yaml`.
- **Content:** `BRIEFING.md` (unmodified) is the source of truth; deliberate differences in `docs/milestone-2/content-decisions.md`.
- **Approved new dev tools for Milestone 2** (each pinned, installed in its step): `tailwindcss` and `@tailwindcss/cli` 4.3.3 (installed in S03 as root devDependencies); `http-server` 14.1.1 via `npx` (S03, never installed); the dev MCP servers `@playwright/mcp`, `chrome-devtools-mcp` and `@upstash/context7-mcp` (S02).
- **Pinned dev tools in use (M2-S02):** `http-server@14.1.1` via `npx` (both gates start it on `127.0.0.1:8099`; S03 serves the site on 8080); `axe-playwright-python==0.1.8` (MIT, bundles axe-core 4.12.1), installed with `pip install --user -r .agents/skills/a11y-gate/requirements.txt` on top of Playwright for Python from `post-create.sh`.
- **`http-server` caveat (SEC-1):** in 14.1.1, `--no-dotfiles` only hides dotfiles from directory listings; files such as `/.git/config` and `/.mcp.json` are still served by direct URL. Serving the repo root would expose the whole repository, which is why only `dist/` is served (above). `security-gate` criterion 5 builds and serves `dist/` the same way on `127.0.0.1:8099`; `a11y-gate` still serves the repo root on loopback for its run (follow-up needs approval).

## Shared brand tokens

- **Where:** `packages/shared/styles/tokens.css`, CSS variables on `:root`: colour palette (`--color-*`), font family (`--font-sans` over the `--font-instrument-sans` variable set by `next/font`), radii, shadows and easings.
- **How:** each app's `app/globals.css` starts with `@import "@repo/shared-types/styles/tokens.css";`, which Next.js 16 (Turbopack, `transpilePackages`) resolves through the workspace package and inlines; each app keeps only its own variables (website: header colours, gradients, layout; backoffice: panel radii, lift shadows, layout).

## Backoffice (`uis/backoffice`)

- **Stack:** identical to the website (Next.js 16.4.1, React 19.3.0, TypeScript 5.9.3 `strict`, ESLint 9 with `eslint-config-next` 16.4.1, `@types/node` 24, CSS Modules, Instrument Sans via `next/font/google`); no other dependency. Port 3001 (`pnpm dev:backoffice`). No authentication yet.
- **Design source:** `docs/milestone-1/design/nexova-backoffice.html`, a Claude Design bundle of the same kind as the website's; its inline data was a stand-in, replaced by `@repo/shared-types`.
- **Structure:** `app/` (own layout with sidebar, top bar and `main`; route `/` "Operations overview"; `globals.css`), `components/` (`Sidebar`, `TopBar` + `LiveClock`, `SlaKpi`, `HeadcountKpi`, `WorkByType` + `NeedsFilter` context, `DepartmentCard` + `SpotlightCard`/`NeedList`/`SupportClock`, `AgentCard`, `OpenQuestions`), `content/overview.ts` (copy, department display order and short labels), `lib/` (`metrics.ts` pure calculations with `node:test`, `departments.ts`, `format.ts`, `motion.ts`).
- **Conventions:** same as the website; it never imports from `uis/website`. Clocks use `useSyncExternalStore` with a `null` server snapshot (no hydration mismatch) and refresh every 30 s.

## MCP servers

### Development (in use, `.mcp.json`, Claude Code project scope)

| Server | Package (exact pin) | Used for |
| --- | --- | --- |
| `playwright` | `@playwright/mcp@0.0.83` (`--headless --isolated --browser chromium`) | Driving a real browser: filling and submitting the form, keyboard navigation, accessibility tree, widths (S05–S07) |
| `chrome-devtools` | `chrome-devtools-mcp@1.12.0` (`--headless --isolated`, Chromium from the Playwright cache, `--no-sandbox`) | Performance traces, network and console, Lighthouse-style insights before PageSpeed (S07–S08) |
| `context7` | `@upstash/context7-mcp@4.4.4` | Up-to-date docs for Tailwind v4 and Next.js 16 (S03–S06) |

All three are free and need no key. If a Context7 key is ever added, it comes from a Codespaces secret through `${CONTEXT7_API_KEY}`, never written in `.mcp.json`. Chromium for both browser servers: `npx -y playwright@1.64.0-alpha-1790635538000 install chromium` (already in `.devcontainer/post-create.sh`). Claude Code asks to approve project servers once; they load in a new session.

### MCP servers (planned)

Not installed; each follows the MCP rules in `.agents/rules/security-and-data.md` (pinned, least privilege, secrets only from environment variables, free only).

- **Postgres (read-only)**, when the database arrives.
- **n8n**, in the automations milestone (Nexova workflows in their own folder, exported to `workflows/`).
- **Product servers in `mcps/`:** `knowledge-base` (L1 Support Agent, tenant-filtered) and `candidates` (CV Matching Agent).
- **HubSpot** (free CRM tier) or mock data, and **Zendesk** with mock data only, for Sales and Support.
- **Gmail / Google Workspace** (candidate status emails; drafts only in the demo).
- **Telemetry** with free tools only: Sentry's free developer plan, or open source (OpenTelemetry + Grafana).
- **Optional:** GitHub MCP (`gh` already covers it) and Figma MCP (if designs move to Figma).

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
| `.agents/skills/` | Coding-agent skills, catalogued in its `README.md`: `update-memory-bank/` (own; keeps this bank in sync, and its `check.sh` verifies it from the repo root, exit code 0 = pass), `milestone-recap/` (own; writes `docs/milestone-<n>/recap.md` at the end of every milestone, verified by `check.sh <n>`), `frontend-design/` and `webapp-testing/` (external, vendored unchanged from `anthropics/skills`, Apache 2.0, with a `SOURCE.md` each) |
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
  - no Docker socket mount and no Docker-in-Docker yet (see "Infrastructure plan" below);
  - `post-create.sh`: `corepack enable` + `corepack install` (the pnpm version pinned in `packageManager`), `pnpm install --frozen-lockfile`, `uv sync` only when `pyproject.toml` exists, Playwright with Chromium for `.agents/skills/webapp-testing`, the Chromium build of the dev MCP servers (`npx -y playwright@1.64.0-alpha-1790635538000 install chromium`, the exact Playwright pinned by `@playwright/mcp@0.0.83`), and the Claude Code CLI; it ends by printing the Node, pnpm and Python versions.
- **Node 24 everywhere:** local development (`.nvmrc` = `24`, `engines` `>=24 <25`), the devcontainer image, and the future Docker images on the VPS, which will be based on the official Node 24 images.
- **Ports:**

| Port | Service |
| --- | --- |
| 3000 | `uis/website` (`pnpm dev:website`) |
| 3001 | `uis/backoffice` |
| 8080 | Root public site (Milestone 2, `npx http-server`) |
| 8000 | FastAPI API (future) in `services/` |
| 5678 | n8n (`workflows/`) |

The devcontainer forwards 3000, 3001, 8000 and 5678, labelled Website, Backoffice, API and n8n; port 8080 is not in the devcontainer yet (Codespaces forwards it automatically when the server starts).

## Infrastructure plan

- **Where development happens:** locally and in GitHub Codespaces, both from the same devcontainer.
- **Databases and other services:** when a milestone first needs them (Postgres, a vector store…), they will run inside the Codespace through Docker: a docker-in-docker devcontainer feature plus a root `docker-compose.yml`. This is planned for the first step of that milestone, not done now.
- **Hosting:** a VPS managed with Easypanel exists but is not used for Nexova yet.
- **Automations:** an external n8n instance, hosted on another project's Easypanel, may be used. Nexova workflows must be kept separate there (their own folder or project) and exported as JSON into `workflows/`, so the repository stays the source of truth.
- **No infrastructure details in the repo:** it is public, so no IP addresses, hostnames, credentials or URLs of other projects are written into any file.

## Stack choice for the UIs

- **Next.js for both UIs:** the website needs server rendering for SEO (and GEO), and using the same stack for the backoffice keeps one toolchain, one set of conventions and shared code.
- **Vite was considered for the backoffice and rejected** for consistency with the website, even though the backoffice has no SEO needs.

## Open decisions

- **Vector store:** Qdrant (proposed in `Company-choice.md`, native hybrid search) versus pgvector (fewer moving parts, reusing the metadata Postgres).
- **CV scoring language:** `Company-choice.md` proposes TypeScript end to end, aligned with the course's Milestone 2 scoring spec, while the API and the support agent use Python + FastAPI. It must be decided whether scoring lives in TypeScript or in Python.
- **LLM provider:** Anthropic versus OpenAI, for RAG answers, ticket summarisation and CV normalisation.

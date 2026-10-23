# AI Engineering Nexova — Student Template

[![4Geeks Academy](https://img.shields.io/badge/4Geeks-Academy-blue)](https://4geeksacademy.com)
[![AI Engineering](https://img.shields.io/badge/track-AI%20Engineering-green)](https://4geeksacademy.com/es/programas-de-carrera/ingenieria-ia)

_Base template for transversal projects in the AI Engineering Career Program — 4Geeks Academy._

---

## Purpose

This repository is the **starter template** for transversal projects. You will work on real company scenarios (Brasaland, TrackFlow, Nexova), building deliverables that map to course milestones (Web, Programming, Backend, Telemetry, RAG, Agents, Workflows, Real-time).

- Create a template from this repository.
- Replace the placeholder `CONTEXT.md` with your assigned company context.
- Use `skills/` and the directory-level `README.md` files as working guidance.

---

## How to start

1. **Use this repository as a template** and create your own project repo.
2. **Clone** your repository (or open it in Codespaces).
3. **Replace** `CONTEXT.md` with the full context for your assigned company.
4. **Read this folder guide** and open the `README.md` of the folder you are working in.
5. **Start implementing** in the right folder — do not dump everything in the root.
6. **Document** what you add: each new app, service, agent, or pipeline gets a subfolder + README.

---

## How to think about this monorepo

You are building **one company** across many milestones and projects. Each top-level folder has a **single responsibility** — like a real engineering team repo.

| Layer               | Folders                           | What lives here                                                  |
| ------------------- | --------------------------------- | ---------------------------------------------------------------- |
| **Company context** | `CONTEXT.md`                      | Domain facts, field names, constraints for your assigned company |
| **User-facing**     | `uis/`, `services/`               | Frontends and backends users (or operators) interact with        |
| **Data**            | `data/`                           | Raw files, pipelines, processed datasets, evaluation sets        |
| **AI**              | `agents/`, `skills/`, `mcps/`     | Agents, reusable agent capabilities, MCP tool servers            |
| **Automation**      | `workflows/`                      | n8n flows and cross-system orchestration                         |
| **Reuse**           | `packages/`, `shared/`            | Shared types, SDKs, schemas, templates                           |
| **Operations**      | `infra/`, `scripts/`, `internal/` | Docker, deploy configs, one-off scripts, internal CLIs           |
| **Documentation**   | `docs/`                           | Architecture, decisions, conventions for the whole repo          |

**Rule of thumb:** if it has a UI → `uis/`. If it exposes an API or runs in the background → `services/`. If it moves or transforms data → `data/`. If an AI model does the work → `agents/` (+ `skills/` or `mcps/` as needed).

---

## Current status

This repository is the Nexova Solutions monorepo, built on the template below. Milestone 1 ("Monorepo AI Setup") is delivered on the branch `chore/hito-1-ai-setup`.

**Current milestone briefing:** [`BRIEFING.md`](./BRIEFING.md) (Milestone 2, "Your Company's Public Website": the official 4Geeks file, unmodified).

**What exists:**

| Part | Where | What it is |
| --- | --- | --- |
| Corporate website | [`uis/website/`](./uis/website/README.md) | Public landing page, Next.js 16, port **3000**. |
| Backoffice | [`uis/backoffice/`](./uis/backoffice/README.md) | Internal operations overview, Next.js 16, port **3001**, no authentication yet. |
| Shared package | [`packages/shared/`](./packages/shared/README.md) | `@repo/shared-types`: Nexova company data, types and the brand tokens (`styles/tokens.css`), defined once and imported by both UIs. |
| Coding-agent configuration | [`AGENTS.md`](./AGENTS.md), [`.agents/`](./.agents/skills/README.md), [`memory-bank/`](./memory-bank/) | Operating protocol, rules with explicit scope, skills, and the persistent project memory. `CLAUDE.md` loads `AGENTS.md` for Claude Code. |

The company context is in [`CONTEXT.md`](./CONTEXT.md). Agents, the API, data pipelines and workflows come in later milestones; their folders keep the template guidance below.

**How to run it** (Node 24, pnpm via Corepack; the devcontainer sets both up):

```bash
pnpm install          # install the workspace
pnpm dev              # website (3000) and backoffice (3001) in parallel
pnpm dev:website      # website only, http://localhost:3000
pnpm dev:backoffice   # backoffice only, http://localhost:3001
pnpm test             # unit tests (node:test) of every package
```

`pnpm lint`, `pnpm typecheck` and `pnpm build` run the other checks across the workspace.

**Milestone documentation:** [`docs/milestone-1/`](./docs/milestone-1/README.md): the evaluation matrix (`evaluation.md`), the verification guide (`verification.md`), the approved designs and the screenshots.

## Public website

Milestone 2 builds Nexova's public website from [`BRIEFING.md`](./BRIEFING.md): plain HTML, compiled Tailwind CSS v4 and vanilla JavaScript at the repository root (the brief requires them there). English is the base language (`index.html`, `application.html`); the Spanish pages live in `es/`. Evidence and decisions: [`docs/milestone-2/`](./docs/milestone-2/README.md).

**Run it locally** (from the repository root, after `pnpm install`):

```bash
pnpm build:site && npx http-server@14.1.1 dist -p 8080 -a 0.0.0.0 -d false -c-1
```

Then open <http://localhost:8080/> (Spanish: <http://localhost:8080/es/>). `pnpm serve:site` runs the same command.

What each part does:

- **`pnpm build:site`** compiles `tailwind.css` into the minified `styles.css` (Tailwind CLI) and then runs `scripts/build-site.mjs`, which copies **only** the public files (`index.html`, `application.html`, `validation.js`, `motion.js`, `styles.css`, `assets/`, `es/`, `robots.txt`, `sitemap.xml`) into `dist/` (git-ignored).
- **`http-server … dist`** serves that clean copy, never the repository root. That way `.git`, `.env`, `.mcp.json` and the docs can never be downloaded from the site: a CISO requirement (finding SEC-1 in [`docs/milestone-2/security.md`](./docs/milestone-2/security.md)).
- **`-p 8080`**: port 8080, because 3000 belongs to the Next.js website (`uis/website`) and 3001 to the backoffice.
- **`-a 0.0.0.0`**: listen on every network interface, so Codespaces can forward the port.
- **`-d false`**: no directory listings.
- **`-c-1`**: no browser caching, so a reload always shows the latest pages and scripts. (A one-hour cache once kept old HTML pointing to old files.) The copies in `dist/` also ask for `styles.css`, `validation.js` and `motion.js` with a `?v=<hash>` version tag.

**Rebuild the CSS** after changing classes in a page: run `pnpm build:site` again, or keep `pnpm watch:site` running while you work (it rebuilds `styles.css` on every save, unminified). Run `pnpm build:site` before committing, so the committed `styles.css` is minified. Styles are Tailwind utility classes on the markup, with the Nexova brand tokens from `packages/shared/styles/tokens.css` exposed as `brand-*` names (e.g. `bg-brand-green`).

**Open it in GitHub Codespaces:** start the command in the Codespace terminal, open the **Ports** tab, and click the globe icon next to port **8080** (Codespaces forwards it automatically when the server starts). To share it, or to test it with PageSpeed Insights, right-click the port → **Port Visibility** → **Public**.

---

## Folder guide — what goes where

Read the linked `README.md` inside each folder before you start coding there.

### Root files

| Path                         | Purpose                                                                   | What you do here                                                                                              |
| ---------------------------- | ------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| [`CONTEXT.md`](./CONTEXT.md) | Single source of truth for your company (Brasaland, TrackFlow, or Nexova) | **First step:** copy your assigned company briefing here so every app, agent, and prompt uses the same domain |
| `docker-compose.yml`         | Local dev orchestration for the whole stack                               | Keep at repo root — wires `services/`, databases, and other containers from one place                         |
| `README.md`                  | This guide                                                                | Orientation — you are here                                                                                    |

### `uis/` — user interfaces

**Purpose:** All frontend applications — anything a human sees and clicks.

**Put here:**

- Public website (`website/`)
- Internal admin / backoffice (`backoffice/`)
- Customer portals, loyalty apps, Streamlit/Gradio tools, dashboards with a UI

**Examples:** corporate landing page, operations backoffice, loyalty portal, telemetry dashboard UI

→ See [`uis/README.md`](./uis/README.md)

### `services/` — centralized company API (FastAPI)

**Purpose:** One **centralized FastAPI backend** for the whole company — a single entry point that keeps complexity low as the project grows.

**Put here:**

- One main FastAPI app (e.g. `api/`) with routers/modules per domain (locations, menus, sales, telemetry, etc.)
- Background workers only when they truly need to run separately from the API

**Recommendation:** avoid splitting into many microservices early. Add endpoints to the same FastAPI app; extract a worker only when necessary.

**Examples:** `/locations`, `/menus`, `/sales/reports`, webhook handlers, scheduled jobs

→ See [`services/README.md`](./services/README.md)

### `data/` — datasets, pipelines, and evaluation

**Purpose:** Everything data-related, from raw files to production-ready tables.

| Subfolder                                       | Purpose                      | What you do here                                                          |
| ----------------------------------------------- | ---------------------------- | ------------------------------------------------------------------------- |
| [`data/raw/`](./data/raw/README.md)             | Untouched source data        | Store dumps, exports, sample CSVs/JSON — document origin and PII rules    |
| [`data/pipelines/`](./data/pipelines/README.md) | ETL/ELT jobs                 | Write ingestion, cleaning, and transformation scripts                     |
| [`data/process/`](./data/process/README.md)     | Clean / intermediate outputs | Save artifacts produced by pipelines (features, aggregates, clean tables) |
| [`data/eval/`](./data/eval/README.md)           | Quality measurement          | Golden sets, RAG/agent eval datasets, experiment metrics                  |

**Flow:** `raw` → `pipelines` → `process` → consumed by `services/`, `uis/`, or `agents/`. Use `eval` to prove quality.

### `agents/` — AI agents

**Purpose:** Autonomous or semi-autonomous AI assistants for the company.

**Put here:**

- One subfolder per agent (e.g. `support-agent/`, `onboarding-agent/`)
- Agent config, prompts, tools wiring, tests
- Start from [`agents/_template/`](./agents/_template/README.md) when creating a new agent

**Examples:** customer support bot, employee onboarding copilot, training assistant

→ See [`agents/README.md`](./agents/README.md)

### `skills/` — reusable agent capabilities

**Purpose:** Packaged instructions + scripts that agents (or you in Cursor) reuse across the repo.

**Put here:**

- Skills for data analysis, code review, scraping, research, etc.
- Each skill = a folder with `SKILL.md`, optional scripts and resources

**Example included:** `skills/data-analysis/` (pandas cleaning script + metrics reference)

→ See [`skills/README.md`](./skills/README.md)

### `mcps/` — Model Context Protocol servers

**Purpose:** Bridge AI models to your systems — databases, APIs, GitHub, custom tools.

**Put here:**

- One subfolder per MCP server (e.g. `database-mcp/`, `github-mcp/`)
- Tool definitions, resources, and server config

**When to use:** when an agent needs live access to data or actions your codebase alone cannot provide

→ See [`mcps/README.md`](./mcps/README.md)

### `workflows/` — automation and orchestration

**Purpose:** Connect systems without writing full apps — scheduled jobs, webhooks, notifications.

**Put here:**

- n8n workflow exports, Make/Zapier configs, or orchestration docs
- Flows that link `services/`, `data/pipelines/`, and `agents/`

**Examples:** new-order → Slack alert, nightly ETL trigger, lead → CRM sync

→ See [`workflows/README.md`](./workflows/README.md)

### `packages/` — shared libraries

**Purpose:** Versionable code reused by multiple apps, agents, or pipelines.

**Put here:**

- Shared TypeScript types (`packages/shared/` → `@repo/shared-types`)
- UI component libraries, API clients, analytics SDKs

**Rule:** if `uis/` and `services/` both need the same interface → extract it here

→ See [`packages/README.md`](./packages/README.md)

### `shared/` — loose shared assets

**Purpose:** Resources that are not a full package — schemas, templates, static assets, short docs.

**Put here:**

- JSON schemas, email templates, OpenAPI specs, design tokens
- Anything reused but too small or non-code for `packages/`

→ See [`shared/README.md`](./shared/README.md)

### `docs/` — cross-cutting documentation

**Purpose:** Architecture and decisions that span the whole company project.

**Put here:**

- System architecture diagrams, ADRs, security/observability guides
- Conventions not tied to one app or agent

→ See [`docs/README.md`](./docs/README.md)

### `infra/` — infrastructure and deployment

**Purpose:** How the company project runs in Docker, cloud, or CI.

**Put here:**

- Dockerfiles, Terraform, K8s manifests, Nginx configs, CI/CD pipelines

**Keep at repo root:** `docker-compose.yml` — orchestrates local dev for `services/`, databases, and other containers from one place.

→ See [`infra/README.md`](./infra/README.md)

### `scripts/` — helper scripts

**Purpose:** Small, repeatable automation — not full apps.

**Put here:**

- Setup scripts, seed data generators, lint wrappers, one-off migrations
- Document each script: what it does, args, and how to run it

**Difference from `internal/`:** scripts are usually single files; `internal/` tools are structured projects with their own deps and tests.

→ See [`scripts/README.md`](./scripts/README.md)

### `internal/` — internal developer tools

**Purpose:** Robust utilities for the engineering team.

**Put here:**

- CLIs, packaged migration tools, prompt evaluators
- Tools with their own `package.json`, tests, and install steps

→ See [`internal/README.md`](./internal/README.md)

---

## Where should I put this?

Quick decision guide:

```text
Does it have buttons and screens?          → uis/
Does it run on a server / API / queue?     → services/
Is it raw or transformed data?             → data/raw/ or data/process/
Does it move data between systems?         → data/pipelines/
Do you measure AI/pipeline quality?        → data/eval/
Is it an AI assistant with a goal?         → agents/
Is it a reusable AI capability/instruction?→ skills/
Does AI need to call external tools/APIs?  → mcps/
Is it n8n / scheduled automation?          → workflows/
Will 2+ folders import the same code?      → packages/
Is it a schema/template/asset, not a lib?  → shared/
Is it architecture or team-wide docs?      → docs/
Is it docker-compose for local dev?        → repo root
Is it Docker / deploy / cloud config?      → infra/
Is it a one-off script?                    → scripts/
Is it a CLI tool with its own package?     → internal/
```

---

## Repository structure (tree)

```text
ai-engineering-company-project-monorepo/
├── README.md                # This guide
├── CONTEXT.md                 # ← Replace with your company briefing
├── docker-compose.yml         # ← Local dev orchestration (repo root)
├── uis/                       # Frontends (website, backoffice, dashboards)
├── services/                  # Centralized FastAPI company API
├── data/
│   ├── raw/                   # Source datasets
│   ├── pipelines/             # ETL/ELT jobs
│   ├── process/               # Clean / intermediate outputs
│   └── eval/                  # Evaluation sets and metrics
├── agents/                    # AI agents (+ _template/ starter)
├── skills/                    # Reusable agent skills
├── mcps/                      # MCP servers for tool access
├── workflows/                 # n8n and automation flows
├── packages/                  # Shared libraries (@repo/shared-types, …)
├── shared/                    # Schemas, templates, loose assets
├── docs/                      # Architecture and cross-cutting docs
├── infra/                     # Docker, Terraform, deployment
├── scripts/                   # Helper scripts
└── internal/                  # Internal CLIs and dev tools
```

---

## Links

- [4Geeks Academy — AI Engineering](https://4geeksacademy.com/es/programas-de-carrera/ingenieria-ia)
- [How to start a coding project](https://4geeks.com/lesson/how-to-start-a-project)

---

## Contributors

This template was built as part of the 4Geeks Academy AI Engineering Career Program by [@marcogonzalo](https://www.linkedin.com/in/marcogonzalo) and [@alesanchezr](https://x.com/alesanchezr) and many other contributors. Find out more about our [AI Engineering Course](https://4geeksacademy.com/en/career-programs/ai-engineering), and [other courses](https://4geeksacademy.com/en/program-comparison).

You can find other templates and resources like this at the [4Geeks Academy GitHub page](https://github.com/4geeksacademy).

_This template is maintained by 4Geeks Academy for the AI Engineering track. For exclusive use in the programme._

# Tech Context — Nexova monorepo

Type: technical

## Monorepo stack

| Layer | Technology | Location |
| --- | --- | --- |
| Frontends | Next.js (App Router) + TypeScript in `strict` mode | `uis/website`, `uis/backoffice` |
| JS/TS package management | pnpm workspace (enabled via Corepack in the devcontainer) | Repo root |
| Shared types and data | `@repo/shared-types` package | `packages/shared` |
| Backend (future) | Python + FastAPI as the company's **single API**, with one router per domain | `services/` |

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

- **Development:** GitHub Codespaces / devcontainer (`.devcontainer/devcontainer.json`, `universal:2` image, Docker-in-Docker via socket). `post-create.sh` enables pnpm with Corepack and installs `uv`.
- **Ports:**

| Port | Service |
| --- | --- |
| 3000 | `uis/website` |
| 3001 | `uis/backoffice` |
| 8000 | FastAPI API (future) in `services/` |
| 5678 | n8n (`workflows/`) |

The devcontainer currently forwards 3000, 8000 and 5678; port 3001 must be added once the backoffice exists.

## Open decisions

- **Vector store:** Qdrant (proposed in `Company-choice.md`, native hybrid search) versus pgvector (fewer moving parts, reusing the metadata Postgres).
- **CV scoring language:** `Company-choice.md` proposes TypeScript end to end, aligned with the course's Milestone 2 scoring spec, while the API and the support agent use Python + FastAPI. It must be decided whether scoring lives in TypeScript or in Python.
- **LLM provider:** Anthropic versus OpenAI, for RAG answers, ticket summarisation and CV normalisation.

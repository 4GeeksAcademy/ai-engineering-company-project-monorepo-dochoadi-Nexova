---
description: Where each kind of code and document goes in the Nexova monorepo, and how to avoid duplicated folders.
alwaysApply: true
---

Scope: always active

## Top-level folders

Put each change in the folder that owns it (source: each folder's `README.md`):

| Folder | Put here |
| --- | --- |
| `CONTEXT.md` | Single source of truth for the Nexova domain. Read it; do not edit it. |
| `memory-bank/` | Persistent project memory for the coding agent. |
| `uis/` | Anything with screens: `website/` (public corporate website), `backoffice/` (internal application), portals, dashboards with a UI. |
| `services/` | The single centralised FastAPI company API and, only when needed, background workers. |
| `data/raw/` | Untransformed source data, with origin and PII rules documented. |
| `data/pipelines/` | ETL/ELT ingestion, cleaning and transformation jobs. |
| `data/process/` | Clean or intermediate outputs produced by pipelines. |
| `data/eval/` | Golden sets and evaluation datasets for RAG, agents and pipelines. |
| `agents/` | One subfolder per product agent (e.g. the L1 HelpDesk Support Agent, the CV–Vacancy Matching Agent), started from `agents/_template/`; shared agent tools in `agents/tools/`. |
| `skills/` | Reusable product-agent capabilities: `SKILL.md` + scripts and resources. |
| `mcps/` | One MCP server per subfolder. |
| `workflows/` | n8n flows and cross-system orchestration. |
| `packages/` | Versionable shared libraries (`packages/shared` → `@repo/shared-types`). |
| `shared/` | Loose shared assets: JSON schemas, templates, OpenAPI specs, design tokens. |
| `docs/` | Cross-cutting documentation: architecture, ADRs, conventions, milestone evaluation (`docs/milestone-<n>/evaluation.md`). |
| `infra/` | Dockerfiles, Terraform, deployment manifests, CI/CD. |
| `scripts/` | Single-file helper scripts (setup, seeds, one-off migrations). |
| `internal/` | Internal tools with their own `package.json`, dependencies and tests. |
| `docker-compose.yml` | Stays at the repo root. |

## Coding-agent config vs product code

- `.agents/` is configuration for the coding agent (rules in `.agents/rules/`, skills in `.agents/skills/`). It is never shipped to Nexova users.
- `/agents` and `/skills` are product code: the AI agents and capabilities Nexova's teams will use. Do not put coding-agent rules or skills there, and do not put product agents in `.agents/`.

## Instructions

1. Give every new app, service, agent, pipeline or package its own subfolder with a `README.md` that states its goal, stack and how to run it.
2. Define Nexova company data (departments, managers, business lines, figures such as 120 employees or the 24 h SLA) once in `packages/shared` and import it; never copy it into an app.
3. Never create a top-level folder that duplicates an existing one (e.g. no `apps/` next to `uis/`, no `api/` next to `services/`, no `lib/` next to `packages/`).
4. Do not put application code at the repo root.

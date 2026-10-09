# 🚀 KICKOFF — Nexova AI Engineering Project (Milestone 4)

> **Date:** 2026-10-09
> **Author:** Full Stack + AI Engineering Lead
> **Purpose:** Initial analysis, duplication detection, proposed structure, and actionable plan to align the monorepo with **Milestone 4 — AI-driven Engineering** requirements from 4Geeks Academy, while keeping Skills as the reusable core for future milestones.

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Current Repository State](#2-current-repository-state)
3. [Duplications & Conflicts Found](#3-duplications--conflicts-found)
4. [Milestone 4 Requirements Mapping](#4-milestone-4-requirements-mapping)
5. [Proposed Folder Structure](#5-proposed-folder-structure)
6. [Agent Governance Architecture](#6-agent-governance-architecture)
7. [Skills Architecture: The Reusable Core](#7-skills-architecture-the-reusable-core)
8. [Action Plan by Phase](#8-action-plan-by-phase)
9. [Delivery Checklist](#9-delivery-checklist)
10. [Architectural Decisions](#10-architectural-decisions)

---

## 1. Executive Summary

This repository is the **starter template** for 4Geeks Academy's AI Engineering program, assigned to **Nexova Solutions**. The template is conceptually well-designed (layer separation: UIs, services, data, agents, skills, MCP, workflows), but it is **skeletal**: folders exist, READMEs define the _what_ and _why_, but **there is no executable code, no real tests, no data pipeline, and no agents implemented**.

The academy's **Milestone 4 — AI-driven Engineering** requires delivering:

| Category | Deliverable |
|----------|-------------|
| **Agent Infrastructure** | `memory-bank/` (projectbrief.md, techContext.md, progress.md), `AGENTS.md` with session-start reads + pre-commit workflow + protected areas, `.agents/rules/` with at least one scoped rule, `.agents/skills/<name>/SKILL.md` with verifiable criteria |
| **Next.js + TypeScript App** | `uis/website` (full corporate site from Milestone 1), `uis/backoffice` (dedicated layout + entry view), Milestone 2 logic imported and visible in UI, APIs under `services/` |
| **Delivery** | Branch `feature/agent-memory-bank`, PR targeting `main` with screenshots + link to `AGENTS.md` |

This kickoff addresses **all three pillars** while preserving the Skills-first architectural vision for future milestones.

---

## 2. Current Repository State

### 2.1. What Works Well ✅

| Aspect | Detail |
|---------|--------|
| **Layer separation** | `uis/`, `services/`, `agents/`, `skills/`, `data/`, `workflows/`, `mcps/` follow monorepo best practices |
| **Bilingual documentation** | English + Spanish in every key folder |
| **Agent template structure** | `agents/_template/` with basic scaffolding + tests folder |
| **Skills starter** | `skills/data-analysis/` has real content (pandas script + metrics reference) |
| **Rich business context** | `CONTEXT-nexova-briefing.en.md` is a complete domain doc with 8 departments, KPIs, and concrete problems |
| **Devcontainer configured** | Python, Node, Docker, useful VS Code extensions |
| **Clear agent ideas** | `Company-choice.md` documents 2 agents with flows, stack, and risks |

### 2.2. What's Missing or Incomplete ❌

| Gap | Impact |
|-----|--------|
| **No real `CONTEXT.md`** | Root `CONTEXT.md` doesn't exist; 3 context files with confusing naming |
| **No `memory-bank/`** | Required by Milestone 4 — must create `projectbrief.md`, `techContext.md`, `progress.md` |
| **No `AGENTS.md`** | Required by Milestone 4 — must define session start, pre-commit workflow, protected areas |
| **No `.agents/` directory** | Required by Milestone 4 — must create `.agents/rules/` and `.agents/skills/` |
| **No `docker-compose.yml`** | No local orchestration for services, databases, or agents |
| **No root `package.json`** | No monorepo workspace configured (npm/pnpm workspaces) |
| **Empty `.gitignore`** | File exists but is empty |
| **No `Makefile`** | No standardized commands (`make install`, `make test`, `make lint`) |
| **No real data** | `data/raw/` only has READMEs; `nexova_sales.csv` doesn't exist |
| **Skills `code-review/` and `research/` empty** | Only `.gitkeep` or empty subdirectories |
| **No agents implemented** | Only the agent template exists |
| **No real unit tests** | Only the `tests/` folder inside the agent template |
| **No CI/CD** | No GitHub Actions or deployment configuration |
| **`services/` has no code** | Not even a minimal FastAPI app |
| **`uis/` has no code** | No frontends at all |
| **`shared/` vs `packages/shared/` ambiguity** | Both exist and can confuse developers |
| **No `.env.example`** | No environment variable template |
| **No `uis/website`** | Required by Milestone 4 — corporate site |
| **No `uis/backoffice`** | Required by Milestone 4 — internal app |

---

## 3. Duplications & Conflicts Found

### 3.1. Context Files — Naming Confusion

| File | Actual Content | Problem |
|------|----------------|---------|
| `CONTEXT-Nexova.en.md` | **Not the general context.** It's a specific technical spec for a sales forecasting model (time series). It instructs building an XGBoost model using `data/raw/nexova_sales.csv`. | ❌ **Misleading name:** looks like the main company Context file, but it's a concrete milestone task. |
| `CONTEXT-nexova-briefing.en.md` | **The real company context.** Describes all 8 departments, their problems, needs, and why choose Nexova. | ✅ This should be the main `CONTEXT.md`. |
| `CONTEXT-nexova-briefing.es.md` | Spanish translation of the briefing. | ✅ Correct as translated version. |
| `Company-choice.md` | Student's personal document: justification for choosing Nexova, 2 agent ideas (HelpDesk Support Agent and CV-Vacancy Matching Agent) with flows, stack, and risks. | ⚠️ Should not live at root; move to `docs/planning/`. |

**📌 Decision:** `CONTEXT-Nexova.en.md` → `docs/milestones/01-forecast-model.md` (it's a milestone spec). `CONTEXT-nexova-briefing.en.md` → `CONTEXT.md` (official context).

### 3.2. `shared/` vs `packages/shared/` — Ambiguity

| Folder | Purpose | Conflict |
|--------|---------|----------|
| `packages/shared/` | Versionable code (TypeScript types) with `package.json` | ✅ Clear |
| `shared/` | Loose non-code assets (schemas, templates, design tokens) | ⚠️ Name overlaps with `packages/shared/`. A new developer won't know where to put "shared" things. |

**📌 Decision:** Rename `shared/` → `assets/` to remove semantic ambiguity.

### 3.3. `skills/_template/SKILL.md` — Empty

The Skill template should have a working example so that copying it only requires filling in fields. This is critical for the Milestone 4 `.agents/skills/` requirement.

### 3.4. `agents/_template/agent.py` — Empty

Same issue: the agent template should have a functional skeleton with a base class.

---

## 4. Milestone 4 Requirements Mapping

### 4.1. Alignment with Nexova Context

All Milestone 4 deliverables must be **grounded in the assigned company context** (`CONTEXT.md` = Nexova briefing). Below is the traceability mapping:

| Milestone 4 Requirement | Nexova Context Anchor | File Location |
|------------------------|----------------------|---------------|
| `memory-bank/projectbrief.md` | Nexova's 8 departments, revenue ($8M), 120 employees, SLA gaps (48h vs 24h), manual CV screening | `memory-bank/projectbrief.md` |
| `memory-bank/techContext.md` | Stack decisions (Python/FastAPI, Next.js/TypeScript, Qdrant, PostgreSQL), monorepo layout, multi-tenant constraints | `memory-bank/techContext.md` |
| `memory-bank/progress.md` | Current status (template only), in-flight items (Milestone 4), next steps | `memory-bank/progress.md` |
| `AGENTS.md` session reads | Must list `memory-bank/projectbrief.md`, `memory-bank/techContext.md`, `memory-bank/progress.md`, `CONTEXT.md` | `AGENTS.md` (root) |
| `AGENTS.md` pre-commit workflow | 4+ ordered steps: format, lint, test, update progress.md, self-review scope | `AGENTS.md` (root) |
| `AGENTS.md` protected areas | `data/raw/` (source data), `.agents/` (governance), `packages/` (shared libs), `docker-compose.yml` | `AGENTS.md` (root) |
| `.agents/rules/` | At least one rule: naming conventions, import rules, multi-tenant isolation | `.agents/rules/` |
| `.agents/skills/<name>/SKILL.md` | Skill with single objective, documented inputs, verifiable acceptance criteria | `.agents/skills/` |
| `uis/website` | Nexova corporate site (from Milestone 1) — reusable React/TS components, consistent brand | `uis/website/` |
| `uis/backoffice` | Internal app — dedicated layout, entry view on `/`, imports Milestone 2 logic | `uis/backoffice/` |
| API under `services/` | Services backing the backoffice UI | `services/` |
| Branch `feature/agent-memory-bank` | Delivery branch name | Git |

### 4.2. Traceability Matrix (context → deliverable)

```
Nexova CONTEXT (briefing)
├── 👤 Customer Support (Roberto Díaz)
│   └── 📋 memory-bank/projectbrief.md → SLA metrics, L1 agent goal
│   └── 🤖 .agents/skills/ticket-resolution/SKILL.md
│
├── 🔍 Talent Selection (Javier Almeida)
│   └── 📋 memory-bank/projectbrief.md → CV scoring, ranking
│   └── 🤖 .agents/skills/cv-scoring/SKILL.md
│
├── 💼 Sales (Marcos Ibáñez)
│   └── 📋 memory-bank/projectbrief.md → pipeline, follow-up automation
│
├── 🎓 Training (Elena Vargas)
│   └── 📋 memory-bank/projectbrief.md → catalogue, recommendation
│
├── 📊 Executive (Laura Mendoza)
│   └── 📋 memory-bank/projectbrief.md → dashboard, weekly reports
│
├── 🌐 Marketing (Carmen Ruiz)
│   └── 🌐 uis/website → corporate site redesign
│
└── 💻 Technology (Sergio Molina)
    └── 📐 memory-bank/techContext.md → stack decisions, constraints
    └── 🏗️ .agents/rules/ → naming, isolation, conventions
```

---

## 5. Proposed Folder Structure

### 5.1. Target Tree (Milestone 4 delivery)

```
/
├── CONTEXT.md                       # ← Consolidated: Nexova company briefing
├── CONTEXT.es.md                    # ← Spanish version
├── README.md / README.es.md         # ← Main guide
├── AGENTS.md                        # ← 🔴 NEW (Milestone 4): session protocol + pre-commit + protected paths
├── kickoff.md                       # ← This document
│
├── .agents/                         # ← 🔴 NEW (Milestone 4): agent governance
│   ├── rules/
│   │   ├── README.md
│   │   └── nexova-conventions.md    # ← Scoped rule: naming, imports, multi-tenant
│   └── skills/
│       ├── README.md
│       └── ticket-resolution/
│           └── SKILL.md             # ← Skill with objective, inputs, verifiable criteria
│
├── memory-bank/                     # ← 🔴 NEW (Milestone 4): living memory
│   ├── projectbrief.md             # ← Business context grounded in Nexova CONTEXT
│   ├── techContext.md              # ← Stack, ADRs, monorepo layout, constraints
│   └── progress.md                 # ← Living log: implemented, in-flight, next steps
│
├── docs/
│   ├── README.md
│   ├── architecture.md
│   ├── adr/
│   ├── planning/
│   │   └── company-choice.md       # ← MOVED from root
│   └── milestones/
│       └── 01-forecast-model.md    # ← RENAMED from CONTEXT-Nexova.en.md
│
├── assets/                          # ← RENAMED from shared/
│   ├── README.md
│   ├── schemas/
│   ├── templates/
│   └── design-tokens/
│
├── packages/
│   ├── README.md
│   └── shared/
│       ├── package.json
│       └── types/
│           └── index.ts
│
├── agents/
│   ├── README.md
│   ├── _template/
│   │   ├── agent.py
│   │   ├── README.md
│   │   └── tests/
│   ├── tools/
│   │   ├── README.md
│   │   ├── __init__.py
│   │   ├── kb_search.py
│   │   ├── ticket_classifier.py
│   │   ├── cv_parser.py
│   │   └── slack_notifier.py
│   ├── helpdesk-agent/
│   │   ├── README.md
│   │   ├── agent.py
│   │   ├── prompts/
│   │   ├── tests/
│   │   └── config.yml
│   └── cv-matching-agent/
│       ├── README.md
│       ├── agent.py
│       ├── prompts/
│       ├── tests/
│       └── config.yml
│
├── skills/
│   ├── README.md
│   ├── _template/
│   │   ├── SKILL.md
│   │   ├── README.md
│   │   ├── scripts/
│   │   └── resources/
│   ├── data-analysis/
│   │   ├── SKILL.md
│   │   ├── scripts/
│   │   │   └── pandas_clean.py
│   │   └── resources/
│   │       └── common_metrics.md
│   ├── code-review/
│   │   ├── SKILL.md
│   │   ├── scripts/
│   │   └── resources/
│   ├── research/
│   │   ├── SKILL.md
│   │   ├── scripts/
│   │   ├── examples/
│   │   └── templates/
│   ├── ticket-resolution/
│   │   ├── SKILL.md
│   │   ├── scripts/
│   │   └── resources/
│   ├── cv-scoring/
│   │   ├── SKILL.md
│   │   ├── scripts/
│   │   └── resources/
│   ├── sales-prospecting/
│   │   ├── SKILL.md
│   │   ├── scripts/
│   │   └── resources/
│   └── training-recommendation/
│       ├── SKILL.md
│       ├── scripts/
│       └── resources/
│
├── mcps/
│   ├── README.md
│   ├── database-mcp/
│   │   ├── server.py
│   │   └── README.md
│   └── github-mcp/
│       ├── server.py
│       └── README.md
│
├── services/
│   ├── README.md
│   └── api/
│       ├── README.md
│       ├── pyproject.toml
│       ├── src/
│       │   ├── main.py
│       │   ├── routers/
│       │   │   ├── health.py
│       │   │   ├── tickets.py
│       │   │   ├── candidates.py
│       │   │   ├── training.py
│       │   │   └── sales.py
│       │   ├── models/
│       │   ├── services/
│       │   └── middleware/
│       └── tests/
│
├── uis/
│   ├── README.md
│   ├── website/                     # ← 🔴 NEW: Next.js corporate site (Milestone 1)
│   │   ├── README.md
│   │   ├── package.json
│   │   ├── src/
│   │   │   ├── app/
│   │   │   │   ├── page.tsx         # ← Home route `/` — full corporate site
│   │   │   │   ├── layout.tsx
│   │   │   │   └── ...
│   │   │   └── components/          # ← Reusable React components
│   │   └── ...
│   └── backoffice/                  # ← 🔴 NEW: Next.js internal app (Milestone 4)
│       ├── README.md
│       ├── package.json
│       ├── src/
│       │   ├── app/
│       │   │   ├── page.tsx         # ← Entry view `/` — welcome/dashboard shell
│       │   │   └── layout.tsx       # ← Dedicated layout (separate from website)
│       │   └── components/
│       └── ...
│
├── data/
│   ├── README.md
│   ├── raw/
│   │   ├── README.md
│   │   └── nexova_sales.csv
│   ├── pipelines/
│   │   ├── README.md
│   │   ├── etl_sales.py
│   │   └── etl_knowledge_base.py
│   ├── process/
│   │   └── README.md
│   └── eval/
│       ├── README.md
│       └── golden_sets/
│
├── workflows/
│   ├── README.md
│   ├── sla-alert-workflow.json
│   ├── nightly-etl-workflow.json
│   └── cv-sync-workflow.json
│
├── infra/
│   ├── README.md
│   ├── docker-compose.yml
│   ├── Dockerfile.api
│   ├── Dockerfile.agent
│   └── terraform/
│
├── scripts/
│   ├── README.md
│   ├── setup.sh
│   ├── train_forecast.py
│   └── seed_data.py
│
├── internal/
│   ├── README.md
│   └── cli/
│       └── README.md
│
├── .env.example
├── .gitignore
├── Makefile
├── package.json                     # ← Root workspace (pnpm)
└── docker-compose.yml
```

---

## 6. Agent Governance Architecture

This section defines the **governance artifacts** required by Milestone 4 — `memory-bank/`, `AGENTS.md`, `.agents/rules/`, and `.agents/skills/` — grounded in Nexova's business context.

### 6.1. `memory-bank/` — Content Specification

#### `memory-bank/projectbrief.md`

Must capture:

- **Company:** Nexova Solutions (founded 2011, Valencia + Miami, 120 employees, $8M revenue)
- **Business lines:** Headhunting (~35%), Customer Support Outsourcing (~45%), Corporate Training (~20%)
- **CEO:** Laura Mendoza — needs real-time unified executive view
- **Critical problems:**
  - Support team misses 24h SLA (actual: 48h avg), no knowledge base, 30 agents
  - Selection consultants manually screen 30–80 CVs per process, no shared scoring
  - Sales team uses CRM inconsistently (40% update rate), loses deals from poor follow-up
  - Training catalogue is a PDF, enrolments via Google Forms
  - All department heads spend 4–8h/week preparing PDF reports for Laura
- **Key KPIs:** SLA compliance, L1 resolution rate (target >40%), top-5 recall for CV matching, override rate trend, conversion rates
- **Multi-tenant constraint:** Nexova serves multiple clients; data isolation must be enforced at query level, never via prompt instructions
- **Regulatory:** EU GDPR — automated hiring decisions risk Article 22 violations

#### `memory-bank/techContext.md`

Must document:

| Category | Decision |
|----------|----------|
| **Agent language** | Python (LangChain/LlamaIndex ecosystem) |
| **UI language** | TypeScript, Next.js (App Router) |
| **Backend API** | FastAPI, under `services/api/` |
| **Vector store** | Qdrant (native multi-tenant, hybrid search) |
| **Relational DB** | PostgreSQL (JSONB for semi-structured data) |
| **Monorepo** | pnpm workspaces |
| **Skills location** | `skills/<name>/SKILL.md` + scripts + resources |
| **MCP servers** | `mcps/<name>/server.py` (Python SDK) |
| **Workflows** | n8n, exported JSON under `workflows/` |
| **Dev environment** | Devcontainer with universal image, Docker Compose |
| **Branch convention** | `feature/<name>` for features, PRs target `main` |

#### `memory-bank/progress.md`

Living log tracking:

- **Implemented:** Folder structure, READMEs, devcontainer, skills template, data-analysis skill
- **In flight:** Milestone 4 (memory-bank, AGENTS.md, .agents/, uis/website, uis/backoffice)
- **Next:** Milestone 5+ (RAG agents, MCP servers, real-time dashboards)

### 6.2. `AGENTS.md` — Agent Protocol

```markdown
# AGENTS.md — Nexova Monorepo Protocol

## Session Start — Required Reads
Before making any edit, read these files in order:
1. `memory-bank/projectbrief.md` — Business context, KPIs, constraints
2. `memory-bank/techContext.md` — Stack, architecture, conventions
3. `memory-bank/progress.md` — Current status, what's in flight
4. `CONTEXT.md` — Nexova company briefing (8 departments, problems)
5. `.agents/rules/nexova-conventions.md` — Scoped rules for this repo

## Pre-Commit Workflow (4 ordered steps)
Before committing, execute these steps in order:

1. **Format & Lint**: Run `make format` (Prettier + Ruff) and `make lint` (ESLint + Pylint). Fix all errors.
2. **Type Check & Test**: Run `make typecheck` (pyright/tsc --noEmit) and `make test` (pytest + vitest). All must pass.
3. **Update progress.md**: If the change adds, removes, or modifies a behavior, file, or dependency, update `memory-bank/progress.md` accordingly.
4. **Self-Review Diff Scope**: Review the staged diff. Confirm:
   - No changes to protected areas (listed below) without explicit human confirmation.
   - No unnecessary files committed (.env, __pycache__, node_modules, .next).
   - Branch name matches convention (`feature/` or `fix/`).

## Protected Areas — Human Confirmation Required
These paths must NOT be modified without explicit human approval:
- `data/raw/*` — Source data files (immutable once committed)
- `.agents/rules/*` — Agent governance rules
- `packages/shared/*` — Shared library interfaces (breaking changes need team review)
- `docker-compose.yml` — Service orchestration topology
- `.devcontainer/*` — Development environment configuration
- `.github/*` — CI/CD workflows
```

### 6.3. `.agents/rules/nexova-conventions.md` — Scoped Rule

```markdown
# Rule: Nexova Naming & Isolation Conventions

**Scope:** Always-on (applies to all agents working in this repo)

## Multi-tenant Data Isolation
- All database queries filtering by client/customer must use a WHERE clause.
- Never rely on LLM prompt instructions for tenant isolation.
- Vector store searches must pass `client_id` as a metadata filter, never as part of the query text.

## Naming Conventions
- Python: snake_case for functions/variables, PascalCase for classes
- TypeScript: camelCase for functions/variables, PascalCase for types/interfaces
- Agent folders: kebab-case (e.g., `helpdesk-agent/`, `cv-matching-agent/`)
- Skills: kebab-case (e.g., `ticket-resolution/`, `cv-scoring/`)

## Import Rules
- Business logic from Milestone 2 must be imported from its original `packages/` path.
- Never copy-paste business logic into the Next.js tree.
- Skills must import `data-analysis` utilities rather than reimplementing them.

## Where New Code Lives
- Frontend pages → `uis/<app>/src/app/`
- Reusable UI components → `uis/<app>/src/components/`
- API routes → `services/api/src/routers/`
- Agent logic → `agents/<agent-name>/`
- Reusable agent tools → `agents/tools/`
- Agent skills → `skills/<skill-name>/`
- MCP servers → `mcps/<server-name>/`
```

### 6.4. `.agents/skills/ticket-resolution/SKILL.md` — Verifiable Skill

```markdown
# Skill: ticket-resolution

## Objective
Classify an incoming support ticket by urgency and category, search the knowledge base for similar resolved cases, and either draft a grounded response (L1) or produce an escalation summary (L2).

## Inputs
- `ticket_text: str` — Raw customer query (untrusted)
- `client_id: str` — Tenant identifier for data isolation
- `kb_top_k: int` — Number of similar cases to retrieve (default: 5)

## Acceptance Criteria (checkboxes)
- [ ] Ticket text is classified into one of: `billing`, `technical`, `account`, `general`
- [ ] Urgency is classified as: `low`, `medium`, `high`, `critical`
- [ ] Knowledge base search is scoped to `client_id` only (verified via filter inspection)
- [ ] Response confidence score is between 0.0 and 1.0
- [ ] If confidence >= 0.7: a draft response is generated with citations from KB chunks
- [ ] If confidence < 0.7: an escalation summary is produced instead (no draft response)
- [ ] If confidence < 0.4: ticket is flagged for SLA monitoring
- [ ] All decisions are logged with: timestamp, ticket_id, confidence, level, client_id
```

---

## 7. Skills Architecture: The Reusable Core

### 7.1. Skill Anatomy

Every Skill follows this contract:

```
skills/<skill-name>/
├── SKILL.md              # Required: purpose, inputs, outputs, criteria
├── scripts/              # Optional: executable code (.py / .ts)
└── resources/            # Optional: references, prompts, configs
```

### 7.2. Skill Reuse Chain

```
📊 data-analysis (base skill — cleaning, metrics, stats)
│
├── 📋 cv-scoring ──── uses ──► data-analysis
│   └── 🤖 cv-matching-agent
│
├── 🎫 ticket-resolution ── uses ──► data-analysis
│   └── 🤖 helpdesk-agent
│
├── 💼 sales-prospecting ── uses ──► data-analysis
│   └── 🤖 sales-assistant-agent
│
├── 🎓 training-recommendation ── uses ──► data-analysis
│   └── 🤖 training-advisor-agent
│
└── 📊 executive-reporting ── uses ──► data-analysis
    └── 🤖 executive-assistant-agent
```

**Key principle:** `data-analysis` is the **base skill** that all others depend on. This maximizes reuse and minimizes duplication.

### 7.3. Skill → Department Mapping (Nexova)

| Department | Skills Needed | Priority |
|------------|--------------|----------|
| **Customer Support** (Roberto Díaz) | `ticket-resolution`, `sentiment-analysis`, `kb-management`, `data-analysis` | 🔴 HIGH |
| **Talent Selection** (Javier Almeida) | `cv-scoring`, `candidate-matching`, `cv-parsing`, `data-analysis` | 🔴 HIGH |
| **Sales** (Marcos Ibáñez) | `sales-prospecting`, `email-composer`, `lead-scoring`, `data-analysis` | 🟡 MEDIUM |
| **Corporate Training** (Elena Vargas) | `training-recommendation`, `content-pipeline`, `data-analysis` | 🟡 MEDIUM |
| **HR** (Patricia Solís) | `onboarding-flow`, `hr-policy-qa`, `data-analysis` | 🟢 LOW |
| **Marketing** (Carmen Ruiz) | `content-pipeline`, `seo-audit`, `data-analysis` | 🟢 LOW |
| **Executive** (Laura Mendoza) | `executive-reporting`, `data-analysis` | 🟡 MEDIUM |

---

## 8. Action Plan by Phase

### 🔴 Phase 0 — Cleanup & Setup (Days 1–2)

Fixes all root-level duplication and creates the minimal config files for the monorepo to function.

| # | Task | Details | Dependencies |
|---|------|---------|--------------|
| 0.1 | **Unify CONTEXT** → `CONTEXT.md` | Copy `CONTEXT-nexova-briefing.en.md` → `CONTEXT.md`. Create `CONTEXT.es.md` | — |
| 0.2 | **Rename `CONTEXT-Nexova.en.md`** → `docs/milestones/01-forecast-model.md` | Move and rename | — |
| 0.3 | **Move `Company-choice.md`** → `docs/planning/company-choice.md` | Create `docs/planning/` and move | — |
| 0.4 | **Rename `shared/` → `assets/`** | Rename folder + update README references | — |
| 0.5 | **Populate `.gitignore`** | node_modules/, .env, __pycache__, .venv, .DS_Store, *.pyc, dist/, .next/ | — |
| 0.6 | **Create `.env.example`** | `DATABASE_URL`, `VECTOR_STORE_URL`, `LLM_API_KEY`, `CLIENT_ID`, `API_PORT`, `UI_PORT` | — |
| 0.7 | **Create `Makefile`** | Commands: `install`, `test`, `lint`, `format`, `typecheck`, `run-api`, `run-website`, `run-backoffice`, `clean` | — |
| 0.8 | **Configure root `package.json`** | pnpm workspace pointing to `packages/*` and `uis/*` | — |
| 0.9 | **Populate `skills/_template/SKILL.md`** | Functional template with purpose, inputs, outputs, and verifiable criteria | — |
| 0.10 | **Populate `agents/_template/agent.py`** | Base class `BaseAgent` with `run()`, `_load_skills()`, `_call_llm()`, `_log_action()` | — |
| 0.11 | **Create `.agents/rules/nexova-conventions.md`** | Scoped, actionable rules (see §6.3) | — |
| 0.12 | **Create `.agents/skills/ticket-resolution/SKILL.md`** | Skill with objective, inputs, verifiable acceptance criteria (see §6.4) | — |

### 🟡 Phase 1 — Memory Bank & Agent Protocol (Days 2–3)

This phase delivers the **core Milestone 4 governance artifacts**.

| # | Task | Description | Dependencies |
|---|-------|-------------|--------------|
| 1.1 | **Create `memory-bank/`** | `projectbrief.md`, `techContext.md`, `progress.md` — all grounded in Nexova CONTEXT | Phase 0 |
| 1.2 | **Create `AGENTS.md`** | Session-start reads (5 files), pre-commit workflow (4 steps), protected areas (6 paths) | 1.1 |
| 1.3 | **Create `memory-bank/progress.md`** | Living log with implemented, in-flight, next sections | 1.1 |
| 1.4 | **Cross-reference memory bank with CONTEXT** | Every KPI ties to a department; every tech decision references the monorepo layout | 1.1, 1.2 |

### 🟢 Phase 2 — Frontend Foundation (Days 3–7)

This phase delivers **Part B** of Milestone 4: the Next.js applications.

| # | Task | Description | Dependencies |
|---|-------|-------------|--------------|
| 2.1 | **Initialize `uis/website` (Next.js)** | Full corporate site on `/` with reusable React/TS components, consistent brand | Phase 0 |
| 2.2 | **Initialize `uis/backoffice` (Next.js)** | Dedicated layout, entry view `/` as welcome/dashboard shell | 2.1 |
| 2.3 | **Import Milestone 2 logic** | Import from original `packages/` path, display result in `uis/backoffice` UI | 2.2 |
| 2.4 | **Create API service** | `services/api/` with FastAPI, `/health` endpoint, routers for backoffice data | 2.2 |
| 2.5 | **Wire backoffice → API** | Backoffice consumes API for data display; Milestone 2 logic visible in UI | 2.3, 2.4 |
| 2.6 | **Docker Compose for services** | `docker-compose.yml` with api, postgres, qdrant | 2.4 |
| 2.7 | **Basic tests** | `pytest` for API, `vitest` for UI components | 2.1, 2.4 |

### 🔵 Phase 3 — Agent Implementation (Weeks 2–3)

| # | Task | Description | Dependencies |
|---|-------|-------------|--------------|
| 3.1 | **HelpDesk Support Agent** | L1/L2 with RAG, escalation, SLA alerts | Phase 1, Phase 2 |
| 3.2 | **CV-Vacancy Matching Agent** | Scoring + ranking + override logging | Phase 1, Phase 2 |
| 3.3 | **n8n workflow: SLA Alert** | Monitors tickets approaching SLA deadline | 3.1 |
| 3.4 | **Support dashboard** | `uis/backoffice/` real-time ticket table | 3.1 |
| 3.5 | **Evaluations (eval)** | Golden set for L1 resolution + faithfulness tests | 3.1, 3.2 |

### 🟣 Phase 4 — Expansion (Weeks 4+)

| # | Task | Priority |
|---|-------|----------|
| 4.1 | Sales prospecting agent | MEDIUM |
| 4.2 | Training recommendation agent | MEDIUM |
| 4.3 | Executive dashboard (Laura) | HIGH |
| 4.4 | CI/CD with GitHub Actions | HIGH |
| 4.5 | Candidate portal | MEDIUM |
| 4.6 | Training portal | LOW |

---

## 9. Delivery Checklist

### 9.1. Milestone 4 Reviewer Checklist

Checklist based on the academy's reference solution:

#### Agent Infrastructure
- [ ] `memory-bank/` exists with `projectbrief.md`, `techContext.md`, and `progress.md`
- [ ] Memory bank reflects **both** business and technical context tied to `CONTEXT.md`
- [ ] `AGENTS.md` lists mandatory memory-bank reads at session start
- [ ] `AGENTS.md` defines a **minimum four-step ordered workflow** before commit
- [ ] `AGENTS.md` lists paths the agent must not touch without explicit confirmation
- [ ] `.agents/rules/` contains at least one scoped, actionable rule
- [ ] `.agents/skills/` contains at least one skill with: single objective, documented inputs, verifiable acceptance criteria (checkboxes or measurable outcomes)

#### Application
- [ ] `uis/website` starts without errors using the documented dev command
- [ ] `/` in `uis/website` shows the complete Milestone 1 corporate site as React/TS components
- [ ] `uis/backoffice` loads with its own layout and a clear entry view
- [ ] Milestone 2 logic is consumed via **import from original location**; UI in `uis/backoffice` shows a meaningful result
- [ ] API services are located under `services/`
- [ ] No unjustified duplication of business logic source files

#### Delivery
- [ ] Branch name is `feature/agent-memory-bank`
- [ ] PR targets `main` on the student fork
- [ ] PR includes screenshots of `uis/website` and `uis/backoffice`
- [ ] PR description includes a link to `AGENTS.md`

### 9.2. Fast Start Checklist

```
[ ] CONTEXT.md unified from briefing
[ ] .gitignore populated
[ ] .env.example created
[ ] Makefile functional (make install, make test, make run)
[ ] Root package.json with pnpm workspace
[ ] memory-bank/projectbrief.md written
[ ] memory-bank/techContext.md written
[ ] memory-bank/progress.md written
[ ] AGENTS.md with session reads + 4-step pre-commit + protected paths
[ ] .agents/rules/nexova-conventions.md created
[ ] .agents/skills/ticket-resolution/SKILL.md with verifiable criteria
[ ] skills/_template/SKILL.md with real example
[ ] agents/_template/agent.py with BaseAgent class
[ ] uis/website — Next.js app, corporate site on / (no errors)
[ ] uis/backoffice — Next.js app, dedicated layout, entry view
[ ] Milestone 2 logic imported and visible in backoffice UI
[ ] services/api/ — FastAPI with /health
[ ] docker-compose.yml with api + postgres
[ ] Tests passing (make test → green)
```

### 9.3. Branch & PR Workflow

```bash
# 1. Create the delivery branch
git checkout -b feature/agent-memory-bank

# 2. Implement all Phase 0–2 tasks
# ...

# 3. Run the pre-commit workflow
make format    # Step 1: Format & Lint
make lint      # Step 1 (continued)
make typecheck # Step 2: Type check
make test      # Step 2 (continued)
# Update memory-bank/progress.md  # Step 3
# Self-review diff scope          # Step 4

# 4. Commit
git add .
git commit -m "feat: Milestone 4 — agent infrastructure + Next.js apps"

# 5. Push and create PR
git push origin feature/agent-memory-bank
# → Create PR targeting main
# → Add screenshots of uis/website and uis/backoffice
# → Add link to AGENTS.md in PR description
```

---

## 10. Architectural Decisions

| Decision | Chosen Option | Justification |
|----------|---------------|---------------|
| **Agent language** | Python | Mature AI ecosystem (LangChain, LlamaIndex, vector tools) |
| **UI language** | TypeScript, Next.js | Strong typing, modern web ecosystem, App Router |
| **Backend API** | FastAPI (Python) | Performance, auto-generated OpenAPI docs, Pydantic validation |
| **Vector store** | Qdrant | Lightweight, native multi-tenant, hybrid search, gRPC |
| **Relational DB** | PostgreSQL | Reliable, JSONB for semi-structured data, great ecosystem |
| **Workflow orchestration** | n8n (local) | Visual, connects APIs without code, self-hosted |
| **Monorepo** | pnpm workspaces | Fast, strict dependency management, native monorepo support |
| **Skills** | `skills/` dir with SKILL.md + scripts | Simple, portable, zero heavy dependencies |
| **Agent skills (M4)** | `.agents/skills/` with verifiable criteria | Aligned with Milestone 4 governance requirements |
| **Governance** | `memory-bank/` + `AGENTS.md` + `.agents/rules/` | Per Milestone 4 spec — session protocol, pre-commit, protected paths |
| **MCP** | Python SDK | Standardized, future-proof, interoperable |
| **Devcontainers** | Universal image | Portability, zero-setup for new developers |
| **Data isolation** | Query-level tenant filter | Multi-tenant must be enforced at DB/vector level, never via prompts |

---

> _This is a living document. As the project progresses, update this kickoff with new decisions, discovered skills, and lessons learned._
>
> **Next revision:** Upon completing Phase 2 (Frontend Foundation).
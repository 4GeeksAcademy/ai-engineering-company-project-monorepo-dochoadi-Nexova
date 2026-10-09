# 📋 PLAYBOOK — Nexova Milestone 4: Step-by-Step Execution Guide

> **Date:** 2026-10-09
> **Purpose:** Actionable, step-by-step instructions to transform the skeletal monorepo into a working Milestone 4 delivery. Each step is ordered, tested, and references the source of truth (`kickoff.md`) for rationale.
> **Prerequisites:** Git, Node.js (≥18), Python (≥3.10), pnpm, Docker, VS Code devcontainer support.

---

## How to Use This Playbook

- **Follow phases in order.** Each phase builds on the previous one.
- **Each step is a unit.** Complete it before moving to the next.
- **Check off boxes** as you go to track progress.
- **When in doubt**, refer to the corresponding section in `kickoff.md`.

---

## Phase 0 — Cleanup & Setup (Ordered Steps)

> **Goal:** Fix root-level clutter, create config files, and establish monorepo foundations.
> **Kickoff reference:** §8 — Action Plan by Phase / Phase 0

### Step 0.1 — Unify CONTEXT files

- [ ] Copy `CONTEXT-nexova-briefing.en.md` → `CONTEXT.md` (the official company context)
- [ ] Copy `CONTEXT-nexova-briefing.es.md` → `CONTEXT.es.md` (Spanish version)
- [ ] Move `CONTEXT-Nexova.en.md` → `docs/milestones/01-forecast-model.md`
- [ ] Move `Company-choice.md` → `docs/planning/company-choice.md`
- [ ] Delete root-level originals: `CONTEXT-nexova-briefing.en.md`, `CONTEXT-nexova-briefing.es.md`, `CONTEXT-Nexova.en.md`

```bash
mkdir -p docs/milestones docs/planning
cp CONTEXT-nexova-briefing.en.md CONTEXT.md
cp CONTEXT-nexova-briefing.es.md CONTEXT.es.md
mv CONTEXT-Nexova.en.md docs/milestones/01-forecast-model.md
mv Company-choice.md docs/planning/company-choice.md
git rm CONTEXT-nexova-briefing.en.md CONTEXT-nexova-briefing.es.md
```

### Step 0.2 — Rename `shared/` → `assets/`

- [ ] Rename the directory
- [ ] Update any README references from `shared/` to `assets/`

```bash
mv shared assets
# Search and replace 'shared/' → 'assets/' in README files
grep -rl "shared/" --include="*.md" . | xargs sed -i 's|shared/|assets/|g'
```

### Step 0.3 — Populate `.gitignore`

- [ ] Replace empty `.gitignore` with a comprehensive one

```bash
cat > .gitignore << 'EOF'
# Dependencies
node_modules/
.pnpm-store/
.venv/
venv/
__pycache__/
*.pyc
*.pyo

# Build output
dist/
build/
.next/
out/

# Environment
.env
.env.local
.env.*.local

# OS
.DS_Store
Thumbs.db

# IDE
.vscode/settings.json
*.swp
*.swo

# Logs
*.log
EOF
```

### Step 0.4 — Create `.env.example`

- [ ] Create environment variable template

```bash
cat > .env.example << 'EOF'
DATABASE_URL=postgresql://nexova:nexova@localhost:5432/nexova
VECTOR_STORE_URL=localhost:6333
LLM_API_KEY=
CLIENT_ID=nexova_default
API_PORT=8000
UI_PORT=3000
BACKOFFICE_PORT=3001
NEXT_PUBLIC_API_URL=http://localhost:8000
EOF
```

### Step 0.5 — Create `Makefile`

- [ ] Create the Makefile with standardized commands

```bash
cat > Makefile << 'MAKEEOF'
.PHONY: install test lint format typecheck run-api run-website run-backoffice clean

# ─── Installation ───────────────────────────────────────────────
install:
	@echo "Installing root dependencies..."
	pnpm install
	@echo "Installing API dependencies..."
	cd services/api && pip install -e ".[dev]"
	@echo "Done."

# ─── Testing ────────────────────────────────────────────────────
test:
	@echo "Running API tests..."
	cd services/api && pytest
	@echo "Running UI tests..."
	cd uis/website && pnpm test --run
	cd uis/backoffice && pnpm test --run

# ─── Linting ─────────────────────────────────────────────────────
lint:
	@echo "Linting Python..."
	cd services/api && ruff check .
	@echo "Linting TypeScript..."
	cd uis/website && pnpm lint
	cd uis/backoffice && pnpm lint

format:
	@echo "Formatting Python..."
	cd services/api && ruff format .
	@echo "Formatting TypeScript..."
	cd uis/website && pnpm format
	cd uis/backoffice && pnpm format

# ─── Type Checking ──────────────────────────────────────────────
typecheck:
	@echo "Type checking Python..."
	cd services/api && pyright .
	@echo "Type checking TypeScript..."
	cd uis/website && pnpm typecheck
	cd uis/backoffice && pnpm typecheck

# ─── Running ─────────────────────────────────────────────────────
run-api:
	cd services/api && uvicorn src.main:app --reload --port 8000

run-website:
	cd uis/website && pnpm dev --port 3000

run-backoffice:
	cd uis/backoffice && pnpm dev --port 3001

# ─── Cleanup ─────────────────────────────────────────────────────
clean:
	@echo "Cleaning..."
	find . -type d -name __pycache__ -exec rm -rf {} + 2>/dev/null || true
	find . -type d -name .next -exec rm -rf {} + 2>/dev/null || true
	find . -type d -name node_modules -exec rm -rf {} + 2>/dev/null || true
	find . -type d -name .venv -exec rm -rf {} + 2>/dev/null || true
	@echo "Done."
MAKEEOF
```

### Step 0.6 — Configure root `package.json`

- [ ] Create root package.json with pnpm workspace

```bash
cat > package.json << 'EOF'
{
  "name": "nexova-monorepo",
  "private": true,
  "packageManager": "pnpm@9.0.0",
  "scripts": {
    "dev:website": "pnpm --filter website dev",
    "dev:backoffice": "pnpm --filter backoffice dev",
    "build": "pnpm --recursive build",
    "lint": "pnpm --recursive lint",
    "typecheck": "pnpm --recursive typecheck",
    "format": "pnpm --recursive format",
    "test": "pnpm --recursive test"
  },
  "workspaces": [
    "packages/*",
    "uis/*"
  ]
}
EOF
```

### Step 0.7 — Populate `skills/_template/SKILL.md`

- [ ] Create a functional skill template

```bash
mkdir -p skills/_template/scripts skills/_template/resources
cat > skills/_template/SKILL.md << 'EOF'
# Skill: <skill-name>

## Objective
_One sentence describing what this skill accomplishes._

## Inputs
| Name | Type | Description |
|------|------|-------------|
| `input_1` | `str` | Description of first input |
| `input_2` | `int` | Description of second input |

## Outputs
| Name | Type | Description |
|------|------|-------------|
| `output_1` | `str` | Description of first output |

## Acceptance Criteria
- [ ] Input validation: all required inputs are present and typed correctly
- [ ] Core logic: performs the described transformation or analysis
- [ ] Error handling: returns meaningful error messages for invalid inputs
- [ ] Logging: all actions are logged with timestamp
- [ ] Testable: can be invoked with sample data and produces expected output

## Dependencies
- List any base skills this skill uses (e.g., `data-analysis`)

## Example Usage
```python
# Example of how to use this skill
result = skill.run(input_1="sample data")
print(result)
```
EOF
```

### Step 0.8 — Populate `agents/_template/agent.py`

- [ ] Create a functional BaseAgent class

```python
cat > agents/_template/agent.py << 'PYEOF'
"""
BaseAgent — Abstract base class for all Nexova agents.

All agents should inherit from this class and implement:
- _load_skills(): load the skills this agent uses
- run(input_data): main execution entry point
"""

from abc import ABC, abstractmethod
from datetime import datetime
import logging
from typing import Any, Dict, Optional


class BaseAgent(ABC):
    """Abstract base agent with logging, LLM integration, and skill loading."""

    def __init__(self, agent_name: str, config: Optional[Dict[str, Any]] = None):
        self.agent_name = agent_name
        self.config = config or {}
        self.skills = {}
        self.logger = logging.getLogger(f"agent.{agent_name}")
        self._setup_logging()
        self._load_skills()

    def _setup_logging(self) -> None:
        """Configure agent-specific logger."""
        handler = logging.StreamHandler()
        handler.setFormatter(logging.Formatter(
            "%(asctime)s [%(name)s] %(levelname)s: %(message)s"
        ))
        self.logger.addHandler(handler)
        self.logger.setLevel(logging.INFO)

    @abstractmethod
    def _load_skills(self) -> None:
        """Load skills this agent depends on.
        
        Subclasses should populate self.skills dict, e.g.:
            from skills.data-analysis.scripts.pandas_clean import clean_dataframe
            self.skills["clean"] = clean_dataframe
        """
        pass

    def _call_llm(self, prompt: str, **kwargs) -> str:
        """Call the LLM with a given prompt.
        
        Args:
            prompt: The prompt string to send to the LLM.
            **kwargs: Additional parameters (temperature, max_tokens, etc.)
        
        Returns:
            The LLM response as a string.
        """
        self.logger.info(f"LLM call: prompt_length={len(prompt)}, kwargs={kwargs}")
        # TODO: Replace with actual LLM client integration
        # Example: return openai_client.chat.completions.create(...)
        raise NotImplementedError("Subclasses must wire LLM client")

    def _log_action(self, action: str, details: Optional[Dict[str, Any]] = None) -> None:
        """Log an agent action with timestamp.
        
        Args:
            action: Short action name (e.g., 'ticket_classified', 'cv_scored').
            details: Optional key-value pairs with action metadata.
        """
        log_entry = {
            "timestamp": datetime.utcnow().isoformat(),
            "agent": self.agent_name,
            "action": action,
            "details": details or {},
        }
        self.logger.info(f"ACTION_LOG: {log_entry}")

    @abstractmethod
    def run(self, input_data: Dict[str, Any]) -> Dict[str, Any]:
        """Main execution entry point.
        
        Args:
            input_data: Dictionary with input parameters.
        
        Returns:
            Dictionary with execution results.
        """
        pass
PYEOF
```

### Step 0.9 — Create `.agents/rules/nexova-conventions.md`

- [ ] Create scoped governance rule (content in kickoff.md §6.3)

```bash
mkdir -p .agents/rules
cat > .agents/rules/nexova-conventions.md << 'RULEEOF'
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
RULEEOF
```

### Step 0.10 — Create `.agents/skills/ticket-resolution/SKILL.md`

- [ ] Create the verifiable skill definition (content in kickoff.md §6.4)

```bash
mkdir -p .agents/skills/ticket-resolution
cat > .agents/skills/ticket-resolution/SKILL.md << 'SKILLEOF'
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
SKILLEOF
```

### Step 0.11 — Create `.agents/rules/README.md` and `.agents/skills/README.md`

- [ ] Add READMEs for the new `.agents/` subdirectories

```bash
cat > .agents/rules/README.md << 'EOF'
# `.agents/rules/` — Agent Governance Rules

This directory contains scoped, actionable rules that agents must follow when working in this repository.

| File | Scope | Description |
|------|-------|-------------|
| `nexova-conventions.md` | Always-on | Naming, multi-tenant isolation, import rules, code placement |

**How to add a rule:**
1. Create a new `.md` file with a clear scope header.
2. Use checkboxes or ordered lists for actionable items.
3. Reference the rule from `AGENTS.md` session-start reads if it should be read at session start.
EOF

cat > .agents/skills/README.md << 'EOF'
# `.agents/skills/` — Agent-Verifiable Skills

This directory contains skill definitions with verifiable acceptance criteria, as required by Milestone 4.

| Skill | File | Description |
|-------|------|-------------|
| ticket-resolution | `ticket-resolution/SKILL.md` | Classify, KB-search, respond or escalate |

**Skill anatomy:**
```
.agents/skills/<name>/
└── SKILL.md    # Required: objective, inputs, verifiable criteria
```

**Note:** Full executable skills live under `skills/<name>/`. The `.agents/skills/` directory holds the **governance layer** — the verifiable spec that agents use to self-check.
EOF
```

### ✅ Phase 0 Completion Check

```
[ ] CONTEXT.md unified
[ ] shared/ → assets/ renamed
[ ] .gitignore populated
[ ] .env.example created
[ ] Makefile functional
[ ] Root package.json configured
[ ] skills/_template/SKILL.md populated
[ ] agents/_template/agent.py populated
[ ] .agents/rules/nexova-conventions.md created
[ ] .agents/skills/ticket-resolution/SKILL.md created
```

---

## Phase 1 — Memory Bank & Agent Protocol (Ordered Steps)

> **Goal:** Create the governance artifacts required by Milestone 4.
> **Kickoff reference:** §6 — Agent Governance Architecture + §8 / Phase 1

### Step 1.1 — Create `memory-bank/` directory

```bash
mkdir -p memory-bank
```

### Step 1.2 — Write `memory-bank/projectbrief.md`

- [ ] Create file with the following content (grounded in Nexova CONTEXT)

```bash
cat > memory-bank/projectbrief.md << 'PBEOF'
# Project Brief — Nexova Solutions

## Company Overview
- **Name:** Nexova Solutions
- **Founded:** 2011
- **Offices:** Valencia (HQ) + Miami
- **Employees:** ~120
- **Revenue:** ~$8M/year
- **CEO:** Laura Mendoza

## Business Lines
| Line | Share | Description |
|------|-------|-------------|
| Headhunting | ~35% | Executive & specialized recruitment for corporate clients |
| Customer Support Outsourcing | ~45% | Managed support teams, SLA-based, multi-client |
| Corporate Training | ~20% | Soft skills & technical training for enterprises |

## Critical Problems

### 🆘 Customer Support (Roberto Díaz)
- 30 agents across multiple clients
- SLA target: 24h → **actual: 48h average**
- No knowledge base → each ticket handled from scratch
- No L1/L2 triage → every agent handles everything
- **Goal:** L1 resolution rate >40%, SLA compliance >90%

### 🔍 Talent Selection (Javier Almeida)
- Consultants manually screen 30–80 CVs per recruitment process
- No shared scoring → each consultant uses personal system
- No candidate ranking → decisions driven by recency, not fit
- **Goal:** top-5 recall >80%, reduce screening time by 50%

### 💼 Sales (Marcos Ibáñez)
- CRM update rate ~40% → pipeline visibility is poor
- No automated follow-up → leads go cold
- No lead scoring → sales effort misallocated
- **Goal:** CRM update rate >90%, follow-up within 1h

### 🎓 Training (Elena Vargas)
- Course catalogue is a static PDF
- Enrolments via Google Forms → no tracking
- No personalised recommendations
- **Goal:** automated catalogue, enrolment tracking, recommendation engine

### 📊 Executive (Laura Mendoza)
- Department heads spend 4–8h/week preparing PDF reports
- No real-time unified view of business
- **Goal:** real-time dashboard, automated weekly reports

## Key KPIs
| KPI | Target | Current |
|-----|--------|---------|
| SLA compliance | >90% | ~50% (est.) |
| L1 resolution rate | >40% | ~0% (no L1 defined) |
| Top-5 CV recall | >80% | Manual (no scoring) |
| Override rate (CV) | <15% | N/A (new system) |
| CRM update rate | >90% | ~40% |
| Lead follow-up time | <1h | >24h (est.) |

## Multi-tenant Constraint
Nexova serves multiple clients per business line. **Data isolation must be enforced at query level** (WHERE client_id = ?). Never rely on LLM prompt instructions for tenant isolation.

## Regulatory
- EU GDPR applies (Nexova processes EU personal data)
- Automated hiring decisions risk Article 22 violations → all CV scores must be reviewable by a human
- Log all override decisions with timestamp and consultant ID
PBEOF
```

### Step 1.3 — Write `memory-bank/techContext.md`

- [ ] Create file documenting stack and architecture decisions

```bash
cat > memory-bank/techContext.md << 'TCEOF'
# Technical Context — Nexova Monorepo

## Stack Decisions
| Category | Choice | Rationale |
|----------|--------|-----------|
| Agent language | Python (≥3.10) | LangChain/LlamaIndex ecosystem, AI/ML libraries |
| UI language | TypeScript, Next.js (App Router) | Strong typing, SSR/SSG, modern DX |
| Backend API | FastAPI (Python) | Auto OpenAPI, Pydantic validation, async perf |
| Vector store | Qdrant | Native multi-tenant, hybrid search, gRPC, lightweight |
| Relational DB | PostgreSQL | JSONB for semi-structured, reliability, ecosystem |
| Workflow engine | n8n (local) | Visual, API-native, self-hosted, no vendor lock |
| Monorepo | pnpm workspaces | Fast, strict deps, native workspace support |
| Dev env | Devcontainer + Docker Compose | Zero-setup onboarding, reproducible |

## Monorepo Layout
```
/
├── agents/          # Agent implementations
├── assets/          # Non-code shared assets (schemas, templates, design tokens)
├── data/            # Data files, pipelines, evaluations
├── docs/            # Architecture, ADRs, milestones, planning
├── infra/           # Docker, Terraform, deployment
├── internal/        # Internal CLI tools
├── mcps/            # MCP server implementations
├── memory-bank/     # Agent governance (Milestone 4)
├── packages/        # Versionable shared libraries
├── scripts/         # Utility scripts
├── services/        # Backend API services
├── skills/          # Reusable skill definitions + scripts
├── uis/             # Frontend applications
└── workflows/       # n8n exported workflows
```

## Branch Convention
- Features: `feature/<name>`
- Fixes: `fix/<name>`
- Target branch: `main`

## ADRs (Architecture Decision Records)
Stored in `docs/adr/`. Key decisions:
| ADR | Decision |
|-----|----------|
| ADR-001 | Data isolation at query level, not prompt level |
| ADR-002 | Skills as the reusable core — agents import skills, not vice versa |
| ADR-003 | MCP servers for external tool integration |
| ADR-004 | Monorepo with pnpm workspaces for dependency management |

## Constraints
- All new code must pass `make lint` and `make test` before commit
- Frontend components go in `uis/<app>/src/components/`, never in `app/`
- Business logic from Milestone 2 must be imported from original `packages/` path
- Skills must reuse `data-analysis` utilities rather than reimplement
TCEOF
```

### Step 1.4 — Write `memory-bank/progress.md`

- [ ] Create living progress log

```bash
cat > memory-bank/progress.md << 'PROGEOF'
# Progress — Nexova Milestone 4

## ✅ Implemented (Pre-Milestone 4)
- [x] Folder structure (agents, skills, data, uis, services, mcps, workflows)
- [x] Bilingual READMEs (English + Spanish) in all key folders
- [x] Devcontainer configured (Python, Node, Docker, extensions)
- [x] Skills template (`skills/_template/`)
- [x] Agent template (`agents/_template/`)
- [x] Data-analysis skill with pandas script and metrics reference
- [x] Rich business context (`CONTEXT-nexova-briefing.en.md` → `CONTEXT.md`)

## 🔄 In Flight (Milestone 4 — AI-driven Engineering)
- [ ] `memory-bank/` with projectbrief.md, techContext.md, progress.md
- [ ] `AGENTS.md` with session-start reads, pre-commit workflow, protected areas
- [ ] `.agents/rules/nexova-conventions.md`
- [ ] `.agents/skills/ticket-resolution/SKILL.md`
- [ ] `uis/website` — Next.js corporate site (Milestone 1)
- [ ] `uis/backoffice` — Next.js internal app with entry view
- [ ] `services/api/` — FastAPI with health endpoint
- [ ] `docker-compose.yml` — api + postgres + qdrant
- [ ] Root config files: `.gitignore`, `.env.example`, `Makefile`, `package.json`
- [ ] Cleanup: CONTEXT unification, `shared/` → `assets/`, docs reorganization

## 📅 Next (Post-Milestone 4)
- [ ] HelpDesk Support Agent (L1/L2 with RAG)
- [ ] CV-Vacancy Matching Agent (scoring + ranking)
- [ ] Sales prospecting agent
- [ ] Training recommendation agent
- [ ] Executive dashboard (real-time KPIs for Laura)
- [ ] MCP servers (database-mcp, github-mcp)
- [ ] n8n workflows (SLA alert, nightly ETL, CV sync)
- [ ] CI/CD with GitHub Actions
- [ ] Evaluation framework (golden sets, faithfulness tests)
PROGEOF
```

### Step 1.5 — Create `AGENTS.md`

- [ ] Create root AGENTS.md with protocol (content in kickoff.md §6.2)

```bash
cat > AGENTS.md << 'AGEOF'
# AGENTS.md — Nexova Monorepo Protocol

## Session Start — Required Reads
Before making any edit, read these files **in order**:

| # | File | Why |
|---|------|-----|
| 1 | `memory-bank/projectbrief.md` | Business context, KPIs, constraints |
| 2 | `memory-bank/techContext.md` | Stack, architecture, conventions |
| 3 | `memory-bank/progress.md` | Current status, what's in flight |
| 4 | `CONTEXT.md` | Nexova company briefing (8 departments, problems) |
| 5 | `.agents/rules/nexova-conventions.md` | Scoped rules for this repo |

## Pre-Commit Workflow (4 ordered steps)
Before committing, execute these steps **in order**:

### Step 1: Format & Lint
```bash
make format   # Prettier + Ruff
make lint     # ESLint + Pylint
```
Fix **all** errors before proceeding.

### Step 2: Type Check & Test
```bash
make typecheck  # pyright / tsc --noEmit
make test       # pytest + vitest
```
All must pass.

### Step 3: Update progress.md
If the change adds, removes, or modifies a behavior, file, or dependency, update `memory-bank/progress.md` accordingly.

### Step 4: Self-Review Diff Scope
Review the staged diff. Confirm:
- [ ] No changes to protected areas (listed below) without explicit human confirmation
- [ ] No unnecessary files committed (`.env`, `__pycache__`, `node_modules`, `.next`)
- [ ] Branch name matches convention (`feature/` or `fix/`)

## Protected Areas — Human Confirmation Required
These paths must **NOT** be modified without explicit human approval:

| Path | Rationale |
|------|-----------|
| `data/raw/*` | Source data files (immutable once committed) |
| `.agents/rules/*` | Agent governance rules |
| `packages/shared/*` | Shared library interfaces (breaking changes need team review) |
| `docker-compose.yml` | Service orchestration topology |
| `.devcontainer/*` | Development environment configuration |
| `.github/*` | CI/CD workflows |

## Branch & PR Workflow

```bash
# Create delivery branch
git checkout -b feature/agent-memory-bank

# Work on changes...

# Pre-commit (4 steps)
make format && make lint
make typecheck && make test
# Update memory-bank/progress.md
# Self-review diff

# Commit and push
git add .
git commit -m "feat: <description>"
git push origin feature/agent-memory-bank

# Create PR targeting main
# Include screenshots of uis/website and uis/backoffice
# Include link to this file in PR description
```
AGEOF
```

### Step 1.6 — Cross-reference memory bank with CONTEXT

- [ ] Verify every KPI in `memory-bank/projectbrief.md` ties to a department in `CONTEXT.md`
- [ ] Verify every tech decision in `memory-bank/techContext.md` references the monorepo layout
- [ ] Verify `AGENTS.md` session-start reads list matches actual file paths

### ✅ Phase 1 Completion Check

```
[ ] memory-bank/projectbrief.md — business context, KPIs, constraints
[ ] memory-bank/techContext.md — stack, ADRs, layout, conventions
[ ] memory-bank/progress.md — implemented, in-flight, next
[ ] AGENTS.md — session reads + pre-commit + protected paths
[ ] Cross-reference verified
```

---

## Phase 2 — Frontend Foundation (Ordered Steps)

> **Goal:** Initialize Next.js apps and FastAPI service.
> **Kickoff reference:** §8 / Phase 2

### Step 2.1 — Initialize `uis/website` (Next.js, corporate site)

- [ ] Create Next.js app with TypeScript and App Router

```bash
cd uis
pnpm create next-app website --typescript --app-router --src-dir src --no-git --use-pnpm
cd website
```

- [ ] Install base dependencies

```bash
pnpm add react react-dom next
pnpm add -D typescript @types/react @types/node
```

- [ ] Create the home page (`src/app/page.tsx`) with full corporate site content

```typescript
// uis/website/src/app/page.tsx — Nexova Corporate Homepage
export default function HomePage() {
  return (
    <main>
      <HeroSection />
      <ServicesSection />
      <AboutSection />
      <ContactSection />
    </main>
  );
}

function HeroSection() {
  return (
    <section className="hero">
      <h1>Nexova Solutions</h1>
      <p>Intelligent talent & support solutions for the modern enterprise</p>
    </section>
  );
}

function ServicesSection() {
  return (
    <section className="services">
      <h2>Our Services</h2>
      <div className="service-grid">
        <div className="service-card">
          <h3>Headhunting</h3>
          <p>Executive & specialized recruitment for corporate clients.</p>
        </div>
        <div className="service-card">
          <h3>Customer Support Outsourcing</h3>
          <p>Multi-client support teams with SLA guarantees.</p>
        </div>
        <div className="service-card">
          <h3>Corporate Training</h3>
          <p>Soft skills & technical training for enterprises.</p>
        </div>
      </div>
    </section>
  );
}

function AboutSection() {
  return (
    <section className="about">
      <h2>About Nexova</h2>
      <p>Founded in 2011, Nexova Solutions operates from Valencia and Miami, serving over 50 corporate clients across Europe and the Americas. With 120 employees and $8M annual revenue, we are a trusted partner in talent and support operations.</p>
    </section>
  );
}

function ContactSection() {
  return (
    <section className="contact">
      <h2>Contact Us</h2>
      <p>Valencia (HQ) · Miami · info@nexova.com</p>
    </section>
  );
}
```

- [ ] Create layout (`src/app/layout.tsx`)

```typescript
// uis/website/src/app/layout.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Nexova Solutions — Intelligent Talent & Support",
  description: "Corporate site of Nexova Solutions: headhunting, customer support outsourcing, and corporate training.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header>
          <nav>
            <a href="/">Nexova</a>
            <a href="/services">Services</a>
            <a href="/about">About</a>
            <a href="/contact">Contact</a>
          </nav>
        </header>
        {children}
        <footer>
          <p>&copy; {new Date().getFullYear()} Nexova Solutions. All rights reserved.</p>
        </footer>
      </body>
    </html>
  );
}
```

### Step 2.2 — Initialize `uis/backoffice` (Next.js, internal app)

- [ ] Create separate Next.js app

```bash
cd /workspaces/ai-engineering-company-project-monorepo-dochoadi-Nexova/uis
pnpm create next-app backoffice --typescript --app-router --src-dir src --no-git --use-pnpm
cd backoffice
pnpm add react react-dom next
pnpm add -D typescript @types/react @types/node
```

- [ ] Create entry view (`src/app/page.tsx`) — welcome/dashboard shell

```typescript
// uis/backoffice/src/app/page.tsx — Backoffice Entry View
export default function DashboardPage() {
  return (
    <main>
      <h1>Nexova Backoffice</h1>
      <p>Welcome to the Nexova internal operations dashboard.</p>
      
      <section className="dashboard-grid">
        <WidgetCard title="Support Tickets" value="—" />
        <WidgetCard title="Active Candidates" value="—" />
        <WidgetCard title="Sales Pipeline" value="—" />
        <WidgetCard title="Training Enrolments" value="—" />
      </section>
    </main>
  );
}

function WidgetCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="widget-card">
      <h3>{title}</h3>
      <p className="widget-value">{value}</p>
    </div>
  );
}
```

- [ ] Create dedicated layout (`src/app/layout.tsx`) — separate from website

```typescript
// uis/backoffice/src/app/layout.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Nexova Backoffice — Internal Operations",
  description: "Nexova internal operations dashboard and management tools.",
};

export default function BackofficeLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="backoffice">
        <aside className="sidebar">
          <h2>Nexova</h2>
          <nav>
            <a href="/">Dashboard</a>
            <a href="/tickets">Tickets</a>
            <a href="/candidates">Candidates</a>
            <a href="/training">Training</a>
            <a href="/sales">Sales</a>
          </nav>
        </aside>
        <main className="content">
          {children}
        </main>
      </body>
    </html>
  );
}
```

### Step 2.3 — Import Milestone 2 Logic into Backoffice

- [ ] Import shared types from `packages/shared/types/index.ts`

```typescript
// Example import in uis/backoffice/src/app/page.tsx or a dedicated module
// import { TicketStatus, CandidateScore } from "packages/shared/types";
// This import path works because of pnpm workspace configuration.
// The actual business logic from Milestone 2 should be imported from
// its original packages/ path — never copy-pasted into the UI tree.

// For display purposes, create a simple wrapper:
import { TicketStatus, CandidateScore } from "@nexova/shared/types";
```

> **Note:** The actual Milestone 2 logic (business rules, scoring algorithms) lives in `packages/`. The backoffice imports and displays results — it does **not** reimplement logic.

### Step 2.4 — Create API Service

- [ ] Set up FastAPI project

```bash
mkdir -p services/api/src/routers services/api/src/models services/api/src/services services/api/src/middleware services/api/tests
```

- [ ] Create `services/api/pyproject.toml`

```toml
[project]
name = "nexova-api"
version = "0.1.0"
description = "Nexova backend API services"
requires-python = ">=3.10"
dependencies = [
    "fastapi>=0.110.0",
    "uvicorn[standard]>=0.27.0",
    "pydantic>=2.5.0",
    "psycopg2-binary>=2.9.9",
    "qdrant-client>=1.7.0",
]

[project.optional-dependencies]
dev = [
    "pytest>=8.0.0",
    "pytest-asyncio>=0.23.0",
    "ruff>=0.3.0",
    "pyright>=1.1.350",
    "httpx>=0.27.0",
]

[build-system]
requires = ["setuptools>=68.0"]
build-backend = "setuptools.build_meta"
```

- [ ] Create `services/api/src/main.py`

```python
"""Nexova API — FastAPI application entry point."""
from fastapi import FastAPI
from src.routers import health

app = FastAPI(
    title="Nexova API",
    version="0.1.0",
    description="Backend services for Nexova Solutions operations dashboard",
)

app.include_router(health.router)


@app.get("/")
async def root():
    return {"service": "nexova-api", "status": "operational", "version": "0.1.0"}
```

- [ ] Create `services/api/src/routers/health.py`

```python
"""Health check endpoint."""
from fastapi import APIRouter

router = APIRouter(tags=["health"])


@router.get("/health")
async def health_check():
    return {"status": "healthy", "service": "nexova-api"}
```

- [ ] Create `services/api/src/routers/__init__.py`

```python
"""API routers package."""
```

- [ ] Create `services/api/src/models/__init__.py`

```python
"""Pydantic models package."""
```

- [ ] Create `services/api/src/services/__init__.py`

```python
"""Business logic services package."""
```

- [ ] Create `services/api/src/middleware/__init__.py`

```python
"""Middleware package."""
```

- [ ] Create `services/api/tests/__init__.py`

```python
"""Test package."""
```

### Step 2.5 — Wire Backoffice → API

- [ ] In `uis/backoffice`, create an API client module

```typescript
// uis/backoffice/src/lib/api.ts — API client
const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export async function fetchHealth(): Promise<{ status: string }> {
  const res = await fetch(`${API_BASE}/health`);
  return res.json();
}

// Add more endpoints as they are built
```

- [ ] Update backoffice dashboard to show API connection status

```typescript
// Inside uis/backoffice/src/app/page.tsx
// Add an async component that calls fetchHealth()
```

### Step 2.6 — Create `docker-compose.yml`

- [ ] Create Docker Compose for local development

```bash
cat > docker-compose.yml << 'DCEOF'
version: "3.8"

services:
  api:
    build:
      context: ./services/api
      dockerfile: ../../infra/Dockerfile.api
    ports:
      - "8000:8000"
    environment:
      - DATABASE_URL=postgresql://nexova:nexova@postgres:5432/nexova
      - VECTOR_STORE_URL=qdrant:6333
    depends_on:
      postgres:
        condition: service_healthy
      qdrant:
        condition: service_healthy
    volumes:
      - ./services/api/src:/app/src

  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: nexova
      POSTGRES_PASSWORD: nexova
      POSTGRES_DB: nexova
    ports:
      - "5432:5432"
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U nexova"]
      interval: 5s
      timeout: 5s
      retries: 5
    volumes:
      - pgdata:/var/lib/postgresql/data

  qdrant:
    image: qdrant/qdrant:latest
    ports:
      - "6333:6333"
      - "6334:6334"
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:6333/health"]
      interval: 5s
      timeout: 5s
      retries: 5
    volumes:
      - qdrant_data:/qdrant/storage

volumes:
  pgdata:
  qdrant_data:
DCEOF
```

- [ ] Create `infra/Dockerfile.api`

```dockerfile
FROM python:3.11-slim

WORKDIR /app
COPY pyproject.toml .
RUN pip install -e ".[dev]"

COPY src/ src/
CMD ["uvicorn", "src.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### Step 2.7 — Basic Tests

- [ ] API test: `services/api/tests/test_health.py`

```python
"""Tests for health endpoint."""
from fastapi.testclient import TestClient
from src.main import app

client = TestClient(app)


def test_health_check():
    """GET /health should return healthy status."""
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "healthy", "service": "nexova-api"}
```

- [ ] Run tests to verify

```bash
cd services/api
pip install -e ".[dev]"
pytest
```

### ✅ Phase 2 Completion Check

```
[ ] uis/website — Next.js app, corporate site on / (no errors)
[ ] uis/backoffice — Next.js app, dedicated layout, entry view
[ ] Milestone 2 logic imported and visible in backoffice UI
[ ] services/api/ — FastAPI with /health endpoint
[ ] docker-compose.yml with api + postgres + qdrant
[ ] Tests passing (make test → green)
```

---

## Phase 3 — Agent Implementation (Ordered Steps)

> **Goal:** Implement the two priority agents with RAG, evaluation, and SLA monitoring.
> **Kickoff reference:** §8 / Phase 3

### Step 3.1 — HelpDesk Support Agent

- [ ] Create `agents/helpdesk-agent/` with full structure

```bash
mkdir -p agents/helpdesk-agent/prompts agents/helpdesk-agent/tests
```

- [ ] Create `agents/helpdesk-agent/agent.py` (extends BaseAgent)

```python
"""HelpDesk Support Agent — L1/L2 ticket resolution with RAG."""

from agents._template.agent import BaseAgent
from typing import Any, Dict


class HelpDeskAgent(BaseAgent):
    """Classifies tickets, searches KB, resolves (L1) or escalates (L2)."""

    def __init__(self, config: Dict[str, Any] = None):
        super().__init__(agent_name="helpdesk-agent", config=config)

    def _load_skills(self) -> None:
        """Load ticket-resolution and data-analysis skills."""
        # self.skills["classify"] = from skills.ticket-resolution...
        # self.skills["search_kb"] = from skills.ticket-resolution...
        self.logger.info("Skills loaded: ticket-resolution")

    def run(self, input_data: Dict[str, Any]) -> Dict[str, Any]:
        ticket_text = input_data.get("ticket_text", "")
        client_id = input_data.get("client_id", "default")
        kb_top_k = input_data.get("kb_top_k", 5)

        # Step 1: Classify
        category = "general"  # TODO: call classification skill
        urgency = "medium"     # TODO: call urgency classifier

        # Step 2: Search KB
        similar_cases = []  # TODO: call KB search skill

        # Step 3: Generate response or escalation
        confidence = 0.0  # TODO: compute from similarity scores
        if confidence >= 0.7:
            result = {"level": "L1", "draft_response": "..."}
        elif confidence < 0.4:
            result = {"level": "L2", "escalation_summary": "...", "flag_sla": True}
        else:
            result = {"level": "L2", "escalation_summary": "..."}

        self._log_action("ticket_processed", {
            "category": category,
            "urgency": urgency,
            "confidence": confidence,
            "level": result["level"],
        })

        return {
            "ticket_text": ticket_text,
            "client_id": client_id,
            "category": category,
            "urgency": urgency,
            "confidence": confidence,
            **result,
        }
```

- [ ] Create `agents/helpdesk-agent/prompts/classify.txt`

```text
You are a support ticket classifier for Nexova Solutions.
Classify the following ticket into one of: billing, technical, account, general.
Also classify urgency as: low, medium, high, critical.

Ticket:
{{ticket_text}}

Output format:
Category: <category>
Urgency: <urgency>
```

- [ ] Create `agents/helpdesk-agent/config.yml`

```yaml
agent:
  name: helpdesk-agent
  version: 0.1.0
  llm:
    model: gpt-4
    temperature: 0.1
    max_tokens: 512
  skills:
    - ticket-resolution
    - data-analysis
  kb:
    top_k: 5
    min_score: 0.4
  sla:
    warning_threshold: 0.4
    critical_threshold: 0.2
```

### Step 3.2 — CV-Vacancy Matching Agent

- [ ] Create `agents/cv-matching-agent/` with full structure

```bash
mkdir -p agents/cv-matching-agent/prompts agents/cv-matching-agent/tests
```

- [ ] Create `agents/cv-matching-agent/agent.py`

```python
"""CV-Vacancy Matching Agent — scores and ranks candidates for job positions."""

from agents._template.agent import BaseAgent
from typing import Any, Dict, List


class CVMatchingAgent(BaseAgent):
    """Scores CVs against vacancy requirements and produces ranked shortlist."""

    def __init__(self, config: Dict[str, Any] = None):
        super().__init__(agent_name="cv-matching-agent", config=config)

    def _load_skills(self) -> None:
        """Load cv-scoring and data-analysis skills."""
        # self.skills["score_cv"] = from skills.cv-scoring...
        # self.skills["rank"] = from skills.data-analysis...
        self.logger.info("Skills loaded: cv-scoring, data-analysis")

    def run(self, input_data: Dict[str, Any]) -> Dict[str, Any]:
        vacancy = input_data.get("vacancy", {})
        candidates = input_data.get("candidates", [])
        top_k = input_data.get("top_k", 5)

        scored = []
        for cv in candidates:
            score = 0.0  # TODO: call cv-scoring skill
            scored.append({"candidate_id": cv.get("id"), "score": score})

        scored.sort(key=lambda x: x["score"], reverse=True)
        shortlist = scored[:top_k]

        self._log_action("cv_matching_completed", {
            "vacancy_id": vacancy.get("id"),
            "candidates_scored": len(scored),
            "top_k": top_k,
        })

        return {
            "vacancy_id": vacancy.get("id"),
            "shortlist": shortlist,
            "total_candidates": len(candidates),
        }
```

- [ ] Create evaluation test (`agents/cv-matching-agent/tests/test_top5_recall.py`)

```python
"""Test top-5 recall for CV matching."""
# This would use a golden set from data/eval/golden_sets/
def test_top5_recall():
    """Verify that ground-truth matches appear in top-5."""
    golden_set = [
        {"vacancy": {...}, "candidates": [...], "expected_top5": ["id_1", "id_3"]},
    ]
    # TODO: run agent on each golden case and assert recall >= 0.8
    assert True  # placeholder
```

### Step 3.3 — n8n Workflow: SLA Alert

- [ ] Create `workflows/sla-alert-workflow.json`

This workflow monitors tickets approaching the SLA deadline (24h) and sends Slack alerts when a ticket has been open for >20h without resolution.

```json
{
  "name": "SLA Alert Workflow",
  "nodes": [
    {
      "id": "1",
      "name": "Webhook Trigger",
      "type": "n8n-nodes-base.webhook"
    },
    {
      "id": "2",
      "name": "Check SLA",
      "type": "n8n-nodes-base.if",
      "parameters": {
        "conditions": {
          "string": [
            {
              "value1": "{{$node[\"Webhook Trigger\"].json[\"hours_open\"]}}",
              "operation": "larger",
              "value2": 20
            }
          ]
        }
      }
    },
    {
      "id": "3",
      "name": "Slack Alert",
      "type": "n8n-nodes-base.slack",
      "parameters": {
        "channel": "#support-alerts",
        "text": "🚨 SLA Warning: Ticket {{$node[\"Webhook Trigger\"].json[\"ticket_id\"]}} has been open for {{$node[\"Webhook Trigger\"].json[\"hours_open\"]}} hours (threshold: 20h). Client: {{$node[\"Webhook Trigger\"].json[\"client_id\"]}}"
      }
    }
  ],
  "connections": {
    "1": { "main": [[{ "nodeId": "2" }]] },
    "2": { "main": [[{ "nodeId": "3" }]] }
  }
}
```

### Step 3.4 — Support Dashboard (Backoffice)

- [ ] Add real-time ticket table to `uis/backoffice/src/app/`

Create a tickets page that consumes the API and displays active tickets with SLA status.

### Step 3.5 — Evaluations

- [ ] Create golden set for L1 resolution

```bash
mkdir -p data/eval/golden_sets
```

- [ ] Create `data/eval/golden_sets/l1_resolution.json`

```json
[
  {
    "ticket_id": "eval-001",
    "ticket_text": "I was charged twice for the same invoice #INV-2024-03. Please refund the duplicate.",
    "expected_category": "billing",
    "expected_urgency": "high",
    "expected_level": "L1",
    "expected_confidence_min": 0.7
  },
  {
    "ticket_id": "eval-002",
    "ticket_text": "I cannot log in to the portal. It says 'invalid credentials' but I know my password is correct.",
    "expected_category": "technical",
    "expected_urgency": "high",
    "expected_level": "L1",
    "expected_confidence_min": 0.7
  }
]
```

- [ ] Create faithfulness test: `data/eval/golden_sets/faithfulness.json`

```json
[
  {
    "test_id": "faith-001",
    "query": "What is the SLA target for support tickets?",
    "context": "The support team aims for a 24-hour SLA. Current average is 48 hours.",
    "expected_response_contains": ["24h", "24-hour", "24 hours"],
    "should_not_contain": ["12h", "48h"]
  }
]
```

### ✅ Phase 3 Completion Check

```
[ ] HelpDesk Support Agent (L1/L2 with RAG scaffolding)
[ ] CV-Vacancy Matching Agent (scoring + ranking scaffolding)
[ ] n8n workflow: SLA Alert
[ ] Support dashboard table in backoffice
[ ] Golden set for L1 resolution
[ ] Faithfulness test golden set
```

---

## Phase 4 — Expansion (Future)

> **Goal:** Additional agents, dashboards, and CI/CD.
> **Kickoff reference:** §8 / Phase 4

| # | Task | When | Priority |
|---|------|------|----------|
| 4.1 | Sales prospecting agent | Week 4+ | MEDIUM |
| 4.2 | Training recommendation agent | Week 4+ | MEDIUM |
| 4.3 | Executive dashboard (Laura Mendoza) | Week 4+ | HIGH |
| 4.4 | CI/CD with GitHub Actions | Week 4+ | HIGH |
| 4.5 | Candidate portal | Week 5+ | MEDIUM |
| 4.6 | Training portal | Week 5+ | LOW |
| 4.7 | MCP servers (database-mcp, github-mcp) | Week 4+ | MEDIUM |
| 4.8 | Real-time agent monitoring | Week 5+ | LOW |

---

## Delivery Checklist

### Pre-PR Validation

Run this checklist before creating the pull request:

```bash
# 1. Verify branch name
git branch --show-current
# → must be: feature/agent-memory-bank

# 2. Run the full pre-commit workflow
make format
make lint
make typecheck
make test

# 3. Verify memory-bank exists and is populated
ls memory-bank/
# → projectbrief.md  techContext.md  progress.md

# 4. Verify AGENTS.md exists
ls AGENTS.md

# 5. Verify .agents/ governance
ls .agents/rules/
ls .agents/skills/ticket-resolution/SKILL.md

# 6. Verify UIs start without errors
cd uis/website && pnpm build  # or pnpm dev (check for errors)
cd uis/backoffice && pnpm build  # or pnpm dev (check for errors)

# 7. Verify API starts
cd services/api && uvicorn src.main:app --port 8000 &
curl http://localhost:8000/health
# → {"status":"healthy","service":"nexova-api"}

# 8. Update memory-bank/progress.md with any new changes

# 9. Self-review the diff
git diff --cached --stat
# Confirm no protected areas are modified
```

### Milestone 4 Reviewer Checklist

#### Agent Infrastructure
- [ ] `memory-bank/` exists with `projectbrief.md`, `techContext.md`, `progress.md`
- [ ] Memory bank reflects **both** business and technical context tied to `CONTEXT.md`
- [ ] `AGENTS.md` lists mandatory memory-bank reads at session start
- [ ] `AGENTS.md` defines a **minimum four-step ordered workflow** before commit
- [ ] `AGENTS.md` lists paths the agent must not touch without explicit confirmation
- [ ] `.agents/rules/` contains at least one scoped, actionable rule
- [ ] `.agents/skills/` contains at least one skill with: single objective, documented inputs, verifiable acceptance criteria

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

---

## Quick-Start Commands

```bash
# ─── Phase 0: Cleanup ───
make install            # Install all dependencies
make format             # Format all code
make lint               # Lint all code

# ─── Phase 1: Governance ───
# (manual file creation, see steps above)

# ─── Phase 2: Run Locally ───
make run-api            # Start FastAPI on :8000
make run-website        # Start corporate site on :3000
make run-backoffice     # Start backoffice on :3001

# ─── All Together ───
docker compose up -d    # Start all services (api + postgres + qdrant)
make test               # Run all tests
```

---

## Troubleshooting

| Problem | Likely Cause | Solution |
|---------|-------------|----------|
| `pnpm: command not found` | pnpm not installed | `npm install -g pnpm` or `brew install pnpm` |
| `python -m pip` fails | Missing venv | `python -m venv .venv && source .venv/bin/activate` |
| Port 8000 in use | Another process | `kill $(lsof -t -i:8000)` or change port in `.env` |
| Docker Compose fails | Docker not running | Start Docker Desktop or `systemctl start docker` |
| `make: command not found` | make not installed | `apt-get install make` or `brew install make` |

---

> **Next revision:** Upon completing Phase 2 (Frontend Foundation).
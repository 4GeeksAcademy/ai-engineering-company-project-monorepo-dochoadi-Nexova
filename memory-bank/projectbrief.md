# Project Brief — Nexova Solutions

Type: business

## What Nexova is

Nexova Solutions is a human resources consulting and talent acquisition firm founded in **2011**, headquartered in **Valencia (Spain)** with an expansion office in **Miami (Florida)**. It has **120 employees** and generates approximately **8 million dollars** in annual revenue across three business lines:

1. **Headhunting** of executive and mid-management profiles (~35 % of revenue).
2. **Customer support team outsourcing** for technology companies (~45 %, the highest-volume line).
3. **Corporate training** in soft skills and leadership (~20 %).

Its clients are **mid-sized** companies in **technology, retail and financial services** that outsource some or all of their talent management. The CEO and founder is **Laura Mendoza**.

## The problem

- **Manual operations:** the 40 selection consultants read 30 to 80 CVs by hand per search; the training catalogue is a PDF and enrolments a Google Form; Laura receives a weekly PDF report that each department head takes 4 to 8 hours to prepare.
- **Disconnected systems:** HubSpot, a legacy Zendesk, Google Workspace, a home-built ATS from the early 2010s and spreadsheets, with no telemetry or centralised logging.
- **Competition from automated platforms:** new data-driven platforms compete directly with Nexova's services, and the window to respond is not unlimited.

## Project goal

Give Nexova the **systems, automations and AI agents** that let it do what it already does well (find, develop and support talent) faster, at greater scale and with far less manual effort.

## Priority scope: the two flagship agents

### 1. L1 HelpDesk Support Agent (Customer Support — Roberto Díaz)

Goal: bring average incident resolution time down from **48 h** to the **committed 24 h SLA**, resolving at Level 1 at least **40 %** of tickets without human intervention within the first 3 months live, with each client company's data strictly isolated.

Summary flow:
1. A ticket arrives via chat, email or widget, tagged with the client company it belongs to.
2. The agent embeds the query and retrieves similar cases from the knowledge base, filtering only that client's data (hard filter, not a prompt instruction).
3. It decides: answer directly (high-confidence match, Level 1), escalate to a human with a summary (low confidence or sensitive case, Level 2), or flag the ticket as SLA-at-risk if it has been open too long.
4. It logs the outcome and adds every new human-resolved case to the knowledge base.

### 2. CV–Vacancy Matching Agent (Talent Selection — Javier Almeida)

Goal: replace the manual reading of 30–80 CVs per search with an explainable candidate ranking based on the requirements the consultant defines, never mixing candidate data between Nexova's client companies.

Summary flow:
1. A vacancy is created with mandatory (must-have) and desirable (nice-to-have) requirements.
2. Incoming CVs are parsed into structured fields: skills, experience, seniority, languages, salary expectation.
3. The agent scores each CV against the requirements and ranks the pool; incomplete or low-confidence CVs are flagged for manual review instead of being silently scored.
4. The consultant sees the ranking, can reorder it, and that decision (accepted / overridden) is logged to calibrate the weights.

## Success metrics

| Metric | Target | Agent |
| --- | --- | --- |
| Tickets resolved at Level 1 without escalation | ≥ 40 % | HelpDesk |
| Average resolution time | < 24 h (48 h today) | HelpDesk |
| Groundedness / faithfulness of Level 1 answers against the knowledge base | No hallucinated answers reaching the customer | HelpDesk |
| Top-5 recall against who was actually hired in similar processes | The right candidates appear near the top | Matching |
| Consultant override rate | High at first (useful for calibration) and trending down over time | Matching |

## Project nature and priorities

- **Academic evaluation project for 4Geeks Academy** (AI Engineering career programme): Nexova is a fictional company, the repository holds no real data, and nothing is ever published to production.
- **Priorities:** first the evaluation criteria of each milestone (`docs/milestone-<n>/evaluation.md`), then the quality of the repository (structure, conventions, tests, documentation).
- **Production concerns are notes, not blockers:** GDPR, image and font licences, domains, real contact details and security hardening are recorded (open questions in `activeContext.md`, constraints in `techContext.md`) but do not block a milestone.

## Milestone 2 goal

Milestone 2 ("Your Company's Public Website", briefing in `BRIEFING.md`) gives Nexova its first public digital touchpoint for Carmen Ruiz's Marketing team: a landing page presenting who Nexova is, what it does and why companies choose it, plus a separate application form where professionals join Nexova's talent pool. Plain HTML + Tailwind CSS + vanilla JavaScript at the repo root, bilingual (English base, Spanish under `es/`), responsive, accessible (WCAG 2.2 AA), SEO-optimised with Schema.org, with full JavaScript validation and a simulated submission (no backend).

## Out of scope for Milestone 1

Milestone 1 ("Monorepo AI Setup") **does not build business features**: no agents, no API, no dashboards. It only prepares the monorepo infrastructure (memory bank, coding-agent rules and workflow, skill, workspace, base website and backoffice) on which they will be built in later milestones.

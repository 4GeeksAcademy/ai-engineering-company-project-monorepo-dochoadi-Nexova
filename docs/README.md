# `docs` folder

This folder holds **cross-cutting documentation** for the monorepo: architecture guides, technical decisions, conventions, processes, and any material shared across applications, pipelines, agents, and workflows.

- **Main purpose**: provide a single place for “global” project documentation (not tied to one app or agent only).
- **Recommendation**: organize docs by topic (architecture, deployment, data, security, observability, etc.) and keep links from each component’s README to these guides.

## Contents

| Path | What it is |
| --- | --- |
| [`milestone-1/`](./milestone-1/README.md) | Milestone 1 "Monorepo AI Setup": [evaluation matrix](./milestone-1/evaluation.md) (criteria E1–E9), [verification guide](./milestone-1/verification.md) (how to re-check every step), [findings report](./milestone-1/report.md) for the tech lead, [learning recap](./milestone-1/recap.md), the retroactive [learning log](./milestone-1/learning-log.md), approved designs and screenshots. |
| [`milestone-1/instructor-feedback.md`](./milestone-1/instructor-feedback.md) | Instructor feedback on Milestone 1 (Spanish original, English translation) and the action taken for each point. |
| [`milestone-2/`](./milestone-2/README.md) | Milestone 2 "Your Company's Public Website": [final report](./milestone-2/report.md), [recap](./milestone-2/recap.md), [evaluation matrix](./milestone-2/evaluation.md) (criteria E1–E30, deliverables, project standards), [content decisions](./milestone-2/content-decisions.md), [verification guide](./milestone-2/verification.md), [security](./milestone-2/security.md), [accessibility](./milestone-2/accessibility.md) and [performance](./milestone-2/performance.md) evidence, [learning log](./milestone-2/learning-log.md) and the official Spanish [briefing](./milestone-2/BRIEFING.es.md). |
| [`milestone-3/`](./milestone-3/README.md) | Milestone 3 "Building Scripts to Automate Tasks" (in progress): [evaluation matrix](./milestone-3/evaluation.md), [decisions](./milestone-3/decisions.md), [domain model](./milestone-3/model.md), [benchmark](./milestone-3/benchmark.md), [verification guide](./milestone-3/verification.md), [learning log](./milestone-3/learning-log.md) and the official Spanish [briefing](./milestone-3/BRIEFING.es.md). |
| [`improvements.md`](./improvements.md) | Improvement backlog across milestones, to compare and apply in the final one. |
| [`briefs/sales-forecasting.md`](./briefs/sales-forecasting.md) | Sales forecasting exercise brief (later milestone). |

## Milestone log

| Milestone | Dates | What was delivered | Result | PR and merge commit | Detail (learning log, verification, report) |
| --- | --- | --- | --- | --- | --- |
| M1 Monorepo AI Setup | 2026-10-12 to 2026-10-13 | Memory bank, agent rules and skills, pnpm workspace, shared company data, website and backoffice | Merged; E1–E9 met | [PR #1](https://github.com/4GeeksAcademy/ai-engineering-company-project-monorepo-dochoadi-Nexova/pull/1) · [`30f8e47`](https://github.com/4GeeksAcademy/ai-engineering-company-project-monorepo-dochoadi-Nexova/commit/30f8e47) | [learning log](./milestone-1/learning-log.md) · [verification](./milestone-1/verification.md) · [report](./milestone-1/report.md) · [issues log](./milestone-1/issues-log-m1.md) |
| M2 Your Company's Public Website | 2026-10-23 to 2026-11-16 | Bilingual public site, talent form with validation, security and accessibility gates | Merged; E1–E30 met | [PR #2](https://github.com/4GeeksAcademy/ai-engineering-company-project-monorepo-dochoadi-Nexova/pull/2) · [`ee14825`](https://github.com/4GeeksAcademy/ai-engineering-company-project-monorepo-dochoadi-Nexova/commit/ee14825) | [learning log](./milestone-2/learning-log.md) · [verification](./milestone-2/verification.md) · [report](./milestone-2/report.md) · [issues log](./milestone-2/issues-log-m2.md) |
| M3 Building Scripts to Automate Tasks | 2026-11-22 to now | So far: domain model, benchmark, Next.js security patch, briefing, evaluation matrix and conventions, TypeScript setup, models and sample data, search functions, filters and sorting, explainable scoring, ranking and the demo (S00–S05) | In progress; next S06 | No PR yet | [learning log](./milestone-3/learning-log.md) · [verification](./milestone-3/verification.md) · report in S11 · [issues log](./milestone-3/issues-log-m3.md) |

> _Spanish version: [README.es.md](./README.es.md)._

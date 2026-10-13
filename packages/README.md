# `packages` folder

This folder contains **shared packages** for the monorepo: internal libraries, utilities, types, shared components, SDKs, clients, and any code reused by multiple applications, agents, or pipelines.

Each subfolder under `packages/` should represent **one versionable package** (for example `shared-types`, `ui`, `analytics-sdk`) with its own README.

- **Main purpose**: encourage reuse and consistency across all company deliverables.
- **Recommendation**: document packages as you add them—their public API and how they are consumed from `apps/`, `agents/`, and `workflows/`.

## Packages

| Package | Name | What it provides |
| --- | --- | --- |
| [`shared/`](./shared/README.md) | `@repo/shared-types` | Shared TypeScript types and Nexova company data (company profile, business lines, departments, support SLA, flagship agents), defined once and imported by `uis/website` and `uis/backoffice`. |

> _Spanish version: [README.es.md](./README.es.md)._

# `@repo/shared-types`

Shared TypeScript types and Nexova Solutions company data for every app in the monorepo (`uis/website`, `uis/backoffice` and future consumers).

## What it exports

| Export | Kind | Content |
| --- | --- | --- |
| `Id`, `BaseEntity` | types | Generic entity types (`types/index.ts`). |
| `company` / `Company` | data / type | Name, founding year (2011), Valencia headquarters, Miami office, 120 employees, approximate annual revenue, client profile and industries. |
| `businessLines` / `BusinessLine` | data / type | The 3 business lines: headhunting, customer support outsourcing, corporate training. |
| `departments` / `Department` | data / type | The 8 areas with manager, team size (or `null`), `teamSizeNote` when the figure is ambiguous, how they work today, problem and needs, each need a `{ text, type }` object. |
| `supportSla` / `SupportSla` | data / type | Committed SLA (24 h), current average (48 h) and number of support agents (30). |
| `flagshipAgents` / `FlagshipAgent` | data / type | The L1 HelpDesk Support Agent and the CV–Vacancy Matching Agent, with goal, target metrics, a 4-step `flow` and `status: "planned"`. |
| `NEED_TYPES` / `NeedTypeInfo` | data / type | The 4 need types (`agent`, `dashboard`, `automation`, `portal`) with label and colour token, used to group department needs. |
| `BusinessLineId`, `DepartmentId`, `FlagshipAgentId`, `TargetMetric`, `Need`, `NeedType` | types | Helper types used by the shapes above. |

All data comes from `CONTEXT.md` and `Company-choice.md`. The package holds no computed values (no headcount totals, no SLA gap); apps compute what they display.

## Brand tokens: `styles/tokens.css`

The Nexova brand tokens are defined once, as CSS variables on `:root`: the colour palette (`--color-*`), the font family (`--font-sans`, built on the `--font-instrument-sans` variable each app sets with `next/font`), radii (`--radius-*`), shadows (`--shadow-*`) and easings (`--ease-*`). Each app imports the file at the top of its `app/globals.css` and adds only its own app-specific variables:

```css
@import "@repo/shared-types/styles/tokens.css";
```

The import resolves through the workspace package (it has no `exports` map, so subpaths are reachable) and Next.js inlines the file into the app's CSS. `NEED_TYPES` colour tokens refer to variables in this file.

## How apps import it

Add the workspace dependency in the app's `package.json`:

```json
"dependencies": { "@repo/shared-types": "workspace:*" }
```

Then import:

```ts
import { company, departments } from "@repo/shared-types";
import type { Department } from "@repo/shared-types";
```

The package ships TypeScript source (`main` and `types` point to `index.ts`); Next.js apps must list it in `transpilePackages`.

## Rule

Nexova company data lives only here. Apps import it and never keep their own copy; if a figure is wrong or missing, fix it in `company.ts` against `CONTEXT.md`.

## Scripts

| Command | What it does |
| --- | --- |
| `pnpm --filter @repo/shared-types typecheck` | `tsc --noEmit` over `index.ts`, `company.ts` and `types/`. |
| `pnpm --filter @repo/shared-types test` | `node --test`: runs `company.test.ts` with Node's native type stripping. |

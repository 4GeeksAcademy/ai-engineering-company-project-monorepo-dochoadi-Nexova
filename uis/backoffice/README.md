# `uis/backoffice` — Nexova internal backoffice

Internal application for Nexova Solutions staff: department heads and Executive Direction (Laura Mendoza's team) see, in one place, where the company stands today. Its first screen is the **Operations overview**: support SLA, headcount by team, the work each department needs by type, the 8 departments, the planned flagship agents and the open questions in the company briefing. Live data arrives with the first integrations; today every figure comes from the briefing (`CONTEXT.md`).

- **Stack:** Next.js 16 (App Router, Turbopack) + React 19, TypeScript `strict` (extends `tsconfig.base.json`), CSS Modules, ESLint (`eslint-config-next`). Same versions as `uis/website`; no other dependency, no CSS framework, UI kit or animation library.
- **Port:** 3001.
- **Authentication:** none yet. It is an internal tool and sign-in comes later (open question in `memory-bank/activeContext.md`); do not expose it publicly until then.
- **Design source:** `docs/milestone-1/design/nexova-backoffice.html`, the approved Claude Design export, rebuilt faithfully. The design's inline data was a stand-in; here all data comes from `@repo/shared-types`.

## Run it

From the repo root:

| Command | What it does |
| --- | --- |
| `pnpm dev:backoffice` | Dev server on http://localhost:3001 |
| `pnpm --filter backoffice build` | Production build (the page is prerendered as static) |
| `pnpm --filter backoffice start` | Serves the build on port 3001 |
| `pnpm --filter backoffice lint` | ESLint |
| `pnpm --filter backoffice typecheck` | `tsc --noEmit` (needs `next-env.d.ts`, which `next dev` or `next build` generates) |
| `pnpm --filter backoffice test` | `node --test`: `lib/metrics.test.ts` |

## Folder structure

```text
uis/backoffice/
├── app/
│   ├── layout.tsx       # Own layout: <html>, Instrument Sans (next/font/google), sidebar, top bar, <main>
│   ├── page.tsx         # Route /: Operations overview, sections in the design's order
│   └── globals.css      # Imports the shared brand tokens; backoffice-only tokens and base styles
├── components/          # One component per block, with CSS Modules
│   ├── Sidebar.tsx      # Wordmark, overview and departments, scroll-spy, Menu toggle under 960px
│   ├── TopBar.tsx (+ LiveClock)
│   ├── SlaKpi.tsx  HeadcountKpi.tsx  Kpi.module.css
│   ├── WorkByType.tsx (+ NeedsFilter context)
│   ├── DepartmentCard.tsx (+ SpotlightCard, NeedList, SupportClock)
│   ├── AgentCard.tsx    # Flow highlight on hover or focus, pure CSS
│   └── OpenQuestions.tsx
├── content/overview.ts  # All copy, typed; department display order and short labels
└── lib/
    ├── metrics.ts       # Pure calculations (+ metrics.test.ts)
    ├── departments.ts   # Shared departments in display order, with their short labels
    ├── format.ts        # en-GB date and time formats
    └── motion.ts        # Reduced-motion check, 30 s clock store, page-load progress
```

## Where data and calculations come from

| What | Where | Rule |
| --- | --- | --- |
| Company facts: departments, managers, team sizes, needs and their types, SLA, business lines, flagship agents and their flows | `@repo/shared-types` (`packages/shared/company.ts`) | Imported, never retyped. |
| Derived figures: SLA gap, headcount accounted for, needs by type, SLA due times | `lib/metrics.ts` | Pure functions, tested with `node:test`. |
| Screen copy | `content/overview.ts` | Word for word from the design; figures are interpolated, never written into JSX. |
| Brand tokens (palette, font, radii, shadows, easings) | `packages/shared/styles/tokens.css`, imported by `app/globals.css` | Defined once for every UI; backoffice-only tokens on `:root` in `app/globals.css`. |

The backoffice imports nothing from `uis/website`; anything both apps need lives in `packages/`.

## Behaviour

Client components are only the ones with behaviour: `Sidebar`, `LiveClock`, `SlaKpi`, `HeadcountKpi`, `NeedsFilter`, `WorkByType`, `NeedList`, `SpotlightCard` and `SupportClock`. Every interval, observer and animation frame is cleaned up on unmount. The clocks render a placeholder on the server and switch to the viewer's time after hydration, refreshing every 30 s. Under `prefers-reduced-motion` there is no count-up, bar growth, ping or flow animation: final values show immediately.

Deliberate deviations from the design: the sidebar contents stay in view while scrolling on wide screens (so the scroll-spy is visible), sidebar links are 44px tall (40px in the design), the hover border of department cards uses the `--color-tan` brand token instead of a one-off colour, and the headcount segments have a 44px-tall hit area.

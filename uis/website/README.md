# `uis/website` — Nexova corporate website

Public landing page of Nexova Solutions: HR consulting and talent acquisition from Valencia and Miami. It replaces the 2019 site, which was slow and not accessible (`CONTEXT.md`, Marketing and Communications).

- **Stack:** Next.js 16 (App Router, Turbopack) + React 19, TypeScript `strict` (extends `tsconfig.base.json`), CSS Modules, ESLint (`eslint-config-next`). No CSS framework, UI kit or animation library.
- **Port:** 3000.
- **Design source:** `docs/milestone-1/design/nexova-landing-v4.html`, the approved Claude Design export. The page rebuilds it faithfully: layout, colours, type, copy, motion and interactions.

## Run it

From the repo root:

| Command | What it does |
| --- | --- |
| `pnpm dev:website` | Dev server on http://localhost:3000 |
| `pnpm --filter website build` | Production build (the page is prerendered as static) |
| `pnpm --filter website start` | Serves the build on port 3000 |
| `pnpm --filter website lint` | ESLint |
| `pnpm --filter website typecheck` | `tsc --noEmit` (needs `next-env.d.ts`, which `next dev` or `next build` generates) |
| `pnpm --filter website test` | `node --test`: `lib/cvField.test.ts` |

## Folder structure

```text
uis/website/
├── app/
│   ├── layout.tsx       # <html>, Instrument Sans (next/font/google), metadata, JSON-LD Organization
│   ├── page.tsx         # Composes the sections in order
│   └── globals.css      # Design tokens (CSS variables on :root) and base styles
├── components/          # One component per section, each with a CSS Module
│   ├── Header.tsx (+ MobileNav)      Hero.tsx (+ RoleTicker, CvCascade)
│   ├── Marquee.tsx  KeyFigures.tsx (+ CountUp)  Services.tsx  Process.tsx
│   ├── Industries.tsx  HumanAndAi.tsx  About.tsx (+ OfficePhotos, OfficeClock)
│   ├── ContactCta.tsx  Footer.tsx
│   └── Button.tsx  Reveal.tsx  PulseDot.tsx          # shared
├── content/home.ts      # All copy, typed
├── lib/
│   ├── cvField.ts       # Hero CV cascade data: exact port of the design's field set-up (+ test)
│   ├── time.ts          # Office time zones, local times, hours apart
│   ├── motion.ts        # Reduced-motion check, scroll-frame and in-view helpers
│   └── jsonLd.ts        # schema.org Organization from company data
└── public/images/       # valencia.jpg, miami.jpg
```

## Where things live

| What | Where | Rule |
| --- | --- | --- |
| Company facts (founding year, cities, headcount, business lines, industries) | `@repo/shared-types` (`packages/shared/company.ts`) | Imported, never retyped. |
| Website copy | `content/home.ts` | Word for word from the design; lists render with `.map()`. `CONTACT_EMAIL` is a placeholder until Nexova confirms the real address. |
| Design tokens (colours, gradients, radii, shadows, easings, layout) | `app/globals.css`, `:root` | Defined once; components use `var(--…)`, never raw colour values. |
| Office photos | `public/images/` | Copied from `docs/milestone-1/design/`; licence not confirmed yet (see `memory-bank/progress.md`). |

## Behaviour

Client components (`"use client"`) are only the ones with behaviour: `Header`, `MobileNav`, `RoleTicker`, `CvCascade`, `Button` (magnetic), `Reveal`, `CountUp`, `Services`, `Process`, `HumanAndAi`, `OfficePhotos`, `OfficeClock`. Every listener, timer, animation and observer is removed on unmount. Under `prefers-reduced-motion` the scroll and pointer effects are skipped and the hero shows the final shortlist.

The office photos reveal by observing their grid wrapper, not the clipped `<figure>`: a figure clipped with `inset(100% …)` never reports as intersecting, which left the photos hidden in the original export.

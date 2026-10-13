---
description: Conventions for Next.js frontends under uis/ (website and backoffice).
globs: ["uis/**"]
---

Scope: files matching uis/**

## Stack

1. Use Next.js App Router with TypeScript in `strict` mode.
2. Run the apps on fixed ports: `uis/website` on 3000, `uis/backoffice` on 3001.

## App isolation

3. Each app has its own `app/layout.tsx`.
4. Never import layout, components or styles from another app (`uis/website` must not import from `uis/backoffice`, and vice versa). Anything both apps need goes to `packages/`.

## Code organisation

5. Put reusable components in `components/`.
6. Put content and data in `lib/` or `content/`; never hard-code copy or figures in JSX.
7. Import Nexova company data (departments, managers such as Javier Almeida or Roberto Díaz, business lines, figures such as 120 employees or the 24 h SLA) from `packages/shared` (`@repo/shared-types`).
8. Define design tokens (colours, spacing, typography) as CSS variables, once per app.

## Accessibility

The 2019 Nexova website is "slow and not accessible" (`CONTEXT.md`); do not repeat that.

9. Use semantic HTML (`header`, `nav`, `main`, `section`, `footer`, headings in order).
10. Every interactive element is reachable and usable by keyboard, with a visible focus state.
11. Text meets WCAG AA contrast.
12. Respect `prefers-reduced-motion`: disable or reduce animations when it is set.

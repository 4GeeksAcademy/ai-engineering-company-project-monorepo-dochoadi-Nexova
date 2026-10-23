---
description: Accessibility rules (WCAG 2.2 AA) for every page and UI of the Nexova monorepo, organised by audience.
globs: ["uis/**", "*.html", "es/*.html", "validation.js"]
---

Scope: files matching uis/**, *.html, es/*.html and validation.js

Target: **WCAG 2.2 AA** on every page. Nexova's 2019 website is "slow and not accessible" (`BRIEFING.md`); the new site must work for people with disabilities, older adults, people in harsh environments (bright sun, noise) and everyone else. Verify with the `a11y-gate` skill (`.agents/skills/a11y-gate/check.sh <milestone>`) before every PR.

## Language

1. Every page sets `lang` on `<html>` (`en` at the root, `es` under `es/`).
2. Every page offers a language switcher that names the target language in its own language ("English" / "Español"), with `hreflang` and `lang` on the link, and `<link rel="alternate" hreflang="…">` in the `<head>`.
3. Inline text in another language is marked with `lang` (e.g. `<span lang="en">headhunting</span>` on a Spanish page).

## Blind or low vision

4. Use semantic landmarks: `header`, `nav`, `main`, `footer`, labelled `section`s.
5. Exactly one `h1` per page; headings in order, never skipping a level.
6. Every informative image has a descriptive `alt`; decorative images use `alt=""` (and `aria-hidden="true"` on decorative SVGs).
7. Icon-only controls and links have an accessible name (`aria-label` or visually hidden text).
8. Dynamic updates (errors, counters, success messages) are announced through a live region (`aria-live="polite"`, or `role="alert"` for blocking errors).

## Deaf or hard of hearing

9. Any audio or video has captions or a transcript.
10. No information is given by sound alone.

## Limited mobility

11. Everything is operable with the keyboard alone, in a logical order, with no keyboard traps.
12. Every focusable element shows a visible focus indicator (never `outline: none` without a replacement).
13. Each page starts with a "Skip to main content" link that becomes visible on focus.
14. Touch and click targets are at least 44 × 44 px.

## Cognitive

15. Plain language: short sentences, familiar words, one idea per paragraph.
16. Labels are always visible; placeholders are hints, never labels.
17. Error messages are specific and say how to fix the problem (the briefing's "Expected error messages").
18. Navigation is predictable: the same header and order on every page; nothing changes context on focus or input.
19. Respect `prefers-reduced-motion`: disable or reduce animations and transitions.

## Older adults

20. Text can be resized to 200 % without loss of content or function.
21. Content reflows at 320 px wide with no horizontal scrolling.
22. Generous spacing and line height; body text at least 16 px.

## Harsh environments

23. Contrast at least WCAG AA (4.5:1 for normal text, 3:1 for large text, icons and control borders); prefer more for body text.
24. Information is never conveyed by colour alone (errors also have text and an icon or border change).
25. Works in forced-colors / high-contrast mode: focus rings, borders and states stay visible (use `outline`, not only `box-shadow` or background colour).

## Everyone

26. If keyboard shortcuts are added, document them on the page and never override browser or screen-reader shortcuts.
27. Captions also help language learners and people in noisy places.

## Error messages in forms

28. Each error message is linked to its field with `aria-describedby`.
29. A field with an error has `aria-invalid="true"` (removed when fixed).
30. Errors are announced through a live region, and on submit focus moves to the first invalid field.

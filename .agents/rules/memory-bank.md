---
description: How to read and keep the Nexova memory bank up to date in every session.
alwaysApply: true
---

Scope: always active

## At the start of each session

1. Read every file in `memory-bank/` before making any change: `projectbrief.md`, `productContext.md`, `techContext.md`, `systemPatterns.md`, `activeContext.md`, `progress.md`.
2. Follow `activeContext.md` for the current focus and next step, and `systemPatterns.md` for mandatory patterns.

## When to update it

3. Update the memory bank in the same commit as any change that alters:
   - business context (departments, managers, figures, scope) → `projectbrief.md`, `productContext.md`;
   - a technical decision, stack, folder or port → `techContext.md`, `systemPatterns.md`;
   - progress (a step finished) → `progress.md` with a dated entry (`YYYY-MM-DD`);
   - the current focus, a decision or an open question → `activeContext.md`;
   - a known problem found or fixed → `progress.md`, "Known issues".
4. Keep the `Type:` line (`business`, `technical` or `status`) on line 3 of each file.
5. Use the `update-memory-bank` skill in `.agents/skills/update-memory-bank/` to make these updates.
6. At the end of every milestone, run the `milestone-recap` skill (`.agents/skills/milestone-recap/`) before opening the pull request.

## Staleness

7. A stale memory bank counts as a bug: if a file contradicts the code or `CONTEXT.md`, fix it in the current step or record it as an open question in `activeContext.md`.

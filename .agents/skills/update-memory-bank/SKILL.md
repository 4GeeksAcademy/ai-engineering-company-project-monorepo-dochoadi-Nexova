---
name: update-memory-bank
description: Keep memory-bank/ in sync with the real state of the repository after every change. Use after any feature, architecture decision, stack change or problem found, and always before opening a pull request.
---

## Goal

Keep the memory bank in sync with the real state of the repository after every change.

## When to use it

- After any feature, architecture decision, stack change or problem found.
- Always before opening a pull request.
- It is step 5 of the pre-commit workflow in `AGENTS.md`.

## Inputs

| Name | Source | Format |
| --- | --- | --- |
| `diff` | `git diff --name-status main...HEAD` plus `git diff main...HEAD` | text |
| `change_description` | the developer's request or the PR title | one or two sentences |
| `date` | `date +%F` | `YYYY-MM-DD` |
| `current_memory_bank` | the 6 files in `memory-bank/` | Markdown |

## Steps

1. Read the inputs.
2. Classify the change: business context, technical decision, progress, or known problem. A change can have more than one class.
3. Map each class to its file:
   - business → `projectbrief.md` / `productContext.md`;
   - technical decision → `techContext.md` / `systemPatterns.md`;
   - progress → `progress.md` / `activeContext.md`;
   - problem → "Known issues" in `progress.md`.
4. Update ONLY the affected files, keeping existing correct content.
5. Add a dated entry to `progress.md` with the date and the commit code (e.g. `M1-S06`).
6. Update "Next steps" in `activeContext.md`.
7. Run `bash .agents/skills/update-memory-bank/check.sh` and fix anything that fails until it exits with code 0.

## Output

- The modified `memory-bank/` files, included in the same commit as the change they describe.
- The `check.sh` output, pasted in the PR.

## Acceptance criteria

Each criterion is checked by `check.sh`, in this order:

1. No file in `memory-bank/` is empty, and the 6 expected files exist.
2. `progress.md` contains an entry dated today (`YYYY-MM-DD`).
3. No file in `memory-bank/` contains the placeholder markers `TODO`, `TBD` or `lorem` (case-insensitive).
4. Every relative Markdown link in `memory-bank/` points to an existing file.
5. If the branch changes files outside `memory-bank/` compared with `main`, it also changes at least one file inside `memory-bank/`.

## Example

A correct `progress.md` entry for the step that added this skill:

```markdown
- **2026-10-12 — Step 6 (`M1-S06`):** `update-memory-bank` skill added in `.agents/skills/update-memory-bank/` (`SKILL.md` with goal, inputs, steps and 5 acceptance criteria; `check.sh` verifying them); "added in step 6" notes removed from `AGENTS.md` and `.agents/rules/memory-bank.md`; E4 row of the matrix updated.
```

## Out of scope

This skill does not change code, rules or `CONTEXT.md`; it only keeps `memory-bank/` true.

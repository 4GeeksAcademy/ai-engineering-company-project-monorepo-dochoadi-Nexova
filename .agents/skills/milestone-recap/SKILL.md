---
name: milestone-recap
description: Produce a learning recap of a finished milestone (what was built, why, and what was learned) in docs/milestone-<n>/recap.md. Use as the last step of every milestone, before opening its pull request.
---

## Goal

Produce a learning recap of a finished milestone, so the developer can review what was built, why, and what was learned.

## When to use it

- As the last step of every milestone, before opening its pull request.
- After the milestone's evaluation matrix, verification guide and memory bank are up to date (the recap reads them; it does not replace them).

## Inputs

| Name | Source | Format |
| --- | --- | --- |
| `n` | the milestone number (e.g. `1`) | integer |
| `history` | `git fetch origin && git log --oneline origin/main..HEAD` (use `main` if a local `main` exists) | text, one commit per line |
| `matrix` | `docs/milestone-<n>/evaluation.md` | Markdown table of criteria `E<k>` |
| `verification` | `docs/milestone-<n>/verification.md` | Markdown, one section per step |
| `memory_bank` | the 6 files in `memory-bank/` (decisions in `activeContext.md`, history and known issues in `progress.md`, patterns in `systemPatterns.md`) | Markdown |
| `report` | `docs/milestone-<n>/report.md`, if it exists | Markdown |

## Steps

1. Read every input. Use the real history: copy commit hashes from `git log`, never retype them from memory.
2. Write `docs/milestone-<n>/recap.md` with exactly the sections of the template below, in that order.
3. Write it for learning: for every step, decision and problem, explain **why**, in words a classmate who was not there could follow. Prefer short paragraphs and tables over long lists.
4. Cover every milestone commit (every commit whose message contains `[M<n>-S`) and every criterion ID in the matrix.
5. Keep it public-safe: no IP addresses, hostnames, credentials, URLs of other projects or security incidents.
6. Run `bash .agents/skills/milestone-recap/check.sh <n>` from the repo root and fix anything that fails until it exits with code 0.
7. Commit the recap in the milestone's last step, and link it from `docs/README.md` and the evaluation matrix.

## Output

- `docs/milestone-<n>/recap.md`.
- The `check.sh <n>` output, pasted in the milestone's pull request.

## Acceptance criteria

All checked by `check.sh <n>`, in this order:

1. `docs/milestone-<n>/recap.md` exists and is not empty.
2. All 9 section headings of the template are present.
3. Every commit in `git log --format=%h <base>..HEAD` whose message contains `[M<n>-S` appears in the recap (`<base>` is `main` if it exists, otherwise `origin/main`). A commit that itself adds or changes the recap is skipped, because a file cannot contain the hash of the commit that creates it.
4. Every criterion ID (`E<k>`) in `docs/milestone-<n>/evaluation.md` appears in the recap.
5. No placeholder markers (`TODO`, `TBD`, `lorem`, case-insensitive).
6. No IPv4 addresses or Easypanel host URLs (the repository is public).

## Template

The recap uses these level-2 headings, in this order:

1. `## Milestone goal`: in the developer's own words, 2–3 lines.
2. `## What we built, step by step`: a table `Step | Commit | What it delivered | Why it matters`, with real short hashes.
3. `## Evaluation criteria and evidence`: each criterion ID → where it is proven.
4. `## Key decisions and their reasons`.
5. `## Problems we hit and how we solved them`: symptom → cause → fix → lesson.
6. `## Concepts learned`: short explanations a classmate could follow.
7. `## What I would do differently`.
8. `## Open questions carried forward`.
9. `## Glossary`: the terms introduced in the milestone.

## Out of scope

- It does not grade the milestone or change the evaluation matrix; it explains it.
- It does not update the memory bank (use `update-memory-bank`) or write the findings report for the tech lead (`docs/milestone-<n>/report.md`).
- It does not open the pull request.

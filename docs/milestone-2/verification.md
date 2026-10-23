# Milestone 2 — Verification guide

How to re-check every step of Milestone 2 (S01–S11). Each section is filled in when its step is done: what was delivered, the commands to run from the repo root, and the expected output. Criteria IDs refer to the [evaluation matrix](./evaluation.md).

## S01 — Setup: branch, briefing and evaluation matrix

### Delivered

- Branch `milestone-your-companys-public-website` created from the up-to-date `main`.
- Official briefing `BRIEFING.md` (root) and its Spanish version `docs/milestone-2/BRIEFING.es.md`, unmodified (4Geeks repo `ai-engineering-syllabus`, commit `ae89516`).
- `docs/milestone-2/`: `content-decisions.md`, `evaluation.md`, `learning-log.md`, `verification.md`, `README.md`; `docs/milestone-1/instructor-feedback.md`.
- Milestone lifecycle, branch-name rule, merge rule, root-site exception and plain-language summary convention in `AGENTS.md`, `.agents/rules/` and the memory bank.

### Commands

```bash
git branch --show-current
git diff --quiet origin/main -- CONTEXT.md && echo "CONTEXT.md unchanged"
sha256sum BRIEFING.md docs/milestone-2/BRIEFING.es.md
grep -cE "^\| E([1-9]|[12][0-9]|30) " docs/milestone-2/evaluation.md
grep -cE "^\| (L|A)[0-9]+ " docs/milestone-2/evaluation.md
grep -rn "merge your own" AGENTS.md .agents/rules/ || echo "old merge wording gone"
bash .agents/skills/update-memory-bank/check.sh; echo "exit=$?"
```

### Expected

- `milestone-your-companys-public-website`; `CONTEXT.md unchanged`.
- `de3eef75c30e5861d9ac4b1fef1e91dce4013d532f96f0f425ba6912976aedb6  BRIEFING.md` and `562b1ecf2f4d5593a78d1234abf42a0f27e11ddcce73b5ddcbcd9e9392082740  docs/milestone-2/BRIEFING.es.md`.
- `30` criteria rows and `30` landing/form deliverable rows.
- `old merge wording gone`; `check.sh` prints 5× `PASS` and `exit=0`.

## S02 — CISO security and accessibility gates, dev MCP servers

### Delivered

_To be filled in this step._

### Commands

_To be filled in this step._

### Expected

_To be filled in this step._

## S03 — Tailwind build and npx server

### Delivered

_To be filled in this step._

### Commands

_To be filled in this step._

### Expected

_To be filled in this step._

## S04 — Landing page

### Delivered

_To be filled in this step._

### Commands

_To be filled in this step._

### Expected

_To be filled in this step._

## S05 — Application form markup

### Delivered

_To be filled in this step._

### Commands

_To be filled in this step._

### Expected

_To be filled in this step._

## S06 — Form validation

### Delivered

_To be filled in this step._

### Commands

_To be filled in this step._

### Expected

_To be filled in this step._

## S07 — Accessibility, security and performance re-check

### Delivered

_To be filled in this step._

### Commands

_To be filled in this step._

### Expected

_To be filled in this step._

## S08 — Performance evidence and public URL

### Delivered

_To be filled in this step._

### Commands

_To be filled in this step._

### Expected

_To be filled in this step._

## S09 — To be defined

### Delivered

_To be filled in this step._

### Commands

_To be filled in this step._

### Expected

_To be filled in this step._

## S10 — Milestone recap

### Delivered

_To be filled in this step._

### Commands

_To be filled in this step._

### Expected

_To be filled in this step._

## S11 — Pull request and merge

### Delivered

_To be filled in this step._

### Commands

_To be filled in this step._

### Expected

_To be filled in this step._

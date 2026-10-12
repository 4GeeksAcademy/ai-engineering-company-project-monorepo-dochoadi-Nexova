# Milestone 1 — Evaluation "Monorepo AI Setup"

Evidence matrix for Milestone 1 of the Nexova Solutions monorepo: each criterion links to the files that prove it and to how to verify it.

| ID | Criterion | Step | Files | How to verify | Result |
| --- | --- | --- | --- | --- | --- |
| E1 | The memory bank contains business context and technical context | 2 | `memory-bank/projectbrief.md`, `memory-bank/productContext.md`, `memory-bank/techContext.md`, `memory-bank/systemPatterns.md`, `memory-bank/activeContext.md`, `memory-bank/progress.md` | `find memory-bank -empty` (no output); `grep -l "^Type: business" memory-bank/*.md` (≥2); `grep -l "^Type: technical" memory-bank/*.md` (≥2); `grep -lE "48 ?h\|Javier Almeida\|Roberto Díaz\|Marcos Ibáñez" memory-bank/*.md` (≥4); `grep -rniE "TODO\|TBD\|lorem" memory-bank/` (no output); `ls memory-bank/` (6 files) | Met: 2 business files, 2 technical and 2 status, all with real Nexova data (departments, SLA 48 h → 24 h, flagship agents) |
| E2 | AGENTS.md specifies a workflow with at least 4 ordered steps before commit | 5 | Pending | Pending | Pending |
| E3 | .agents/ contains at least one rule with an explicit scope | 4 | Pending | Pending | Pending |
| E4 | The skill has a single goal, documented inputs and verifiable acceptance criteria | 6 | Pending | Pending | Pending |
| E5 | ./uis/website starts without errors with the project dev command | 9 | Pending | Pending | Pending |
| E6 | Route / in ./uis/website renders a complete corporate website aligned with CONTEXT.md | 9 | Pending | Pending | Pending |
| E7 | ./uis/backoffice exists, has its own layout and renders without errors | 10 | Pending | Pending | Pending |
| E8 | ./uis/backoffice shows company-relevant content on screen, not only in the console | 10 | Pending | Pending | Pending |
| E9 | Application code follows the monorepo folder conventions without unnecessary duplication | 8 and 11 | Pending | Pending | Pending |

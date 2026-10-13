# Milestone 1 — Verification guide

How to re-check every step of Milestone 1 ("Monorepo AI Setup") from a clean checkout of the branch `chore/hito-1-ai-setup`. Each section says what the step delivered, the commands to run with their expected output, and, for the two UIs, a manual browser checklist. The criteria (E1–E9) and their evidence are in the [evaluation matrix](./evaluation.md).

## Before you start

Run everything from the repository root, in the devcontainer or a GitHub Codespace (Node 24, pnpm via Corepack, Python 3.12 with Playwright).

```bash
git switch chore/hito-1-ai-setup
pnpm install --frozen-lockfile   # no errors
```

If a local `main` branch does not exist, use `origin/main` wherever a command below compares against `main`.

---

## Step 1 — Branch, `.gitignore` and evaluation matrix

**Delivered:** the milestone branch, a `.gitignore` for secrets, personal files, dependencies, builds and test artifacts, and the evaluation matrix `docs/milestone-1/evaluation.md` (criteria E1–E9).

```bash
git branch --show-current                          # chore/hito-1-ai-setup
grep -nE "^\.env\*|^!\.env\.example|\*\.pem|\*\.key|\*\.rtf|node_modules|\.next|test-results" .gitignore
                                                   # one line per pattern
git ls-files | grep -E "(^|/)\.env" | grep -v "\.env\.example"   # no output
grep -cE "^\| E[1-9] \|" docs/milestone-1/evaluation.md          # 9
```

## Step 2 — Memory bank (E1)

**Delivered:** `memory-bank/` with business context (`projectbrief.md`, `productContext.md`), technical context (`techContext.md`, `systemPatterns.md`) and status (`activeContext.md`, `progress.md`).

```bash
ls memory-bank/                                    # 6 files
find memory-bank -empty                            # no output
grep -l "^Type: business" memory-bank/*.md         # 2 or more files
grep -l "^Type: technical" memory-bank/*.md        # 2 or more files
grep -lE "48 ?h|Javier Almeida|Roberto Díaz|Marcos Ibáñez" memory-bank/*.md   # 4 or more files
grep -rniE "TODO|TBD|lorem" memory-bank/           # no output
```

## Step 3 — Repository language: English

**Delivered:** the files from steps 1–2 translated; every file, commit and PR in English from here on.

```bash
git log --oneline origin/main..HEAD               # from [M1-S03] on, every subject is in English
grep -rlE "\b(contexto|negocio|técnico|matriz)\b" memory-bank docs/milestone-1/evaluation.md AGENTS.md .agents/rules
                                                   # no output
```

## Step 4 — Coding-agent rules with explicit scope (E3)

**Delivered:** 7 rules in `.agents/rules/`, each with frontmatter and a `Scope:` line: 4 always active, 2 by file pattern, 1 requested by the agent.

```bash
ls .agents/rules/                                  # 7 files
grep -L "^description:" .agents/rules/*.md         # no output
grep -l "^alwaysApply: true" .agents/rules/*.md    # 4 files
grep -l "^globs:" .agents/rules/*.md               # 2 files (uis-nextjs, services-backend)
grep -L -E "^(alwaysApply|globs):" .agents/rules/*.md   # only hr-domain-glossary.md
grep -L "^Scope:" .agents/rules/*.md               # no output
find .agents -empty                                # no output
```

## Step 5 — `AGENTS.md` with the pre-commit workflow (E2)

**Delivered:** the root `AGENTS.md`, the mandatory protocol for any coding agent, with a 7-step pre-commit workflow; `CLAUDE.md` loads it for Claude Code.

```bash
wc -l AGENTS.md                                    # under 120 lines
grep -E "^## " AGENTS.md                           # 8 sections in order
awk '/^## Mandatory workflow before every commit/{f=1;next}/^## /{f=0}f' AGENTS.md | grep -cE "^[0-9]+\. "
                                                   # 7
grep -c "memory-bank/" AGENTS.md                   # 6 or more
cat CLAUDE.md                                      # the two @ lines: @AGENTS.md and @.agents/rules/git-workflow.md
```

## Step 6 — `update-memory-bank` skill (E4)

**Delivered:** `.agents/skills/update-memory-bank/` with `SKILL.md` (goal, inputs, steps, 5 acceptance criteria) and `check.sh`, which verifies the criteria.

```bash
ls -l .agents/skills/update-memory-bank/           # check.sh is executable (-rwx)
grep -cE "^## (Goal|Inputs|Acceptance criteria)$" .agents/skills/update-memory-bank/SKILL.md   # 3
bash .agents/skills/update-memory-bank/check.sh; echo "exit=$?"
                                                   # 5× PASS, "All 5 criteria passed", exit=0
```

Negative test: empty `memory-bank/progress.md` (`: > memory-bank/progress.md`), rerun `check.sh` (expect `FAIL [1]`, `FAIL [2]`, `exit=1`), then restore it with `git checkout memory-bank/progress.md`.

## Step 7 — Vendored external skills

**Delivered:** `frontend-design` and `webapp-testing` copied unchanged from Anthropic's public skills repository (Apache 2.0) into `.agents/skills/`, each with a `SOURCE.md`; a catalogue in `.agents/skills/README.md`; `.claude/skills` is a symlink to `../.agents/skills`.

```bash
ls .agents/skills/                                 # README.md frontend-design milestone-recap update-memory-bank webapp-testing
                                                   # (milestone-recap was added in step 13)
ls .agents/skills/frontend-design .agents/skills/webapp-testing   # LICENSE.txt, SKILL.md, SOURCE.md in each
readlink .claude/skills                            # ../.agents/skills
```

## Step 8 — pnpm workspace and shared company data (E9, part 1)

**Delivered:** the pnpm workspace (`uis/*`, `packages/*`) on Node 24 with TypeScript 5.9.3, and Nexova's company data defined once in `packages/shared/company.ts`, exported by `@repo/shared-types`.

```bash
node -v && pnpm -v                                 # v24.x and 12.11.2
cat pnpm-workspace.yaml                            # uis/* and packages/*
pnpm --filter @repo/shared-types typecheck; echo "exit=$?"   # exit=0
pnpm --filter @repo/shared-types test              # 6 tests pass
```

## Step 9 — Devcontainer on Node 24

**Delivered:** `.devcontainer/devcontainer.json` on `javascript-node:24` with Python 3.12, GitHub CLI and sshd, forwarding ports 3000, 3001, 8000 and 5678; `post-create.sh` (pnpm via Corepack, frozen install, Playwright with Chromium, Claude Code); `.nvmrc` = `24`.

```bash
grep -E '"image"|forwardPorts' .devcontainer/devcontainer.json
                                                   # javascript-node:24 and [3000, 3001, 8000, 5678]
cat .nvmrc                                         # 24
bash -n .devcontainer/post-create.sh; echo "exit=$?"   # exit=0 (valid syntax)
python3 -c "import playwright; print('ok')"        # ok (inside the devcontainer)
```

## Step 10 — Corporate website (E5, E6)

**Delivered:** `uis/website`, the public landing page in Next.js 16 on port 3000, rebuilt faithfully from the approved design `docs/milestone-1/design/nexova-landing-v4.html`; company facts from `@repo/shared-types`; screenshots in `docs/milestone-1/screenshots/`.

```bash
pnpm --filter website lint && pnpm --filter website typecheck && pnpm --filter website test && pnpm --filter website build; echo "exit=$?"
                                                   # exit=0, 4 tests pass, / prerendered as static
pnpm dev:website                                   # ✓ Ready, then in another terminal:
curl -s -o /dev/null -w "%{http_code}\n" localhost:3000/   # 200
curl -s localhost:3000/ | grep -oE "Nexova|Valencia|Miami|Executive|Customer support|Leadership|application/ld\+json" | sort -u
                                                   # 7 terms
grep -rnE "Laura Mendoza|Javier Almeida" uis/website --include=*.ts --include=*.tsx   # no output
```

**Manual browser checks** (http://localhost:3000, at 1440px and 375px wide; compare with `website-desktop.png`, `website-mobile.png` and `website-hero-placement.png`):

- [ ] The hero CV cascade: CV cards fall, sort into the grid and the shortlist ends on "Placement" after about 9 seconds.
- [ ] The role ticker in the hero rotates through roles.
- [ ] The key figures count up the first time they scroll into view.
- [ ] Both office photos (Valencia and Miami) reveal when the About section scrolls into view, and the two office clocks show live local times.
- [ ] Under 860px, the Menu button opens the mobile menu (`aria-expanded` turns `true`), Escape closes it, and following a link closes it.
- [ ] The stacked service cards (the 3 business lines) pile up as you scroll, each one sticking over the previous one, at both widths; no horizontal scroll at 375px.
- [ ] Every link and button is reachable with Tab and shows a visible focus ring.
- [ ] With "reduce motion" on in the OS, the hero shows the final shortlist and nothing animates on scroll.
- [ ] The browser console shows no errors.

## Step 11 — Backoffice (E7, E8)

**Delivered:** `uis/backoffice`, the internal operations overview in Next.js 16 on port 3001, with its own layout, rebuilt from the approved design `docs/milestone-1/design/nexova-backoffice.html`; all data from `@repo/shared-types`, calculations in `lib/metrics.ts`; brand tokens moved to `packages/shared/styles/tokens.css` and imported by both apps.

```bash
pnpm --filter backoffice lint && pnpm --filter backoffice typecheck && pnpm --filter backoffice test && pnpm --filter backoffice build; echo "exit=$?"
                                                   # exit=0, 5 tests pass, / prerendered as static
pnpm dev:backoffice                                # compiles with no errors, then in another terminal:
curl -s -o /dev/null -w "%{http_code}\n" localhost:3001/   # 200
curl -s localhost:3001/ | grep -oE "Operations overview|Breached|Roberto Díaz|Javier Almeida|Marcos Ibáñez|Not stated|Planned|Where the work is" | sort -u
                                                   # all 8 terms
grep -rn "uis/website\|from ['\"]website" uis/backoffice --include=*.ts --include=*.tsx --include=*.css
                                                   # no output (no imports from the website)
grep -rnE "Laura Mendoza|Roberto Díaz|48|120" uis/backoffice --include=*.tsx   # no output
```

**Manual browser checks** (http://localhost:3001, at 1440px and 375px wide; compare with `backoffice-desktop.png` and `backoffice-mobile.png`):

- [ ] KPI count-up: on load, the Support SLA counts up to "+24 h" and "100 % over" while the SLA bar fills from 0 past the 24 h marker; Headcount counts up to "110 of 120"; the "Breached" dot pings 3 times.
- [ ] Type filter: clicking "Automations and alerts · 9" sets `aria-pressed="true"`, dims the other bar segments, highlights the 9 matching needs in the department cards, dims the rest (the dimmed text stays readable), and the summary reads "9 automations and alerts across 6 departments, highlighted below." Clicking it again clears the filter.
- [ ] Headcount segments: hovering or tabbing to a segment shows e.g. "Customer Support: 30 people (25 % of 120)"; clicking it scrolls to that department card.
- [ ] SLA clock: the Customer Support card shows "If a ticket arrived now", with "SLA due" 24 h from now and "Typical resolution" 48 h from now (in rust); the top-bar time and dot update every 30 s.
- [ ] Scroll-spy: on a wide screen, scrolling through the departments highlights the one in view in the sidebar with an ember bar.
- [ ] Agent flows: the four flow steps of an agent card play a travelling highlight only while the card is hovered or focused with Tab, and stop when it is not.
- [ ] Under 960px, the sidebar becomes a top bar; "Menu" opens the navigation (`aria-expanded="true"`, label "Close"), Escape closes it and returns focus to the button, and following a link closes it.
- [ ] At 375px there is no horizontal scroll; the browser console shows no errors.
- [ ] With "reduce motion" on, final values show immediately: no count-up, bar growth, ping or flow animation.

## Step 12 — Conventions and cleanup (E9, part 2)

**Delivered:** `typecheck` works on a fresh clone (`next typegen` before `tsc`); the root `README.md` describes the real state of the repository; the sales forecasting brief moved to `docs/briefs/sales-forecasting.md`; template leftovers documented; push policy updated in `.agents/rules/git-workflow.md`; AA contrast for the backoffice's dimmed needs; this guide; planning decisions consolidated in `memory-bank/`.

```bash
rm -f uis/*/next-env.d.ts && rm -rf uis/*/.next && pnpm typecheck; echo "typecheck-fresh exit=$?"
                                                   # typecheck-fresh exit=0
pnpm lint && pnpm test && pnpm build; echo "exit=$?"   # exit=0
grep -nE "README.es.md|no root .AGENTS.md" README.md   # no output
grep -rnE "([0-9]{1,3}\.){3}[0-9]{1,3}|easypanel\.host|password" memory-bank docs README.md | grep -v "127.0.0.1"
                                                   # no output (no IP addresses, hostnames or credentials in the public repo)
ls docs/briefs docs/milestone-1                    # sales-forecasting.md; design/ evaluation.md screenshots/ verification.md
```

E9 audit:

```bash
git diff --name-only origin/main...HEAD | cut -d/ -f1 | sort -u
    # only template folders plus .agents, .claude, AGENTS.md, CLAUDE.md and the workspace files
find . -name "*.py" -not -path "./node_modules/*" -not -path "*/.venv/*" -not -path "./agents/*" -not -path "./skills/*" -not -path "./data/*" -not -path "./.agents/*" -not -path "./services/*"
    # no output: no Python outside the allowed folders
grep -rnE "#[0-9A-Fa-f]{6}" uis/*/app uis/*/components | grep -v "var(--" | grep -v tokens.css
    # no output: raw colours only in packages/shared/styles/tokens.css
grep -rnE "Laura Mendoza|Javier Almeida|Roberto Díaz" uis --include=*.ts --include=*.tsx
    # no output: company names come from @repo/shared-types
git ls-files | while read -r f; do [ -f "$f" ] && [ ! -s "$f" ] && echo "$f"; done | grep -v .gitkeep
    # no output: no empty tracked files
for d in uis/website uis/backoffice packages/shared docs/milestone-1; do test -f $d/README.md -o -f $d/evaluation.md && echo "$d OK"; done
    # 4 lines ending in OK
bash .agents/skills/update-memory-bank/check.sh; echo "exit=$?"   # 5× PASS, exit=0
```

## Step 13 — Milestone recap, final report and PR

**Delivered:** the `milestone-recap` skill (`.agents/skills/milestone-recap/`, with `check.sh <n>`), referenced from `AGENTS.md` and `.agents/rules/memory-bank.md`; the findings report [`report.md`](./report.md); the learning recap [`recap.md`](./recap.md); and the pull request from `chore/hito-1-ai-setup` to `main`, to be reviewed and merged by someone other than the author.

```bash
grep -E "^\| E[1-9] \|" docs/milestone-1/evaluation.md | grep -c "| Met"   # 9
git log --oneline origin/main..HEAD | grep -c " \[M1-S"   # 11: steps 3–13 (steps 1–2 predate the naming convention)
bash .agents/skills/milestone-recap/check.sh 1; echo "exit=$?"   # 6× PASS, exit=0
grep -c "milestone-recap" AGENTS.md .agents/rules/memory-bank.md .agents/skills/README.md   # 1 or more per file
gh pr view --json state,baseRefName,headRefName   # OPEN, main <- chore/hito-1-ai-setup
```

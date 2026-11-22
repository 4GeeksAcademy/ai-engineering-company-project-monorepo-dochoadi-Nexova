# Milestone 1 — Issues and fixes log

Compiled on 2026-11-22 from what was recorded during the milestone; nothing new was added. The source of each row has the detail.

**Scope:** problems produced in this milestone, even if found or fixed later.

**Status:** `Open` · `Fixed` · `Accepted`. Never delete a row: update its status.

## Errors and fixes

| ID | Problem | Fix or decision | Step | Status | Source |
|---|---|---|---|---|---|
| M1-01 | Empty `.gitignore` | Rules for secrets, dependencies and builds | S01 | Fixed | [report](./report.md) |
| M1-02 | Empty memory bank and a misspelt file name | Filled; renamed to `projectbrief.md` | S02 | Fixed | [report](./report.md) |
| M1-03 | Empty root `AGENTS.md` | Operating protocol written | S05 | Fixed | [report](./report.md) |
| M1-04 | `packages/shared` entry point pointed to a missing file | Entry point created | S08 | Fixed | [report](./report.md) |
| M1-05 | Setup script failed on `uv sync` without a `pyproject.toml` | Run it only when the file exists | S09 | Fixed | [recap](./recap.md) |
| M1-06 | Backoffice port 3001 was not forwarded | Added to the devcontainer | S09 | Fixed | [report](./report.md) |
| M1-07 | First sessions had no Node and no git credentials | Moved to a real Codespace | S09–S10 | Fixed | [report](./report.md) |
| M1-08 | Playwright browsers do not run on Alpine | Debian-based Node 24 image | S09 | Fixed | [report](./report.md) |
| M1-09 | pnpm refused dependency build scripts | `allowBuilds` set to false (prebuilt binaries) | S10 | Fixed | [recap](./recap.md) |
| M1-10 | Next.js created a competing `AGENTS.md` in each app | `agentRules: false` | S10–S11 | Fixed | [recap](./recap.md) |
| M1-11 | Office photos never appeared | Observe the wrapper, not the clipped element | S10 | Fixed | [recap](./recap.md) |
| M1-12 | Landing design had unsupported claims, low contrast, endless motion and generic patterns | Corrected in the design review | S10 | Fixed | [report](./report.md) |
| M1-13 | Typecheck failed on a fresh clone | Run `next typegen` first | S12 | Fixed | [recap](./recap.md) |
| M1-14 | Dimmed backoffice needs fell below AA contrast | Dim the fill, keep the text colour | S12 | Fixed | [recap](./recap.md) |
| M1-15 | Root README was outdated and had broken links | Status rewritten, links removed | S12 | Fixed | [report](./report.md) |
| M1-16 | Forecasting brief was named like the company context | Moved to `docs/briefs/` | S12 | Fixed | [report](./report.md) |
| M1-17 | Instructor: wrong branch name | Use the name the brief asks for | M2-S01 | Fixed | [feedback](./instructor-feedback.md) |
| M1-18 | Instructor: briefing not in `BRIEFING.md` | Official file at the root, unmodified | M2-S01 | Fixed | [feedback](./instructor-feedback.md) |
| M1-19 | Instructor: own PR merged against the written rule | Merge rule clarified | M2-S01 | Fixed | [feedback](./instructor-feedback.md) |

## Dependency advisories published later

| ID | Problem | Fix or decision | Found in | Status | Source |
|---|---|---|---|---|---|
| M1-31 | 7 moderate Next.js advisories for 16.4.1 (published 16–19 November 2026) stop `pnpm build` when an agent runs it | Both apps updated to 16.4.6 in M3-S00d (`f2ded98`): `pnpm build` exit 0, and `pnpm audit` lists no Next.js advisory (both run again in M3-S01) | M3-S00b | Fixed | [Milestone 3 learning log](../milestone-3/learning-log.md) |
| M1-32 | Moderate `minimatch` 10.2.6 advisory GHSA-g3hv-75wg-m249 | Decide at the end of Milestone 3 (the fix is a major version, 11.0.1) | M3-S00b | Open | `pnpm audit` |
| M1-33 | ESLint 9.39.5 is deprecated (no longer supported) | Decide at the end of Milestone 3 | M3-S00d | Open | Install warning, npm registry |

## Found later in Milestone 3

| ID | Problem | Fix or decision | Found in | Status | Source |
|---|---|---|---|---|---|
| M1-34 | Memory check criterion 2 passes with any entry of the same day, even another step's | Check for the step's code; protected check, for the decision review | M3-S01 | Open | [Milestone 3 log](../milestone-3/issues-log-m3.md) (M3-50) |

## Data problems and open questions

| ID | Problem | Current handling | Status | Source |
|---|---|---|---|---|
| M1-20 | Two Sales managers in `CONTEXT.md` | Marcos Ibáñez until confirmed | Open | [report](./report.md) |
| M1-21 | Teams add up to 110 of 120 employees | The gap is shown, not invented | Open | [report](./report.md) |
| M1-22 | Unclear whether three team sizes include the manager | Noted on each department | Open | [report](./report.md) |
| M1-23 | No team size for Executive and Marketing | Shown as "Not stated" | Open | [report](./report.md) |
| M1-24 | No headcount split between Valencia and Miami | Left out | Open | [report](./report.md) |
| M1-25 | Forecasting dataset does not exist | For the milestone that uses it | Open | [report](./report.md) |
| M1-26 | No real contact email | Placeholder | Open | [recap](./recap.md) |
| M1-27 | Backoffice has no authentication decision | Not decided | Open | [recap](./recap.md) |
| M1-28 | Vector store and LLM provider undecided | For the agent milestones | Open | [report](./report.md) |
| M1-29 | Language of the CV scoring undecided | TypeScript for the deterministic score, recorded in M3-S01: `grep -n "closed 2026-11-22" memory-bank/techContext.md` finds it | Fixed | [report](./report.md) |
| M1-30 | Office photo licences | Use confirmed by the developer; formal record needed before a real launch | Accepted | [Milestone 2 recap](../milestone-2/recap.md) |

## Produced in Milestone 1, found later in the Milestone 2 review

| ID | Problem | Fix or decision | Fixed or decided in | Status | Source |
|---|---|---|---|---|---|
| SEC-2 | Development-only `braces` advisory with no patch | Exception; advisory withdrawn on 2026-10-23, so review it at the end of M3 | M2-S03, M2-S11 | Accepted | [security](../milestone-2/security.md) |
| SEC-3 | M1 apps send no security headers | M1 hardening, needs approval | Not planned yet | Open | [security](../milestone-2/security.md) |
| SEC-4 | Unpinned installs in the devcontainer | Exact versions | M2-S10 | Fixed | [security](../milestone-2/security.md) |
| SEC-5 | Vendored test helper starts commands through a shell | Note for literal commands only | Not planned yet | Open | [security](../milestone-2/security.md) |
| SEC-7 | JSON-LD uses `dangerouslySetInnerHTML` (safe today) | Keep the data static | Not planned yet | Open | [security](../milestone-2/security.md) |
| A11Y-1 | Scroll-linked dimmed text below AA | M1 hardening; avoided on the public site | Not planned yet | Open | [accessibility](../milestone-2/accessibility.md) |
| A11Y-2 | Low contrast during fades | M1 hardening; avoided on the public site | Not planned yet | Open | [accessibility](../milestone-2/accessibility.md) |
| A11Y-3 | Headcount segments are too small to target | M1 hardening | Not planned yet | Open | [accessibility](../milestone-2/accessibility.md) |
| A11Y-4 | Filter buttons are 40 px, under the 44 px rule | M1 hardening | Not planned yet | Open | [accessibility](../milestone-2/accessibility.md) |
| A11Y-5 | Endless marquee without a pause | M1 hardening; pause control on the public site | Not planned yet | Open | [accessibility](../milestone-2/accessibility.md) |
| A11Y-6 | Endless decorative pulses | M1 hardening; avoided on the public site | Not planned yet | Open | [accessibility](../milestone-2/accessibility.md) |
| A11Y-7 | Dimmed backoffice needs | Fixed in Milestone 1 | M1-S12 | Fixed | [accessibility](../milestone-2/accessibility.md) |

# Milestone 2 — Issues and fixes log

Compiled on 2026-11-22 from what was recorded during the milestone, plus what was found after the merge. The source of each row has the detail.

**Scope:** problems produced in this milestone, even if found or fixed later.

**Status:** `Open` · `Fixed` · `Accepted`. Never delete a row: update its status.

## Errors and fixes

| ID | Problem | Fix or decision | Step | Status | Source |
|---|---|---|---|---|---|
| M2-01 | Next.js in both apps needed a security patch | Updated to 16.4.1 | S02 | Fixed | [security](./security.md) |
| M2-02 | Security gate matched its own documentation | Match real host URLs only | S03 | Fixed | [security](./security.md) |
| M2-03 | Closed mobile menu links counted as tabbable | Explicit hidden state | S03 | Fixed | [recap](./recap.md) |
| M2-04 | Buttons vanished in high-contrast mode | Transparent borders | S04 | Fixed | [recap](./recap.md) |
| M2-05 | Spanish form ran without validation after an update | No caching and version tags | S06–S07 | Fixed | [recap](./recap.md) |
| M2-06 | Submit button stayed visible after success | Use the `hidden` attribute | S07 | Fixed | [recap](./recap.md) |
| M2-07 | Lighthouse 87–88 on the landing pages | Create the animations in phases | S08 | Fixed | [recap](./recap.md) |
| M2-08 | First paint took 2.4 s | Self-hosted, preloaded font | S08 | Fixed | [recap](./recap.md) |
| M2-09 | Security gate flagged Lighthouse reports | Skip generated reports | S08 | Fixed | [recap](./recap.md) |
| M2-10 | "Why Nexova" was not in 2 columns (final audit, E26) | 2 × 2 grid | S11 | Fixed | [recap](./recap.md) |
| M2-11 | Memory bank described an older state (final audit, E3) | Memory updated | S13 | Fixed | [verification](./verification.md) |
| M2-12 | Public preview port had to go back to Private | Developer confirmed Private on 2026-11-22 | After the merge | Fixed | [report](./report.md) |
| M2-13 | Merge was never recorded; its section is a placeholder | Filled in M3-S01 as S14: `grep -n "To be filled in this step"` finds nothing in the guide; `git show -s --format=%P ee14825` gives 2 parents | M3-S01 | Fixed | [verification](./verification.md) |
| M2-14 | Memory still says PR #2 is open | Corrected in M3-S01: merge `ee14825` in `progress.md`, `activeContext.md` and `projectbrief.md`; `gh pr view 2` says MERGED | M3-S01 | Fixed | [verification](./verification.md) |
| M2-15 | Security rule 16 gives `--no-dotfiles` instead of the documented server flags (`dist`, `-d false -c-1`) | Correct the rule, for the decision review | Found in M3-S01 | Open | [Milestone 3 log](../milestone-3/issues-log-m3.md) (M3-49) |

## Security review findings

| ID | Problem | Fix or decision | Step | Status | Source |
|---|---|---|---|---|---|
| SEC-1 | Planned server also served dotfiles | Serve only the `dist/` allowlist | S03 | Fixed | [security](./security.md) |
| SEC-6 | Development browser runs without its sandbox | Trusted pages only; try removing the flag | Not planned yet | Open | [security](./security.md) |

The SEC and A11Y findings about things built in Milestone 1 are in the [Milestone 1 log](../milestone-1/issues-log-m1.md).

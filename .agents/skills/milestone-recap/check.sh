#!/usr/bin/env bash
# Verifies the 6 acceptance criteria of the milestone-recap skill (see SKILL.md).
# Usage: bash .agents/skills/milestone-recap/check.sh <milestone-number>
set -uo pipefail

cd "$(git rev-parse --show-toplevel)" || exit 1

n="${1:-}"
if ! [[ "$n" =~ ^[0-9]+$ ]]; then
  echo "Usage: $0 <milestone-number>"
  exit 2
fi

RECAP="docs/milestone-$n/recap.md"
MATRIX="docs/milestone-$n/evaluation.md"
HEADINGS=(
  "## Milestone goal"
  "## What we built, step by step"
  "## Evaluation criteria and evidence"
  "## Key decisions and their reasons"
  "## Problems we hit and how we solved them"
  "## Concepts learned"
  "## What I would do differently"
  "## Open questions carried forward"
  "## Glossary"
)
failures=0

pass() { echo "PASS [$1] $2"; }
fail() { echo "FAIL [$1] $2: $3"; failures=$((failures + 1)); }

# 1. The recap exists and is not empty.
desc="$RECAP exists and is not empty"
if [ -s "$RECAP" ]; then pass 1 "$desc"; else fail 1 "$desc" "missing or empty"; fi

# 2. All 9 section headings are present.
desc="all ${#HEADINGS[@]} section headings are present"
missing=()
for h in "${HEADINGS[@]}"; do
  grep -qxF "$h" "$RECAP" 2>/dev/null || missing+=("$h")
done
if [ ${#missing[@]} -eq 0 ]; then pass 2 "$desc"; else fail 2 "$desc" "$(IFS=,; echo "${missing[*]}")"; fi

# 3. Every milestone commit appears in the recap (except commits that touch the recap itself).
desc="every [M$n-S..] commit appears in the recap"
if git rev-parse --verify -q main >/dev/null; then
  base="main"
elif git rev-parse --verify -q origin/main >/dev/null; then
  base="origin/main"
else
  base=""
fi
if [ -z "$base" ]; then
  fail 3 "$desc" "neither main nor origin/main exists"
else
  absent=()
  while IFS= read -r line; do
    h="${line%% *}"
    msg="${line#* }"
    case "$msg" in *"[M$n-S"*) ;; *) continue ;; esac
    if git show --name-only --format= "$h" | grep -qxF "$RECAP"; then continue; fi
    grep -qF "$h" "$RECAP" 2>/dev/null || absent+=("$h")
  done < <(git log --format='%h %s' "$base..HEAD")
  if [ ${#absent[@]} -eq 0 ]; then pass 3 "$desc (against $base)"; else fail 3 "$desc" "missing $(IFS=,; echo "${absent[*]}")"; fi
fi

# 4. Every criterion ID in the evaluation matrix appears in the recap.
desc="every criterion ID in $MATRIX appears in the recap"
if [ ! -f "$MATRIX" ]; then
  fail 4 "$desc" "$MATRIX not found"
else
  ids="$(grep -oE "^\| E[0-9]+ \|" "$MATRIX" | grep -oE "E[0-9]+" | sort -u)"
  absent=()
  for id in $ids; do
    grep -qw "$id" "$RECAP" 2>/dev/null || absent+=("$id")
  done
  if [ -z "$ids" ]; then
    fail 4 "$desc" "no criterion IDs found"
  elif [ ${#absent[@]} -eq 0 ]; then
    pass 4 "$desc"
  else
    fail 4 "$desc" "missing $(IFS=,; echo "${absent[*]}")"
  fi
fi

# 5. No placeholder markers.
desc="no placeholder markers"
matches="$(grep -niE "todo|tbd|lorem" "$RECAP" 2>/dev/null)"
if [ -z "$matches" ]; then pass 5 "$desc"; else fail 5 "$desc" "lines $(echo "$matches" | cut -d: -f1 | tr '\n' ' ' | sed 's/ $//')"; fi

# 6. No IPv4 addresses or Easypanel host URLs (public repo).
desc="no IPv4 addresses or Easypanel host URLs"
matches="$(grep -nE "([0-9]{1,3}\.){3}[0-9]{1,3}|easypanel\.host" "$RECAP" 2>/dev/null)"
if [ -z "$matches" ]; then pass 6 "$desc"; else fail 6 "$desc" "lines $(echo "$matches" | cut -d: -f1 | tr '\n' ' ' | sed 's/ $//')"; fi

if [ "$failures" -eq 0 ]; then
  echo "All 6 criteria passed"
  exit 0
fi
echo "$failures criteria failed"
exit 1

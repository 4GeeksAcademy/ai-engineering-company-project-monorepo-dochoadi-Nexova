#!/usr/bin/env bash
# Verifies the 5 acceptance criteria of the update-memory-bank skill (see SKILL.md).
set -uo pipefail

cd "$(git rev-parse --show-toplevel)" || exit 1

MB="memory-bank"
EXPECTED_FILES=(projectbrief.md productContext.md techContext.md systemPatterns.md activeContext.md progress.md)
failures=0

pass() { echo "PASS [$1] $2"; }
fail() { echo "FAIL [$1] $2: $3"; failures=$((failures + 1)); }

# 1. The 6 expected files exist and no file in memory-bank/ is empty.
desc="memory-bank/ has the 6 expected files and none is empty"
problems=()
for f in "${EXPECTED_FILES[@]}"; do
  [ -e "$MB/$f" ] || problems+=("missing $f")
done
while IFS= read -r f; do
  problems+=("empty ${f#"$MB"/}")
done < <(find "$MB" -type f -empty 2>/dev/null)
if [ ${#problems[@]} -eq 0 ]; then pass 1 "$desc"; else fail 1 "$desc" "$(IFS=,; echo "${problems[*]}")"; fi

# 2. progress.md contains an entry dated today.
today="$(date +%F)"
desc="progress.md contains an entry dated today ($today)"
if grep -q -- "$today" "$MB/progress.md" 2>/dev/null; then
  pass 2 "$desc"
else
  fail 2 "$desc" "no line with $today"
fi

# 3. No placeholder markers in memory-bank/.
desc="memory-bank/ contains no placeholder markers"
matches="$(grep -rniE "todo|tbd|lorem" "$MB" 2>/dev/null)"
if [ -z "$matches" ]; then
  pass 3 "$desc"
else
  fail 3 "$desc" "$(echo "$matches" | cut -d: -f1,2 | tr '\n' ' ' | sed 's/ $//')"
fi

# 4. Every relative Markdown link in memory-bank/ points to an existing file.
desc="every relative Markdown link in memory-bank/ resolves"
broken=()
while IFS= read -r match; do
  file="${match%%:*}"
  target="${match#*](}"
  target="${target%)}"
  target="${target%% *}"
  case "$target" in
    http://*|https://*|mailto:*|\#*|"") continue ;;
  esac
  path="${target%%#*}"
  [ -e "$MB/$path" ] || broken+=("${file#"$MB"/} -> $target")
done < <(grep -roE "\]\([^)]*\)" "$MB" --include="*.md" 2>/dev/null)
if [ ${#broken[@]} -eq 0 ]; then pass 4 "$desc"; else fail 4 "$desc" "$(IFS=,; echo "${broken[*]}")"; fi

# 5. If the branch changes files outside memory-bank/, it also changes memory-bank/.
desc="changes outside memory-bank/ come with a memory-bank/ update"
if git rev-parse --verify -q main >/dev/null; then
  base="main"
elif git rev-parse --verify -q origin/main >/dev/null; then
  base="origin/main"
else
  base=""
fi
if [ -z "$base" ]; then
  fail 5 "$desc" "neither main nor origin/main exists"
else
  # Committed, staged, unstaged and untracked changes since the branch left main.
  merge_base="$(git merge-base "$base" HEAD)"
  changed="$( { git diff --name-only "$merge_base"; git ls-files --others --exclude-standard; } | sort -u)"
  outside="$(echo "$changed" | grep -v -e "^$MB/" -e '^$' | wc -l)"
  inside="$(echo "$changed" | grep -c "^$MB/")"
  if [ "$outside" -eq 0 ] || [ "$inside" -gt 0 ]; then
    pass 5 "$desc"
  else
    fail 5 "$desc" "$outside file(s) changed outside memory-bank/ against $base, none inside"
  fi
fi

if [ "$failures" -eq 0 ]; then
  echo "All 5 criteria passed"
  exit 0
fi
echo "$failures criteria failed"
exit 1

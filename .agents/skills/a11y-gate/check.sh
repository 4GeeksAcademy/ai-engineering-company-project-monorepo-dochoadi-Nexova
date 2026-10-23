#!/usr/bin/env bash
# Verifies the 8 acceptance criteria of the a11y-gate skill (see SKILL.md).
# Usage: bash .agents/skills/a11y-gate/check.sh <milestone>
# Prints PASS / FAIL / SKIP lines per page, width and criterion; exits 0 only when there is no FAIL.
set -uo pipefail

cd "$(git rev-parse --show-toplevel)" || exit 1

MILESTONE="${1:-}"
if ! [[ "$MILESTONE" =~ ^[0-9]+$ ]]; then
  echo "usage: bash .agents/skills/a11y-gate/check.sh <milestone>" >&2
  exit 2
fi

SKILL_DIR=".agents/skills/a11y-gate"
OUT="docs/milestone-$MILESTONE/a11y"
PORT=8099
HTTP_SERVER="http-server@14.1.1"
SITE_PAGES=(index.html application.html es/index.html es/application.html)
CRITERIA=(
  "axe: 0 serious or critical violations"
  "lang set and correct, exactly one h1, no skipped heading levels"
  "every img has a non-empty alt, or alt=\"\" with aria-hidden"
  "every form control has an associated label"
  "Tab reaches every interactive element in DOM order with a visible focus style"
  "reflow: no horizontal scroll at 320px"
  "prefers-reduced-motion: reduce leaves no running CSS animations"
  "forced-colors screenshot saved for manual review"
)

echo "a11y-gate — Milestone $MILESTONE"

pages=()
for p in "${SITE_PAGES[@]}"; do
  if [ -f "$p" ]; then
    pages+=("$p")
  else
    for i in "${!CRITERIA[@]}"; do echo "SKIP [$((i + 1))] $p: ${CRITERIA[$i]} — page does not exist yet"; done
  fi
done

if [ ${#pages[@]} -eq 0 ]; then
  echo "a11y-gate passed (no FAIL; no site pages yet)"
  exit 0
fi

if ! python3 -c "import axe_playwright_python, playwright" 2>/dev/null; then
  echo "FAIL [0] Python tools missing — run: pip install --user -r $SKILL_DIR/requirements.txt"
  exit 1
fi

# Serve the dist/ allowlist copy, exactly like the documented site command; never the repo root (SEC-1).
if ! build_out="$(pnpm build:site 2>&1)"; then
  echo "FAIL [0] pnpm build:site failed: $(echo "$build_out" | tail -1)"
  exit 1
fi
npx -y "$HTTP_SERVER" dist -p "$PORT" -a 127.0.0.1 -d false -c-1 -s >/dev/null 2>&1 &
server_pid=$!
stop_server() {
  # http-server renames its process to "http-server", so stop it by the port it listens on.
  for pid in $(ss -ltnpH "sport = :$PORT" 2>/dev/null | grep -oE 'pid=[0-9]+' | cut -d= -f2); do kill "$pid" 2>/dev/null; done
  kill "$server_pid" 2>/dev/null
  wait "$server_pid" 2>/dev/null
}
trap stop_server EXIT

for _ in $(seq 1 60); do
  curl -s -o /dev/null "http://127.0.0.1:$PORT/" && break
  sleep 0.5
done

python3 "$SKILL_DIR/a11y_check.py" --base "http://127.0.0.1:$PORT" --out "$OUT" --pages "${pages[@]}"
status=$?

if [ "$status" -eq 0 ]; then
  echo "a11y-gate passed (no FAIL)"
  exit 0
fi
echo "a11y-gate failed"
exit 1

#!/usr/bin/env bash
# Verifies the 7 acceptance criteria of the security-gate skill (see SKILL.md).
# Usage: bash .agents/skills/security-gate/check.sh <milestone>
# Prints one PASS / FAIL / SKIP line per criterion; exits 0 only when there is no FAIL.
set -uo pipefail

cd "$(git rev-parse --show-toplevel)" || exit 1

MILESTONE="${1:-}"
if ! [[ "$MILESTONE" =~ ^[0-9]+$ ]]; then
  echo "usage: bash .agents/skills/security-gate/check.sh <milestone>" >&2
  exit 2
fi

SELF=".agents/skills/security-gate"
PORT=8099
HTTP_SERVER="http-server@14.1.1"
failures=0

pass() { echo "PASS [$1] $2"; }
fail() { echo "FAIL [$1] $2: $3"; failures=$((failures + 1)); }
skip() { echo "SKIP [$1] $2: $3"; }

# Secret patterns (extended regex). This skill's own folder is excluded because it documents them.
SECRET_RE='-----BEGIN [A-Z ]*PRIVATE KEY-----|sk-ant-[A-Za-z0-9_-]{20,}|sk-[A-Za-z0-9]{20,}|ghp_[A-Za-z0-9]{36}|github_pat_[A-Za-z0-9_]{22,}|AKIA[0-9A-Z]{16}|[Pp][Aa][Ss][Ss][Ww][Oo][Rr][Dd][[:space:]]*=[[:space:]]*["'"'"']?[^"'"'"'[:space:]$]{4,}'

echo "security-gate — Milestone $MILESTONE"

# 1. No secret patterns in tracked files, and no tracked .env files.
desc="no secret patterns or .env files in tracked files"
hits="$(git grep -nIE -e "$SECRET_RE" -- . ":(exclude)$SELF" 2>/dev/null | cut -d: -f1,2)"
envs="$(git ls-files | grep -E '(^|/)\.env($|\.)' | grep -vE '\.env\.example$')"
if [ -z "$hits" ] && [ -z "$envs" ]; then
  pass 1 "$desc"
else
  fail 1 "$desc" "$(echo "$hits $envs" | tr '\n' ' ' | sed 's/ *$//')"
fi

# 2. No secret patterns in the full git history.
desc="no secret patterns in the full git history (git log -p --all)"
hist="$(git log -p --all --format='commit %h' -- . ":(exclude)$SELF" 2>/dev/null \
  | awk '/^commit /{c=$2} /^\+/{print c": "$0}' | grep -E -e "$SECRET_RE" | cut -c1-80)"
if [ -z "$hist" ]; then pass 2 "$desc"; else fail 2 "$desc" "$(echo "$hist" | head -5 | tr '\n' ' ')"; fi

# 3. No IPv4 addresses (except 127.0.0.1 and 0.0.0.0) and no easypanel.host URLs in tracked files.
desc="no IPv4 addresses (except 127.0.0.1 / 0.0.0.0) or easypanel.host URLs in tracked files"
ips="$(git grep -nIE -e '(^|[^0-9.])([0-9]{1,3}\.){3}[0-9]{1,3}([^0-9.]|$)' -- . ":(exclude)pnpm-lock.yaml" 2>/dev/null \
  | grep -vE '(^|[^0-9.])(127\.0\.0\.1|0\.0\.0\.0)([^0-9.]|$)' | cut -d: -f1,2)"
# A real host URL has a label before the domain (<name>.easypanel.host); the bare word in docs is not one.
hosts="$(git grep -nIE -e '[A-Za-z0-9-]+\.easypanel\.host' 2>/dev/null | cut -d: -f1,2)"
if [ -z "$ips" ] && [ -z "$hosts" ]; then
  pass 3 "$desc"
else
  fail 3 "$desc" "$(echo "$ips $hosts" | tr '\n' ' ' | sed 's/ *$//')"
fi

# 4. pnpm audit reports no high or critical vulnerabilities.
desc="pnpm audit --audit-level high reports no high or critical vulnerabilities"
audit_out="$(pnpm audit --audit-level high 2>&1)"
if [ $? -eq 0 ]; then
  pass 4 "$desc"
else
  fail 4 "$desc" "$(echo "$audit_out" | grep -E '^Severity|GHSA' | tr -s ' │' ' ' | tr '\n' ' ' | sed 's/ *$//')"
fi

# 5. The static site server serves only the dist/ allowlist copy (SEC-1): no dotfiles, .git, docs or listings.
desc="static server (pnpm build:site, then http-server dist -d false) does not serve /.env, /.git/config, /.mcp.json or /memory-bank/"
if ! build_out="$(pnpm build:site 2>&1)"; then
  build_failed=1
else
  build_failed=0
  npx -y "$HTTP_SERVER" dist -p "$PORT" -a 127.0.0.1 -d false -s >/dev/null 2>&1 &
  server_pid=$!
fi
up=0
for _ in $(seq 1 60); do
  [ "$build_failed" -eq 1 ] && break
  if curl -s -o /dev/null "http://127.0.0.1:$PORT/"; then up=1; break; fi
  sleep 0.5
done
if [ "$build_failed" -eq 1 ]; then
  fail 5 "$desc" "pnpm build:site failed: $(echo "$build_out" | tail -1)"
elif [ "$up" -eq 0 ]; then
  fail 5 "$desc" "server did not start on port $PORT"
else
  exposed=()
  for path in /.env /.git/config /.mcp.json /memory-bank/; do
    code="$(curl -s -o /dev/null -w '%{http_code}' "http://127.0.0.1:$PORT$path")"
    [ "$code" = "200" ] && exposed+=("$path=200")
  done
  if [ ${#exposed[@]} -eq 0 ]; then pass 5 "$desc"; else fail 5 "$desc" "${exposed[*]}"; fi
fi
# http-server renames its process to "http-server", so stop it by the port it listens on.
for pid in $(ss -ltnpH "sport = :$PORT" 2>/dev/null | grep -oE 'pid=[0-9]+' | cut -d= -f2); do kill "$pid" 2>/dev/null; done
if [ -n "${server_pid:-}" ]; then
  kill "$server_pid" 2>/dev/null
  wait "$server_pid" 2>/dev/null
fi

# 6. validation.js uses no unsafe DOM APIs, storage or network calls.
desc="validation.js has no innerHTML, outerHTML, insertAdjacentHTML, eval, document.write, localStorage, sessionStorage, fetch or XMLHttpRequest"
if [ ! -f validation.js ]; then
  skip 6 "$desc" "validation.js does not exist yet"
else
  bad="$(grep -nE '\b(innerHTML|outerHTML|insertAdjacentHTML|eval|localStorage|sessionStorage|fetch|XMLHttpRequest)\b|document\.write' validation.js | cut -d: -f1 | tr '\n' ' ')"
  if [ -z "$bad" ]; then pass 6 "$desc"; else fail 6 "$desc" "validation.js lines $bad"; fi
fi

# 7. Every site page has a CSP meta tag, and every target="_blank" link has rel="noopener noreferrer".
desc="every site page has a CSP meta tag and rel=\"noopener noreferrer\" on target=\"_blank\" links"
shopt -s nullglob
pages=(*.html es/*.html)
shopt -u nullglob
if [ ${#pages[@]} -eq 0 ]; then
  skip 7 "$desc" "no site HTML pages yet"
else
  problems="$(python3 - "${pages[@]}" <<'PY'
import re, sys
out = []
for path in sys.argv[1:]:
    html = open(path, encoding="utf-8").read()
    if not re.search(r'<meta[^>]+http-equiv=["\']Content-Security-Policy["\']', html, re.I):
        out.append(f"{path}: no CSP meta")
    for tag in re.findall(r"<a\b[^>]*>", html, re.I | re.S):
        if re.search(r'target=["\']_blank["\']', tag, re.I):
            rel = re.search(r'rel=["\']([^"\']*)["\']', tag, re.I)
            words = set(rel.group(1).lower().split()) if rel else set()
            if not {"noopener", "noreferrer"} <= words:
                out.append(f"{path}: target=_blank without rel=noopener noreferrer")
print("; ".join(out))
PY
)"
  if [ -z "$problems" ]; then pass 7 "$desc (${#pages[@]} pages)"; else fail 7 "$desc" "$problems"; fi
fi

if [ "$failures" -eq 0 ]; then
  echo "security-gate passed (no FAIL)"
  exit 0
fi
echo "security-gate failed: $failures criterion/criteria with FAIL"
exit 1

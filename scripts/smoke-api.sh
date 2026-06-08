#!/usr/bin/env bash
# Lane P — minimal API smoke for Next.js monolith (no admin credentials required).
set -euo pipefail

BASE_URL="${BASE_URL:-http://localhost:3000}"
COOKIE_JAR="$(mktemp)"
trap 'rm -f "$COOKIE_JAR"' EXIT

pass=0
fail=0

check() {
  local name="$1"
  local expected="$2"
  local actual="$3"
  if [[ "$actual" == "$expected" ]]; then
    echo "PASS  $name"
    pass=$((pass + 1))
  else
    echo "FAIL  $name (expected $expected, got $actual)"
    fail=$((fail + 1))
  fi
}

echo "Smoke testing $BASE_URL"
echo "---"

health_code=$(curl -s -o /tmp/kep-health.json -w "%{http_code}" "$BASE_URL/api/health")
health_body=$(cat /tmp/kep-health.json)
check "GET /api/health status" "200" "$health_code"
if echo "$health_body" | grep -q '"status"[[:space:]]*:[[:space:]]*"ok"'; then
  check "GET /api/health body" "ok" "ok"
else
  check "GET /api/health body" "ok" "missing"
fi

dash_code=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/dashboard/exams")
# Next.js middleware redirects unauthenticated users
if [[ "$dash_code" == "307" || "$dash_code" == "308" || "$dash_code" == "302" ]]; then
  check "GET /dashboard/exams unauth" "redirect" "redirect"
else
  check "GET /dashboard/exams unauth" "redirect" "$dash_code"
fi

bad_login=$(curl -s -o /tmp/kep-login.json -w "%{http_code}" \
  -X POST "$BASE_URL/api/auth/login/admin" \
  -H "Content-Type: application/json" \
  -d '{"username":"__smoke_invalid__","password":"__smoke_invalid__"}')
check "POST /api/auth/login/admin bad creds" "401" "$bad_login"

echo "---"
echo "Results: $pass passed, $fail failed"
[[ "$fail" -eq 0 ]]

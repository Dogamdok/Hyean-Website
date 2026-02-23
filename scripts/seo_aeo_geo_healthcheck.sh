#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PROJECT_DATA="$ROOT_DIR/apps/hyean-web/src/data/projects.ts"
INSIGHTS_DATA="$ROOT_DIR/apps/hyean-web/src/data/insights.ts"
BASE_URL="${1:-http://127.0.0.1:3001}"
MAX_PROJECT_CHECKS="${MAX_PROJECT_CHECKS:-6}"

pass_count=0
fail_count=0

pass() {
  pass_count=$((pass_count + 1))
  echo "[PASS] $1"
}

fail() {
  fail_count=$((fail_count + 1))
  echo "[FAIL] $1"
}

check_status() {
  local path="$1"
  local code
  code="$(curl -o /dev/null -s -w "%{http_code}" "$BASE_URL$path" || true)"
  if [[ "$code" == "200" ]]; then
    pass "HTTP 200 $path"
  else
    fail "HTTP $code $path"
  fi
}

check_contains() {
  local path="$1"
  local pattern="$2"
  local label="$3"
  local body
  body="$(curl -fsSL "$BASE_URL$path" 2>/dev/null || true)"
  if [[ -z "$body" ]]; then
    fail "$label ($path: body unavailable)"
    return
  fi

  if printf '%s' "$body" | rg -q "$pattern"; then
    pass "$label"
  else
    fail "$label"
  fi
}

get_first_insight_slug() {
  local from_api
  from_api="$(
    curl -fsSL "$BASE_URL/api/posts?limit=1" 2>/dev/null \
      | node -e '
let data = "";
process.stdin.on("data", (chunk) => { data += chunk; });
process.stdin.on("end", () => {
  try {
    const parsed = JSON.parse(data);
    const slug = parsed?.posts?.[0]?.slug;
    if (typeof slug === "string" && slug.trim()) {
      process.stdout.write(slug.trim());
    }
  } catch {
    // ignore
  }
});
      ' 2>/dev/null || true
  )"

  if [[ -n "$from_api" ]]; then
    echo "$from_api"
    return
  fi

  if [[ -f "$INSIGHTS_DATA" ]]; then
    rg -o "slug: '[^']+'" "$INSIGHTS_DATA" | sed -E "s/slug: '([^']+)'/\\1/" | head -n 1
  fi
}

echo "== HYEAN SEO/AEO/GEO Healthcheck =="
echo "BASE_URL=$BASE_URL"
echo

# Core route checks
check_status "/"
check_status "/services"
check_status "/projects"
check_status "/insights"
check_status "/contact"
check_status "/robots.txt"
check_status "/sitemap.xml"
check_status "/rss.xml"

echo

# Technical SEO checks
check_contains "/" "rel=\"canonical\"" "Canonical tag on homepage"
check_contains "/services" "\"@type\":\"Service\"" "Service schema on services page"
check_contains "/projects" "\"@type\":\"CollectionPage\"" "CollectionPage schema on projects page"
check_contains "/insights" "\"@type\":\"CollectionPage\"" "CollectionPage schema on insights page"
check_contains "/robots.txt" "Sitemap: https://hyean.org/sitemap.xml" "robots.txt references sitemap"
check_contains "/sitemap.xml" "<urlset" "sitemap.xml has urlset root"
check_contains "/rss.xml" "<rss version=\"2.0\"" "rss.xml has RSS root"

echo

# Insights detail checks
first_insight_slug="$(get_first_insight_slug)"
if [[ -n "$first_insight_slug" ]]; then
  insight_path="/insights/$first_insight_slug"
  check_status "$insight_path"
  check_contains "$insight_path" "\"@type\":\"Article\"" "Article schema on $insight_path"
  check_contains "/sitemap.xml" "$insight_path" "sitemap includes $insight_path"
  check_contains "/rss.xml" "$insight_path" "rss includes $insight_path"
fi

echo

# Project detail trust signal checks
project_slugs=()
while IFS= read -r slug; do
  project_slugs+=("$slug")
done < <(rg -o "slug: '[^']+'" "$PROJECT_DATA" | sed -E "s/slug: '([^']+)'/\\1/" | sort -u)

checked=0
for slug in "${project_slugs[@]}"; do
  if (( checked >= MAX_PROJECT_CHECKS )); then
    break
  fi

  path="/projects/$slug"
  check_status "$path"
  check_contains "$path" "\"@type\":\"BreadcrumbList\"" "Breadcrumb schema on $path"
  check_contains "$path" "\"@type\":\"Article\"" "Article schema on $path"
  check_contains "$path" "출처 및 업데이트" "Trust block on $path"
  checked=$((checked + 1))
done

echo

# Restored image checks (cache-busted URLs)
for image_path in \
  "/images/projects/beyond-village-youth-town-buyeo/beyond-village-youth-town-buyeo-05-restored.jpg" \
  "/images/projects/beyond-village-youth-town-buyeo/beyond-village-youth-town-buyeo-06-restored.jpg"; do
  code="$(curl -o /dev/null -s -w "%{http_code}" "$BASE_URL$image_path" || true)"
  if [[ "$code" != "200" ]]; then
    fail "Restored image unavailable: $image_path (HTTP $code)"
    continue
  fi

  byte_size="$(curl -sSL "$BASE_URL$image_path" | wc -c | awk '{print $1}')"
  if [[ "$byte_size" =~ ^[0-9]+$ ]] && (( byte_size > 10000 )); then
    pass "Restored image OK: $image_path (${byte_size} bytes)"
  else
    fail "Restored image too small/unreadable: $image_path (${byte_size} bytes)"
  fi
done

echo
echo "Summary: PASS=$pass_count FAIL=$fail_count"
if (( fail_count > 0 )); then
  exit 1
fi

#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PROJECT_DATA="$ROOT_DIR/apps/hyean-web/src/data/projects.ts"
INSIGHTS_DATA_TS="$ROOT_DIR/apps/hyean-web/src/data/insights.ts"
INSIGHTS_DATA_JSON="$ROOT_DIR/apps/hyean-web/data/posts.json"
OUT_DIR="$ROOT_DIR/docs/seo"

SITE_URL_INPUT="${1:-https://hyean.org}"
SITE_URL="${SITE_URL_INPUT%/}"

DATE_STAMP="$(date '+%Y%m%d')"
TXT_OUT="${2:-$OUT_DIR/indexing_targets_${DATE_STAMP}.txt}"
CSV_OUT="${TXT_OUT%.txt}.csv"

mkdir -p "$OUT_DIR"

PROJECT_SLUGS=()
while IFS= read -r slug; do
  PROJECT_SLUGS+=("$slug")
done < <(rg -o "slug: '[^']+'" "$PROJECT_DATA" | sed -E "s/slug: '([^']+)'/\\1/" | sort -u)

INSIGHT_SLUGS=()
while IFS= read -r slug; do
  INSIGHT_SLUGS+=("$slug")
done < <(
  {
    if [[ -f "$INSIGHTS_DATA_TS" ]]; then
      rg -o "slug: '[^']+'" "$INSIGHTS_DATA_TS" | sed -E "s/slug: '([^']+)'/\\1/" || true
    fi

    if [[ -f "$INSIGHTS_DATA_JSON" ]]; then
      node -e '
const fs = require("fs");
const file = process.argv[1];
try {
  const payload = JSON.parse(fs.readFileSync(file, "utf8"));
  if (!Array.isArray(payload)) process.exit(0);
  for (const row of payload) {
    if (row && typeof row.slug === "string" && row.slug.trim()) {
      console.log(row.slug.trim());
    }
  }
} catch {
  process.exit(0);
}
      ' "$INSIGHTS_DATA_JSON"
    fi
  } | sort -u
)

STATIC_PATHS=(
  "/"
  "/about"
  "/services"
  "/projects"
  "/spaces"
  "/insights"
  "/contact"
  "/capabilities/learning-execution"
  "/capabilities/collaboration-execution"
  "/capabilities/performance-management"
)

{
  echo "# HYEAN Indexing Targets"
  echo "# generated_at: $(date '+%Y-%m-%d %H:%M:%S %Z')"
  echo "# site_url: $SITE_URL"
  echo

  for path in "${STATIC_PATHS[@]}"; do
    if [[ "$path" == "/" ]]; then
      echo "$SITE_URL"
    else
      echo "$SITE_URL$path"
    fi
  done

  for slug in "${PROJECT_SLUGS[@]}"; do
    echo "$SITE_URL/projects/$slug"
  done

  for slug in "${INSIGHT_SLUGS[@]}"; do
    echo "$SITE_URL/insights/$slug"
  done
} > "$TXT_OUT"

{
  echo "url,type"
  for path in "${STATIC_PATHS[@]}"; do
    if [[ "$path" == "/" ]]; then
      echo "\"$SITE_URL\",\"static\""
    else
      echo "\"$SITE_URL$path\",\"static\""
    fi
  done

  for slug in "${PROJECT_SLUGS[@]}"; do
    echo "\"$SITE_URL/projects/$slug\",\"project\""
  done

  for slug in "${INSIGHT_SLUGS[@]}"; do
    echo "\"$SITE_URL/insights/$slug\",\"insight\""
  done
} > "$CSV_OUT"

echo "Generated indexing targets:"
echo "  - $TXT_OUT"
echo "  - $CSV_OUT"
echo "Total URLs: $(wc -l < "$TXT_OUT" | awk '{print $1-4}')"

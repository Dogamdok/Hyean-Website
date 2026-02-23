#!/usr/bin/env bash
set -euo pipefail

ROOT='/Users/doh/Desktop/Storage'
OUT='/Users/doh/Desktop/Storage/1 Projects/Hyean Website Project/content/migration/generated_inventory.md'

{
  echo '# Generated Migration Inventory'
  echo
  echo "Generated at: $(date '+%Y-%m-%d %H:%M:%S')"
  echo
  for base in \
    "$ROOT/4 Archives/Hyean Web 2" \
    "$ROOT/4 Archives/Hyean Web"; do
    echo "## Source: $base"
    echo
    if [ ! -d "$base" ]; then
      echo "- source missing"
      echo
      continue
    fi
    while IFS= read -r file; do
      title="$(rg -m 1 -o '<title>[^<]+' "$file" 2>/dev/null | sed 's/<title>//' || true)"
      h1="$(rg -m 1 -o '<h1[^>]*>[^<]+' "$file" 2>/dev/null | sed -E 's/<h1[^>]*>//' || true)"
      echo "- $(basename "$file")"
      [ -n "$title" ] && echo "  - title: $title"
      [ -n "$h1" ] && echo "  - h1: $h1"
    done < <(find "$base" -maxdepth 1 -name '*.html' | sort)
    echo
  done
} > "$OUT"

echo "Wrote: $OUT"

#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
VERSIONS_DIR="$ROOT_DIR/versions"
SNAPSHOT_DIR="$VERSIONS_DIR/snapshots"

mkdir -p "$SNAPSHOT_DIR"

LABEL="${1:-manual}"
SAFE_LABEL="$(echo "$LABEL" | tr '[:space:]/:' '---' | tr -cd '[:alnum:]_-')"
TIMESTAMP="$(date '+%Y%m%d_%H%M%S')"
SNAPSHOT_NAME="${TIMESTAMP}_${SAFE_LABEL}"
ARCHIVE_PATH="$SNAPSHOT_DIR/${SNAPSHOT_NAME}.tar.gz"
META_PATH="$SNAPSHOT_DIR/${SNAPSHOT_NAME}.md"

tar -czf "$ARCHIVE_PATH" \
  --exclude='apps/hyean-web/node_modules' \
  --exclude='apps/hyean-web/.next' \
  --exclude='apps/hyean-web/data/inquiries.json' \
  --exclude='versions/snapshots' \
  -C "$ROOT_DIR" \
  "apps/hyean-web" \
  "docs" \
  "content/migration" \
  "scripts" \
  "README.md"

cat > "$META_PATH" <<EOF
# Snapshot ${SNAPSHOT_NAME}

- created_at: $(date '+%Y-%m-%d %H:%M:%S')
- label: ${LABEL}
- archive: ${ARCHIVE_PATH}
- scope:
  - apps/hyean-web
  - docs
  - content/migration
  - scripts
  - README.md
- excludes:
  - apps/hyean-web/node_modules
  - apps/hyean-web/.next
  - apps/hyean-web/data/inquiries.json
  - versions/snapshots
EOF

ln -sfn "$ARCHIVE_PATH" "$VERSIONS_DIR/latest.tar.gz"
ln -sfn "$META_PATH" "$VERSIONS_DIR/latest.md"

echo "Created snapshot:"
echo "  - $ARCHIVE_PATH"
echo "  - $META_PATH"

#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SNAPSHOT_DIR="$ROOT_DIR/versions/snapshots"

if [[ $# -lt 1 ]]; then
  echo "Usage: $(basename "$0") <snapshot-file-or-name>"
  echo
  echo "Available snapshots:"
  ls -1 "$SNAPSHOT_DIR"/*.tar.gz 2>/dev/null || echo "(none)"
  exit 1
fi

INPUT="$1"
if [[ -f "$INPUT" ]]; then
  SNAPSHOT_PATH="$INPUT"
elif [[ -f "$SNAPSHOT_DIR/$INPUT" ]]; then
  SNAPSHOT_PATH="$SNAPSHOT_DIR/$INPUT"
elif [[ -f "$SNAPSHOT_DIR/$INPUT.tar.gz" ]]; then
  SNAPSHOT_PATH="$SNAPSHOT_DIR/$INPUT.tar.gz"
else
  echo "Snapshot not found: $INPUT"
  exit 1
fi

tar -xzf "$SNAPSHOT_PATH" -C "$ROOT_DIR"
echo "Restored snapshot: $SNAPSHOT_PATH"

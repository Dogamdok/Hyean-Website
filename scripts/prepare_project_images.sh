#!/bin/zsh
set -euo pipefail

DOWNLOADS_DIR="${1:-/Users/doh/Downloads}"
ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
ORIGINAL_ROOT="$ROOT_DIR/assets/project-images/original"
WEB_ROOT="$ROOT_DIR/apps/hyean-web/public/images/projects"
REPORT_PATH="$ROOT_DIR/docs/project-image-asset-map.md"
MAX_WEB_IMAGES="${MAX_WEB_IMAGES:-6}"

HAS_FFMPEG=0
HAS_SIPS=0

if command -v ffmpeg >/dev/null 2>&1; then
  HAS_FFMPEG=1
fi

if command -v sips >/dev/null 2>&1; then
  HAS_SIPS=1
fi

if (( HAS_FFMPEG == 0 && HAS_SIPS == 0 )); then
  echo "Error: either 'ffmpeg' or 'sips' command is required." >&2
  exit 1
fi

convert_with_ffmpeg() {
  local src="$1"
  local out="$2"
  ffmpeg -v error -y -i "$src" -vf "scale=1600:-2:flags=lanczos" -q:v 3 "$out"
}

convert_with_sips() {
  local src="$1"
  local out="$2"
  sips -s format jpeg -s formatOptions 72 --resampleWidth 1600 "$src" --out "$out" >/dev/null
}

convert_web_image() {
  local src="$1"
  local out="$2"

  if (( HAS_FFMPEG == 1 )); then
    convert_with_ffmpeg "$src" "$out"
    return
  fi

  convert_with_sips "$src" "$out"
}

typeset -a all_images
all_images=("${(@f)$(find "$DOWNLOADS_DIR" -maxdepth 1 -type f \( -iname '*.jpg' -o -iname '*.jpeg' -o -iname '*.png' -o -iname '*.heic' -o -iname '*.webp' \) | sort -V)}")

if (( ${#all_images[@]} == 0 )); then
  echo "No source images found in: $DOWNLOADS_DIR" >&2
  exit 1
fi

typeset -a slug_order
slug_order=(
  "seobu-naeryuk-seongjihyeyumgil"
  "123-sabi-craft-festa-2024-2025"
  "beyond-village-youth-town-buyeo"
  "buyeo-youth-tourism-pilot-camp"
  "kntc-heritage-plogging-campaign"
  "buyeo-garden-book-pop-up-garden"
  "gongju-buyeo-cheongyang-youth-exchange-project"
  "hansan-mosi-festival-master-planning"
)

typeset -A patterns
patterns=(
  "seobu-naeryuk-seongjihyeyumgil" "성지혜윰|도앙골성지|삽티성지"
  "123-sabi-craft-festa-2024-2025" "공예페스타|123사비공예페스타|벌룬 오딧세이_참가자등록명부_공예"
  "beyond-village-youth-town-buyeo" "청년마을|벌룬 오딧세이_참가자등록명부_청년"
  "buyeo-youth-tourism-pilot-camp" "관광 파일럿"
  "kntc-heritage-plogging-campaign" "국가유산플로깅"
  "buyeo-garden-book-pop-up-garden" "정원백서|정원백서|정원"
  "gongju-buyeo-cheongyang-youth-exchange-project" "공주부여청양 청년교류"
  "hansan-mosi-festival-master-planning" "한산모시문화제"
)

mkdir -p "$ORIGINAL_ROOT" "$WEB_ROOT"

{
  echo "# 프로젝트 이미지 매핑"
  echo
  echo "- 생성 시각: $(date '+%Y-%m-%d %H:%M:%S %Z')"
  echo "- 원본 경로: \`$ORIGINAL_ROOT\`"
  echo "- 웹 경로: \`$WEB_ROOT\`"
  echo "- 웹 변환 규격: JPEG / width 1600 / ffmpeg 우선(sips fallback)"
  echo

  for slug in "${slug_order[@]}"; do
    pattern="${patterns[$slug]}"
    typeset -a matches
    matches=("${(@f)$(printf '%s\n' "${all_images[@]}" | rg "$pattern" | sort -V)}")

    mkdir -p "$ORIGINAL_ROOT/$slug" "$WEB_ROOT/$slug"
    find "$WEB_ROOT/$slug" -maxdepth 1 -type f -name "$slug-*.jpg" -delete

    echo "## $slug"
    echo

    if (( ${#matches[@]} == 0 )); then
      echo "- 상태: 매칭 실패"
      echo
      continue
    fi

    web_index=1
    src_index=1
    echo "- 원본 수집: ${#matches[@]}개"
    echo "- 웹 사용: 최대 ${MAX_WEB_IMAGES}개"
    echo
    echo "| No | 원본 파일 | 웹 파일 |"
    echo "|---:|---|---|"

    for src in "${matches[@]}"; do
      base_name="$(basename "$src")"
      cp -f "$src" "$ORIGINAL_ROOT/$slug/$base_name"

      web_file="-"
      if (( web_index <= MAX_WEB_IMAGES )); then
        web_file="${slug}-$(printf '%02d' "$web_index").jpg"
        out_path="$WEB_ROOT/$slug/$web_file"
        convert_web_image "$src" "$out_path"
        web_index=$((web_index + 1))
      fi

      printf '| %d | `%s` | `%s` |\n' "$src_index" "$base_name" "$web_file"
      src_index=$((src_index + 1))
    done
    echo
  done
} >"$REPORT_PATH"

echo "Image sync complete."
echo "- Originals: $ORIGINAL_ROOT"
echo "- Web assets: $WEB_ROOT"
echo "- Mapping report: $REPORT_PATH"

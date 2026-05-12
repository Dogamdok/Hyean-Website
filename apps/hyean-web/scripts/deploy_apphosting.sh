#!/usr/bin/env bash
set -euo pipefail

PROJECT_ID="hyean-website"
BACKEND_ID="hyean-website"
BASE_URL="https://hyean-website--hyean-website.asia-east1.hosted.app"
CONTACT_CHAT_API="${BASE_URL}/api/contact-chat"
INQUIRIES_API="${BASE_URL}/api/inquiries"

REQUIRED_SECRETS=(
  "GEMINI_API_KEY"
  "HYEAN_INQUIRY_EMAIL_USER"
  "HYEAN_INQUIRY_EMAIL_PASS"
  "HYEAN_INQUIRY_EMAIL_TO"
  "HYEAN_INQUIRY_EMAIL_FROM"
)

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "${ROOT_DIR}"

require_cmd() {
  local name="$1"
  if ! command -v "$name" >/dev/null 2>&1; then
    echo "[error] Missing required command: $name"
    exit 1
  fi
}

read_model_name() {
  sed -n "s/^const GEMINI_MODEL = '\([^']*\)';$/\1/p" "src/app/api/contact-chat/route.ts" | head -n 1
}

echo "[deploy] project=${PROJECT_ID} backend=${BACKEND_ID}"

for cmd in firebase curl jq sed rg; do
  require_cmd "$cmd"
done

MODEL_NAME="$(read_model_name)"
if [ -z "${MODEL_NAME}" ]; then
  echo "[error] Could not read GEMINI_MODEL from src/app/api/contact-chat/route.ts"
  exit 1
fi

echo "[1/7] Build"
if [ "${SKIP_BUILD:-0}" = "1" ]; then
  echo "  - skipped (SKIP_BUILD=1)"
else
  npm run build
fi

echo "[2/7] Secret metadata check"
for secret_name in "${REQUIRED_SECRETS[@]}"; do
  firebase apphosting:secrets:describe "${secret_name}" --project "${PROJECT_ID}" >/dev/null
  echo "  - ${secret_name}: found"
done

echo "[3/7] Grant backend access to secrets"
for secret_name in "${REQUIRED_SECRETS[@]}"; do
  firebase apphosting:secrets:grantaccess "${secret_name}" --project "${PROJECT_ID}" --backend "${BACKEND_ID}" >/dev/null
  echo "  - ${secret_name}: granted"
done

echo "[4/7] Verify Gemini model availability"
GEMINI_KEY="$(firebase apphosting:secrets:access GEMINI_API_KEY --project "${PROJECT_ID}" 2>/dev/null | tr -d '\r\n')"
if [ -z "${GEMINI_KEY}" ]; then
  echo "[error] GEMINI_API_KEY is empty"
  exit 1
fi

if ! curl -sS -G "https://generativelanguage.googleapis.com/v1beta/models" --data-urlencode "key=${GEMINI_KEY}" \
  | jq -r '.models[].name' \
  | rg -x "models/${MODEL_NAME}" >/dev/null; then
  echo "[error] Configured model is not available: ${MODEL_NAME}"
  exit 1
fi

echo "  - models/${MODEL_NAME}: available"

echo "[5/7] Deploy App Hosting"
firebase deploy --project "${PROJECT_ID}" --only apphosting

NOW_LABEL="$(date +%Y%m%d-%H%M%S)"

echo "[6/7] Smoke test /api/contact-chat"
CHAT_RESPONSE="$(curl -sS -X POST "${CONTACT_CHAT_API}" -H "content-type: application/json" --data '{"question":"문의 전에 일정과 예산을 어떻게 정리하면 좋을까요?","step":"timeline","form":{"name":"Deploy QA","organization":"HYEAN QA","email":"qa@hyean.org","inquiryFocus":"운영 점검","timeline":"2주","budgetRange":"테스트","message":"deploy smoke"}}')"
echo "${CHAT_RESPONSE}" | jq -e '.success == true and (.model | type == "string") and (.message | type == "string")' >/dev/null
echo "  - contact-chat: ok"

echo "[7/7] Optional smoke test /api/inquiries"
if [ "${RUN_INQUIRY_SMOKE_TEST:-0}" = "1" ]; then
  INQUIRY_RESPONSE="$(curl -sS -X POST "${INQUIRIES_API}" -H "content-type: application/json" --data "{\"name\":\"Deploy QA ${NOW_LABEL}\",\"organization\":\"HYEAN QA\",\"email\":\"qa@hyean.org\",\"inquiryFocus\":\"운영 점검\",\"timeline\":\"2주\",\"budgetRange\":\"테스트\",\"message\":\"deploy inquiry smoke ${NOW_LABEL}\",\"sourceSite\":\"hyean-web\",\"sourceLabel\":\"혜안 웹사이트\",\"sourceUrl\":\"https://hyean.org/contact\"}")"
  echo "${INQUIRY_RESPONSE}" | jq -e '.id | type == "string"' >/dev/null
  echo "  - inquiries: ok"
else
  echo "  - skipped (set RUN_INQUIRY_SMOKE_TEST=1 to enable real inquiry + email send test)"
fi

echo "[done] Deploy + smoke test completed for ${PROJECT_ID}"

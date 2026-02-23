# Hyean-Insights Checkpoint
> 작성일: 2026-02-23 10:53
> 작업 폴더: /Users/doh/Desktop/Storage/1 Projects/Hyean Website Project

---

## 1. 작업 개요
### 1.1 목적
`docs/09_insights_api_db_n8n_architecture_spec_2026-02-23.md`에 맞춰 인사이트 콘텐츠를 static 파일에서 API/DB 기반으로 전환하고, n8n/Sitemap/RSS/SEO 경로까지 연결해 운영 자동화를 마련합니다.

### 1.2 핵심 요구사항
- Firestore 우선, 설정 없으면 로컬 `data/posts.json` fallback인 저장소 계층 구현
- `POST /api/posts`, `GET /api/posts`, `GET /api/posts/[slug]` API 구현 및 `x-api-key` 인증
- `/insights`와 `/insights/[slug]`, `/rss.xml`, `/sitemap.xml`을 구조화데이터/JSON-LD/Markdown 기반으로 전환
- 명세 문서에 구현 현황, .env 템플릿, SEO 점검 스크립트 업데이트 반영

---

## 2. 작업 전 상태 (Before)
- 인사이트는 `src/data/insights.ts` 정적 배열 + 목록/정보 링크 모두 static
- sitemap에 `/insights/[slug]` 누락, RSS 없음, API 없는 상태
- 운영용 env/.env.example 및 API 인증 경로 존재하지 않음

---

## 3. 목표 상태 (After)
- Firestore/N8N 기반 게시 구조가 API로 노출되어 n8n 워크플로우로 바로 생성 가능
- `/insights` 페이지가 API 데이터로 렌더되고 `/insights/[slug]` 페이지가 Markdown 컨텐츠 + 구조화 데이터 제공
- `sitemap.xml`/`rss.xml`에 인사이트 URL 자동 반영, `scripts/seo_aeo_geo_healthcheck.sh`에 세부 점검 추가
- `.env.example`에 Firebase/FireStore/N8N 요구변수 정의, 문서에 구현 현황 업데이트

---

## 4. 완료된 작업
- [x] `InsightPost` 타입 정의 확장 및 `LegacyInsightPost` 분리 (`apps/hyean-web/src/types/content.ts`)
- [x] `src/lib/insight-post-store.ts`에 Firestore REST + 로컬 fallback 저장소/검증/CRUD
- [x] `POST /api/posts`, `GET /api/posts`, `GET /api/posts/[slug]` 라우트 구현 + rate-limit
- [x] `MarkdownContent` 렌더러 및 상세 페이지(`/insights/[slug]/page.tsx`) 작성
- [x] `/insights` 페이지 API 기반으로 전환 + 링크/구조화데이터 정비 (`apps/hyean-web/src/app/insights/page.tsx`)
- [x] `sitemap.xml`에 인사이트 목록 추가 + `/rss.xml/route.ts` 추가
- [x] `.env.example` 추가 + 명세 문서(#docs/09_insights...)에 구현 현황 기록
- [x] SEO 헬스체크에 RSS/인사이트 상세 검증 추가, `npm run build` 및 헬스 체크 통과

---

## 5. 미완료 작업 (TODO)

### 5.1 Firestore 운영 환경 구성
```bash
# Set required secrets in deployment environment
export FIREBASE_SERVICE_ACCOUNT_KEY='<base64/json>'
export NEXT_PUBLIC_FIREBASE_PROJECT_ID='<project-id>'
export N8N_API_KEY='<secret>'
```
*설명*: Firestore 우선 저장소가 활성화되도록 서비스 계정·프로젝트 ID·API 키를 호스팅 환경에 주입해야 함.

### 5.2 n8n 워크플로우 연결
```bash
# n8n HTTP 노드 설정 예시
# - URL: https://<deploy>/api/posts
# - Header: x-api-key=${N8N_API_KEY}
# - Body(JSON): {"title":"...","slug":"...","excerpt":"...","content":"...","category":"Operations","author":"HYEAN Editorial Team","coverImage":"https://...","tags":["가치"],"sources":["https://..."]}
```
*설명*: 자동 발행 시 `x-api-key` 인증이 작동하도록 워크플로우에 설정하고 실패 시 Slack/Email 알림 연결.

### 5.3 Search Console/Bing 재수집
```bash
# submit updated sitemap + rss urls to console tools
curl -X POST "https://www.googleapis.com/webmasters/v3/sites/https%3A%2F%2Fhyean.org/sitemaps/https%3A%2F%2Fhyean.org%2Fsitemap.xml?key=<API_KEY>"
```
*설명*: `/insights/[slug]`, `/rss.xml` 경로가 배포되었으므로 색인 재요청 필요.

---

## 6. 시행착오 및 교훈
### 6.1 발생한 문제
- Query string이 붙은 로컬 이미지가 `next/image` `localPatterns` 정책을 위반하여 빌드 실패.
- Firestore SDK를 설치하지 않은 환경에서 `firebase-admin`을 import하면 런타임 오류가 발생할 수 있음.

### 6.2 해결 방법
- `05/06` 이미지에 재생성된 파일명(`-restored.jpg`)을 추가하고 직접 참조하도록 변경.
- Firestore 접속은 REST+(JWT) 방식으로 구현하고 `firebase-admin`은 optional helper로 분리함.

### 6.3 얻은 교훈
- static 컨텐츠를 API/DB로 전환할 때는 Next.js 이미지 정책과 외부 의존성 환경을 동시에 고려해야 함.
- 로컬/CI 환경 차이를 위해 두 가지 저장소 경로를 유지하는 설계가 안정적임.

---

## 7. 핵심 결정 사항

| 결정 사항 | 선택한 옵션 | 이유 |
|-----------|-------------|------|
| 저장소 우선순위 | Firestore REST 우선, 로컬 fallback | Firestore 미설정 환경에서도 개발/로컬 빌드가 가능해야 해서 |
| 이미지 캐시 우회 | 파일명 변경(`-restored`) | `next/image` `localPatterns` 규칙 회피 및 버전 명시 필요 |
| 인사이트 렌더 | API/Markdown + JSON-LD | 구조화 데이터와 질문형 응답 친화적인 콘텐츠 제공 요구에 부합 |

---

## 8. 참고 자료
- `apps/hyean-web/src/lib/insight-post-store.ts`
- `apps/hyean-web/src/app/api/posts/route.ts`
- `apps/hyean-web/src/app/insights/[slug]/page.tsx`
- `docs/09_insights_api_db_n8n_architecture_spec_2026-02-23.md`
- `apps/hyean-web/.env.example`

---

## 9. 다음 세션 가이드

### 이 파일을 읽은 AI에게:
1. 먼저 `5. 미완료 작업`을 확인하고 Firestore 환경 변수/워크플로우/색인 작업 중 어떤 항목을 이어갈지 파악하세요.
2. `7. 핵심 결정 사항`에서 저장소 우선순위 및 API 인증 방식 맥락을 이해하세요.
3. 사용자와 진행 방향을 확인할 때 `RFC 2119` 조건(401/409/429 처리 여부)과 기존 헬스체크 결과도 언급하세요.

### 사용자에게:
```
/Users/doh/Desktop/Storage/1 Projects/Hyean Website Project/_checkpoints/CHECKPOINT_2026-02-23_Hyean-Insights.md를 읽고 작업 이어서 해줘
```

---

*이 문서는 #checkpoint 명령으로 자동 생성되었습니다.*

# HYEAN Insights API+DB+n8n 아키텍처 전환 명세 (for Website Dev AI)

> Date: 2026-02-23  
> Scope: `apps/hyean-web` 인사이트 발행/노출 구조 전환  
> Goal: 정적 데이터 파일 기반 인사이트를 API+DB 기반으로 전환하여, n8n 주기 발행을 운영 가능한 수준으로 만든다.

## 1) 배경: 현재 구조와 한계

현재 혜안 인사이트는 `src/data/insights.ts` 정적 배열을 `src/app/insights/page.tsx`가 직접 렌더링하는 구조다.

- 현재 데이터 소스: `apps/hyean-web/src/data/insights.ts`
- 현재 페이지: `apps/hyean-web/src/app/insights/page.tsx`
- 현재 상태의 한계:
  1. 게시물 추가 시 코드 수정 + 재배포가 필요함
  2. 게시물별 상세 URL(`/insights/[slug]`)이 없음
  3. n8n이 API 호출만으로 게시물을 발행할 수 없음
  4. sitemap이 글 단위 URL을 포함하지 못함

## 2) 목표 구조 (Target Architecture)

인사이트 발행을 "파일 편집"이 아니라 "API 호출"로 전환한다.

```text
n8n Scheduler
  -> 원고 생성/검수
  -> HTTP POST /api/posts (x-api-key)
  -> Next.js Route Handler
  -> Firestore(posts)
  -> /insights (목록), /insights/[slug] (상세), sitemap/rss 자동 반영
```

핵심 원칙:

1. 클라이언트에서 DB 직접 쓰기를 금지하고 서버 API만 쓰기
2. 게시물 소스 오브 트루스는 Firestore `posts` 컬렉션
3. 본문 포맷은 Markdown 문자열로 통일
4. 이미지 경로 정책(cover/body)과 storage rule 경로를 반드시 일치

## 3) 제안 데이터 모델 (Firestore: `posts`)

초기 버전은 도감독 구조를 준용하되, 확장 가능한 필드를 포함한다.

```ts
type InsightPost = {
  slug: string;              // 문서 ID와 동일
  title: string;             // 140자 이내
  excerpt: string;           // 320자 이내
  content: string;           // markdown, 최대 60,000자
  category: string;          // ex) Strategy, Operations, Case, Policy
  author: string;            // ex) HYEAN Editorial Team
  coverImage: string;        // /images/... 또는 https://...
  tags?: string[];           // 선택
  sources?: string[];        // 선택, URL/문서 출처
  isPublished: boolean;      // 게시 여부
  createdAt: Timestamp;
  updatedAt: Timestamp;
};
```

슬러그 규칙:

- 정규식: `^[a-z0-9]+(?:-[a-z0-9]+)*$`
- 공백/특수문자는 제거하고 하이픈으로 정규화

## 4) API 계약 (n8n 발행용)

### 4.1 `POST /api/posts`

- 목적: 신규 게시물 생성
- 인증: `x-api-key` 헤더 필수
- 서버 검증:
  - 필수 필드 누락 검사
  - slug 형식 검사
  - coverImage URL 검사
  - 중복 slug 차단(409)

요청 예시:

```json
{
  "title": "지역 실행 프로젝트에서 성과 지표를 설계하는 5단계",
  "slug": "regional-execution-kpi-framework-5-steps",
  "excerpt": "지표가 보고서용 숫자에 머물지 않도록, 운영 의사결정과 연결되는 KPI 설계 방식을 정리합니다.",
  "content": "# 문제 정의\n...\n## 실행 체크리스트\n...",
  "category": "Operations",
  "author": "HYEAN Editorial Team",
  "coverImage": "https://.../cover.jpg",
  "tags": ["성과관리", "지역활성화"],
  "sources": ["https://..."]
}
```

### 4.2 `GET /api/posts`

- 목적: 게시글 목록 조회(관리/검증/디버깅)
- 반환: `isPublished=true` 중심 목록

### 4.3 `GET /api/posts/[slug]`

- 목적: 단일 게시물 조회

## 5) 라우트/렌더 구조 (혜안 적용안)

필수 라우트:

1. `/insights` 목록 페이지: Firestore에서 최신순 조회
2. `/insights/[slug]` 상세 페이지: Markdown 렌더링
3. `/sitemap.xml`: 게시글 상세 URL 동적 포함
4. `/rss.xml` (권장): 인사이트 피드 제공

## 6) 파일 단위 구현 계획 (혜안 프로젝트)

아래 경로는 `apps/hyean-web` 기준.

### 6.1 신규 파일

1. `src/lib/firebase-admin.ts`
2. `src/app/api/posts/route.ts`
3. `src/app/api/posts/[slug]/route.ts`
4. `src/app/insights/[slug]/page.tsx`
5. `src/app/rss.xml/route.ts` (권장)
6. `src/lib/rate-limit.ts` (권장)

### 6.2 수정 파일

1. `src/app/insights/page.tsx`  
   - `src/data/insights.ts` import 제거  
   - DB 조회 기반 목록 렌더로 변경
2. `src/app/sitemap.ts`  
   - `/insights/[slug]` 동적 엔트리 추가
3. `src/app/robots.ts`  
   - sitemap 경로 유지 점검
4. `src/types/content.ts`  
   - 필요 시 동적 post type 분리

### 6.3 기존 정적 파일 처리

- `src/data/insights.ts`는 초기 이관 또는 fallback 용도로만 유지
- 운영 소스 오브 트루스는 Firestore로 단일화

## 7) 이미지 정책 (중요)

권장 정책:

1. 커버 이미지는 URL 문자열 저장
2. 본문 이미지는 Markdown 내 URL 삽입
3. Firebase Storage 사용 시 경로를 명시적으로 고정:
   - 예: `insights/{yyyy}/{mm}/{timestamp}_{filename}`
4. Storage rules와 업로드 코드 경로를 반드시 일치시킬 것

## 8) 환경변수 스펙

필수:

1. `NEXT_PUBLIC_BASE_URL`
2. `NEXT_PUBLIC_FIREBASE_API_KEY`
3. `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
4. `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
5. `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
6. `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
7. `NEXT_PUBLIC_FIREBASE_APP_ID`
8. `FIREBASE_SERVICE_ACCOUNT_KEY` (서버 전용)
9. `N8N_API_KEY` (서버 전용)

## 9) n8n 워크플로우 기준안

권장 단계:

1. Schedule Trigger (주 1~2회)
2. Topic/Keyword 수집
3. Draft 생성 (LLM)
4. QA 노드 (금지어/길이/출처 체크)
5. 이미지 URL 확정
6. HTTP Request -> `POST /api/posts` (`x-api-key`)
7. 실패 시 Slack/Email 알림
8. 성공 시 로그 저장

초기 운영 정책:

- 기본은 자동 게시(`isPublished=true`)
- 안정화 전에는 `draft` 플래그를 추가해 반자동 운영 가능

## 10) SEO/AEO/GEO 반영 기준

각 글에 대해 다음을 충족한다.

1. 고유 `title`, `description(excerpt)`, canonical
2. `Article` JSON-LD
3. `datePublished`, `dateModified`, `author` 명시
4. 출처(`sources`)가 있으면 본문/구조화데이터에 반영
5. sitemap에 글 URL 자동 반영
6. rss 피드 제공(권장)

## 11) 마이그레이션 단계 (권장 순서)

### Phase 1: API/DB 기반 구축

1. Firebase Admin 초기화
2. `/api/posts`, `/api/posts/[slug]` 구현
3. 최소 검증/에러 처리/인증 적용

### Phase 2: 인사이트 렌더 전환

1. `/insights` 목록 DB 조회 전환
2. `/insights/[slug]` 상세 페이지 구현
3. Markdown 렌더링/본문 이미지 처리

### Phase 3: 검색/배포 운영 연동

1. sitemap 동적 반영
2. rss 제공
3. Search Console/Bing 재제출

### Phase 4: n8n 자동 발행 연결

1. `N8N_API_KEY` 운영값 설정
2. n8n HTTP 노드 연결
3. 장애 알림 + 재시도 정책 적용

## 12) 완료 기준 (Definition of Done)

아래를 모두 만족하면 전환 완료로 본다.

1. n8n에서 API 호출만으로 게시글 생성 가능
2. 게시글이 `/insights` 목록과 `/insights/[slug]` 상세에 노출
3. sitemap에 해당 slug URL 반영
4. 인증 없는 API 요청은 401로 차단
5. 잘못된 slug/필드는 400으로 차단
6. 중복 slug는 409로 차단
7. 배포 후 Search Console에서 글 URL 검사 가능

## 13) 주의사항

1. Firestore rules와 API 인증은 별개다. 둘 다 설정해야 한다.
2. 클라이언트 SDK로 `posts` 쓰기를 허용하지 않는다.
3. 이미지 업로드 경로와 storage rules 불일치를 만들지 않는다.
4. `src/data/insights.ts`와 Firestore를 동시에 운영하지 말고, 최종적으로 Firestore 단일 소스로 수렴한다.

## 14) 2026-02-23 구현 반영 현황

- [x] `POST /api/posts` 구현 (`x-api-key` 인증 + 입력 검증 + 중복 409)
- [x] `GET /api/posts`, `GET /api/posts/[slug]` 구현
- [x] `/insights`를 API+DB 조회 기반으로 전환
- [x] `/insights/[slug]` 상세 페이지 + Markdown 렌더 + `Article` JSON-LD 구현
- [x] `/sitemap.xml`에 인사이트 상세 URL 동적 반영
- [x] `/rss.xml` 라우트 추가
- [x] 환경변수 템플릿 추가 (`apps/hyean-web/.env.example`)

구현 메모:

1. 저장소 계층은 `src/lib/insight-post-store.ts`에 통합됨
2. 운영 환경에서 `FIREBASE_SERVICE_ACCOUNT_KEY` + `NEXT_PUBLIC_FIREBASE_PROJECT_ID`가 설정되면 Firestore를 우선 사용
3. 로컬/미설정 환경에서는 `data/posts.json` + 기존 `src/data/insights.ts` fallback으로 동작
4. `firebase-admin` 패키지가 없는 환경을 고려해 서버는 REST 기반 Firestore 접근 로직을 사용

남은 운영 작업:

1. 운영 서버 환경변수 실제 주입
2. n8n 워크플로우 HTTP 노드 연결 및 재시도/알림 정책 적용
3. Search Console/Bing에서 `/insights/[slug]`, `/rss.xml` 재수집 요청

# HYEAN Website 2026 Redesign

> Date: 2026-02-20  
> Scope: `apps/hyean-web` (Corporate site only)

## 1. Executive Summary

현재 사이트는 메시지의 방향성은 맞지만, 시각 완성도/신뢰 증거/전환 UX/기술 완성도에서 임팩트 비즈니스 기준에 미달한다.  
핵심은 "예쁜 리뉴얼"이 아니라 **신뢰를 증명하는 정보구조 + 성과 중심 콘텐츠 + 빠르고 접근 가능한 경험**으로 전환하는 것이다.

## 2. Current Diagnosis

### 2.1 Brand Fit
- 강점: 브랜드 핵심 문장과 타깃(대학/RISE) 축은 이미 반영됨.
- 한계: 톤앤매너가 "사회적 임팩트 실행 파트너"보다 "일반 기업 소개"에 가까움.
- Evidence: `apps/hyean-web/src/data/site.ts`, `apps/hyean-web/src/app/page.tsx`.

### 2.2 Visual & Layout
- 강점: 흑백 중심 토큰, 충분한 여백, 카드 구조 기반은 존재.
- 한계: 인라인 스타일 혼재, 컴포넌트 일관성 부족, 사례 카드의 상호작용 연결 누락.
- Evidence: `apps/hyean-web/src/app/globals.css`, `apps/hyean-web/src/components/project-card.tsx`.

### 2.3 Content Credibility (Impact Business 관점)
- 강점: 프로젝트 본문/실행/지표 필드가 준비됨.
- 한계: 정량 성과(숫자), 파트너 로고/증빙 링크, 방법론 근거가 랜딩에서 바로 보이지 않음.
- Evidence: `apps/hyean-web/src/data/projects.ts`, `apps/hyean-web/src/app/projects/[slug]/page.tsx`.

### 2.4 Conversion UX
- 강점: 문의 폼과 타깃 전용 페이지 존재.
- 한계: 홈에서 타깃별 전환 동선이 얕고, 문의 전 신뢰 강화 단계(사례 다운로드, FAQ, 처리 SLA) 부재.
- Evidence: `apps/hyean-web/src/app/page.tsx`, `apps/hyean-web/src/app/contact/page.tsx`.

### 2.5 Technical Readiness
- Critical: 프로젝트 이미지 6개 누락으로 사례 카드 대량 깨짐.
- High: Google font fetch 의존으로 빌드 실패 가능.
- Medium: `Next/Image` 경고(`sizes` 누락), 중복 파일(`page 2.tsx` 등) 잔존.
- Evidence: `apps/hyean-web/.next/dev/logs/next-development.log`, `apps/hyean-web/src/app/layout.tsx`, `apps/hyean-web/src/components/project-card.tsx`, `apps/hyean-web/src/app/about/page 2.tsx`.

## 3. 2026 Trend Translation for HYEAN

## 3.1 Keep (혜안에 맞는 트렌드)
- Editorial minimalism: 장식 최소화, 타이포/콘텐츠 중심 구조.
- Authentic proof: 실제 현장 사진 + 수치/문서 근거 우선.
- Fast trust UX: 첫 화면에서 "무엇을 해결하는가 + 무엇으로 증명하는가" 즉시 제시.
- Accessibility by default: WCAG 2.2 기준 반영.

## 3.2 Avoid (혜안과 충돌하는 트렌드)
- 과도한 3D/장식형 인터랙션.
- 의미 없는 스크롤 이펙트.
- 브랜드 맥락 없는 컬러 실험.

## 3.3 Brand Tone to UI Mapping
- Clarity: 짧은 문장, 명확한 정보 위계, KPI 숫자 우선.
- Humanity: 현장 사진, 참여자 목소리, 지역 맥락 캡션.
- Balance: 공공 신뢰감(정제) + 실행 에너지(전환 CTA)의 균형.

## 4. Target UX Architecture (v2)

## 4.1 Home 구조
- Hero: "더 나은 세상을 만드는 혜안" + 핵심 가치 제안 1문장.
- Proof strip: 누적 프로젝트 수, 협력 기관 수, 최근 2년 성과.
- Audience split: `대학 협력` / `RISE` / `지자체·기관` 3개 진입.
- Featured cases: 정량 성과가 있는 사례 우선.
- Methodology: 문제진단-공동설계-실행-성과관리 4단계.
- Final CTA: 문의 + 사례집 다운로드.

## 4.2 Projects 구조
- Listing: 필터(`대상/지역/연도/유형`) + 썸네일 일관화.
- Detail: 개요 → 실행 → 정량 성과 → 증빙 링크 → 유사 프로젝트 문의.
- Interaction: 기본 B/W, hover 시 컬러 복귀 + 텍스트 underline 강조.

## 4.3 Contact 구조
- 폼 이전: 예상 처리시간, 담당자 유형, 준비 자료 안내.
- 폼 항목: 목적/예산 범위/희망 일정/협업 유형 추가.
- 폼 이후: 접수 완료 메시지 + 다음 단계 안내 + 관련 사례 링크.

## 5. Implementation Plan

## Phase 0 (즉시, 1-2일): 안정화
- 누락 이미지 6개 복구.
- `Next/Image`에 `sizes`/우선순위 이미지 설정.
- 폰트 로딩 전략 정리(`@import` vs `next/font` 단일화).
- 중복 파일(`* 2.tsx`, `route 2.ts`) 정리.

## Phase 1 (1주): 디자인 시스템 정합
- 컴포넌트별 인라인 스타일 제거, 토큰 기반 일괄 적용.
- Typography scale 재정의(H1/H2/Body/Caption).
- 카드/버튼/네비게이션 상태(hover/focus/active) 명세화.

## Phase 2 (2주): 신뢰 콘텐츠 강화
- 사례별 정량 지표 보강(최소 3개 KPI/사례).
- 파트너/고객 로고 및 증빙 자료 섹션 구축.
- 방법론/프로세스 섹션 시각화.

## Phase 3 (1주): 전환/SEO/접근성
- 타깃별 랜딩 메시지 A/B 테스트.
- 구조화 데이터(Organization, Article, Breadcrumb) 반영.
- WCAG 2.2 핵심 항목(포커스, 터치 타깃, 에러 보조) 점검.

## Phase 4 (지속): 운영 체계
- 월간 콘텐츠 캘린더(사례 1, 인사이트 2, 뉴스 1).
- 분기별 성과 대시보드(문의 전환율, 핵심 유입 키워드).

## 6. KPIs

- Business: 문의 전환율, 타깃별 문의 비중, 재문의율.
- UX: INP < 200ms, LCP < 2.5s, CLS < 0.1.
- Content Trust: 사례 상세 페이지 체류시간, 증빙 링크 클릭률.
- SEO: 브랜드 키워드 외 비브랜드 유입 비율.

## 7. Immediate Backlog (P0)

- P0-1: 이미지 자산 복구 및 경로 검증.
- P0-2: 홈 Hero/Proof strip 재설계 와이어프레임 확정.
- P0-3: 프로젝트 카드 인터랙션 완성(B/W -> Color).
- P0-4: 폼 전환 UX(사전 안내 + 후속 안내) 추가.
- P0-5: 빌드/배포 기준선(CI lint/build) 확정.

## 8. External Reference Links

- HYEAN current site: https://hyean.org/
- Adobe AI & Digital Trends 2026: https://business.adobe.com/resources/reports-and-guides/ai-and-digital-trends-report.html
- Adobe Creative Trends 2026: https://blog.adobe.com/en/publish/2025/10/22/creative-trends-forecast-2026-ai-goes-art-school
- Figma State of the Designer 2026: https://www.figma.com/resource-library/state-of-the-designer-2026/
- Awwwards 2025 trend scan (2026 early signal): https://www.awwwards.com/web-design-trends-2025-introduction.html
- Google Page Experience: https://developers.google.com/search/docs/appearance/page-experience
- Google Core Web Vitals and ranking: https://developers.google.com/search/docs/appearance/core-web-vitals
- Google helpful content guidance: https://developers.google.com/search/docs/fundamentals/creating-helpful-content
- WCAG 2.2 updates: https://www.w3.org/WAI/standards-guidelines/wcag/new-in-22/
- Web.dev INP: https://web.dev/inp/
- Web.dev LCP: https://web.dev/articles/lcp
- HTTP Archive media chapter: https://almanac.httparchive.org/en/2024/media

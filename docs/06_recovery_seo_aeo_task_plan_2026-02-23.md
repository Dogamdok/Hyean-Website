# HYEAN Website Recovery + SEO/AEO Task Plan

> Date: 2026-02-23  
> Scope: `apps/hyean-web` (corporate site)

## 1) 이번 점검 결론

### 1.1 이미지 복구 (완료)
- 증상: `beyond-village-youth-town-buyeo` 캐러셀 4/5번째(파일 `-05`, `-06`)가 검정 화면으로 노출.
- 원인: `sips` 변환 과정에서 일부 iPhone JPEG가 올블랙 이미지(YAVG=0)로 저장됨.
- 조치:
  - `beyond-village-youth-town-buyeo-05.jpg`, `...-06.jpg`를 `ffmpeg`로 재생성.
  - `scripts/prepare_project_images.sh`를 `ffmpeg 우선 / sips fallback` 구조로 개선.
- 결과:
  - 복구 파일 YAVG 정상 (`138.396`, `122.116`)
  - 로컬 응답 정상 (`HTTP 200`, 실제 파일 크기 `446,059`, `396,718`)

### 1.2 현재 코드 상태 (현행 기준)
- 빌드: `npm run build` 성공.
- 라우트: 핵심 페이지 + capability 페이지 + campaign landing 정상 구성.
- 데이터: 서비스/프로젝트/공간/인사이트 구조화 완료.
- 문의: API 저장형 접수 구현 완료.

## 2) 기존 기초 계획 대비 추진 현황

기준 문서: `docs/02_build_roadmap.md`

### Phase 1 Foundation
- 상태: 완료

### Phase 2 Content Migration
- 상태: 대부분 완료, 일부 고도화 필요
- 완료:
  - 프로젝트 15건 구조화
  - 이미지/영상 연결
  - 공간/연계 프로젝트 연결
- 남은 항목:
  - 프로젝트별 출처/증빙 링크 고도화
  - 오래된/중복 보조 파일 정리 (`page 2.tsx` 등)

### Phase 3 Conversion Optimization
- 상태: 부분 진행
- 완료:
  - capability 기반 메시지 구조 일부 반영
- 미완료:
  - CTA A/B 테스트 체계
  - 문의 후속 자동응답(메일/CRM)
  - 퍼널 대시보드

### Phase 4 Deployment & Operations
- 상태: 본격 착수 전
- 미완료:
  - 배포 인프라/도메인 운영체계 확정
  - SEO 운영 루틴/모니터링 체계

## 3) 핵심 갭(완성도 저해 요인)

1. `sitemap.xml`, `robots.txt` 부재
2. JSON-LD 구조화 데이터 부재 (`Organization`, `Service`, `Article`, `BreadcrumbList`)
3. 페이지별 정교한 메타 템플릿 부재(현재는 기본/부분 수준)
4. E-E-A-T 신뢰 신호(출처/근거/업데이트 이력/운영 주체 설명) 부족
5. 중복 파일 잔존 (`for-university/page 2.tsx`, `for-rise/page 2.tsx`)
6. 문의 전환 퍼널 추적 설계 미흡(이벤트 표준/대시보드 부재)

## 4) SEO + AI SEO 전략 (AEO/GEO)

참고 용어:
- AEO: Answer Engine Optimization
- GEO: Generative Engine Optimization

목표:
- 검색엔진 + 생성형 AI가 “신뢰 가능한 지역 실행 파트너”로 인식하도록 엔터티/근거/구조를 명확화

### 전략 축 A: Technical SEO 기준선
1. `robots.ts`, `sitemap.ts` 추가
2. canonical/metadata 템플릿 전 페이지 확장
3. 이미지 alt 일관성 규칙 적용 (프로젝트명/지역/활동 맥락 포함)
4. Core Web Vitals 추적(LCP/INP/CLS)

### 전략 축 B: 신뢰성(Trust) 신호
1. 회사 실체 정보 고정 블록 (사업자/주소/연락처/인증)
2. 프로젝트별 “근거 카드” 추가
   - 수행 기간
   - 파트너 유형
   - 핵심 지표 + 출처
3. “마지막 업데이트 날짜”와 데이터 기준일 표기
4. 인사이트/사례에 출처 링크 명시

### 전략 축 C: 구조화 데이터(JSON-LD)
1. 전역: `Organization`, `WebSite`
2. 서비스 페이지: `Service`
3. 프로젝트 상세: `Article` 또는 `CreativeWork` + `BreadcrumbList`
4. 인사이트: `Article` + `author`, `datePublished`, `dateModified`

### 전략 축 D: AI 검색 친화 콘텐츠(AEO/GEO)
1. 질문형 섹션(Q&A) 도입
   - “혜안은 어떤 문제를 해결하는가?”
   - “어떤 방식으로 성과를 증빙하는가?”
2. 사실형 요약 블록(3~5개 핵심 수치) 제공
3. 용어 정의(지역실행/성과관리/다기관협업) 표준화
4. 인용 가능한 문장(짧고 명확한 문장 구조) 배치

## 5) 실행 Task (우선순위/산출물)

## P0 (이번 주)
1. 이미지 안정화 완료본 확정
   - 산출물: `project-image-asset-map.md` 갱신본 + 검수 체크리스트
2. 중복 파일 제거
   - 대상: `src/app/for-university/page 2.tsx`, `src/app/for-rise/page 2.tsx`
3. SEO 기반 파일 추가
   - `src/app/robots.ts`, `src/app/sitemap.ts`
4. Organization JSON-LD 추가
   - 위치: `src/app/layout.tsx` 또는 전용 컴포넌트

## P1 (1~2주)
1. 프로젝트 상세 신뢰 블록 표준화
   - 지표 + 출처 + 업데이트일
2. 인사이트 구조화 데이터(Article) 적용
3. 문의 퍼널 이벤트 정의
   - view_contact / start_inquiry / submit_inquiry
4. Search Console/Bing Webmaster 등록 및 검증

## P2 (3~4주)
1. FAQ/질문형 랜딩 섹션 구축 (AEO)
2. 타깃 키워드별 내부링크 구조 고도화
3. 캠페인 페이지 noindex 정책 운영 가이드 정리
4. 월간 SEO/AEO 리포트 템플릿 확정

## 6) 측정 KPI

### SEO KPI
- 비브랜드 유입 세션
- 주요 페이지 인덱싱 수
- 검색 CTR, 평균 순위

### AEO/GEO KPI
- AI 검색/요약 노출 시 인용 빈도(브랜드 문장/수치 인용)
- 브랜드 질의 대비 사실형 응답 정확도
- “혜안 + 프로젝트 유형” 질의에서의 언급률

### 전환 KPI
- 문의 시작률
- 문의 완료율
- 문의 후 미팅 전환율

## 7) 운영 루틴

1. 주간: 콘텐츠/메타/링크 점검
2. 월간: 인덱싱/CTR/문의 전환 리뷰
3. 분기: 정보 신뢰도 갱신(지표/사례/출처 최신화)

## 8) 즉시 실행 권고 (Next Action)

1. `P0` 4개 항목을 이번 주 내 완료
2. 다음 주부터 `P1` 착수(구조화 데이터 + 퍼널 측정)
3. 4주차에 SEO/AEO 성과 1차 리뷰 후 카피/IA 보정

## 9) 2026-02-23 실행 반영 현황

- [x] 이미지 복구 + 변환 파이프라인 안정화 (`ffmpeg` 우선)
- [x] `robots.txt` 생성 (`src/app/robots.ts`)
- [x] `sitemap.xml` 생성 (`src/app/sitemap.ts`)
- [x] 전역 구조화 데이터 적용 (`Organization`, `WebSite`)
- [x] 홈 FAQ 섹션 + `FAQPage` 구조화 데이터 적용
- [x] 프로젝트 상세 구조화 데이터 적용 (`BreadcrumbList`, `Article`)
- [x] 프로젝트 상세 신뢰 블록 추가 (`출처 및 업데이트`)
- [x] 주요 페이지 canonical/description 메타 보강
- [x] 문의 퍼널 이벤트 계측(`view_contact`, `start_inquiry`, `submit_inquiry`, `submit_inquiry_error`)
- [x] 사례별 KPI 출처 링크 정밀화(대표 사례 6건, `evidenceStatement`/`updatedAt`/`sourceCitations`)
- [x] 서비스/프로젝트 페이지 구조화 데이터 보강(`Service`, `CollectionPage`)
- [x] 중복 캠페인 파일 정리(`src/app/for-university/page 2.tsx`, `src/app/for-rise/page 2.tsx`)
- [x] 복구 이미지 캐시 우회 반영(청년마을 4·5번째 이미지 파일명 버전 분리)
- [x] 운영 점검 스크립트 추가(`scripts/seo_aeo_geo_healthcheck.sh`)
- [x] 인덱싱 제출 큐 자동 생성 스크립트 추가(`scripts/generate_indexing_targets.sh`)
- [x] 인사이트 API+DB 전환 기반 구축(`/api/posts`, `/insights/[slug]`, `/rss.xml`, 동적 sitemap 반영)

미완료(다음 스프린트):
- [ ] Search Console/Bing Webmaster 등록 및 색인 운영
- [ ] Search Console/Bing 수집 데이터 기반 월간 리포트 자동화

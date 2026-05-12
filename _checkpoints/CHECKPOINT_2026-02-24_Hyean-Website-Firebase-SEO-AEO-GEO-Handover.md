# Hyean-Website-Firebase-SEO-AEO-GEO-Handover Checkpoint
> 작성일: 2026-02-24 13:39 KST
> 작업 폴더: /Users/doh/Desktop/Storage/1 Projects/Hyean Website Project

---

## 1. 작업 개요
### 1.1 목적
`hyean.org`를 Imweb 운영에서 코드 기반(Firebase App Hosting + Next.js) 운영으로 전환하면서 진행한 웹 제작/디자인 개선/배포/SEO·GEO·AEO 최적화 이력을 통합해, 다음 AI가 즉시 이어서 운영할 수 있도록 한다.

### 1.2 핵심 요구사항
- 기업 웹사이트(혜안) 중심으로 정보구조/콘텐츠/UX를 고도화
- Firebase App Hosting(`hyean-website`) 기준 배포 운영 체계 확립
- 도메인 전환 과정에서 Google Workspace 메일(MX) 연동 영향 최소화
- SEO/GEO/AEO를 구조화데이터, sitemap/rss, 인사이트 콘텐츠로 체계화

---

## 2. 작업 전 상태 (Before)
- Imweb 기반 운영으로 코드 추적/개선/배포 이력 관리가 어려웠음.
- Hyean 관련 코드/문서/아카이브가 다수 폴더로 분산되어 유지보수 난이도 높음.
- 초기에는 인사이트가 static 중심이었고, 검색 신호(sitemap/rss/API 연동)가 제한적이었음.
- 도메인 DNS가 Hostcocoa/Imweb/Cafe24 사이에서 얽혀 A 레코드 직접 수정이 어려운 구간이 있었음.

---

## 3. 목표 상태 (After)
- `Hyean Website Project` 내 코드/문서/체크포인트 기반으로 운영 연속성 확보.
- Firebase App Hosting 설정 고정(`apps/hyean-web/firebase.json`, backendId: `hyean-website`).
- SEO/AEO/GEO 핵심 신호 반영:
  - 네이버 소유확인 메타
  - 동적 `sitemap.xml`/`rss.xml`
  - JSON-LD 구조화 데이터
  - 정책·공공협력 기반 인사이트 축적

---

## 4. 완료된 작업
- [x] 기업 사이트 재구축 기반 완료(Next.js, 콘텐츠 이관, 타깃 페이지)
  - 기존 체크포인트(2026-02-19) 범위 완료 항목 반영
- [x] UI/UX 리디자인(모바일 메뉴, 필터, 문의 폼 확장, 디자인 시스템)
  - `docs/05_ui_redesign_checkpoint_2026-02-20.md`
- [x] 인사이트 API/DB 아키텍처 구현
  - `GET/POST /api/posts`, `GET /api/posts/[slug]`
  - `insights`, `insights/[slug]`, `sitemap`, `rss` 경로 연동
- [x] 네이버 사이트 인증 메타 반영
  - `apps/hyean-web/src/app/layout.tsx`
- [x] SEO/GEO/AEO 인사이트 3건(2026-02-23) 반영
  - `regional-revitalization-playbook-living-population-2026`
  - `public-collaboration-operating-system-2026`
  - `seo-geo-aeo-trust-framework-2026`
  - 파일: `apps/hyean-web/src/data/insights.ts`
- [x] robots/sitemap/rss 운영 신호 구성
  - `apps/hyean-web/src/app/robots.ts`
  - `apps/hyean-web/src/app/sitemap.ts`
  - `apps/hyean-web/src/app/rss.xml/route.ts`
- [x] DNS 전환 실무 정리(운영 과정)
  - Cafe24 네임서버 반영 후 DNS 제어권 회복
  - Firebase 도메인 연결 과정에서 TXT/CNAME/A 레코드 검증 진행
  - Google Workspace 메일(MX) 유지 원칙 확정

### 4.1 History & Timeline
- **2026-02-19**: 기업 웹사이트 코드베이스 재구축 및 마이그레이션 체계 수립.
- **2026-02-20**: UI 전면 리디자인, 모바일/전환 UX 개선.
- **2026-02-23**: 인사이트 API/DB + sitemap/rss 자동화 + SEO 헬스체크 강화.
- **2026-02-24**: 도메인 전환 운영 정리, 네이버 인증 반영, SEO·GEO·AEO 운영형 콘텐츠/신호 확정.

---

## 5. 미완료 작업 (TODO)

### 5.1 운영 빌드/런타임 스모크 테스트
```bash
cd "/Users/doh/Desktop/Storage/1 Projects/Hyean Website Project/apps/hyean-web"

# 1) 프로덕션 빌드 검증
npm run build

# 2) 로컬 런타임 확인
npm run dev
```

### 5.2 Firebase App Hosting 재배포(필요 시)
```bash
cd "/Users/doh/Desktop/Storage/1 Projects/Hyean Website Project/apps/hyean-web"

# App Hosting 배포
firebase deploy --only apphosting
```

### 5.3 SEO 운영 점검 스크립트 실행
```bash
cd "/Users/doh/Desktop/Storage/1 Projects/Hyean Website Project"

# SEO/AEO/GEO 점검 스크립트
bash scripts/seo_aeo_geo_healthcheck.sh
```

### 5.4 도메인/DNS/메일 영향 점검 (컷오버 후)
```bash
# A 레코드 확인
DIG_A=$(dig hyean.org A +short); echo "$DIG_A"

# MX 레코드(Google Workspace) 확인
DIG_MX=$(dig hyean.org MX +short); echo "$DIG_MX"

# TXT 검증 확인
DIG_TXT=$(dig hyean.org TXT +short); echo "$DIG_TXT"
```

### 5.5 검색 콘솔 운영 (수동)
```bash
# 제출 대상 (Google Search Console / Naver Search Advisor)
# https://hyean.org/sitemap.xml
# https://hyean.org/rss.xml

# 색인 요청 대상 예시
# https://hyean.org/
# https://hyean.org/insights
# https://hyean.org/contact
```

---

## 6. 시행착오 및 교훈
### 6.1 발생한 문제
- DNS 관리 권한이 Hostcocoa/Imweb 설정과 Cafe24 관리 화면 사이에서 분리되어 A레코드 수정이 즉시 불가한 구간이 발생.
- 레코드 편집 가능 여부가 네임서버/호스트IP 관리 정책에 따라 달라 원인 파악에 시간이 소요됨.
- 도메인 컷오버 과정에서 메일(MX) 영향 우려가 커서 웹 레코드와 메일 레코드를 분리 관리해야 했음.

### 6.2 해결 방법
- 네임서버 전환 상태를 먼저 확정한 후 DNS 레코드 작업 순서를 재정렬.
- TXT/CNAME 검증 -> A 레코드/연결 검증 순서로 진행.
- MX는 건드리지 않고 웹 연결 관련 레코드만 수정하는 원칙으로 운영.

### 6.3 얻은 교훈
- 도메인 전환은 "코드 배포"보다 "DNS 제어권 확인"이 선행되어야 한다.
- SEO/GEO/AEO는 기술 설정과 콘텐츠 전략이 동시에 맞아야 안정적으로 작동한다.
- 인수인계 문서가 없으면 같은 DNS 이슈를 반복하기 쉽다.

---

## 7. 핵심 결정 사항

| 결정 사항 | 선택한 옵션 | 이유 |
|-----------|-------------|------|
| 운영 범위 | 혜안 기업 사이트 중심(헤리티지 분리) | 프로젝트 범위 명확화 및 리소스 집중 |
| 배포 타깃 | Firebase App Hosting (`hyean-website`) | 운영 자동화/도메인 연결 일관성 |
| SEO 전략 | sitemap/rss + JSON-LD + 인사이트 축적 | 검색/생성형 노출 동시 대응 |
| DNS 운영 원칙 | 웹 레코드와 MX 분리 관리 | Google Workspace 메일 안정성 보장 |

---

## 8. 참고 자료
- `/Users/doh/Desktop/Storage/1 Projects/Hyean Website Project/_checkpoints/CHECKPOINT_2026-02-19_HYEAN-Website-Rebuild-Corporate.md`
- `/Users/doh/Desktop/Storage/1 Projects/Hyean Website Project/_checkpoints/CHECKPOINT_2026-02-23_Hyean-Insights.md`
- `/Users/doh/Desktop/Storage/1 Projects/Hyean Website Project/docs/05_ui_redesign_checkpoint_2026-02-20.md`
- `/Users/doh/Desktop/Storage/1 Projects/Hyean Website Project/apps/hyean-web/firebase.json`
- `/Users/doh/Desktop/Storage/1 Projects/Hyean Website Project/apps/hyean-web/src/app/layout.tsx`
- `/Users/doh/Desktop/Storage/1 Projects/Hyean Website Project/apps/hyean-web/src/app/robots.ts`
- `/Users/doh/Desktop/Storage/1 Projects/Hyean Website Project/apps/hyean-web/src/app/sitemap.ts`
- `/Users/doh/Desktop/Storage/1 Projects/Hyean Website Project/apps/hyean-web/src/app/rss.xml/route.ts`
- `/Users/doh/Desktop/Storage/1 Projects/Hyean Website Project/apps/hyean-web/src/data/insights.ts`
- `/Users/doh/Desktop/Storage/1 Projects/Hyean Website Project/scripts/seo_aeo_geo_healthcheck.sh`

---

## 9. 다음 세션 가이드

### 이 파일을 읽은 AI에게:
1. 먼저 "5. 미완료 작업"의 5.1~5.4를 실행해 운영 상태를 검증하세요.
2. DNS/MX가 정상인 상태에서 5.5(색인 운영) 진행 여부를 사용자에게 확인하세요.
3. 기존 의사결정(기업 사이트 중심, App Hosting, MX 분리)을 변경할 경우 반드시 사용자 합의를 먼저 받으세요.

### 사용자에게:
다음 세션에서 이렇게 요청하세요:
```
/Users/doh/Desktop/Storage/1 Projects/Hyean Website Project/_checkpoints/CHECKPOINT_2026-02-24_Hyean-Website-Firebase-SEO-AEO-GEO-Handover.md를 읽고 작업 이어서 해줘
```

---

*이 문서는 #checkpoint 명령으로 자동 생성되었습니다.*

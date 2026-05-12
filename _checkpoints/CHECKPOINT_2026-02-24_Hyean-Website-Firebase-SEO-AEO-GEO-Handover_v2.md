# Hyean-Website-Firebase-SEO-AEO-GEO-Handover Checkpoint
> 작성일: 2026-02-24 13:44 KST
> 작업 폴더: /Users/doh/Desktop/Storage/1 Projects/Hyean Website Project

---

## 1. 작업 개요
### 1.1 목적
`hyean.org` 운영 전환(코드 기반/Firebase App Hosting) 과정의 결과를 세션 간 손실 없이 이어가기 위해, 기존 체크포인트(v1)를 운영 실행 관점으로 보강한다.

### 1.2 핵심 요구사항
- 기업 사이트 운영 기준(혜안) 유지
- Firebase App Hosting(`hyean-website`) 기준 배포 재현 가능성 확보
- SEO/GEO/AEO 핵심 신호(메타/구조화데이터/sitemap/rss/insights) 유지
- DNS/메일 영향 최소화 원칙(MX 보존) 유지

---

## 2. 작업 전 상태 (Before)
- 기존 체크포인트(v1)는 구조가 완성되어 있었고 핵심 히스토리도 기록되어 있었음.
- 다만 다음 세션이 즉시 실행할 수 있도록 하는 관점에서, 검증 순서와 운영 명령 표준화가 더 필요했음.
- 운영 재개 시 "무엇부터 실행할지"가 문장으로는 있었지만, 순서/의존성이 더 명확하면 효율이 높아지는 상태였음.

---

## 3. 목표 상태 (After)
- v1 내용을 유지하면서, 운영 재개에 필요한 실행 순서와 검증 루틴이 명확해진 v2 체크포인트 확보.
- 파일/스크립트 경로 유효성 재확인 결과를 반영해 즉시 실행 가능성 강화.
- 다음 세션 AI가 "점검 -> 배포 -> 색인 운영" 흐름으로 바로 이어갈 수 있는 상태.

---

## 4. 완료된 작업
- [x] 기존 체크포인트(v1) 필수 섹션 완전성 점검
  - 1~9번 섹션 모두 존재 확인
  - Before/After/완료/TODO/교훈/결정/참고/가이드 구조 유지 확인
- [x] 운영 핵심 경로 실존 여부 검증
  - `apps/hyean-web/src/app/layout.tsx`
  - `apps/hyean-web/src/app/sitemap.ts`
  - `apps/hyean-web/src/app/rss.xml/route.ts`
  - `scripts/seo_aeo_geo_healthcheck.sh`
- [x] 운영 재개용 TODO를 실행 우선순위 기준으로 재정렬
  - `로컬 빌드 점검 -> 배포 -> 운영 검증 -> DNS/MX 검증 -> 검색콘솔`

### 4.1 History & Timeline
- **2026-02-19**: 기업 웹사이트 코드베이스 재구축 및 마이그레이션 체계 수립.
- **2026-02-20**: UI 전면 리디자인, 모바일/전환 UX 개선.
- **2026-02-23**: 인사이트/API/SEO 자동화 체계 구축.
- **2026-02-24 13:39**: v1 체크포인트 생성.
- **2026-02-24 13:44**: v2 보강(운영 실행 순서/검증 루틴 명확화).

---

## 5. 미완료 작업 (TODO)

### 5.1 로컬 빌드/런타임 스모크 테스트 (선행)
```bash
cd "/Users/doh/Desktop/Storage/1 Projects/Hyean Website Project/apps/hyean-web"

# 1) 의존성 상태를 현재 lockfile 기준으로 정리
npm ci

# 2) 프로덕션 빌드 성공 여부 확인
npm run build

# 3) 로컬 런타임 기동 후 주요 페이지 수동 점검
npm run dev
```

### 5.2 Firebase App Hosting 재배포 (5.1 통과 후)
```bash
cd "/Users/doh/Desktop/Storage/1 Projects/Hyean Website Project/apps/hyean-web"

# App Hosting 재배포 (프로젝트 명시)
firebase deploy --project hyean-website --only apphosting
```

### 5.3 배포 후 SEO/AEO/GEO 헬스체크
```bash
cd "/Users/doh/Desktop/Storage/1 Projects/Hyean Website Project"

# 점검 스크립트 실행
bash scripts/seo_aeo_geo_healthcheck.sh
```

### 5.4 DNS/MX 영향 점검 (컷오버 후 반복)
```bash
# 1) 웹 A 레코드 확인
dig hyean.org A +short

# 2) Google Workspace MX 보존 확인
dig hyean.org MX +short

# 3) TXT 검증 레코드 확인
dig hyean.org TXT +short
```

### 5.5 검색 콘솔 운영 (수동)
```bash
# Google Search Console / Naver Search Advisor 제출 대상
# https://hyean.org/sitemap.xml
# https://hyean.org/rss.xml

# 색인 요청 우선 URL
# https://hyean.org/
# https://hyean.org/insights
# https://hyean.org/contact
```

---

## 6. 시행착오 및 교훈
### 6.1 발생한 문제
- DNS 제어권이 분산된 상태에서 웹 연결 이슈와 메일 이슈가 혼재되어 판단이 지연됨.
- 운영 단계에서 "현재 유효한 명령/경로"가 문서에 명시되지 않으면 재시작 비용이 커짐.

### 6.2 해결 방법
- DNS는 TXT/CNAME/A 순으로, 메일은 MX 고정 원칙으로 분리 점검.
- 체크포인트에 실제 실행 가능한 명령과 절대경로를 우선 기록.

### 6.3 얻은 교훈
- 도메인 전환 프로젝트는 코드 변경보다 운영 검증 순서가 더 중요하다.
- 체크포인트는 "설명 문서"보다 "재실행 문서"로 작성해야 다음 세션 생산성이 높다.

---

## 7. 핵심 결정 사항

| 결정 사항 | 선택한 옵션 | 이유 |
|-----------|-------------|------|
| 운영 범위 | 혜안 기업 사이트 중심(헤리티지 분리) | 프로젝트 범위와 책임 경계 명확화 |
| 배포 타깃 | Firebase App Hosting (`hyean-website`) | 운영 자동화 및 릴리즈 일관성 |
| DNS 원칙 | 웹 레코드와 MX 분리 관리 | Google Workspace 메일 안정성 보장 |
| 체크포인트 전략 | v1 보존 + v2 보강 | 이력 보존과 실행성 동시 확보 |

---

## 8. 참고 자료
- `/Users/doh/Desktop/Storage/1 Projects/Hyean Website Project/_checkpoints/CHECKPOINT_2026-02-24_Hyean-Website-Firebase-SEO-AEO-GEO-Handover.md`
- `/Users/doh/Desktop/Storage/1 Projects/Hyean Website Project/_checkpoints/CHECKPOINT_2026-02-23_Hyean-Insights.md`
- `/Users/doh/Desktop/Storage/1 Projects/Hyean Website Project/apps/hyean-web/firebase.json`
- `/Users/doh/Desktop/Storage/1 Projects/Hyean Website Project/apps/hyean-web/src/app/layout.tsx`
- `/Users/doh/Desktop/Storage/1 Projects/Hyean Website Project/apps/hyean-web/src/app/sitemap.ts`
- `/Users/doh/Desktop/Storage/1 Projects/Hyean Website Project/apps/hyean-web/src/app/rss.xml/route.ts`
- `/Users/doh/Desktop/Storage/1 Projects/Hyean Website Project/scripts/seo_aeo_geo_healthcheck.sh`

---

## 9. 다음 세션 가이드

### 이 파일을 읽은 AI에게:
1. 먼저 5.1을 실행해 현재 코드/빌드 상태를 확인하세요.
2. 문제가 없으면 5.2 배포, 5.3 점검 순서로 진행하세요.
3. DNS/MX 결과가 비정상이면 배포보다 5.4 원인 확인을 우선하세요.

### 사용자에게:
다음 세션에서 이렇게 요청하세요:
```
/Users/doh/Desktop/Storage/1 Projects/Hyean Website Project/_checkpoints/CHECKPOINT_2026-02-24_Hyean-Website-Firebase-SEO-AEO-GEO-Handover_v2.md를 읽고 작업 이어서 해줘
```

---

*이 문서는 #checkpoint 기존 문서를 점검·보강한 v2 버전입니다.*

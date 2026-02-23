# HYEAN-Website-Rebuild-Corporate Checkpoint
> 작성일: 2026-02-19 15:15
> 작업 폴더: /Users/doh/Desktop/Storage/1 Projects/Hyean Website Project

---

## 1. 작업 개요
### 1.1 목적
Imweb 기반 `hyean.org`를 자체 기술 스택(Next.js)으로 전환하고, 기존 포트폴리오/인사이트를 이관하여 (주)혜안 기업 웹사이트를 직접 운영 가능한 구조로 구축한다.

### 1.2 핵심 요구사항
- Storage 구조를 파악하고 신규 프로젝트 폴더를 구축할 것
- 로컬콘텐츠 중점대학/RISE 담당자 대상 어필 구조를 사이트/문서에 반영할 것
- 랜딩페이지 단일전략이 아닌 채널 전략(네이버/블로그 포함)을 문서화할 것
- 최종 범위는 **(주)혜안 웹사이트**로 한정하고, **혜안 헤리티지는 별도 사이트로 분리**할 것

---

## 2. 작업 전 상태 (Before)
- Imweb 기반 운영 사이트(`https://hyean.org`)를 코드로 직접 관리하기 어려운 상태
- `Hyean Web`, `Hyean Web 2`, `Hyean Heritage Web` 등 과거 아카이브가 분산 저장
- 신규 코드베이스(`Hyean Website Project`)와 이관 문서 체계가 없었음
- 로컬콘텐츠 중점대학/RISE 담당자 타깃 전환 페이지 부재

---

## 3. 목표 상태 (After)
- `Hyean Website Project` 내에 Next.js 기반 기업 웹사이트 코드/문서/이관 인벤토리 완비
- 회사소개/서비스/프로젝트/인사이트/문의 + 타깃 페이지(`/for-university`, `/for-rise`) 구현
- 이관 출처와 전략 문서가 프로젝트 내에서 추적 가능
- 범위 문서/README에 헤리티지 분리 원칙 명시

---

## 4. 완료된 작업
- [x] 프로젝트 루트 생성: `1 Projects/Hyean Website Project`
- [x] 표준 구조 생성: `apps/`, `docs/`, `content/migration/`, `scripts/`
- [x] Next.js 앱 스캐폴드 및 핵심 페이지 구현
- [x] 문의 API(`POST /api/inquiries`) + 파일 저장 스토어 구현
- [x] 포트폴리오/인사이트 1차 이관 데이터 작성
- [x] 로컬콘텐츠 중점대학 타깃 페이지 구현
- [x] RISE 타깃 페이지 구현
- [x] 전략 문서(총괄/타깃/증빙/네이버/파워블로거) 프로젝트로 통합
- [x] 이관 인벤토리 자동생성 스크립트 수정 및 출력 파일 생성
- [x] 범위 고정 반영: “혜안 헤리티지 제외, (주)혜안 기업 사이트 구현”
- [x] Next 동적 라우트 타입 보정(`params: Promise<{slug: string}>`)으로 빌드 호환성 개선

---

## 5. 미완료 작업 (TODO)

### 5.1 의존성 설치 및 정적 검증 완료
```bash
# 프로젝트 앱 폴더로 이동
cd "/Users/doh/Desktop/Storage/1 Projects/Hyean Website Project/apps/hyean-web"

# 의존성 설치 (현재 네트워크 불안정으로 재시도 필요)
npm install

# 정적 검사 및 빌드
npm run lint
npm run build
```

### 5.2 포트폴리오 2차 이관(이미지/정량 성과)
```bash
# 이관 인벤토리 재생성
bash "/Users/doh/Desktop/Storage/1 Projects/Hyean Website Project/scripts/build_migration_inventory.sh"

# 프로젝트 데이터 편집
code "/Users/doh/Desktop/Storage/1 Projects/Hyean Website Project/apps/hyean-web/src/data/projects.ts"
```

### 5.3 운영 연동(문의 후속 처리)
```bash
# 현재 파일 저장형 문의 데이터 확인
cat "/Users/doh/Desktop/Storage/1 Projects/Hyean Website Project/apps/hyean-web/data/inquiries.json"

# 추후: 메일/CRM 연동용 API 확장 파일 수정
code "/Users/doh/Desktop/Storage/1 Projects/Hyean Website Project/apps/hyean-web/src/app/api/inquiries/route.ts"
```

### 5.4 배포 준비
```bash
# (예시) 빌드 검증 후 배포 대상 플랫폼에 맞춰 환경변수/도메인 설정
# Vercel 또는 Firebase Hosting 중 1개 확정 후 설정 문서화
```

---

## 6. 시행착오 및 교훈
### 6.1 발생한 문제
- `npm install` 중 `ENOTFOUND registry.npmjs.org`가 반복되어 설치가 장시간 지연/중단됨
- 이관 인벤토리 스크립트에서 `set -euo pipefail` + 매치 없음 상황으로 조기 종료
- 스크립트 리다이렉션 위치 오류로 출력이 파일이 아닌 STDOUT으로만 나감

### 6.2 해결 방법
- 장시간 정체된 `npm install` 프로세스 정리 후 재시도 기준만 남김
- 스크립트에서 `rg` 무매치 허용(`|| true`), 소스 디렉터리 존재 검사 추가
- 블록 리다이렉션을 `} > "$OUT"`으로 수정해 파일 생성 정상화

### 6.3 얻은 교훈
- 아카이브 마이그레이션 스크립트는 “무매치/누락 디렉터리”를 기본 허용해야 안정적임
- 네트워크 의존 작업은 별도 단계로 분리하고, 코드/문서 완성도부터 고정하는 것이 효율적임

---

## 7. 핵심 결정 사항

| 결정 사항 | 선택한 옵션 | 이유 |
|-----------|-------------|------|
| 사이트 범위 | (주)혜안 기업 웹사이트만 구축 | 사용자 최종 지시로 혜안 헤리티지 분리 확정 |
| 정보구조 | Corporate + 타깃 페이지(University/RISE) | 담당자 검색/전환 시나리오를 직접 반영하기 위함 |
| 기술스택 | Next.js App Router + TS | 향후 직접 유지보수/확장 용이성 |
| 문의 저장 방식 | 초기 파일 저장형(`data/inquiries.json`) | 빠른 MVP 구축 후 CRM/메일 연동으로 확장 가능 |
| 콘텐츠 이관 방식 | 원문 복제 대신 의미 재구성 + 출처 추적 | 신뢰성/가독성/운영 유연성 확보 |

---

## 8. 참고 자료
- `/Users/doh/Desktop/Storage/1 Projects/Hyean Website Project/README.md`
- `/Users/doh/Desktop/Storage/1 Projects/Hyean Website Project/docs/00_project_scope.md`
- `/Users/doh/Desktop/Storage/1 Projects/Hyean Website Project/docs/01_migration_inventory.md`
- `/Users/doh/Desktop/Storage/1 Projects/Hyean Website Project/docs/02_build_roadmap.md`
- `/Users/doh/Desktop/Storage/1 Projects/Hyean Website Project/content/migration/generated_inventory.md`
- `/Users/doh/Desktop/Storage/1 Projects/Hyean Website Project/apps/hyean-web/src/data/projects.ts`
- `/Users/doh/Desktop/Storage/1 Projects/Hyean Website Project/apps/hyean-web/src/app/for-university/page.tsx`
- `/Users/doh/Desktop/Storage/1 Projects/Hyean Website Project/apps/hyean-web/src/app/for-rise/page.tsx`

---

## 9. 다음 세션 가이드

### 이 파일을 읽은 AI에게:
1. 먼저 "5. 미완료 작업" 섹션을 확인하세요
2. "7. 핵심 결정 사항"의 맥락을 이해하세요
3. 사용자에게 현재 상태를 요약하고 이어서 진행할지 확인하세요

### 사용자에게:
다음 세션에서 이렇게 요청하세요:
```
/Users/doh/Desktop/Storage/1 Projects/Hyean Website Project/_checkpoints/CHECKPOINT_2026-02-19_HYEAN-Website-Rebuild-Corporate.md를 읽고 작업 이어서 해줘
```

---

*이 문서는 #checkpoint 명령으로 자동 생성되었습니다.*

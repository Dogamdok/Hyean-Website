# UI Redesign Checkpoint (2026-02-20 11:37 KST)

## 1) 이번 체크포인트 반영 범위

- 홈 화면 구조 고도화
  - 2컬럼 히어로(메시지 + 실행 신호 패널)
  - Impact Model / Audience / Methodology / Services / Projects 섹션 재배치
- 헤더 UX 개선
  - 모바일 토글 메뉴
  - 현재 경로 active 표시
  - 상단 문의 CTA 추가
- 프로젝트 탐색 UX 개선
  - 검색 + 연도 필터 + 상태 필터 + 결과 수량 + empty state
- 문의 전환 UX 강화
  - 폼 필드 추가: `budgetRange`, `timeline`
  - API 저장 스키마 확장
- 하위 페이지 톤앤매너 통일
  - About / For University / For RISE / Contact / Insights / Project Detail
- 푸터 확장
  - 협업 배너 + Strategic Track 링크 추가
- 글로벌 디자인 시스템 재작성
  - 색/레이아웃/카드/폼/버튼/애니메이션/반응형 전면 정리

## 2) 주요 수정 파일

- `apps/hyean-web/src/app/page.tsx`
- `apps/hyean-web/src/app/globals.css`
- `apps/hyean-web/src/components/site-header.tsx`
- `apps/hyean-web/src/components/site-footer.tsx`
- `apps/hyean-web/src/components/projects-browser.tsx` (new)
- `apps/hyean-web/src/app/projects/page.tsx`
- `apps/hyean-web/src/app/services/page.tsx`
- `apps/hyean-web/src/app/contact/contact-form.tsx`
- `apps/hyean-web/src/app/api/inquiries/route.ts`
- `apps/hyean-web/src/lib/inquiry-store.ts`
- `apps/hyean-web/src/app/about/page.tsx`
- `apps/hyean-web/src/app/for-university/page.tsx`
- `apps/hyean-web/src/app/for-rise/page.tsx`
- `apps/hyean-web/src/app/contact/page.tsx`
- `apps/hyean-web/src/app/insights/page.tsx`
- `apps/hyean-web/src/app/projects/[slug]/page.tsx`

## 3) 검증 결과

- `npm run build` 성공 (Next.js 16.1.1, webpack 모드)
- `curl -I http://localhost:3000` -> `HTTP/1.1 200 OK`
- 로컬 미리보기 URL: `http://localhost:3000`

## 4) 현재 남은 작업(우선순위)

1. 실데이터 확정
   - 홈 핵심 지표/프로젝트 KPI 실제 수치 반영
2. 콘텐츠 완성도
   - 프로젝트 상세 템플릿 문구 정밀화(문제-접근-실행-성과-확장)
3. 전환/운영
   - 문의 폼 스팸 방지 + 알림(메일/슬랙/노션) 연동
4. 신뢰/배포
   - 정책 페이지(개인정보처리방침 등), SEO 메타/OG/Schema 보강

## 5) 재개 커맨드

```bash
cd "apps/hyean-web"
npm run dev
```

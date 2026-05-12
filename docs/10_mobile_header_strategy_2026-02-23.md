# HYEAN Mobile Header Strategy (2026-02-23)

## 1) Problem
- Mobile viewport에서 sticky header가 과도한 높이를 차지해 본문 가시성이 떨어짐.
- 기존 구조는 모바일에서도 `메인 내비 + 전략 칩`이 항상 노출되어 정보 밀도가 과함.

## 2) Evidence-Based Design Findings (2026 기준 운영 참조)
- Android app bar guidance: 작은 상단 바(`Small top app bar`)는 탐색/액션이 많지 않은 화면에 적합하며, `scrollBehavior`로 스크롤 반응을 설계할 수 있음.
- W3C Technique C34: 화면 높이가 부족한 뷰포트(특히 모바일 가로/확대)에서는 sticky 영역이 본문을 과도하게 가릴 수 있어 media query로 un-fix 하는 접근을 권장.
- WAI APG Disclosure Pattern: 버튼 + `aria-expanded` + `aria-controls`로 콘텐츠를 접고 펼치는 패턴이 표준적인 접근성 방식.
- WCAG 2.2 SC 2.5.8: 터치/포인터 타깃은 최소 24x24 CSS px(또는 충분한 간격) 기준을 만족해야 오탭 위험을 낮출 수 있음.
- MDN `env(safe-area-inset-*)`: 노치/비정형 화면에서 상단 안전 영역을 고려해 콘텐츠 가려짐을 방지해야 함.

## 3) Strategy
- 기본 상태는 `Compact Header`로 고정:
  - 로고 + 메뉴 토글 버튼만 노출
  - 주 내비/보조 내비는 접힘 상태
- 필요 시에만 `Expanded Navigation`:
  - 토글 버튼으로 메뉴를 펼침
  - 펼침 상태에서만 메인 링크/전략 칩 표시
- 짧은 높이 환경 보호:
  - `max-height` 미디어쿼리에서 sticky 해제(가로모드/줌 대응)
- 접근성/조작성:
  - `aria-expanded`, `aria-controls` 적용
  - 터치 타깃 최소 44px 수준 확보(권장 여유 포함)
  - 메뉴 오픈 시 배경 스크롤 잠금

## 4) Implemented Changes
- `apps/hyean-web/src/components/site-header.tsx`
  - Client component 전환
  - 모바일 메뉴 토글 상태 관리 추가
  - 라우트 이동 시 메뉴 자동 닫힘
  - `aria-expanded`, `aria-controls` 적용
- `apps/hyean-web/src/app/globals.css`
  - 모바일 기본 헤더를 compact 상태로 변경
  - 모바일에서 `.nav-main`, `.nav-secondary`를 기본 숨김 처리
  - `.site-header.is-open`일 때만 메뉴 표시
  - 메뉴 버튼 시각 상태(햄버거/닫기) 추가
  - `env(safe-area-inset-top)` 적용
  - `@media (max-width: 900px) and (max-height: 540px)`에서 sticky 완화

## 5) Validation
- `npm run build` 통과 (Next.js production build 성공).

## 6) Next Measurement Plan
- 모바일 First Content visibility:
  - 첫 화면에서 Hero 본문 텍스트가 헤더 아래로 충분히 노출되는지 확인
- Interaction:
  - 메뉴 첫 탭 도달 시간, 오탭(잘못된 링크 클릭) 감소 여부 확인
- Scroll ergonomics:
  - 가로모드/짧은 높이에서 콘텐츠 가림 이슈 재발 여부 점검

## References
- Android Developers, App bars  
  https://developer.android.com/develop/ui/compose/components/app-bars
- W3C WAI Technique C34  
  https://www.w3.org/WAI/WCAG21/Techniques/css/C34
- W3C WAI-ARIA APG, Disclosure Pattern  
  https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/
- W3C WCAG 2.2 Understanding SC 2.5.8  
  https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html
- MDN CSS `env()`  
  https://developer.mozilla.org/en-US/docs/Web/CSS/env

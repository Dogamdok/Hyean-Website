# HYEAN SEO · GEO · AEO 완성도 평가 (2026-02-23)

## 평가 요약
- SEO 완성도: 8.4 / 10
- GEO 완성도: 7.6 / 10
- AEO 완성도: 7.8 / 10
- 종합: 7.9 / 10

## 근거 기반 진단
1. SEO (검색엔진 최적화)
- 강점
  - 전역/페이지 메타데이터(`title`, `description`, `canonical`, OG/Twitter)가 구현됨.
  - `robots.txt`, `sitemap.xml`, `rss.xml` 제공.
  - 인사이트 상세 페이지에 `Article`/`BreadcrumbList` 구조화 데이터 적용.
- 보완점
  - 네이버 소유확인 메타는 이번 반영으로 해결됨.
  - 서치어드바이저에서 사이트맵/RSS 제출 및 수집요청 운영은 콘솔 작업이 필요.

2. GEO (생성형 엔진 노출 최적화)
- 강점
  - Organization/WebSite/Article 기반 구조화 데이터가 있어 엔티티 해석 기반이 있음.
  - 출처 필드(`sources`)가 있어 인용 가능한 문서 구조를 만들기 쉬움.
- 보완점
  - 출처 URL가 없는 구형 글 비중이 있어 신뢰 시그널이 고르지 않음.
  - 주제 클러스터(지역활성화·공공협력·성과관리)별 허브 링크 설계가 더 필요함.

3. AEO (질문응답형 노출 최적화)
- 강점
  - 페이지별 요약(excerpt)과 태그가 분리되어 있어 질문형 재가공에 유리함.
  - 문서형 상세 페이지가 있어 답변 단위 추출이 가능함.
- 보완점
  - FAQ형 블록과 Q/A 스타일 문단이 아직 부족함.
  - 각 글의 핵심 결론 섹션(3~5문장 요약)을 표준 템플릿으로 고정하면 개선 여지 큼.

## 이번 턴 반영 사항
- 네이버 검증 메타 추가:
  - `<meta name="naver-site-verification" content="a199d9f3473d15ac3056bfebc611d321fc61eaac" />`
- 연구 기반 인사이트 글 3건 추가:
  - 지역활성화(생활인구/지방소멸대응기금)
  - 공공협력 실행체계(투자계획-평가-환류)
  - AI 검색 대응(SEO/GEO/AEO 통합 운영)

## 다음 우선순위
1. 네이버 Search Advisor에서 사이트맵과 RSS 제출 상태 확인.
2. 인사이트 상세 템플릿에 `핵심 요약`, `자주 묻는 질문` 섹션을 공통화.
3. 서비스/프로젝트 페이지에도 `FAQPage` 또는 Q/A 섹션을 단계적으로 적용.
4. 월 1회 기존 글 업데이트(정책 변경, 데이터 최신화) 운영.

## 참고 문서
- Google SEO Starter Guide
  - https://developers.google.com/search/docs/fundamentals/seo-starter-guide
- Google Structured Data (FAQ)
  - https://developers.google.com/search/docs/appearance/structured-data/faqpage
- Naver Search Advisor 가이드
  - https://searchadvisor.naver.com/guide/faq-start-register
  - https://searchadvisor.naver.com/guide/request-feed
  - https://searchadvisor.naver.com/guide/structured-data-intro
  - https://searchadvisor.naver.com/guide/seo-help
- 행정안전부 지방소멸대응기금
  - https://www.mois.go.kr/frt/sub/a06/b06/localextinctionFund/screen.do

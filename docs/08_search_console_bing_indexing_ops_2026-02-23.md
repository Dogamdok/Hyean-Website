# Search Console + Bing Indexing Ops

> Date: 2026-02-23  
> Scope: HYEAN corporate site indexing operations

## 1) 목표

- 검색엔진 색인 기준선 확보
- 주요 페이지 색인 우선순위 관리
- 월간 색인/노출/클릭 성과를 운영 루틴으로 전환

## 2) 사전 조건

1. `https://hyean.org/robots.txt` 배포 확인
2. `https://hyean.org/sitemap.xml` 배포 확인
3. canonical/meta/JSON-LD 배포 확인

## 3) 인덱싱 타깃 생성

다음 스크립트로 제출 대상 URL 목록을 생성한다.

```bash
cd "/Users/doh/Desktop/Storage/1 Projects/Hyean Website Project"
bash scripts/generate_indexing_targets.sh
```

생성 파일:
- `docs/seo/indexing_targets_YYYYMMDD.txt`
- `docs/seo/indexing_targets_YYYYMMDD.csv`

2026-02-23 생성본:
- `docs/seo/indexing_targets_20260223.txt` (29 URLs)
- `docs/seo/indexing_targets_20260223.csv` (29 URLs)

## 3-1) 배포 전 품질 점검(권장)

인덱싱 제출 전, 메타/구조화데이터/복구 이미지 상태를 자동 점검한다.

```bash
cd "/Users/doh/Desktop/Storage/1 Projects/Hyean Website Project"
bash scripts/seo_aeo_geo_healthcheck.sh http://127.0.0.1:3001
```

점검 항목:
1. 핵심 페이지 HTTP 상태
2. canonical, robots, sitemap, JSON-LD(Service/CollectionPage/Article/BreadcrumbList)
3. 프로젝트 상세 “출처 및 업데이트” 블록 노출
4. 청년마을 복구 이미지(4·5번째) 응답 및 파일 크기

## 4) Google Search Console 운영 절차

1. 속성 등록(도메인 또는 URL prefix)
2. 소유권 검증(DNS TXT 권장)
3. Sitemaps에 `https://hyean.org/sitemap.xml` 제출
4. URL 검사 도구로 대표 페이지 우선 요청:
   - `/`
   - `/projects`
   - 대표 사례 상세 6건
5. Coverage/Pages 리포트에서 다음 상태 분류:
   - Indexed
   - Crawled - currently not indexed
   - Discovered - currently not indexed
6. 1주 후 재점검 및 우선순위 URL 재요청

## 5) Bing Webmaster Tools 운영 절차

1. 사이트 등록 + 소유권 검증
2. Sitemap 제출: `https://hyean.org/sitemap.xml`
3. URL Submission(수동/배치)로 대표 페이지 제출
4. Index Coverage와 Query 리포트 점검

## 6) 우선 제출 큐 (대표 사례)

1. `/projects/seobu-naeryuk-seongjihyeyumgil`
2. `/projects/123-sabi-craft-festa-2024-2025`
3. `/projects/beyond-village-youth-town-buyeo`
4. `/projects/buyeo-youth-tourism-pilot-camp`
5. `/projects/kntc-heritage-plogging-campaign`
6. `/projects/buyeo-garden-book-pop-up-garden`

## 7) 주간 운영 체크리스트

1. robots/sitemap 응답 및 최신성 확인
2. 신규/수정 페이지 canonical 점검
3. 색인 제외 사유 상위 5개 원인 분류
4. 대표 URL 재요청 필요 여부 판단
5. 내부링크 보강 필요 페이지 식별

## 8) 월간 리포트 항목

1. Indexed pages 증감
2. 비브랜드 검색 노출/클릭/CTR 변화
3. 대표 사례 상세 페이지 유입 및 체류시간
4. 문의 페이지 진입 및 완료율 변화

# Hyean Website 런타임 정체 진단 (2026-02-20)

## 1) 증상
- `next dev` 실행 후 `Ready`가 찍혀도 브라우저에서 `localhost:3000`이 열리지 않음.
- 요청 시 무한 대기 또는 타임아웃 발생.
- 시스템 전체적으로 체감 정체(팬/지연) 발생.

## 2) 재현 및 증거
- 환경:
  - macOS `26.2` (Build `25C56`)
  - Node `v25.2.1` (`/opt/homebrew/bin/node`)
  - Next `16.1.1`
- Turbopack build 실패 로그:
  - `/var/folders/zh/z4h2hgm912q0b64xkq93nr140000gn/T/next-panic-d33f5e2a9cbdc34e497ae2fbd01dbf3e.log`
  - 핵심 에러: `creating new process` -> `binding to a port` -> `Operation not permitted (os error 1)`
- Turbopack dev 재현:
  - `next dev --turbopack`은 `Ready` 이후 `curl` 요청이 타임아웃(응답 0 bytes).
- Webpack dev 검증:
  - `next dev --webpack --hostname 127.0.0.1 --port 3000`는 `HTTP/1.1 200 OK` 즉시 응답.

## 3) 시스템 상태 진단
- 초기 부하:
  - `load averages: 3.64 / 34.05 / 45.55` (비정상적으로 높음)
- 정리 후 부하:
  - `load averages: 1.56 / 2.37 / 9.41` (회복)
- 메모리:
  - `memory_pressure -Q` 기준 free `89%` (메모리 병목 아님)
- 디스크:
  - `/System/Volumes/Data` `99%` 사용 (`874GiB / 926GiB`, 여유 `15GiB`)
  - 개발/빌드/인덱싱 성능 저하 유발 가능성이 큼
- 상시 백그라운드 리스너:
  - 보안모듈/동기화/앱 리스너 다수 동작 (25 entries)

## 4) 원인 결론
- 1차 원인(직접):
  - Next 16의 기본 Turbopack 경로에서 프로세스/포트 바인딩 단계가 실패/정체.
- 2차 원인(악화):
  - 데이터 볼륨 여유 공간 부족(99% 사용).
  - 잔류 스캔/빌드 프로세스가 load average를 급상승시켜 체감 정체를 증폭.
- 잠재 리스크:
  - Node `25`(Current, 비-LTS) 사용으로 도구 체인 안정성 저하 가능.

## 5) 적용한 즉시 안정화 조치
- 프로젝트 기본 스크립트를 Webpack 경로로 변경:
  - `apps/hyean-web/package.json`
    - `dev`: `next dev --webpack --hostname 127.0.0.1 --port 3000`
    - `build`: `next build --webpack`
    - `start`: `next start --hostname 127.0.0.1 --port 3000`
    - `dev:turbopack`, `build:turbopack`는 분리 유지
- Node 버전 가이드 추가:
  - `apps/hyean-web/.nvmrc` -> `22`

## 6) 재발 방지 운영안
- 즉시:
  - 항상 `npm run dev`(webpack 기본값) 사용.
  - 서버 미응답 시 Turbopack 실행 여부부터 확인.
- 시스템:
  - 데이터 볼륨 여유 공간을 최소 `60~100GiB` 이상 확보.
  - `Downloads`/대용량 아카이브 정리 우선.
- 런타임:
  - Node를 LTS(`22`)로 통일 후 재설치/재실행.
  - 보안 모듈 상시 실행이 많을 때는 개발 시간대 최소화 권장.

## 7) 확인 명령
```bash
cd "apps/hyean-web"
npm run build
npm run dev
curl -I http://localhost:3000
```

정상 기준: `HTTP/1.1 200 OK`

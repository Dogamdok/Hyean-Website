import type { Metadata } from 'next';
import Link from 'next/link';

const pagePath = '/capabilities/collaboration-execution';
const pageTitle = '공공협력 실행 | HYEAN';
const pageDescription = '다기관 협업 프로젝트에서 이해관계자 정렬, 운영 프로세스, 현장 실행을 연결하는 구조를 소개합니다.';

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  alternates: {
    canonical: pagePath,
  },
  openGraph: {
    title: pageTitle,
    description: pageDescription,
    url: pagePath,
    siteName: 'HYEAN',
    locale: 'ko_KR',
    type: 'website',
    images: [{ url: '/opengraph-image.png', alt: 'HYEAN 공공협력 실행' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: pageTitle,
    description: pageDescription,
    images: ['/twitter-image.png'],
  },
};

export default function CollaborationExecutionPage() {
  return (
    <section className="section">
      <div className="container">
        <span className="eyebrow">Capability</span>
        <h1>공공협력 실행</h1>
        <p>
          혜안은 다양한 기관과 파트너가 참여하는 프로젝트에서 목표, 역할, 의사결정 기준을 정렬해 실행 가능한
          협업 구조를 만듭니다.
        </p>

        <div className="grid-2 section-stack-md">
          <article className="card capability-card">
            <h2>운영 구조</h2>
            <ul className="list">
              <li>이해관계자별 역할과 의사결정 체계 수립</li>
              <li>현장 운영 매뉴얼 및 리스크 체크포인트 설계</li>
              <li>정기 점검 회의와 실행 로그 기반 보정</li>
            </ul>
          </article>
          <article className="card capability-card">
            <h2>성과 방식</h2>
            <ul className="list">
              <li>참여-운영-결과를 연결한 운영 지표 설계</li>
              <li>중간 점검과 최종 보고를 위한 데이터 구조화</li>
              <li>후속 단계 제안에 바로 쓸 수 있는 증빙 체계화</li>
            </ul>
          </article>
        </div>

        <div className="cta-row">
          <Link href="/projects" className="button secondary">
            수행 프로젝트 보기
          </Link>
          <Link href="/contact" className="button">
            협업 구조 상담
          </Link>
        </div>
      </div>
    </section>
  );
}

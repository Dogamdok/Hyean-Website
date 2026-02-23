import type { Metadata } from 'next';
import Link from 'next/link';

const pagePath = '/capabilities/performance-management';
const pageTitle = '성과관리 체계 | HYEAN';
const pageDescription = '운영 데이터, 증빙 문서, 성과 리포트를 하나의 흐름으로 설계하는 혜안의 성과관리 체계를 안내합니다.';

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
    images: [{ url: '/opengraph-image.png', alt: 'HYEAN 성과관리 체계' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: pageTitle,
    description: pageDescription,
    images: ['/twitter-image.png'],
  },
};

export default function PerformanceManagementPage() {
  return (
    <section className="section">
      <div className="container">
        <span className="eyebrow">Capability</span>
        <h1>성과관리 체계</h1>
        <p>
          혜안은 실행 과정에서 발생하는 데이터와 문서를 단순 보관이 아닌 의사결정 자산으로 재구성해 다음 사업
          단계까지 연결합니다.
        </p>

        <div className="grid-2 section-stack-md">
          <article className="card capability-card">
            <h2>성과관리 프레임</h2>
            <ul className="list">
              <li>운영 목표와 지표의 초기 정렬</li>
              <li>차수별 실행 데이터 수집 및 검증</li>
              <li>성과 요약과 확장 시사점 도출</li>
            </ul>
          </article>
          <article className="card capability-card">
            <h2>보고/증빙 체계</h2>
            <ul className="list">
              <li>현장 기록, 산출물, 정량 지표의 연계 관리</li>
              <li>대내외 커뮤니케이션용 리포트 구조화</li>
              <li>재사용 가능한 템플릿 기반 운영 고도화</li>
            </ul>
          </article>
        </div>

        <div className="cta-row">
          <Link href="/projects" className="button secondary">
            성과 사례 보기
          </Link>
          <Link href="/contact" className="button">
            성과관리 문의
          </Link>
        </div>
      </div>
    </section>
  );
}

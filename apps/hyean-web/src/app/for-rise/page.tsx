import Link from 'next/link';
import type { Metadata } from 'next';

const pagePath = '/for-rise';
const pageTitle = '광역협력 실행 파트너 | HYEAN';
const pageDescription = '광역 협력 과제 수행을 위한 실행 구조 및 성과관리 체계 안내 페이지';

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
    images: [{ url: '/opengraph-image.png', alt: 'HYEAN 광역협력 실행 파트너' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: pageTitle,
    description: pageDescription,
    images: ['/twitter-image.png'],
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function RiseCampaignPage() {
  return (
    <section className="section">
      <div className="container">
        <span className="eyebrow">Campaign Landing</span>
        <h1>광역 협력 과제 실행 모델</h1>
        <p>
          지역산업 연계, 청년 참여, 성과관리까지 포함한 실행 구조를 설계해 다기관 협업 프로젝트의 실행 완성도를
          높입니다.
        </p>

        <div className="grid-2 section-stack-md">
          <article className="card capability-card">
            <h2>핵심 가치</h2>
            <ul className="list">
              <li>기관 간 역할과 책임의 명확한 정렬</li>
              <li>교육-실험-성과 리포팅의 일관된 운영 흐름</li>
              <li>중간 점검과 최종 보고를 고려한 KPI 설계</li>
            </ul>
          </article>
          <article className="card capability-card">
            <h2>적용 범위</h2>
            <ul className="list">
              <li>현장형 교육 모듈 운영</li>
              <li>파일럿 실험 프로젝트 운영</li>
              <li>성과지표 설계 및 증빙 리포트 지원</li>
            </ul>
          </article>
        </div>

        <div className="cta-row">
          <Link href="/contact" className="button">
            실행모델 상담 신청
          </Link>
          <Link href="/projects" className="button secondary">
            관련 사례 보기
          </Link>
        </div>
      </div>
    </section>
  );
}

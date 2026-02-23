import Link from 'next/link';
import type { Metadata } from 'next';

const pagePath = '/for-university';
const pageTitle = '대학 연계 실행 파트너 | HYEAN';
const pageDescription = '대학 연계형 지역 프로젝트 운영 파트너십 안내 페이지';

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
    images: [{ url: '/opengraph-image.png', alt: 'HYEAN 대학 연계 실행 파트너' }],
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

export default function UniversityCampaignPage() {
  return (
    <section className="section">
      <div className="container">
        <span className="eyebrow">Campaign Landing</span>
        <h1>대학 연계형 지역 실행 모델</h1>
        <p>
          교육과 실험을 결합한 운영 구조로, 참여자의 학습 결과가 지역 현장 프로젝트로 이어지도록 설계합니다.
        </p>

        <div className="grid-2 section-stack-md">
          <article className="card capability-card">
            <h2>운영 포인트</h2>
            <ul className="list">
              <li>학사 일정과 연동되는 단계형 커리큘럼</li>
              <li>현장 실습과 파일럿 실험의 유기적 연결</li>
              <li>성과보고에 필요한 증빙 구조 동시 구축</li>
            </ul>
          </article>
          <article className="card capability-card">
            <h2>협업 형태</h2>
            <ul className="list">
              <li>실습형 로컬 콘텐츠 기획 프로젝트</li>
              <li>아이디어톤-파일럿 연계 프로그램</li>
              <li>성과공유회 및 포트폴리오 워크숍</li>
            </ul>
          </article>
        </div>

        <div className="cta-row">
          <Link href="/contact" className="button">
            협업 문의
          </Link>
          <Link href="/projects" className="button secondary">
            수행 사례 확인
          </Link>
        </div>
      </div>
    </section>
  );
}

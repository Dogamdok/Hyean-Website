import type { Metadata } from 'next';
import { companyProfile, brandStatement } from '@/data/site';

const pagePath = '/about';
const pageTitle = '회사소개 | HYEAN';
const pageDescription = '혜안의 미션, 핵심가치, 수행 역량, 기업 정보를 확인하세요.';

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
    images: [{ url: '/opengraph-image.png', alt: 'HYEAN 회사소개' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: pageTitle,
    description: pageDescription,
    images: ['/twitter-image.png'],
  },
};

const coreValues = [
  {
    title: '진정성',
    description: '현장 맥락을 깊이 이해하고, 과장 없는 실행 기준으로 프로젝트를 운영합니다.',
  },
  {
    title: '협력',
    description: '대학, 지자체, 지역 파트너가 함께 움직일 수 있는 공동 실행 구조를 설계합니다.',
  },
  {
    title: '지속가능성',
    description: '단기 성과를 넘어 다음 단계까지 이어지는 운영 모델과 성과 체계를 만듭니다.',
  },
];

const capabilities = [
  '지역활성화 사업 전략 수립 및 운영',
  '교육/실험 프로그램 설계 및 퍼실리테이션',
  '브랜딩, 커뮤니케이션, 성과 콘텐츠 제작',
  '공공사업 증빙/리포트 정리 체계 구축',
];

export default function AboutPage() {
  return (
    <section className="section">
      <div className="container">
        <span className="eyebrow">About HYEAN</span>
        <h1>{brandStatement.headline}</h1>
        <p>{brandStatement.subheadline}</p>
        <p className="muted">{brandStatement.mission}</p>

        <div className="grid-3 section-stack-lg">
          {coreValues.map((value) => (
            <article className="card" key={value.title}>
              <h2>{value.title}</h2>
              <p>{value.description}</p>
            </article>
          ))}
        </div>

        <article className="card section-stack-md">
          <h2>주요 수행 역량</h2>
          <ul className="list">
            {capabilities.map((capability) => (
              <li key={capability}>{capability}</li>
            ))}
          </ul>
        </article>

        <article className="card section-stack-md about-company-info" id="credentials">
          <h2>회사 정보</h2>
          <p>
            {companyProfile.legalName} | 대표 {companyProfile.ceo}
          </p>
          <p>사업자등록번호: {companyProfile.businessNumber}</p>
          {companyProfile.credentials?.map((credential) => (
            <p key={credential}>{credential}</p>
          ))}
          <p>본사: {companyProfile.headquarters}</p>
          <p>지사: {companyProfile.branch}</p>
          <p>
            Tel {companyProfile.phone} | Fax {companyProfile.fax}
          </p>
          <p>Email: {companyProfile.email}</p>
        </article>
      </div>
    </section>
  );
}

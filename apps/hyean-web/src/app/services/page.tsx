import type { Metadata } from 'next';
import { services } from '@/data/services';
import { siteUrl } from '@/lib/site-url';

const pagePath = '/services';
const pageTitle = '서비스 | HYEAN';
const pageDescription = '소셜 임팩트 프로젝트의 진단-설계-실행-확산을 아우르는 혜안의 서비스 영역입니다.';

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
    images: [{ url: '/opengraph-image.png', alt: 'HYEAN 서비스' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: pageTitle,
    description: pageDescription,
    images: ['/twitter-image.png'],
  },
};

export default function ServicesPage() {
  const serviceStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'HYEAN 서비스 목록',
    itemListElement: services.map((service, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Service',
        '@id': `${siteUrl}/services#${service.key}`,
        name: service.name,
        description: service.summary,
        serviceType: service.name,
        areaServed: 'KR',
        provider: {
          '@type': 'Organization',
          '@id': `${siteUrl}/#organization`,
        },
        url: `${siteUrl}/services#${service.key}`,
      },
    })),
  };

  return (
    <section className="section">
      <div className="container">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceStructuredData) }}
        />
        <span className="eyebrow">Services</span>
        <h1>전략 수립부터 교육, 기획, 홍보까지</h1>
        <p className="muted">
          소셜 임팩트 창출을 위한 프로젝트를 진단, 설계, 실행, 확산까지 일관된 체계로 제공합니다.
        </p>
        <div className="grid-2">
          {services.map((service) => (
            <article className="card" id={service.key} key={service.key}>
              <h2 className="service-title">{service.name}</h2>
              <p>{service.summary}</p>
              <ul className="list">
                {service.details.map((detail) => (
                  <li key={detail}>{detail}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

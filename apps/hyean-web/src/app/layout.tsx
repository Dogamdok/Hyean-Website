import type { Metadata } from 'next';
import Script from 'next/script';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { companyProfile } from '@/data/site';
import { siteUrl } from '@/lib/site-url';
import './globals.css';

const gaMeasurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim();

const organizationStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': `${siteUrl}/#organization`,
  name: companyProfile.nameEn,
  alternateName: [companyProfile.nameKo, companyProfile.legalName],
  url: companyProfile.website,
  logo: `${siteUrl}/brand/hyean-logo-primary.png`,
  telephone: companyProfile.phone,
  email: companyProfile.email,
  address: {
    '@type': 'PostalAddress',
    streetAddress: companyProfile.headquarters,
    addressCountry: 'KR',
  },
  contactPoint: [
    {
      '@type': 'ContactPoint',
      contactType: 'customer support',
      telephone: companyProfile.phone,
      email: companyProfile.email,
      areaServed: 'KR',
      availableLanguage: ['ko'],
    },
  ],
};

const websiteStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${siteUrl}/#website`,
  url: siteUrl,
  name: 'HYEAN',
  inLanguage: 'ko-KR',
  publisher: {
    '@id': `${siteUrl}/#organization`,
  },
};

export const metadata: Metadata = {
  title: 'HYEAN | 더 나은 세상을 만드는 혜안',
  description:
    '주식회사 혜안은 충남 부여 기반의 지역활성화, 교육, 브랜딩, 프로젝트 운영 전문 파트너입니다.',
  metadataBase: new URL(siteUrl),
  keywords: [
    '혜안',
    '주식회사 혜안',
    '지역활성화',
    '공공협력 실행',
    '성과관리 체계',
    '청년마을',
    '충남 부여',
    '사회적경제',
  ],
  authors: [{ name: companyProfile.nameKo, url: siteUrl }],
  creator: companyProfile.nameKo,
  publisher: companyProfile.nameKo,
  alternates: {
    canonical: '/',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-video-preview': -1,
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/icon.png', type: 'image/png' },
    ],
    apple: [{ url: '/apple-icon.png', type: 'image/png' }],
    shortcut: '/favicon.ico',
  },
  openGraph: {
    title: 'HYEAN | 더 나은 세상을 만드는 혜안',
    description:
      '주식회사 혜안은 지역 기반 프로젝트를 설계-실행-성과관리까지 연결해, 증빙 가능한 결과로 다음 단계를 만듭니다.',
    url: siteUrl,
    siteName: 'HYEAN',
    locale: 'ko_KR',
    type: 'website',
    images: [
      {
        url: '/opengraph-image.png',
        width: 1200,
        height: 630,
        alt: 'HYEAN Solutions for Social Impact',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'HYEAN | 더 나은 세상을 만드는 혜안',
    description:
      '주식회사 혜안은 지역 기반 프로젝트를 설계-실행-성과관리까지 연결해, 증빙 가능한 결과로 다음 단계를 만듭니다.',
    images: ['/twitter-image.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>
        {gaMeasurementId ? (
          <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${gaMeasurementId}`} strategy="afterInteractive" />
            <Script
              id="ga-init"
              strategy="afterInteractive"
              dangerouslySetInnerHTML={{
                __html: `
window.dataLayer = window.dataLayer || [];
function gtag(){window.dataLayer.push(arguments);}
window.gtag = gtag;
gtag('js', new Date());
gtag('config', '${gaMeasurementId}', { anonymize_ip: true });
                `.trim(),
              }}
            />
          </>
        ) : null}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationStructuredData) }}
        />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteStructuredData) }} />
        <SiteHeader />
        <main>{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}

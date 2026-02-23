import type { Metadata } from 'next';
import Link from 'next/link';
import { companyProfile } from '@/data/site';
import { listInsightPosts } from '@/lib/insight-post-store';
import { siteUrl, toAbsoluteUrl } from '@/lib/site-url';
const pagePath = '/insights';
const pageTitle = '인사이트 | HYEAN';
const pageDescription = '지역활성화, 공공협력 실행, 성과관리 체계에 대한 혜안의 인사이트를 확인하세요.';

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
    images: [{ url: '/opengraph-image.png', alt: 'HYEAN Insights' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: pageTitle,
    description: pageDescription,
    images: ['/twitter-image.png'],
  },
};

function formatDateLabel(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value.slice(0, 10);
  }
  return date.toISOString().slice(0, 10);
}

export default async function InsightsPage() {
  const insights = await listInsightPosts({ includeUnpublished: false });

  const insightsStructuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': `${siteUrl}/insights#collection`,
        url: `${siteUrl}/insights`,
        name: 'HYEAN 인사이트',
        description: '지역활성화, 공공협력 실행, 성과관리 체계에 대한 혜안 인사이트 목록',
      },
      {
        '@type': 'ItemList',
        '@id': `${siteUrl}/insights#list`,
        itemListElement: insights.map((post, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          url: `${siteUrl}/insights/${post.slug}`,
          name: post.title,
        })),
      },
      ...insights.map((post) => ({
        '@type': 'Article',
        '@id': `${siteUrl}/insights/${post.slug}#article`,
        headline: post.title,
        description: post.excerpt,
        datePublished: post.createdAt,
        dateModified: post.updatedAt,
        inLanguage: 'ko-KR',
        url: `${siteUrl}/insights/${post.slug}`,
        author: {
          '@type': 'Organization',
          name: post.author || companyProfile.nameKo,
        },
        publisher: {
          '@type': 'Organization',
          name: companyProfile.nameKo,
          logo: {
            '@type': 'ImageObject',
            url: `${siteUrl}/brand/hyean-logo-primary.png`,
          },
        },
        image: toAbsoluteUrl(post.coverImage),
        keywords: post.tags.join(', '),
        ...(post.sources.filter((source) => source.startsWith('http')).length > 0
          ? { citation: post.sources.filter((source) => source.startsWith('http')) }
          : {}),
        isPartOf: {
          '@id': `${siteUrl}/insights#collection`,
        },
      })),
    ],
  };

  return (
    <section className="section">
      <div className="container">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(insightsStructuredData) }} />
        <span className="eyebrow">Insights</span>
        <h1>인사이트</h1>
        <p className="muted">
          API+DB 기반으로 운영되는 혜안 인사이트 목록입니다. 각 글은 상세 페이지와 구조화 데이터가 함께 제공됩니다.
        </p>
        <div className="grid-2">
          {insights.length === 0 ? (
            <article className="card">
              <h2>게시된 인사이트가 아직 없습니다.</h2>
              <p className="muted">n8n 발행 워크플로우로 첫 글을 발행하면 이 목록에 자동 노출됩니다.</p>
            </article>
          ) : (
            insights.map((post) => (
              <article className="card" key={post.slug} id={post.slug}>
                <p className="muted">
                  <time dateTime={post.updatedAt}>{formatDateLabel(post.updatedAt)}</time>
                </p>
                <h2>{post.title}</h2>
                <p>{post.excerpt}</p>
                <p className="muted">{post.category}</p>
                <div className="tag-row">
                  {post.tags.map((tag) => (
                    <span className="tag" key={tag}>
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="cta-row">
                  <Link href={`/insights/${post.slug}`} className="button">
                    상세 보기
                  </Link>
                  {post.sources[0]?.startsWith('http') ? (
                    <a href={post.sources[0]} className="button secondary" target="_blank" rel="noreferrer">
                      원문 URL
                    </a>
                  ) : null}
                </div>
              </article>
            ))
          )}
        </div>
      </div>
    </section>
  );
}

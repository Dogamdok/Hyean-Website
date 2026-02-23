import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { MarkdownContent } from '@/components/markdown-content';
import { companyProfile } from '@/data/site';
import { getInsightPostBySlug } from '@/lib/insight-post-store';
import { siteUrl, toAbsoluteUrl } from '@/lib/site-url';

type PageProps = {
  params: Promise<{ slug: string }>;
};

function isLocalPathLikeSource(source: string): boolean {
  return /^(file:\/\/|\/Users\/|\/home\/|[A-Za-z]:\\)/.test(source);
}

function normalizeDisplaySource(source: string): string {
  if (isLocalPathLikeSource(source)) {
    return '내부 아카이브 자료';
  }
  return source;
}

function formatDateLabel(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value.slice(0, 10);
  }
  return date.toISOString().slice(0, 10);
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getInsightPostBySlug(slug, { includeUnpublished: false });
  if (!post) {
    return {
      title: '인사이트 | HYEAN',
    };
  }

  const canonicalPath = `/insights/${post.slug}`;
  const ogImage = post.coverImage || '/opengraph-image.png';

  return {
    title: `${post.title} | HYEAN`,
    description: post.excerpt,
    keywords: [post.category, ...post.tags],
    alternates: {
      canonical: canonicalPath,
    },
    openGraph: {
      title: `${post.title} | HYEAN`,
      description: post.excerpt,
      url: canonicalPath,
      siteName: 'HYEAN',
      locale: 'ko_KR',
      type: 'article',
      images: [
        {
          url: ogImage,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${post.title} | HYEAN`,
      description: post.excerpt,
      images: [ogImage],
    },
  };
}

export default async function InsightDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getInsightPostBySlug(slug, { includeUnpublished: false });
  if (!post) {
    notFound();
  }

  const canonicalUrl = `${siteUrl}/insights/${post.slug}`;
  const absoluteCoverImage = toAbsoluteUrl(post.coverImage);
  const sanitizedSources = post.sources.map((source) => normalizeDisplaySource(source));
  const sourceCitations = sanitizedSources.filter((source) => source.startsWith('http'));
  const breadcrumbStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: '홈',
        item: siteUrl,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: '인사이트',
        item: `${siteUrl}/insights`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: post.title,
        item: canonicalUrl,
      },
    ],
  };

  const articleStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    '@id': `${canonicalUrl}#article`,
    headline: post.title,
    description: post.excerpt,
    inLanguage: 'ko-KR',
    mainEntityOfPage: canonicalUrl,
    datePublished: post.createdAt,
    dateModified: post.updatedAt,
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
    image: [absoluteCoverImage],
    keywords: [post.category, ...post.tags].join(', '),
    ...(sourceCitations.length > 0 ? { citation: sourceCitations } : {}),
  };

  return (
    <section className="section">
      <div className="container">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbStructuredData) }}
        />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleStructuredData) }} />

        <span className="eyebrow">Insight Detail</span>
        <h1>{post.title}</h1>
        <p className="muted">{post.excerpt}</p>

        <div className="tag-row section-stack-sm">
          <span className="tag">{post.category}</span>
          <span className="tag">작성: {post.author || companyProfile.nameKo}</span>
          <span className="tag">업데이트: {formatDateLabel(post.updatedAt)}</span>
        </div>

        <div className="insight-cover-wrap section-stack-md">
          <img src={toAbsoluteUrl(post.coverImage)} alt={post.title} loading="lazy" className="insight-cover-image" />
        </div>

        <article className="card section-stack-md insight-detail-card">
          <MarkdownContent content={post.content} />
        </article>

        {sanitizedSources.length > 0 ? (
          <article className="card section-stack-md insight-source-card">
            <h2>출처</h2>
            <ul className="list">
              {sanitizedSources.map((source, index) => (
                <li key={`${source}-${index}`}>
                  {source.startsWith('http') ? (
                    <a href={source} target="_blank" rel="noreferrer">
                      {source}
                    </a>
                  ) : (
                    source
                  )}
                </li>
              ))}
            </ul>
          </article>
        ) : null}

        <div className="cta-row">
          <Link href="/insights" className="button secondary">
            인사이트 목록
          </Link>
          <Link href="/contact" className="button">
            관련 프로젝트 문의
          </Link>
        </div>
      </div>
    </section>
  );
}

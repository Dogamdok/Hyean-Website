import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { projectMap, projects, projectSlugAliases } from '@/data/projects';
import { ProjectImageCarousel } from '@/components/project-image-carousel';
import { companyProfile, experienceConfig } from '@/data/site';
import { siteUrl, toAbsoluteUrl } from '@/lib/site-url';
import { getYouTubeEmbedUrl } from '@/lib/youtube';

type PageProps = {
  params: Promise<{ slug: string }>;
};

const fallbackUpdatedDate = '2026-02-23';

function getLatestYearLabel(value: string): string | null {
  const years = value.match(/\d{4}/g);
  if (!years || years.length === 0) return null;
  return years.sort().at(-1) ?? null;
}

function getProjectUpdatedAt(periodOrYear: string, updatedAt?: string): string {
  if (updatedAt && /^\d{4}-\d{2}-\d{2}$/.test(updatedAt)) {
    return updatedAt;
  }

  const latestYear = getLatestYearLabel(periodOrYear);
  return latestYear ? `${latestYear}-12-31` : fallbackUpdatedDate;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const resolvedSlug = projectSlugAliases[slug] ?? slug;
  const project = projectMap.get(resolvedSlug);

  if (!project) {
    return {
      title: '프로젝트 | HYEAN',
    };
  }

  const canonicalPath = `/projects/${resolvedSlug}`;
  const ogImage =
    (project.imageUrls && project.imageUrls.length > 0 ? project.imageUrls[0] : project.imageUrl) ?? '/opengraph-image.png';

  return {
    title: `${project.title} | HYEAN`,
    description: project.summary,
    keywords: [project.challengeType, project.engagementType, ...project.focus],
    alternates: {
      canonical: canonicalPath,
    },
    openGraph: {
      title: `${project.title} | HYEAN`,
      description: project.summary,
      url: canonicalPath,
      siteName: 'HYEAN',
      locale: 'ko_KR',
      type: 'article',
      images: [
        {
          url: ogImage,
          alt: project.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${project.title} | HYEAN`,
      description: project.summary,
      images: [ogImage],
    },
  };
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const aliasTarget = projectSlugAliases[slug];

  if (aliasTarget) {
    redirect(`/projects/${aliasTarget}`);
  }

  const project = projectMap.get(slug);
  if (!project) {
    notFound();
  }

  const periodLabel = project.period || project.year || '기간 정보 확인 필요';
  const embedUrl = getYouTubeEmbedUrl(project.youtubeUrl);
  const imageSources =
    project.imageUrls && project.imageUrls.length > 0 ? project.imageUrls : project.imageUrl ? [project.imageUrl] : [];
  const showPhotoArchive = experienceConfig.showProjectImages && imageSources.length > 0 && Boolean(project.hasImageAsset);
  const canonicalUrl = `${siteUrl}/projects/${project.slug}`;
  const absoluteImages = imageSources.map((src) => toAbsoluteUrl(src));
  const lastUpdated = getProjectUpdatedAt(project.year ?? project.period, project.updatedAt);
  const publishYear = (project.year ?? project.period)?.match(/\d{4}/)?.[0];
  const publishedAt = publishYear ? `${publishYear}-01-01` : undefined;
  const sourceCitationsBase =
    project.sourceCitations && project.sourceCitations.length > 0
      ? project.sourceCitations
      : project.sources.map((source) => ({
          label: source,
          url: source.startsWith('http') ? source : undefined,
          type: source.startsWith('http') ? ('external' as const) : ('internal' as const),
        }));
  const sourceCitations =
    sourceCitationsBase.length > 0
      ? sourceCitationsBase
      : [
          {
            label: '내부 프로젝트 운영 기록',
            type: 'internal' as const,
          },
        ];
  const citationLinks = sourceCitations.map((citation) => citation.url).filter((url): url is string => Boolean(url));
  const evidenceStatement =
    project.evidenceStatement ??
    `${project.proofLine} 세부 수치와 근거는 아래 핵심 지표 및 출처 항목을 기준으로 관리됩니다.`;
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
        name: '프로젝트',
        item: `${siteUrl}/projects`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: project.title,
        item: canonicalUrl,
      },
    ],
  };
  const projectStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    '@id': `${canonicalUrl}#article`,
    headline: project.title,
    description: project.summary,
    inLanguage: 'ko-KR',
    mainEntityOfPage: canonicalUrl,
    ...(publishedAt ? { datePublished: publishedAt } : {}),
    dateModified: lastUpdated,
    author: {
      '@type': 'Organization',
      name: companyProfile.nameKo,
      url: companyProfile.website,
    },
    publisher: {
      '@type': 'Organization',
      name: companyProfile.nameKo,
      logo: {
        '@type': 'ImageObject',
        url: `${siteUrl}/brand/hyean-logo-primary.png`,
      },
    },
    image: absoluteImages.length > 0 ? absoluteImages : [toAbsoluteUrl('/opengraph-image.png')],
    about: project.focus.map((item) => ({ '@type': 'Thing', name: item })),
    keywords: [project.challengeType, project.engagementType, ...project.focus].join(', '),
    ...(citationLinks.length > 0 ? { citation: citationLinks } : {}),
  };

  const relatedProjects = projects
    .filter((item) => item.slug !== project.slug)
    .sort((a, b) => {
      const score = (target: (typeof projects)[number]) =>
        Number(target.challengeType === project.challengeType) * 2 +
        Number(target.engagementType === project.engagementType) +
        Number(target.portfolioTier === 'featured');
      return score(b) - score(a);
    })
    .slice(0, 3);

  return (
    <section className="section">
      <div className="container">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbStructuredData) }}
        />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(projectStructuredData) }} />

        <span className="eyebrow">Project Detail</span>
        <h1>{project.title}</h1>
        <p>{project.summary}</p>

        <div className="tag-row section-stack-sm">
          <span className="tag">{project.challengeType}</span>
          <span className="tag">{project.engagementType}</span>
          <span className="tag">{project.role}</span>
        </div>

        <div className="project-info-grid section-stack-md">
          <article className="project-info-card">
            <p className="project-info-label">기간</p>
            <p className="project-info-value">{periodLabel}</p>
          </article>
          <article className="project-info-card">
            <p className="project-info-label">지역</p>
            <p className="project-info-value">{project.region}</p>
          </article>
          <article className="project-info-card">
            <p className="project-info-label">주체</p>
            <p className="project-info-value">{project.client}</p>
          </article>
          <article className="project-info-card">
            <p className="project-info-label">포트폴리오 구분</p>
            <p className="project-info-value">
              {project.portfolioTier === 'featured' ? '대표 사례' : '아카이브 사례'}
            </p>
          </article>
        </div>

        <div className="grid-2 section-stack-md">
          <article className="card project-detail-card">
            <h2>문제와 목표</h2>
            <p>{project.overview}</p>
            <p className="proof-line">{project.proofLine}</p>
          </article>
          <article className="card project-detail-card">
            <h2>수행 방식</h2>
            <ul className="list">
              {project.execution.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
        </div>

        <div className="grid-2 section-stack-md">
          <article className="card project-detail-card">
            <h2>핵심 결과</h2>
            <ul className="list">
              {project.results.map((result) => (
                <li key={result}>{result}</li>
              ))}
            </ul>
          </article>
          <article className="card project-detail-card">
            <h2>운영 포인트</h2>
            <div className="tag-row">
              {project.focus.map((item) => (
                <span key={item} className="tag">
                  {item}
                </span>
              ))}
            </div>
          </article>
        </div>

        <article className="project-media-card section-stack-md">
          <h2>프로젝트 미디어</h2>
          {showPhotoArchive || embedUrl ? (
            <div className="project-media-grid">
              {showPhotoArchive ? (
                <div className="project-media-block">
                  <p className="project-media-label">현장 사진</p>
                  <ProjectImageCarousel
                    images={imageSources}
                    alt={project.title}
                    variant="detail"
                    sizes="(max-width: 900px) 100vw, 1100px"
                    fit={project.imageFitMode ?? 'contain'}
                    backdropColor={project.imageBackdropColor}
                  />
                </div>
              ) : null}

              {embedUrl ? (
                <div className="project-media-block">
                  <p className="project-media-label">영상 아카이브</p>
                  <div className="project-media-wrap">
                    <iframe
                      src={embedUrl}
                      title={`${project.title} 영상`}
                      loading="lazy"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      referrerPolicy="strict-origin-when-cross-origin"
                      allowFullScreen
                    />
                  </div>
                </div>
              ) : null}
            </div>
          ) : (
            <div className="project-media-placeholder">
              <p>이미지/영상 아카이브가 준비되지 않은 사례입니다.</p>
              <p className="muted">추가 자료를 주시면 슬라이드형 미디어 블록으로 연결할 수 있습니다.</p>
            </div>
          )}
        </article>

        {project.metrics && project.metrics.length > 0 ? (
          <article className="card project-detail-card section-stack-md">
            <h2>핵심 지표</h2>
            <div className="grid-3 section-stack-sm">
              {project.metrics.map((metric) => (
                <div key={`${metric.label}-${metric.value}`}>
                  <p className="muted metric-label">{metric.label}</p>
                  <p className="metric-value">{metric.value}</p>
                </div>
              ))}
            </div>
          </article>
        ) : null}

        <article className="card project-detail-card section-stack-md">
          <h2>출처 및 업데이트</h2>
          <p className="project-evidence-statement">{evidenceStatement}</p>
          <p className="muted">마지막 업데이트: {lastUpdated}</p>
          <ul className="list">
            {sourceCitations.map((citation) => (
              <li key={`${citation.label}-${citation.url ?? 'internal'}`}>
                {citation.url ? (
                  <a href={citation.url} target="_blank" rel="noreferrer">
                    {citation.label}
                  </a>
                ) : (
                  citation.label
                )}
                {citation.type === 'internal' ? <span className="muted"> (내부 근거)</span> : null}
              </li>
            ))}
          </ul>
        </article>

        <article className="section-stack-md">
          <h2>연계 사례</h2>
          <div className="project-related-grid">
            {relatedProjects.map((item) => (
              <div key={item.slug} className="project-related-item">
                <p className="muted">
                  {item.period} · {item.region}
                </p>
                <h3>{item.title}</h3>
                <p className="muted">{item.proofLine}</p>
                <Link href={`/projects/${item.slug}`} className="card-link">
                  사례 보기
                </Link>
              </div>
            ))}
          </div>
        </article>

        <div className="cta-row">
          <Link href="/projects" className="button secondary">
            목록으로
          </Link>
          <Link href="/contact" className="button">
            유사 프로젝트 문의
          </Link>
        </div>
      </div>
    </section>
  );
}

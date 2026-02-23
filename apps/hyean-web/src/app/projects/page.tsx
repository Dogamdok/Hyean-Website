import type { Metadata } from 'next';
import Link from 'next/link';
import { archiveProjects, featuredProjects } from '@/data/projects';
import { ProjectCard } from '@/components/project-card';
import { ProjectImageCarousel } from '@/components/project-image-carousel';
import { experienceConfig } from '@/data/site';
import { getYouTubeEmbedUrl } from '@/lib/youtube';
import { siteUrl } from '@/lib/site-url';

const pagePath = '/projects';
const pageTitle = '프로젝트 | HYEAN';
const pageDescription = '혜안이 수행한 공공협력, 교육 실험, 지역 캠페인, 체류형 프로젝트 사례를 확인하세요.';

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
    images: [{ url: '/opengraph-image.png', alt: 'HYEAN 프로젝트' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: pageTitle,
    description: pageDescription,
    images: ['/twitter-image.png'],
  },
};

export default function ProjectsPage() {
  const archivePriority = ['hansan-mosi-festival-master-planning', 'gongju-buyeo-cheongyang-youth-exchange-project'];
  const orderedArchiveProjects = [...archiveProjects].sort((a, b) => {
    const rankA = archivePriority.indexOf(a.slug);
    const rankB = archivePriority.indexOf(b.slug);
    const safeRankA = rankA === -1 ? Number.POSITIVE_INFINITY : rankA;
    const safeRankB = rankB === -1 ? Number.POSITIVE_INFINITY : rankB;
    return safeRankA - safeRankB;
  });
  const allPortfolioProjects = [...featuredProjects, ...orderedArchiveProjects];
  const projectCollectionStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': `${siteUrl}/projects#collection`,
    name: 'HYEAN 프로젝트 포트폴리오',
    url: `${siteUrl}/projects`,
    inLanguage: 'ko-KR',
    isPartOf: {
      '@id': `${siteUrl}/#website`,
    },
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: allPortfolioProjects.map((project, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@type': 'CreativeWork',
          '@id': `${siteUrl}/projects/${project.slug}`,
          name: project.title,
          description: project.summary,
          url: `${siteUrl}/projects/${project.slug}`,
          temporalCoverage: project.period,
          creator: {
            '@type': 'Organization',
            '@id': `${siteUrl}/#organization`,
          },
          keywords: [project.challengeType, project.engagementType, ...project.focus].join(', '),
        },
      })),
    },
  };

  return (
    <section className="section">
      <div className="container">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(projectCollectionStructuredData) }}
        />
        <span className="eyebrow">Portfolio</span>
        <h1>프로젝트 포트폴리오</h1>
        <p className="muted">
          공공협력, 교육형 실험, 지역 캠페인, 체류형 프로젝트까지 혜안의 실행 이력을 대표 사례와 아카이브로
          구분해 정리했습니다.
        </p>

        <div className="section-stack-lg">
          <span className="eyebrow">Featured Cases</span>
          <h2>대표 사례</h2>
          <div className="grid-3 section-stack-md">
            {featuredProjects.map((project, index) => (
              <ProjectCard key={project.slug} project={project} priorityImage={index < 3} />
            ))}
          </div>
        </div>

        <div className="section-stack-lg">
          <span className="eyebrow">Archive</span>
          <h2>프로젝트 아카이브</h2>
          <div className="portfolio-archive-grid section-stack-md">
            {orderedArchiveProjects.map((project) => {
              const imageSources =
                project.imageUrls && project.imageUrls.length > 0 ? project.imageUrls : project.imageUrl ? [project.imageUrl] : [];
              const showPhotoMedia =
                experienceConfig.showProjectImages && Boolean(project.hasImageAsset) && imageSources.length > 0;
              const videoEmbedUrl = getYouTubeEmbedUrl(project.youtubeUrl);

              return (
                <article key={project.slug} className="portfolio-archive-item">
                  {showPhotoMedia ? (
                    <div className="portfolio-archive-media">
                      <ProjectImageCarousel
                        images={imageSources}
                        alt={project.title}
                        variant="archive"
                        sizes="(max-width: 900px) 100vw, 50vw"
                        fit={project.imageFitMode ?? 'cover'}
                        backdropColor={project.imageBackdropColor}
                      />
                    </div>
                  ) : videoEmbedUrl ? (
                    <div className="portfolio-archive-media portfolio-archive-video">
                      <iframe
                        src={videoEmbedUrl}
                        title={`${project.title} 영상 미리보기`}
                        loading="lazy"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        referrerPolicy="strict-origin-when-cross-origin"
                        allowFullScreen
                      />
                    </div>
                  ) : null}

                  <p className="portfolio-archive-meta">
                    {project.period} · {project.region}
                  </p>
                  <h3>{project.title}</h3>
                  <p className="muted">{project.proofLine}</p>
                  <div className="portfolio-archive-action">
                    <Link href={`/projects/${project.slug}`} className="card-link">
                      상세 보기
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        </div>

        <div className="cta-row">
          <Link href="/spaces" className="button secondary">
            공간과 시설 보기
          </Link>
          <Link href="/contact" className="button">
            프로젝트 문의하기
          </Link>
        </div>
      </div>
    </section>
  );
}

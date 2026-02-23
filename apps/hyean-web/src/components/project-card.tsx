import Link from 'next/link';
import type { ProjectCase } from '@/types/content';
import { experienceConfig } from '@/data/site';
import { ProjectImageCarousel } from '@/components/project-image-carousel';

type ProjectCardProps = {
  project: ProjectCase;
  priorityImage?: boolean;
};

export function ProjectCard({ project, priorityImage = false }: ProjectCardProps) {
  const imageSources =
    project.imageUrls && project.imageUrls.length > 0 ? project.imageUrls : project.imageUrl ? [project.imageUrl] : [];
  const showImage = experienceConfig.showProjectImages && imageSources.length > 0 && Boolean(project.hasImageAsset);
  const periodLabel = project.period || project.year || '기간 정보 확인 중';
  const hasVideo = Boolean(project.youtubeUrl);
  const imageFitMode = project.imageFitMode ?? 'cover';
  const imageBackdropColor = project.imageBackdropColor;

  return (
    <article className="card">
      {showImage ? (
        <div className="card-image-wrap">
          <ProjectImageCarousel
            images={imageSources}
            alt={project.title}
            priority={priorityImage}
            variant="card"
            fit={imageFitMode}
            backdropColor={imageBackdropColor}
          />
        </div>
      ) : (
        <div className="card-image-placeholder" aria-hidden="true">
          <p className="card-placeholder-year">{periodLabel}</p>
          <p className="card-placeholder-challenge">{project.challengeType}</p>
          <p className="card-placeholder-region">{project.region}</p>
        </div>
      )}
      <div className="card-meta">
        <span>{periodLabel}</span>
        <span>{project.region}</span>
      </div>
      <div className="card-meta-secondary">
        <span>{project.challengeType}</span>
        <span>{project.engagementType}</span>
      </div>
      <h3 className="card-title">
        <Link href={`/projects/${project.slug}`}>{project.title}</Link>
      </h3>
      <p className="card-summary">{project.summary}</p>
      <div className="card-badge-row">
        <span className="card-badge">{project.portfolioTier === 'featured' ? '대표 사례' : '아카이브'}</span>
        <span className={`card-badge ${hasVideo ? 'card-badge-video' : ''}`}>
          {hasVideo ? '영상 아카이브' : '포스터/현장기록 준비중'}
        </span>
      </div>
      <div className="tag-row">
        {project.focus.map((tag) => (
          <span key={tag} className="tag">
            {tag}
          </span>
        ))}
      </div>
    </article>
  );
}

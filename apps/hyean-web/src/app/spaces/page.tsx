import type { Metadata } from 'next';
import Link from 'next/link';
import { BedDouble, Building2, FlaskConical, House, MapPin, Wrench, type LucideIcon } from 'lucide-react';
import { spaces } from '@/data/spaces';
import { projectMap } from '@/data/projects';

const pagePath = '/spaces';
const pageTitle = '공간과 시설 | HYEAN';
const pageDescription = '혜안이 운영하는 로컬 거점 공간과 실험 시설 정보를 확인하세요.';

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
    images: [{ url: '/opengraph-image.png', alt: 'HYEAN 공간과 시설' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: pageTitle,
    description: pageDescription,
    images: ['/twitter-image.png'],
  },
};

export default function SpacesPage() {
  const facilitiesCount = spaces.reduce((sum, space) => sum + (space.facilities?.length ?? 0), 0);
  const spaceRoleMeta: Record<string, { icon: LucideIcon; title: string; description: string }> = {
    'beyond-village': {
      icon: BedDouble,
      title: '체류형 운영 거점',
      description: '프로그램 참여자의 숙박, 교류, 전시가 이어지는 메인 베이스입니다.',
    },
    'beyond-lab': {
      icon: FlaskConical,
      title: '순환 실험 인프라',
      description: '새활용·수선·메이킹 중심의 실습형 실험 공간입니다.',
    },
    'beyond-house': {
      icon: House,
      title: '중기 정착 지원 공간',
      description: '단기 체류 이후 중기 거주와 프로젝트 지속을 연결합니다.',
    },
  };

  const spaceFacts = [
    { label: '운영 공간', value: `${spaces.length}곳`, icon: Building2 },
    { label: '핵심 설비', value: `${facilitiesCount}종`, icon: Wrench },
    { label: '주요 거점', value: '충남 부여', icon: MapPin },
  ] as const;

  return (
    <section className="section">
      <div className="container">
        <span className="eyebrow">Spaces & Facilities</span>
        <h1>공간과 시설</h1>
        <p className="muted">
          혜안은 프로젝트 실행을 위한 로컬 거점 공간과 실험 인프라를 직접 운영합니다. 공간 자체가 프로그램의
          일부로 작동하도록 설계되어 있습니다.
        </p>

        <div className="space-overview-grid section-stack-md">
          {spaceFacts.map((fact) => {
            const Icon = fact.icon;
            return (
              <article key={fact.label} className="space-overview-card">
                <Icon className="space-overview-icon" aria-hidden="true" />
                <p className="space-overview-label">{fact.label}</p>
                <p className="space-overview-value">{fact.value}</p>
              </article>
            );
          })}
        </div>

        <div className="grid-3 section-stack-md space-cards-grid">
          {spaces.map((space) => {
            const roleMeta = spaceRoleMeta[space.slug];
            const RoleIcon = roleMeta?.icon;

            return (
              <article key={space.slug} className="card space-card">
                {roleMeta && RoleIcon ? (
                  <div className="space-role-panel">
                    <RoleIcon className="space-role-icon" aria-hidden="true" />
                    <div>
                      <p className="space-role-title">{roleMeta.title}</p>
                      <p className="space-role-description">{roleMeta.description}</p>
                    </div>
                  </div>
                ) : null}

                <h2 className="space-title">{space.name}</h2>
                <p className="space-address">{space.address}</p>
                <p>{space.summary}</p>

                <h3 className="space-subtitle">핵심 기능</h3>
                <ul className="list">
                  {space.features.map((feature) => (
                    <li key={feature}>{feature}</li>
                  ))}
                </ul>

                {space.facilities && space.facilities.length > 0 ? (
                  <>
                    <h3 className="space-subtitle">보유 설비</h3>
                    <ul className="list">
                      {space.facilities.map((facility) => (
                        <li key={facility}>{facility}</li>
                      ))}
                    </ul>
                  </>
                ) : null}

                {space.relatedProjectSlugs && space.relatedProjectSlugs.length > 0 ? (
                  <div className="section-stack-sm">
                    <h3 className="space-subtitle">연계 프로젝트</h3>
                    <div className="tag-row">
                      {space.relatedProjectSlugs.map((slug) => {
                        const project = projectMap.get(slug);
                        if (!project) return null;
                        return (
                          <Link key={slug} href={`/projects/${slug}`} className="tag-link">
                            {project.title}
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                ) : null}
              </article>
            );
          })}
        </div>

        <div className="cta-row">
          <Link href="/contact" className="button">
            공간/시설 협업 문의
          </Link>
        </div>
      </div>
    </section>
  );
}

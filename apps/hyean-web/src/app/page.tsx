import Link from 'next/link';
import { Compass, Network, ShieldCheck } from 'lucide-react';
import { featuredProjects } from '@/data/projects';
import { brandStatement } from '@/data/site';
import { ProjectCard } from '@/components/project-card';

const challengeMatrix = [
  {
    title: '참여는 높지만 실행이 끊기는 경우',
    response: '교육-실험-후속 실행을 한 흐름으로 재설계해 운영 단절을 줄입니다.',
    proof: '단계별 운영 로그와 후속 로드맵 동시 제공',
    icon: Compass,
  },
  {
    title: '기관 간 협업은 많지만 정렬이 안 되는 경우',
    response: '역할, 의사결정, 일정 기준을 명확히 정리한 협업 구조를 만듭니다.',
    proof: '이해관계자별 역할표와 운영 프로토콜 체계화',
    icon: Network,
  },
  {
    title: '성과는 있었지만 증빙과 확산이 어려운 경우',
    response: '현장 데이터와 결과 문서를 연결해 재사용 가능한 성과 구조를 설계합니다.',
    proof: '리포트용 지표 묶음과 실행 증빙 패키지 제공',
    icon: ShieldCheck,
  },
] as const;

const capabilityCards = [
  {
    title: '교육·실험 설계',
    description: '참여자 경험과 현장 실험을 결합한 운영 시퀀스를 만듭니다.',
    href: '/capabilities/learning-execution',
  },
  {
    title: '공공협력 실행',
    description: '다기관 참여 구조에서 역할과 책임을 정렬해 실행력을 높입니다.',
    href: '/capabilities/collaboration-execution',
  },
  {
    title: '성과관리 체계',
    description: '운영 데이터와 증빙 문서를 연결해 다음 단계 의사결정에 활용합니다.',
    href: '/capabilities/performance-management',
  },
] as const;

const executionModel = [
  {
    step: '01 진단',
    title: '프로젝트 맥락 정의',
    output: '우선과제, 이해관계자 맵, 실행 범위',
  },
  {
    step: '02 설계',
    title: '운영 시퀀스 설계',
    output: '운영안, 역할표, 지표 프레임',
  },
  {
    step: '03 실행',
    title: '현장 운영 및 보정',
    output: '차수별 로그, 피드백 반영 내역',
  },
  {
    step: '04 정리',
    title: '성과 구조화',
    output: '리포트, 증빙 묶음, 후속 제안',
  },
] as const;

const faqItems = [
  {
    question: '혜안은 어떤 문제를 주로 해결하나요?',
    answer:
      '기관 간 협업 정렬, 실행 단절, 성과 증빙 부족 같은 현장 문제를 교육·실험·성과관리 구조로 연결해 해결합니다.',
  },
  {
    question: '프로젝트는 어떤 방식으로 진행되나요?',
    answer:
      '진단 → 설계 → 실행 → 성과 구조화의 4단계로 운영하며, 단계별 산출물과 의사결정 기준을 함께 제공합니다.',
  },
  {
    question: '문의하면 얼마나 빨리 회신받을 수 있나요?',
    answer: '영업일 기준 1~2일 내 1차 회신을 원칙으로 하며, 과제 맥락에 맞는 초기 실행 제안까지 안내합니다.',
  },
] as const;

export default function HomePage() {
  const featuredCases = featuredProjects.slice(0, 4);
  const evidenceRail = [
    { label: '주요 사업 분야', value: '공공협력 · 교육실험 · 지역캠페인' },
    { label: '핵심 지역축', value: '충남·충청권' },
    { label: '실행 방식', value: '교육·실험·성과 루프' },
    { label: '조직 정체성', value: '인증 사회적기업 · 사회연대경제조직' },
  ];
  const faqStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };

  return (
    <>
      <section className="section hero-section">
        <div className="container hero-grid">
          <div className="hero-main">
            <span className="eyebrow">HYEAN Impact Practice</span>
            <h1 className="hero-title">{brandStatement.headline}</h1>
            <p className="hero-lead">{brandStatement.subheadline}</p>
            <p className="muted hero-description">{brandStatement.mission}</p>
            <div className="hero-marker-list">
              <p>현장 중심 실행 설계</p>
              <p>다기관 협업 운영</p>
              <p>성과관리 및 증빙 체계화</p>
            </div>
            <div className="cta-row">
              <Link href="/projects" className="button">
                수행 사례 보기
              </Link>
              <Link href="/contact" className="button secondary">
                협업 문의하기
              </Link>
            </div>
          </div>
          <aside className="hero-evidence-rail" aria-label="핵심 근거">
            {evidenceRail.map((item) => (
              <article key={item.label} className="hero-evidence-card">
                <p className="hero-evidence-label">{item.label}</p>
                <p className="hero-evidence-value">{item.value}</p>
              </article>
            ))}
            <article className="hero-evidence-card hero-evidence-card-accent">
              <p className="hero-evidence-label">운영 원칙</p>
              <p className="hero-evidence-value">문제정의 → 실행 → 증빙 → 확장</p>
            </article>
          </aside>
        </div>
      </section>

      <section className="section section-tight">
        <div className="container">
          <span className="eyebrow">What We Solve</span>
          <h2>복잡한 과제를 실행 구조로 전환합니다</h2>
          <div className="grid-3 challenge-grid">
            {challengeMatrix.map((item) => {
              const Icon = item.icon;
              return (
                <article key={item.title} className="card challenge-card">
                  <div className="challenge-head">
                    <Icon className="challenge-icon" aria-hidden="true" />
                    <span className="challenge-icon-bar" aria-hidden="true" />
                  </div>
                  <h3 className="challenge-title">{item.title}</h3>
                  <p>{item.response}</p>
                  <p className="muted challenge-proof">{item.proof}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container">
          <span className="eyebrow">Case Filmstrip</span>
          <h2>최근 수행 트랙</h2>
          <div className="case-filmstrip" role="list" aria-label="사례 요약">
            {featuredCases.map((project) => (
              <article key={project.slug} className="case-strip-card" role="listitem">
                <p className="case-strip-meta">
                  {project.period} · {project.region}
                </p>
                <h3>{project.title}</h3>
                <p>{project.proofLine}</p>
                <div className="tag-row">
                  <span className="tag">{project.challengeType}</span>
                  <span className="tag">{project.engagementType}</span>
                </div>
                <Link href={`/projects/${project.slug}`} className="card-link">
                  사례 상세 보기
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <span className="eyebrow">Execution Model</span>
          <h2>실행 모델</h2>
          <div className="grid-2 execution-grid">
            {executionModel.map((item) => (
              <article className="card execution-card" key={item.step}>
                <p className="execution-step">{item.step}</p>
                <h3>{item.title}</h3>
                <p className="muted">{item.output}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container">
          <span className="eyebrow">FAQ</span>
          <h2>자주 묻는 질문</h2>
          <div className="faq-list">
            {faqItems.map((item) => (
              <article key={item.question} className="faq-item">
                <h3>{item.question}</h3>
                <p>{item.answer}</p>
              </article>
            ))}
          </div>
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqStructuredData) }} />
        </div>
      </section>

      <section className="section section-alt">
        <div className="container">
          <span className="eyebrow">Capabilities</span>
          <h2>핵심 역량</h2>
          <div className="grid-3 audience-grid">
            {capabilityCards.map((card) => (
              <article className="card audience-card" key={card.title}>
                <h3>{card.title}</h3>
                <p>{card.description}</p>
                <Link href={card.href} className="card-link">
                  자세히 보기
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-tight">
        <div className="container">
          <div className="final-cta">
            <h2>우리 지역 프로젝트에 맞는 실행 모델이 필요한가요?</h2>
            <p className="muted">
              현재 과제, 일정, 기대성과를 공유해 주시면 초기 진단과 실행 구조 제안을 빠르게 드립니다.
            </p>
            <div className="cta-row">
              <Link href="/contact" className="button">
                초기 진단 문의
              </Link>
              <Link href="/projects" className="button secondary">
                사례 먼저 확인하기
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <span className="eyebrow">Selected Cases</span>
          <h2>대표 사례</h2>
          <div className="grid-3">
            {featuredCases.slice(0, 3).map((project, index) => (
              <ProjectCard key={project.slug} project={project} priorityImage={index === 0} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

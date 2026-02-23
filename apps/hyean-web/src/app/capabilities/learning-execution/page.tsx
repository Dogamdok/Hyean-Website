import type { Metadata } from 'next';
import Link from 'next/link';

const pagePath = '/capabilities/learning-execution';
const pageTitle = '교육·실험 설계 | HYEAN';
const pageDescription = '현장형 교육과 실험 프로젝트를 설계하고 운영해 실행 가능한 결과를 만드는 협업 구조를 소개합니다.';

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
    images: [{ url: '/opengraph-image.png', alt: 'HYEAN 교육·실험 설계' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: pageTitle,
    description: pageDescription,
    images: ['/twitter-image.png'],
  },
};

export default function LearningExecutionPage() {
  return (
    <section className="section">
      <div className="container">
        <span className="eyebrow">Capability</span>
        <h1>교육·실험 설계</h1>
        <p>
          혜안은 학습 과정과 현장 실험을 하나의 운영 시퀀스로 연결해, 참여자의 아이디어가 실제 지역 실행으로
          이어지도록 설계합니다.
        </p>

        <div className="grid-2 section-stack-md">
          <article className="card capability-card">
            <h2>핵심 접근</h2>
            <ul className="list">
              <li>기초-심화-실험 단계형 커리큘럼 설계</li>
              <li>현장 검증 중심의 파일럿 운영</li>
              <li>성과기록과 후속 실행계획 동시 정리</li>
            </ul>
          </article>
          <article className="card capability-card">
            <h2>주요 산출물</h2>
            <ul className="list">
              <li>운영 캘린더 및 역할 매트릭스</li>
              <li>실험 과제 설계서와 피드백 로그</li>
              <li>결과 리포트 및 다음 단계 제안안</li>
            </ul>
          </article>
        </div>

        <div className="cta-row">
          <Link href="/projects" className="button secondary">
            관련 사례 보기
          </Link>
          <Link href="/contact" className="button">
            협업 문의하기
          </Link>
        </div>
      </div>
    </section>
  );
}

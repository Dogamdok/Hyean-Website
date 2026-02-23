import type { Metadata } from 'next';
import { companyProfile } from '@/data/site';
import { ContactChatbot } from './contact-chatbot';

const pagePath = '/contact';
const pageTitle = '문의 | HYEAN';
const pageDescription = '과제 맥락, 일정, 목표 성과를 공유하면 혜안의 초기 실행 구조 제안을 받을 수 있습니다.';

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
    images: [{ url: '/opengraph-image.png', alt: 'HYEAN 문의' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: pageTitle,
    description: pageDescription,
    images: ['/twitter-image.png'],
  },
};

export default function ContactPage() {
  return (
    <section className="section">
      <div className="container">
        <span className="eyebrow">Contact</span>
        <h1>협업 문의</h1>
        <p className="muted">
          과제 맥락과 희망 일정만 공유해 주시면, 초기 진단과 함께 가능한 실행 구조를 제안드립니다.
        </p>
        <article className="card section-stack-sm contact-expectation">
          <h2>문의 전 확인사항</h2>
          <ul className="list">
            <li>초기 회신: 영업일 기준 1~2일 내</li>
            <li>권장 첨부/준비: 현재 과제 요약, 일정, 목표 성과</li>
            <li>진행 방식: 사전 진단 → 1차 미팅 → 맞춤 실행안 제안</li>
          </ul>
        </article>

        <div className="grid-2 section-stack-md">
          <article className="card">
            <h2>AI 챗봇 문의</h2>
            <p className="muted">
              대화형 질문에 답하면 기존 문의 접수와 동일한 방식으로 자동 등록됩니다.
            </p>
            <ContactChatbot />
          </article>

          <article className="card contact-info-compact">
            <h2>연락처</h2>
            <p>
              {companyProfile.legalName} | 대표 {companyProfile.ceo}
            </p>
            <p>Tel: {companyProfile.phone}</p>
            <p>Fax: {companyProfile.fax}</p>
            <p>Email: {companyProfile.email}</p>
            <p>본사: {companyProfile.headquarters}</p>
            <p className="muted">지사: {companyProfile.branch}</p>
          </article>
        </div>
      </div>
    </section>
  );
}

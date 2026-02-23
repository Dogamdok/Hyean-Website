'use client';

import { FormEvent, useEffect, useRef, useState } from 'react';
import { trackEvent } from '@/lib/analytics';

type FormState = {
  name: string;
  organization: string;
  email: string;
  inquiryFocus: string;
  timeline: string;
  budgetRange: string;
  message: string;
};

const initialFormState: FormState = {
  name: '',
  organization: '',
  email: '',
  inquiryFocus: 'education-experiment',
  timeline: 'within-3-months',
  budgetRange: 'undecided',
  message: '',
};

export function ContactForm() {
  const [form, setForm] = useState<FormState>(initialFormState);
  const [statusMessage, setStatusMessage] = useState('');
  const [statusType, setStatusType] = useState<'idle' | 'success' | 'error'>('idle');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const hasStartedInquiryRef = useRef(false);

  useEffect(() => {
    trackEvent('view_contact', {
      inquiry_channel: 'form',
      page_path: '/contact',
    });
  }, []);

  const markInquiryStart = () => {
    if (hasStartedInquiryRef.current) return;
    trackEvent('start_inquiry', {
      inquiry_channel: 'form',
    });
    hasStartedInquiryRef.current = true;
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatusMessage('');
    setStatusType('idle');
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/inquiries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });

      const payload = (await response.json()) as { message?: string };

      if (!response.ok) {
        throw new Error(payload.message ?? '문의 접수 중 문제가 발생했습니다.');
      }

      trackEvent('submit_inquiry', {
        inquiry_channel: 'form',
        inquiry_focus: form.inquiryFocus,
        timeline: form.timeline,
        budget_range: form.budgetRange,
        message_length: form.message.length,
      });
      setStatusMessage(payload.message ?? '문의가 접수되었습니다.');
      setStatusType('success');
      setForm(initialFormState);
      hasStartedInquiryRef.current = false;
    } catch (error) {
      trackEvent('submit_inquiry_error', {
        inquiry_channel: 'form',
      });
      setStatusMessage(error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.');
      setStatusType('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="form-grid" onSubmit={onSubmit}>
      <label htmlFor="name">이름</label>
      <input
        id="name"
        name="name"
        value={form.name}
        onChange={(event) => {
          markInquiryStart();
          setForm((prev) => ({ ...prev, name: event.target.value }));
        }}
        required
      />

      <label htmlFor="organization">소속</label>
      <input
        id="organization"
        name="organization"
        value={form.organization}
        onChange={(event) => {
          markInquiryStart();
          setForm((prev) => ({ ...prev, organization: event.target.value }));
        }}
      />

      <label htmlFor="email">이메일</label>
      <input
        id="email"
        name="email"
        type="email"
        value={form.email}
        onChange={(event) => {
          markInquiryStart();
          setForm((prev) => ({ ...prev, email: event.target.value }));
        }}
        required
      />

      <label htmlFor="inquiryFocus">협업 초점</label>
      <select
        id="inquiryFocus"
        name="inquiryFocus"
        value={form.inquiryFocus}
        onChange={(event) => {
          markInquiryStart();
          setForm((prev) => ({ ...prev, inquiryFocus: event.target.value }));
        }}
      >
        <option value="education-experiment">교육·실험 프로그램 운영</option>
        <option value="collaboration-project">다기관 협업 프로젝트 실행</option>
        <option value="performance-management">성과관리/보고체계 구축</option>
        <option value="other">기타</option>
      </select>

      <label htmlFor="timeline">희망 일정</label>
      <select
        id="timeline"
        name="timeline"
        value={form.timeline}
        onChange={(event) => {
          markInquiryStart();
          setForm((prev) => ({ ...prev, timeline: event.target.value }));
        }}
      >
        <option value="asap">즉시 시작(1개월 이내)</option>
        <option value="within-3-months">3개월 이내</option>
        <option value="within-6-months">6개월 이내</option>
        <option value="exploring">아직 검토 단계</option>
      </select>

      <label htmlFor="budgetRange">예산 범위(선택)</label>
      <select
        id="budgetRange"
        name="budgetRange"
        value={form.budgetRange}
        onChange={(event) => {
          markInquiryStart();
          setForm((prev) => ({ ...prev, budgetRange: event.target.value }));
        }}
      >
        <option value="undecided">미정</option>
        <option value="under-30m">3천만원 미만</option>
        <option value="30m-100m">3천만원~1억원</option>
        <option value="over-100m">1억원 이상</option>
      </select>

      <label htmlFor="message">문의 내용</label>
      <textarea
        id="message"
        name="message"
        value={form.message}
        onChange={(event) => {
          markInquiryStart();
          setForm((prev) => ({ ...prev, message: event.target.value }));
        }}
        required
      />

      <button type="submit" className="button" disabled={isSubmitting}>
        {isSubmitting ? '접수 중...' : '문의 보내기'}
      </button>
      {statusMessage ? (
        <p className={`message ${statusType === 'error' ? 'message-error' : 'message-success'}`}>
          {statusMessage}
        </p>
      ) : null}
    </form>
  );
}

'use client';

import { FormEvent, useEffect, useMemo, useRef, useState } from 'react';
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

type ChatMessage = {
  role: 'bot' | 'user' | 'system';
  text: string;
};

type ChatStep = 'name' | 'organization' | 'email' | 'focus' | 'timeline' | 'budget' | 'message' | 'confirm' | 'done';

type ChatOption = {
  label: string;
  value: string;
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const namePattern = /^[가-힣a-zA-Z\s.'-]{2,30}$/;
const weakNameInputs = new Set([
  '뭐야',
  '뭐임',
  '몰라',
  '모름',
  '잉',
  'ㅇㅇ',
  'ㅎㅎ',
  'ㅋㅋ',
  'test',
  'tester',
  'asdf',
  'qwer',
]);

const FOCUS_OPTIONS: ChatOption[] = [
  { label: '교육·실험 프로그램 운영', value: 'education-experiment' },
  { label: '다기관 협업 프로젝트 실행', value: 'collaboration-project' },
  { label: '성과관리/보고체계 구축', value: 'performance-management' },
  { label: '기타', value: 'other' },
];

const TIMELINE_OPTIONS: ChatOption[] = [
  { label: '즉시 시작(1개월 이내)', value: 'asap' },
  { label: '3개월 이내', value: 'within-3-months' },
  { label: '6개월 이내', value: 'within-6-months' },
  { label: '아직 검토 단계', value: 'exploring' },
];

const BUDGET_OPTIONS: ChatOption[] = [
  { label: '미정', value: 'undecided' },
  { label: '3천만원 미만', value: 'under-30m' },
  { label: '3천만원~1억원', value: '30m-100m' },
  { label: '1억원 이상', value: 'over-100m' },
];

const CONFIRM_OPTIONS: ChatOption[] = [
  { label: '전송하기', value: 'submit' },
  { label: '문의내용 다시 입력', value: 'rewrite-message' },
];

const initialFormState: FormState = {
  name: '',
  organization: '',
  email: '',
  inquiryFocus: '',
  timeline: 'within-3-months',
  budgetRange: 'undecided',
  message: '',
};

function matchOption(input: string, options: ChatOption[]): ChatOption | null {
  const normalized = input.trim().toLowerCase();
  if (!normalized) return null;
  return options.find((option) => option.value === normalized || option.label.toLowerCase() === normalized) ?? null;
}

function isLikelyContactName(input: string): boolean {
  const trimmed = input.trim();
  const normalized = trimmed.toLowerCase();
  if (weakNameInputs.has(normalized)) return false;
  return namePattern.test(trimmed);
}

export function ContactChatbot() {
  const [form, setForm] = useState<FormState>(initialFormState);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'bot',
      text: '안녕하세요. 혜안 AI 상담봇입니다. 몇 가지 질문으로 빠르게 문의 접수를 도와드릴게요.',
    },
    {
      role: 'bot',
      text: '먼저 성함(또는 담당자명)을 알려주세요.',
    },
  ]);
  const [step, setStep] = useState<ChatStep>('name');
  const [input, setInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const threadRef = useRef<HTMLDivElement>(null);
  const hasStartedInquiryRef = useRef(false);

  useEffect(() => {
    trackEvent('view_contact', {
      inquiry_channel: 'chatbot',
      page_path: '/contact',
    });
  }, []);

  useEffect(() => {
    const thread = threadRef.current;
    if (!thread) return;
    thread.scrollTop = thread.scrollHeight;
  }, [messages]);

  const activeOptions = useMemo(() => {
    if (step === 'focus') return FOCUS_OPTIONS;
    if (step === 'timeline') return TIMELINE_OPTIONS;
    if (step === 'budget') return BUDGET_OPTIONS;
    if (step === 'confirm') return CONFIRM_OPTIONS;
    return [];
  }, [step]);

  const inputPlaceholder = useMemo(() => {
    if (step === 'done') return '접수가 완료되었습니다';
    if (step === 'email') return 'example@email.com';
    if (step === 'message') return '문의 배경, 목표, 현재 상황을 적어주세요';
    if (step === 'confirm') return '전송하기 / 문의내용 다시 입력';
    return '메시지를 입력하세요';
  }, [step]);

  const pushMessage = (message: ChatMessage) => {
    setMessages((prev) => [...prev, message]);
  };

  const toBot = (text: string) => pushMessage({ role: 'bot', text });
  const toSystem = (text: string) => pushMessage({ role: 'system', text });
  const toUser = (text: string) => pushMessage({ role: 'user', text });

  const askNext = (nextStep: ChatStep, nextForm?: FormState) => {
    const formSnapshot = nextForm ?? form;
    setStep(nextStep);

    if (nextStep === 'organization') {
      toBot('소속 기관/회사명을 알려주세요. 없으면 "없음"이라고 입력해 주세요.');
      return;
    }
    if (nextStep === 'email') {
      toBot('연락받으실 이메일을 입력해 주세요.');
      return;
    }
    if (nextStep === 'focus') {
      toBot('이번 협업에서 가장 중요한 초점을 선택해 주세요.');
      return;
    }
    if (nextStep === 'timeline') {
      toBot('희망 일정은 어떻게 되시나요?');
      return;
    }
    if (nextStep === 'budget') {
      toBot('예산 범위를 알려주세요. 아직 미정이면 "미정"을 선택하셔도 됩니다.');
      return;
    }
    if (nextStep === 'message') {
      toBot('문의 내용을 남겨주세요. 목표/배경/원하는 결과를 간단히 적어주시면 됩니다.');
      return;
    }
    if (nextStep === 'confirm') {
      const focusLabel =
        FOCUS_OPTIONS.find((item) => item.value === formSnapshot.inquiryFocus)?.label ?? formSnapshot.inquiryFocus;
      const timelineLabel =
        TIMELINE_OPTIONS.find((item) => item.value === formSnapshot.timeline)?.label ?? formSnapshot.timeline;
      const budgetLabel =
        BUDGET_OPTIONS.find((item) => item.value === formSnapshot.budgetRange)?.label ?? formSnapshot.budgetRange;

      toBot(
        `확인했습니다.\n담당자: ${formSnapshot.name}\n소속: ${formSnapshot.organization || '없음'}\n이메일: ${formSnapshot.email}\n협업 초점: ${focusLabel}\n희망 일정: ${timelineLabel}\n예산: ${budgetLabel}\n문의 내용: ${formSnapshot.message}`,
      );
      toBot('내용이 맞으면 "전송하기"를 눌러주세요.');
      return;
    }
  };

  const submitInquiry = async () => {
    if (isSubmitting) return;

    setIsSubmitting(true);
    toSystem('문의를 접수하는 중입니다...');

    try {
      const response = await fetch('/api/inquiries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...form,
          sourceSite: 'hyean-web',
          sourceLabel: 'HYEAN Website',
          sourceUrl: typeof window !== 'undefined' ? window.location.href : '/contact',
        }),
      });

      const payload = (await response.json()) as { message?: string };
      if (!response.ok) {
        throw new Error(payload.message ?? '문의 접수 중 문제가 발생했습니다.');
      }

      trackEvent('submit_inquiry', {
        inquiry_channel: 'chatbot',
        inquiry_focus: form.inquiryFocus || 'unknown',
        timeline: form.timeline || 'unknown',
        budget_range: form.budgetRange || 'unknown',
        message_length: form.message.length,
      });
      toBot(payload.message ?? '문의가 정상 접수되었습니다. 빠르게 확인 후 연락드리겠습니다.');
      setStep('done');
    } catch (error) {
      trackEvent('submit_inquiry_error', {
        inquiry_channel: 'chatbot',
      });
      toSystem(error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const onAnswer = async (rawInput: string) => {
    const value = rawInput.trim();
    if (!value || step === 'done' || isSubmitting) return;

    toUser(value);

    if (step === 'name') {
      if (value.length < 2) {
        toBot('성함은 2자 이상으로 입력해 주세요.');
        return;
      }
      if (!isLikelyContactName(value)) {
        toBot('성함/담당자명 형식으로 다시 입력해 주세요. 예: 김혜안 또는 Hyean Kim');
        return;
      }
      const nextForm = { ...form, name: value };
      setForm(nextForm);
      if (!hasStartedInquiryRef.current) {
        trackEvent('start_inquiry', {
          inquiry_channel: 'chatbot',
        });
        hasStartedInquiryRef.current = true;
      }
      askNext('organization', nextForm);
      return;
    }

    if (step === 'organization') {
      const normalized = value.toLowerCase();
      const organization = normalized === '없음' || normalized === '없어요' || normalized === 'skip' ? '' : value;
      const nextForm = { ...form, organization };
      setForm(nextForm);
      askNext('email', nextForm);
      return;
    }

    if (step === 'email') {
      if (!emailPattern.test(value)) {
        toBot('이메일 형식이 올바르지 않습니다. 다시 입력해 주세요.');
        return;
      }
      const nextForm = { ...form, email: value.toLowerCase() };
      setForm(nextForm);
      askNext('focus', nextForm);
      return;
    }

    if (step === 'focus') {
      const matched = matchOption(value, FOCUS_OPTIONS);
      if (!matched) {
        toBot('아래 버튼 중에서 선택해 주세요.');
        return;
      }
      const nextForm = { ...form, inquiryFocus: matched.value };
      setForm(nextForm);
      askNext('timeline', nextForm);
      return;
    }

    if (step === 'timeline') {
      const matched = matchOption(value, TIMELINE_OPTIONS);
      if (!matched) {
        toBot('일정도 아래 버튼에서 선택해 주세요.');
        return;
      }
      const nextForm = { ...form, timeline: matched.value };
      setForm(nextForm);
      askNext('budget', nextForm);
      return;
    }

    if (step === 'budget') {
      const matched = matchOption(value, BUDGET_OPTIONS);
      if (!matched) {
        toBot('예산 범위도 아래 버튼에서 선택해 주세요.');
        return;
      }
      const nextForm = { ...form, budgetRange: matched.value };
      setForm(nextForm);
      askNext('message', nextForm);
      return;
    }

    if (step === 'message') {
      if (value.length < 10) {
        toBot('문의 내용은 10자 이상으로 입력해 주세요.');
        return;
      }
      const nextForm = { ...form, message: value };
      setForm(nextForm);
      askNext('confirm', nextForm);
      return;
    }

    if (step === 'confirm') {
      const normalized = value.toLowerCase();
      if (normalized === '전송하기' || normalized === 'submit') {
        await submitInquiry();
        return;
      }
      if (normalized === '문의내용 다시 입력' || normalized === 'rewrite-message') {
        toBot('좋습니다. 문의 내용을 다시 입력해 주세요.');
        setStep('message');
        return;
      }
      toBot('아래 버튼에서 "전송하기" 또는 "문의내용 다시 입력"을 선택해 주세요.');
    }
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const value = input.trim();
    if (!value) return;
    setInput('');
    await onAnswer(value);
  };

  const onOptionClick = async (option: ChatOption) => {
    if (step === 'confirm' && option.value === 'submit') {
      toUser(option.label);
      await submitInquiry();
      return;
    }

    if (step === 'confirm' && option.value === 'rewrite-message') {
      toUser(option.label);
      toBot('좋습니다. 문의 내용을 다시 입력해 주세요.');
      setStep('message');
      return;
    }

    await onAnswer(option.label);
  };

  return (
    <div className="contact-chatbot">
      <div ref={threadRef} className="contact-chatbot-thread" aria-live="polite">
        {messages.map((message, index) => (
          <div key={`${message.role}-${index}`} className={`chat-message chat-message-${message.role}`}>
            <p>{message.text}</p>
          </div>
        ))}
      </div>

      {activeOptions.length > 0 && step !== 'done' ? (
        <div className="contact-chatbot-options">
          {activeOptions.map((option) => (
            <button
              key={`${option.value}-${option.label}`}
              type="button"
              className="chat-option-button"
              onClick={() => onOptionClick(option)}
              disabled={isSubmitting}
            >
              {option.label}
            </button>
          ))}
        </div>
      ) : null}

      <form className="contact-chatbot-input" onSubmit={onSubmit}>
        <input
          type="text"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder={inputPlaceholder}
          disabled={step === 'done' || isSubmitting}
        />
        <button type="submit" className="button" disabled={step === 'done' || isSubmitting}>
          {isSubmitting ? '접수 중...' : '보내기'}
        </button>
      </form>
    </div>
  );
}

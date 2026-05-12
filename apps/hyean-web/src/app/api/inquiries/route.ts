import { NextResponse } from 'next/server';
import { saveInquiry } from '@/lib/inquiry-store';
import { sendInquiryNotificationEmail } from '@/lib/inquiry-email';

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function sanitizeField(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

export async function POST(request: Request) {
  try {
    const rawBody = (await request.json()) as Record<string, unknown>;
    const requestHost =
      sanitizeField(request.headers.get('x-forwarded-host')) || sanitizeField(request.headers.get('host'));
    const requestReferer = sanitizeField(request.headers.get('referer'));
    const sourceUrlInput = sanitizeField(rawBody.sourceUrl || requestReferer);

    let sourceHost = '';
    let sourcePath = '';
    if (sourceUrlInput) {
      try {
        const parsed = new URL(sourceUrlInput);
        sourceHost = parsed.host;
        sourcePath = parsed.pathname;
      } catch {
        sourceHost = '';
        sourcePath = '';
      }
    }

    const explicitSourceSite = sanitizeField(rawBody.sourceSite);
    const fallbackSourceSite = requestHost.includes('hyean') ? 'hyean-web' : requestHost || 'unknown';
    const sourceSite = explicitSourceSite || fallbackSourceSite;
    const sourceLabel = sanitizeField(rawBody.sourceLabel) || sourceSite;

    const payload = {
      name: sanitizeField(rawBody.name),
      organization: sanitizeField(rawBody.organization),
      email: sanitizeField(rawBody.email).toLowerCase(),
      inquiryFocus: sanitizeField(rawBody.inquiryFocus || rawBody.inquiryType),
      timeline: sanitizeField(rawBody.timeline),
      budgetRange: sanitizeField(rawBody.budgetRange),
      message: sanitizeField(rawBody.message),
      sourceSite,
      sourceLabel,
      sourceHost: sourceHost || requestHost,
      sourcePath,
    };

    if (!payload.name || !payload.email || !payload.inquiryFocus || !payload.message) {
      return NextResponse.json(
        { message: '필수 항목(name, email, inquiryFocus, message)을 입력해주세요.' },
        { status: 400 },
      );
    }

    if (!emailPattern.test(payload.email)) {
      return NextResponse.json({ message: '올바른 이메일 형식이 아닙니다.' }, { status: 400 });
    }

    const record = await saveInquiry(payload);
    try {
      const delivery = await sendInquiryNotificationEmail(record);
      if (delivery === 'skipped') {
        console.warn('[inquiries] Email notification skipped: mail config is not set.');
      }
    } catch (error) {
      console.error('[inquiries] Failed to send email notification:', error);
    }

    return NextResponse.json(
      {
        message: '문의가 정상 접수되었습니다. 빠르게 확인 후 연락드리겠습니다.',
        id: record.id,
      },
      { status: 201 },
    );
  } catch {
    return NextResponse.json({ message: '문의 접수 중 서버 오류가 발생했습니다.' }, { status: 500 });
  }
}

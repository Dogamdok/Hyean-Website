import nodemailer from 'nodemailer';
import type { InquiryRecord } from '@/lib/inquiry-store';

type InquiryEmailConfig = {
  user: string;
  pass: string;
  to: string;
  from: string;
  cc?: string;
  bcc?: string;
  subjectPrefix: string;
  smtpHost?: string;
  smtpPort?: number;
  smtpSecure: boolean;
  baseUrl: string;
};

function sanitizeText(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

function parseBoolean(value: string): boolean | null {
  const normalized = value.toLowerCase();
  if (['1', 'true', 'yes', 'on'].includes(normalized)) return true;
  if (['0', 'false', 'no', 'off'].includes(normalized)) return false;
  return null;
}

function parseNumber(value: string): number | null {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed <= 0) return null;
  return Math.floor(parsed);
}

function escapeHtml(text: string): string {
  return text
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function formatDateLabel(isoDate: string): string {
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return isoDate;
  return date.toLocaleString('ko-KR', { timeZone: 'Asia/Seoul', hour12: false });
}

function getInquiryEmailConfig(): InquiryEmailConfig | null {
  const enabledRaw = sanitizeText(process.env.HYEAN_INQUIRY_EMAIL_ENABLED);
  if (enabledRaw) {
    const enabled = parseBoolean(enabledRaw);
    if (enabled === false) return null;
  }

  const user =
    sanitizeText(process.env.HYEAN_INQUIRY_EMAIL_USER) || sanitizeText(process.env.EMAIL_USER);
  const pass =
    sanitizeText(process.env.HYEAN_INQUIRY_EMAIL_PASS) || sanitizeText(process.env.EMAIL_PASS);
  const to =
    sanitizeText(process.env.HYEAN_INQUIRY_EMAIL_TO) ||
    sanitizeText(process.env.EMAIL_TO) ||
    user;
  const from = sanitizeText(process.env.HYEAN_INQUIRY_EMAIL_FROM) || user;

  if (!user || !pass || !to || !from) {
    return null;
  }

  const smtpHost = sanitizeText(process.env.HYEAN_INQUIRY_SMTP_HOST);
  const smtpPort = parseNumber(sanitizeText(process.env.HYEAN_INQUIRY_SMTP_PORT)) ?? undefined;
  const smtpSecure =
    parseBoolean(sanitizeText(process.env.HYEAN_INQUIRY_SMTP_SECURE)) ??
    (smtpPort ? smtpPort === 465 : false);
  const subjectPrefix =
    sanitizeText(process.env.HYEAN_INQUIRY_EMAIL_SUBJECT_PREFIX) || '[혜안 웹사이트 문의]';
  const configuredBaseUrl = sanitizeText(process.env.NEXT_PUBLIC_BASE_URL) || 'https://hyean.org';
  const baseUrl = (/^https?:\/\//.test(configuredBaseUrl) ? configuredBaseUrl : `https://${configuredBaseUrl}`).replace(
    /\/$/,
    '',
  );

  return {
    user,
    pass,
    to,
    from,
    cc: sanitizeText(process.env.HYEAN_INQUIRY_EMAIL_CC) || undefined,
    bcc: sanitizeText(process.env.HYEAN_INQUIRY_EMAIL_BCC) || undefined,
    subjectPrefix,
    smtpHost: smtpHost || undefined,
    smtpPort,
    smtpSecure,
    baseUrl,
  };
}

export async function sendInquiryNotificationEmail(record: InquiryRecord): Promise<'sent' | 'skipped'> {
  const config = getInquiryEmailConfig();
  if (!config) return 'skipped';

  const transporter = config.smtpHost
    ? nodemailer.createTransport({
        host: config.smtpHost,
        port: config.smtpPort ?? 587,
        secure: config.smtpSecure,
        auth: {
          user: config.user,
          pass: config.pass,
        },
      })
    : nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: config.user,
          pass: config.pass,
        },
      });

  const safeName = escapeHtml(record.name || '이름 미입력');
  const safeOrganization = escapeHtml(record.organization || '소속 미입력');
  const safeEmail = escapeHtml(record.email || '이메일 미입력');
  const safeInquiryFocus = escapeHtml(record.inquiryFocus || '협업 초점 미입력');
  const safeTimeline = escapeHtml(record.timeline || '미입력');
  const safeBudgetRange = escapeHtml(record.budgetRange || '미입력');
  const safeSourceSite = escapeHtml(record.sourceSite || 'hyean-web');
  const safeSourceHost = escapeHtml(record.sourceHost || 'unknown');
  const safeSourcePath = escapeHtml(record.sourcePath || '/contact');
  const safeCreatedAt = escapeHtml(formatDateLabel(record.createdAt));
  const safeMessage = escapeHtml(record.message || '').replaceAll('\n', '<br />');

  await transporter.sendMail({
    from: `"HYEAN Website" <${config.from}>`,
    to: config.to,
    cc: config.cc,
    bcc: config.bcc,
    replyTo: record.email || undefined,
    subject: `${config.subjectPrefix} ${safeName} (${safeOrganization})`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 640px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
        <h2 style="color: #1e293b; margin-bottom: 16px;">혜안 웹사이트 문의가 접수되었습니다.</h2>
        <div style="background: #f8fafc; border-radius: 6px; padding: 14px; margin-bottom: 18px;">
          <p style="margin: 6px 0;"><strong>문의 ID:</strong> ${escapeHtml(record.id)}</p>
          <p style="margin: 6px 0;"><strong>접수 일시:</strong> ${safeCreatedAt} (KST)</p>
          <p style="margin: 6px 0;"><strong>담당자:</strong> ${safeName}</p>
          <p style="margin: 6px 0;"><strong>소속:</strong> ${safeOrganization}</p>
          <p style="margin: 6px 0;"><strong>이메일:</strong> <a href="mailto:${safeEmail}">${safeEmail}</a></p>
          <p style="margin: 6px 0;"><strong>협업 초점:</strong> ${safeInquiryFocus}</p>
          <p style="margin: 6px 0;"><strong>희망 일정:</strong> ${safeTimeline}</p>
          <p style="margin: 6px 0;"><strong>예산 범위:</strong> ${safeBudgetRange}</p>
          <p style="margin: 6px 0;"><strong>유입 소스:</strong> ${safeSourceSite} (${safeSourceHost}${safeSourcePath})</p>
        </div>
        <div style="margin-bottom: 18px;">
          <h3 style="margin-bottom: 8px; color: #334155;">문의 내용</h3>
          <p style="margin: 0; line-height: 1.7; color: #334155;">${safeMessage}</p>
        </div>
        <div style="font-size: 12px; color: #94a3b8; text-align: center;">
          <p style="margin: 0 0 4px;">이 메일은 혜안 웹사이트 문의 API에서 자동 발송되었습니다.</p>
          <p style="margin: 0;"><a href="${config.baseUrl}/contact" style="color: #2563eb; text-decoration: none;">문의 페이지 바로가기</a></p>
        </div>
      </div>
    `,
  });

  return 'sent';
}

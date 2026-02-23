import { NextResponse } from 'next/server';
import { checkRateLimit } from '@/lib/rate-limit';
import { getInsightPostBySlug, isValidInsightSlug } from '@/lib/insight-post-store';

const apiWindowMs = 60 * 1000;
const getRateLimit = 120;

function getClientKey(request: Request): string {
  const forwardedFor = request.headers.get('x-forwarded-for') ?? '';
  const ip = forwardedFor.split(',')[0]?.trim();
  const host = request.headers.get('host') ?? 'unknown-host';
  return `${ip || 'unknown-ip'}@${host}`;
}

function isAuthorized(request: Request): boolean {
  const expected = process.env.N8N_API_KEY;
  const provided = request.headers.get('x-api-key')?.trim();
  if (!expected) return false;
  return Boolean(provided && provided === expected);
}

type RouteProps = {
  params: Promise<{ slug: string }>;
};

export async function GET(request: Request, { params }: RouteProps) {
  const key = `get-post:${getClientKey(request)}`;
  const rate = checkRateLimit(key, getRateLimit, apiWindowMs);
  if (!rate.ok) {
    return NextResponse.json(
      { message: 'Too many requests. Please retry later.' },
      { status: 429, headers: { 'Retry-After': String(Math.ceil((rate.resetAt - Date.now()) / 1000)) } },
    );
  }

  const { slug } = await params;
  if (!isValidInsightSlug(slug)) {
    return NextResponse.json({ message: 'Invalid slug format' }, { status: 400 });
  }

  const { searchParams } = new URL(request.url);
  const includeDraftParam = searchParams.get('includeDraft');
  const includeUnpublished = includeDraftParam === 'true' && isAuthorized(request);

  try {
    const post = await getInsightPostBySlug(slug, { includeUnpublished });
    if (!post) {
      return NextResponse.json({ message: 'Post not found' }, { status: 404 });
    }

    return NextResponse.json({ post }, { status: 200 });
  } catch {
    return NextResponse.json({ message: 'Failed to load post' }, { status: 500 });
  }
}

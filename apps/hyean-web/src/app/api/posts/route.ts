import { NextResponse } from 'next/server';
import { checkRateLimit } from '@/lib/rate-limit';
import {
  createInsightPost,
  isFirestoreStoreEnabled,
  listInsightPosts,
  validateInsightPostInput,
} from '@/lib/insight-post-store';

const apiWindowMs = 60 * 1000;
const postRateLimit = 30;
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

export async function GET(request: Request) {
  const key = `get-posts:${getClientKey(request)}`;
  const rate = checkRateLimit(key, getRateLimit, apiWindowMs);
  if (!rate.ok) {
    return NextResponse.json(
      { message: 'Too many requests. Please retry later.' },
      { status: 429, headers: { 'Retry-After': String(Math.ceil((rate.resetAt - Date.now()) / 1000)) } },
    );
  }

  const { searchParams } = new URL(request.url);
  const includeDraftParam = searchParams.get('includeDraft');
  const includeUnpublished = includeDraftParam === 'true' && isAuthorized(request);
  const limitParam = Number(searchParams.get('limit') ?? '');
  const limit = Number.isFinite(limitParam) && limitParam > 0 ? Math.min(limitParam, 100) : undefined;
  const posts = await listInsightPosts({
    includeUnpublished,
    limit,
  });

  return NextResponse.json(
    {
      count: posts.length,
      source: isFirestoreStoreEnabled() ? 'firestore' : 'local-fallback',
      posts,
    },
    { status: 200 },
  );
}

export async function POST(request: Request) {
  const key = `post-posts:${getClientKey(request)}`;
  const rate = checkRateLimit(key, postRateLimit, apiWindowMs);
  if (!rate.ok) {
    return NextResponse.json(
      { message: 'Too many requests. Please retry later.' },
      { status: 429, headers: { 'Retry-After': String(Math.ceil((rate.resetAt - Date.now()) / 1000)) } },
    );
  }

  if (!isAuthorized(request)) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  if (!process.env.N8N_API_KEY) {
    return NextResponse.json({ message: 'N8N_API_KEY is not configured on server' }, { status: 500 });
  }

  try {
    const rawBody = (await request.json()) as Record<string, unknown>;
    const validation = validateInsightPostInput(rawBody);
    if (!validation.valid || !validation.normalized) {
      return NextResponse.json(
        {
          message: 'Invalid payload',
          errors: validation.errors,
        },
        { status: 400 },
      );
    }

    const created = await createInsightPost(validation.normalized);
    if (!created.ok) {
      return NextResponse.json({ message: created.message }, { status: created.status });
    }

    return NextResponse.json(
      {
        message: 'Post created',
        source: isFirestoreStoreEnabled() ? 'firestore' : 'local-fallback',
        post: created.post,
      },
      { status: 201 },
    );
  } catch {
    return NextResponse.json({ message: 'Failed to create post' }, { status: 500 });
  }
}

import { createSign } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { insights as legacyInsights } from '@/data/insights';
import type { InsightPost, InsightPostCreateInput } from '@/types/content';

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const titleMaxLength = 140;
const excerptMaxLength = 320;
const contentMaxLength = 60000;
const postsCollection = 'posts';
const localPostFilePath = path.join(process.cwd(), 'data', 'posts.json');
const googleTokenEndpoint = 'https://oauth2.googleapis.com/token';
const firestoreScope = 'https://www.googleapis.com/auth/datastore';
const defaultCategory = 'Insights';
const defaultAuthor = 'HYEAN Editorial Team';
const internalArchiveSourceLabel = '내부 아카이브 자료';
const localPathPattern = /^(file:\/\/|\/Users\/|\/home\/|\/Volumes\/|~\/|[A-Za-z]:\\)/;

type PostListOptions = {
  includeUnpublished?: boolean;
  limit?: number;
};

type ServiceAccountKey = {
  project_id?: string;
  client_email?: string;
  private_key?: string;
};

type FirestoreValue =
  | { stringValue: string }
  | { booleanValue: boolean }
  | { timestampValue: string }
  | { arrayValue: { values?: FirestoreValue[] } };

type FirestoreDocument = {
  name: string;
  fields?: Record<string, FirestoreValue>;
};

type CreateInsightPostResult =
  | { ok: true; post: InsightPost }
  | { ok: false; status: 409; message: string };

let tokenCache: { token: string; expiresAt: number } | null = null;

export function isValidInsightSlug(slug: string): boolean {
  return slugPattern.test(slug.trim());
}

function sanitizeText(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

function sanitizeTags(values: unknown): string[] {
  if (!Array.isArray(values)) return [];
  return values
    .map((value) => sanitizeText(value))
    .filter(Boolean)
    .slice(0, 20);
}

function sanitizeSourceValue(value: unknown): string {
  const normalized = sanitizeText(value);
  if (!normalized) return '';

  if (/^https?:\/\/[^\s]+$/i.test(normalized)) {
    return normalized;
  }

  if (localPathPattern.test(normalized)) {
    return internalArchiveSourceLabel;
  }

  return normalized;
}

function sanitizeSources(values: unknown): string[] {
  if (!Array.isArray(values)) return [];
  return Array.from(new Set(values.map((value) => sanitizeSourceValue(value)).filter(Boolean))).slice(0, 30);
}

export function isValidCoverImage(coverImage: string): boolean {
  return /^\/images\/[^\s]+$/i.test(coverImage) || /^https?:\/\/[^\s]+$/i.test(coverImage);
}

export function validateInsightPostInput(raw: Record<string, unknown>): {
  valid: boolean;
  errors: string[];
  normalized?: InsightPostCreateInput;
} {
  const slug = sanitizeText(raw.slug);
  const title = sanitizeText(raw.title);
  const excerpt = sanitizeText(raw.excerpt);
  const content = sanitizeText(raw.content);
  const category = sanitizeText(raw.category) || defaultCategory;
  const author = sanitizeText(raw.author) || defaultAuthor;
  const coverImage = sanitizeText(raw.coverImage);
  const tags = sanitizeTags(raw.tags);
  const sources = sanitizeSources(raw.sources);
  const isPublished = typeof raw.isPublished === 'boolean' ? raw.isPublished : true;

  const errors: string[] = [];

  if (!slug) {
    errors.push('slug is required');
  } else if (!isValidInsightSlug(slug)) {
    errors.push('slug must match ^[a-z0-9]+(?:-[a-z0-9]+)*$');
  }

  if (!title) {
    errors.push('title is required');
  } else if (title.length > titleMaxLength) {
    errors.push(`title must be <= ${titleMaxLength} characters`);
  }

  if (!excerpt) {
    errors.push('excerpt is required');
  } else if (excerpt.length > excerptMaxLength) {
    errors.push(`excerpt must be <= ${excerptMaxLength} characters`);
  }

  if (!content) {
    errors.push('content is required');
  } else if (content.length > contentMaxLength) {
    errors.push(`content must be <= ${contentMaxLength} characters`);
  }

  if (!coverImage) {
    errors.push('coverImage is required');
  } else if (!isValidCoverImage(coverImage)) {
    errors.push('coverImage must be /images/... or http(s):// URL');
  }

  if (!category) {
    errors.push('category is required');
  }

  if (!author) {
    errors.push('author is required');
  }

  if (errors.length > 0) {
    return { valid: false, errors };
  }

  return {
    valid: true,
    errors: [],
    normalized: {
      slug,
      title,
      excerpt,
      content,
      category,
      author,
      coverImage,
      tags,
      sources,
      isPublished,
    },
  };
}

function normalizeIsoDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return new Date().toISOString();
  }
  return date.toISOString();
}

function toLegacyFallbackPost(index: number, post: (typeof legacyInsights)[number]): InsightPost {
  const safeDate = /^\d{4}-\d{2}-\d{2}$/.test(post.date)
    ? `${post.date}T00:00:00.000Z`
    : new Date(Date.now() - index * 1000).toISOString();
  return {
    slug: post.slug,
    title: post.title,
    excerpt: post.summary,
    content: post.body.join('\n\n'),
    category: defaultCategory,
    author: defaultAuthor,
    coverImage: '/opengraph-image.png',
    tags: post.tags,
    sources: sanitizeSources(post.sources),
    isPublished: post.status !== 'draft',
    createdAt: safeDate,
    updatedAt: safeDate,
  };
}

function getLegacyFallbackPosts(): InsightPost[] {
  return legacyInsights
    .map((post, index) => toLegacyFallbackPost(index, post))
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

async function readLocalPosts(): Promise<InsightPost[]> {
  try {
    const raw = await readFile(localPostFilePath, 'utf-8');
    const parsed = JSON.parse(raw) as InsightPost[];
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((item) => item && typeof item.slug === 'string' && typeof item.title === 'string')
      .map((item) => ({
        ...item,
        tags: sanitizeTags(item.tags),
        sources: sanitizeSources(item.sources),
        category: sanitizeText(item.category) || defaultCategory,
        author: sanitizeText(item.author) || defaultAuthor,
        coverImage: sanitizeText(item.coverImage) || '/opengraph-image.png',
        excerpt: sanitizeText(item.excerpt),
        content: sanitizeText(item.content),
        isPublished: Boolean(item.isPublished),
        createdAt: normalizeIsoDate(item.createdAt),
        updatedAt: normalizeIsoDate(item.updatedAt),
      }));
  } catch {
    return [];
  }
}

async function writeLocalPosts(posts: InsightPost[]): Promise<void> {
  await mkdir(path.dirname(localPostFilePath), { recursive: true });
  await writeFile(localPostFilePath, JSON.stringify(posts, null, 2), 'utf-8');
}

function getServiceAccountFromEnv(): ServiceAccountKey | null {
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
  if (!raw) return null;

  const candidates = [raw];
  try {
    const decoded = Buffer.from(raw, 'base64').toString('utf-8');
    if (decoded && decoded !== raw) candidates.push(decoded);
  } catch {
    // ignore invalid base64
  }

  for (const candidate of candidates) {
    try {
      const parsed = JSON.parse(candidate) as ServiceAccountKey;
      if (!parsed.client_email || !parsed.private_key) continue;
      return {
        ...parsed,
        private_key: parsed.private_key.replace(/\\n/g, '\n'),
      };
    } catch {
      // continue
    }
  }

  return null;
}

function getFirestoreProjectId(serviceAccount: ServiceAccountKey | null): string {
  return (
    sanitizeText(process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID) ||
    sanitizeText(serviceAccount?.project_id) ||
    ''
  );
}

export function isFirestoreStoreEnabled(): boolean {
  const account = getServiceAccountFromEnv();
  const projectId = getFirestoreProjectId(account);
  return Boolean(account?.client_email && account?.private_key && projectId);
}

function buildJwtAssertion(serviceAccount: ServiceAccountKey): string {
  const nowSec = Math.floor(Date.now() / 1000);
  const header = Buffer.from(JSON.stringify({ alg: 'RS256', typ: 'JWT' })).toString('base64url');
  const payload = Buffer.from(
    JSON.stringify({
      iss: serviceAccount.client_email,
      sub: serviceAccount.client_email,
      aud: googleTokenEndpoint,
      scope: firestoreScope,
      iat: nowSec,
      exp: nowSec + 3600,
    }),
  ).toString('base64url');
  const body = `${header}.${payload}`;

  const signer = createSign('RSA-SHA256');
  signer.update(body);
  signer.end();
  const signature = signer.sign(serviceAccount.private_key ?? '', 'base64url');
  return `${body}.${signature}`;
}

async function getFirestoreAccessToken(serviceAccount: ServiceAccountKey): Promise<string> {
  const now = Date.now();
  if (tokenCache && tokenCache.expiresAt > now + 30_000) {
    return tokenCache.token;
  }

  const assertion = buildJwtAssertion(serviceAccount);
  const body = new URLSearchParams({
    grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
    assertion,
  });

  const response = await fetch(googleTokenEndpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body,
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error(`Failed to get Google access token (${response.status})`);
  }

  const payload = (await response.json()) as { access_token?: string; expires_in?: number };
  if (!payload.access_token) {
    throw new Error('Google token response is missing access_token');
  }

  tokenCache = {
    token: payload.access_token,
    expiresAt: now + Math.max(60, payload.expires_in ?? 3600) * 1000,
  };
  return payload.access_token;
}

function fireFieldString(value: string): FirestoreValue {
  return { stringValue: value };
}

function fireFieldBoolean(value: boolean): FirestoreValue {
  return { booleanValue: value };
}

function fireFieldTimestamp(value: string): FirestoreValue {
  return { timestampValue: normalizeIsoDate(value) };
}

function fireFieldStringArray(values: string[]): FirestoreValue {
  return {
    arrayValue: {
      values: values.map((value) => ({ stringValue: value })),
    },
  };
}

function encodePostToFirestoreFields(post: InsightPost): Record<string, FirestoreValue> {
  return {
    slug: fireFieldString(post.slug),
    title: fireFieldString(post.title),
    excerpt: fireFieldString(post.excerpt),
    content: fireFieldString(post.content),
    category: fireFieldString(post.category),
    author: fireFieldString(post.author),
    coverImage: fireFieldString(post.coverImage),
    tags: fireFieldStringArray(post.tags),
    sources: fireFieldStringArray(post.sources),
    isPublished: fireFieldBoolean(post.isPublished),
    createdAt: fireFieldTimestamp(post.createdAt),
    updatedAt: fireFieldTimestamp(post.updatedAt),
  };
}

function decodeFirestoreValue(value: FirestoreValue | undefined): string | boolean | string[] {
  if (!value) return '';
  if ('stringValue' in value) return value.stringValue;
  if ('booleanValue' in value) return value.booleanValue;
  if ('timestampValue' in value) return value.timestampValue;
  if ('arrayValue' in value) {
    return (value.arrayValue.values ?? [])
      .map((item) => ('stringValue' in item ? item.stringValue : ''))
      .filter(Boolean);
  }
  return '';
}

function decodeFirestoreDoc(document: FirestoreDocument): InsightPost {
  const fields = document.fields ?? {};
  const docId = document.name.split('/').pop() ?? '';
  const createdAtRaw = decodeFirestoreValue(fields.createdAt);
  const updatedAtRaw = decodeFirestoreValue(fields.updatedAt);
  const slugValue = sanitizeText(decodeFirestoreValue(fields.slug));

  return {
    slug: slugValue || docId,
    title: sanitizeText(decodeFirestoreValue(fields.title)),
    excerpt: sanitizeText(decodeFirestoreValue(fields.excerpt)),
    content: sanitizeText(decodeFirestoreValue(fields.content)),
    category: sanitizeText(decodeFirestoreValue(fields.category)) || defaultCategory,
    author: sanitizeText(decodeFirestoreValue(fields.author)) || defaultAuthor,
    coverImage: sanitizeText(decodeFirestoreValue(fields.coverImage)) || '/opengraph-image.png',
    tags: sanitizeTags(decodeFirestoreValue(fields.tags)),
    sources: sanitizeSources(decodeFirestoreValue(fields.sources)),
    isPublished: Boolean(decodeFirestoreValue(fields.isPublished)),
    createdAt: normalizeIsoDate(typeof createdAtRaw === 'string' ? createdAtRaw : new Date().toISOString()),
    updatedAt: normalizeIsoDate(typeof updatedAtRaw === 'string' ? updatedAtRaw : new Date().toISOString()),
  };
}

async function firestoreRequest(
  pathSuffix: string,
  init: RequestInit = {},
  serviceAccount: ServiceAccountKey,
): Promise<Response> {
  const projectId = getFirestoreProjectId(serviceAccount);
  const accessToken = await getFirestoreAccessToken(serviceAccount);
  const endpoint = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)${pathSuffix}`;

  return fetch(endpoint, {
    ...init,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      ...(init.headers ?? {}),
    },
    cache: 'no-store',
  });
}

async function getFirestorePostBySlug(
  slug: string,
  options: { includeUnpublished?: boolean } = {},
): Promise<InsightPost | null> {
  const serviceAccount = getServiceAccountFromEnv();
  if (!serviceAccount) return null;

  const response = await firestoreRequest(`/documents/${postsCollection}/${slug}`, {}, serviceAccount);
  if (response.status === 404) {
    return null;
  }
  if (!response.ok) {
    throw new Error(`Failed to load Firestore post (${response.status})`);
  }

  const payload = (await response.json()) as FirestoreDocument;
  const post = decodeFirestoreDoc(payload);
  if (!options.includeUnpublished && !post.isPublished) {
    return null;
  }
  return post;
}

async function listFirestorePosts(options: PostListOptions = {}): Promise<InsightPost[]> {
  const serviceAccount = getServiceAccountFromEnv();
  if (!serviceAccount) return [];

  const query: Record<string, unknown> = {
    from: [{ collectionId: postsCollection }],
    orderBy: [{ field: { fieldPath: 'updatedAt' }, direction: 'DESCENDING' }],
  };

  if (!options.includeUnpublished) {
    query.where = {
      fieldFilter: {
        field: { fieldPath: 'isPublished' },
        op: 'EQUAL',
        value: { booleanValue: true },
      },
    };
  }

  if (typeof options.limit === 'number' && options.limit > 0) {
    query.limit = options.limit;
  }

  const response = await firestoreRequest(
    '/documents:runQuery',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ structuredQuery: query }),
    },
    serviceAccount,
  );

  if (!response.ok) {
    throw new Error(`Failed to query Firestore posts (${response.status})`);
  }

  const rows = (await response.json()) as Array<{ document?: FirestoreDocument }>;
  return rows
    .map((row) => row.document)
    .filter((doc): doc is FirestoreDocument => Boolean(doc))
    .map((doc) => decodeFirestoreDoc(doc));
}

async function createFirestorePost(input: InsightPostCreateInput): Promise<CreateInsightPostResult> {
  const serviceAccount = getServiceAccountFromEnv();
  if (!serviceAccount) {
    throw new Error('Firestore store is not configured');
  }

  const now = new Date().toISOString();
  const nextPost: InsightPost = {
    slug: input.slug,
    title: input.title,
    excerpt: input.excerpt,
    content: input.content,
    category: input.category,
    author: input.author,
    coverImage: input.coverImage,
    tags: input.tags ?? [],
    sources: input.sources ?? [],
    isPublished: input.isPublished ?? true,
    createdAt: now,
    updatedAt: now,
  };

  const response = await firestoreRequest(
    `/documents/${postsCollection}?documentId=${encodeURIComponent(input.slug)}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fields: encodePostToFirestoreFields(nextPost),
      }),
    },
    serviceAccount,
  );

  if (response.ok) {
    return { ok: true, post: nextPost };
  }

  if (response.status === 409) {
    return { ok: false, status: 409, message: 'post with same slug already exists' };
  }

  const errorText = await response.text();
  if (errorText.includes('ALREADY_EXISTS')) {
    return { ok: false, status: 409, message: 'post with same slug already exists' };
  }

  throw new Error(`Failed to create Firestore post (${response.status})`);
}

async function listLocalPosts(options: PostListOptions = {}): Promise<InsightPost[]> {
  const localPosts = await readLocalPosts();
  const basePosts = localPosts.length > 0 ? localPosts : getLegacyFallbackPosts();
  const filtered = options.includeUnpublished ? basePosts : basePosts.filter((post) => post.isPublished);
  const sorted = filtered.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));

  if (typeof options.limit === 'number' && options.limit > 0) {
    return sorted.slice(0, options.limit);
  }
  return sorted;
}

async function getLocalPostBySlug(slug: string, options: { includeUnpublished?: boolean } = {}): Promise<InsightPost | null> {
  const posts = await listLocalPosts({ includeUnpublished: true });
  const post = posts.find((item) => item.slug === slug);
  if (!post) return null;
  if (!options.includeUnpublished && !post.isPublished) return null;
  return post;
}

async function createLocalPost(input: InsightPostCreateInput): Promise<CreateInsightPostResult> {
  const posts = await listLocalPosts({ includeUnpublished: true });
  const existing = posts.some((item) => item.slug === input.slug);
  if (existing) {
    return { ok: false, status: 409, message: 'post with same slug already exists' };
  }

  const now = new Date().toISOString();
  const nextPost: InsightPost = {
    slug: input.slug,
    title: input.title,
    excerpt: input.excerpt,
    content: input.content,
    category: input.category,
    author: input.author,
    coverImage: input.coverImage,
    tags: input.tags ?? [],
    sources: input.sources ?? [],
    isPublished: input.isPublished ?? true,
    createdAt: now,
    updatedAt: now,
  };

  const nextPosts = [nextPost, ...posts].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  await writeLocalPosts(nextPosts);
  return { ok: true, post: nextPost };
}

export async function listInsightPosts(options: PostListOptions = {}): Promise<InsightPost[]> {
  if (isFirestoreStoreEnabled()) {
    return listFirestorePosts(options);
  }
  return listLocalPosts(options);
}

export async function getInsightPostBySlug(
  slug: string,
  options: { includeUnpublished?: boolean } = {},
): Promise<InsightPost | null> {
  if (!isValidInsightSlug(slug)) return null;
  if (isFirestoreStoreEnabled()) {
    return getFirestorePostBySlug(slug, options);
  }
  return getLocalPostBySlug(slug, options);
}

export async function createInsightPost(input: InsightPostCreateInput): Promise<CreateInsightPostResult> {
  if (isFirestoreStoreEnabled()) {
    return createFirestorePost(input);
  }
  return createLocalPost(input);
}

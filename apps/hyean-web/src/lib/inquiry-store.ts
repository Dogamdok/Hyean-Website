import { createSign, randomUUID } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

export type InquiryRecord = {
  id: string;
  name: string;
  organization: string;
  email: string;
  inquiryFocus: string;
  timeline?: string;
  budgetRange?: string;
  message: string;
  sourceSite?: string;
  sourceLabel?: string;
  sourceHost?: string;
  sourcePath?: string;
  createdAt: string;
};

type ServiceAccountKey = {
  project_id?: string;
  client_email?: string;
  private_key?: string;
};

type FirestoreValue = { stringValue: string } | { timestampValue: string };

type FirestoreDocument = {
  name: string;
  fields?: Record<string, FirestoreValue>;
};

const inquiryFilePath = path.join(process.cwd(), 'data', 'inquiries.json');
const inquiriesCollection = sanitizeText(process.env.FIRESTORE_INQUIRIES_COLLECTION) || 'inquiries';
const googleTokenEndpoint = 'https://oauth2.googleapis.com/token';
const firestoreScope = 'https://www.googleapis.com/auth/datastore';
let tokenCache: { token: string; expiresAt: number } | null = null;

function sanitizeText(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

function normalizeIsoDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return new Date().toISOString();
  }
  return date.toISOString();
}

async function readInquiries(): Promise<InquiryRecord[]> {
  try {
    const raw = await readFile(inquiryFilePath, 'utf-8');
    const parsed = JSON.parse(raw) as InquiryRecord[];
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((item) => item && typeof item.id === 'string')
      .map((item) => ({
        id: sanitizeText(item.id),
        name: sanitizeText(item.name),
        organization: sanitizeText(item.organization),
        email: sanitizeText(item.email),
        inquiryFocus: sanitizeText(item.inquiryFocus),
        timeline: sanitizeText(item.timeline),
        budgetRange: sanitizeText(item.budgetRange),
        message: sanitizeText(item.message),
        sourceSite: sanitizeText(item.sourceSite),
        sourceLabel: sanitizeText(item.sourceLabel),
        sourceHost: sanitizeText(item.sourceHost),
        sourcePath: sanitizeText(item.sourcePath),
        createdAt: normalizeIsoDate(item.createdAt),
      }));
  } catch {
    return [];
  }
}

async function writeInquiries(inquiries: InquiryRecord[]): Promise<void> {
  await mkdir(path.dirname(inquiryFilePath), { recursive: true });
  await writeFile(inquiryFilePath, JSON.stringify(inquiries, null, 2), 'utf-8');
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
  return sanitizeText(process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID) || sanitizeText(serviceAccount?.project_id);
}

export function isInquiryFirestoreEnabled(): boolean {
  const serviceAccount = getServiceAccountFromEnv();
  const projectId = getFirestoreProjectId(serviceAccount);
  return Boolean(serviceAccount?.client_email && serviceAccount?.private_key && projectId);
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

function fireFieldString(value: string): FirestoreValue {
  return { stringValue: value };
}

function fireFieldTimestamp(value: string): FirestoreValue {
  return { timestampValue: normalizeIsoDate(value) };
}

function decodeFirestoreValue(value: FirestoreValue | undefined): string {
  if (!value) return '';
  if ('stringValue' in value) return value.stringValue;
  if ('timestampValue' in value) return value.timestampValue;
  return '';
}

function encodeInquiryToFirestoreFields(record: InquiryRecord): Record<string, FirestoreValue> {
  return {
    id: fireFieldString(record.id),
    name: fireFieldString(record.name),
    organization: fireFieldString(record.organization),
    email: fireFieldString(record.email),
    inquiryFocus: fireFieldString(record.inquiryFocus),
    timeline: fireFieldString(record.timeline ?? ''),
    budgetRange: fireFieldString(record.budgetRange ?? ''),
    message: fireFieldString(record.message),
    sourceSite: fireFieldString(record.sourceSite ?? ''),
    sourceLabel: fireFieldString(record.sourceLabel ?? ''),
    sourceHost: fireFieldString(record.sourceHost ?? ''),
    sourcePath: fireFieldString(record.sourcePath ?? ''),
    createdAt: fireFieldTimestamp(record.createdAt),
  };
}

function decodeFirestoreDoc(document: FirestoreDocument): InquiryRecord {
  const fields = document.fields ?? {};
  const docId = document.name.split('/').pop() ?? '';
  const createdAtRaw = decodeFirestoreValue(fields.createdAt);

  return {
    id: sanitizeText(decodeFirestoreValue(fields.id)) || sanitizeText(docId),
    name: sanitizeText(decodeFirestoreValue(fields.name)),
    organization: sanitizeText(decodeFirestoreValue(fields.organization)),
    email: sanitizeText(decodeFirestoreValue(fields.email)),
    inquiryFocus: sanitizeText(decodeFirestoreValue(fields.inquiryFocus)),
    timeline: sanitizeText(decodeFirestoreValue(fields.timeline)),
    budgetRange: sanitizeText(decodeFirestoreValue(fields.budgetRange)),
    message: sanitizeText(decodeFirestoreValue(fields.message)),
    sourceSite: sanitizeText(decodeFirestoreValue(fields.sourceSite)),
    sourceLabel: sanitizeText(decodeFirestoreValue(fields.sourceLabel)),
    sourceHost: sanitizeText(decodeFirestoreValue(fields.sourceHost)),
    sourcePath: sanitizeText(decodeFirestoreValue(fields.sourcePath)),
    createdAt: normalizeIsoDate(createdAtRaw || new Date().toISOString()),
  };
}

async function listFirestoreInquiries(limit = 200): Promise<InquiryRecord[]> {
  const serviceAccount = getServiceAccountFromEnv();
  if (!serviceAccount) return [];

  const response = await firestoreRequest(
    '/documents:runQuery',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        structuredQuery: {
          from: [{ collectionId: inquiriesCollection }],
          orderBy: [{ field: { fieldPath: 'createdAt' }, direction: 'DESCENDING' }],
          limit: Math.max(1, Math.min(limit, 1000)),
        },
      }),
    },
    serviceAccount,
  );

  if (!response.ok) {
    throw new Error(`Failed to query Firestore inquiries (${response.status})`);
  }

  const rows = (await response.json()) as Array<{ document?: FirestoreDocument }>;
  return rows
    .map((row) => row.document)
    .filter((doc): doc is FirestoreDocument => Boolean(doc))
    .map((doc) => decodeFirestoreDoc(doc))
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

async function saveFirestoreInquiry(record: InquiryRecord): Promise<void> {
  const serviceAccount = getServiceAccountFromEnv();
  if (!serviceAccount) {
    throw new Error('Firestore store is not configured');
  }

  const response = await firestoreRequest(
    `/documents/${inquiriesCollection}?documentId=${encodeURIComponent(record.id)}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fields: encodeInquiryToFirestoreFields(record),
      }),
    },
    serviceAccount,
  );

  if (!response.ok) {
    throw new Error(`Failed to create Firestore inquiry (${response.status})`);
  }
}

export async function listInquiries(): Promise<InquiryRecord[]> {
  if (isInquiryFirestoreEnabled()) {
    try {
      return await listFirestoreInquiries();
    } catch {
      // fallback to local when Firestore network/auth fails
    }
  }

  const local = await readInquiries();
  return local.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function saveInquiry(record: Omit<InquiryRecord, 'id' | 'createdAt'>) {
  const nextRecord: InquiryRecord = {
    id: `inq_${Date.now()}_${randomUUID().replace(/-/g, '').slice(0, 12)}`,
    createdAt: new Date().toISOString(),
    ...record,
  };

  if (isInquiryFirestoreEnabled()) {
    try {
      await saveFirestoreInquiry(nextRecord);
      return nextRecord;
    } catch {
      // fallback to local file to avoid dropping inquiries on transient failures
    }
  }

  const localInquiries = await readInquiries();
  const nextInquiries = [nextRecord, ...localInquiries].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  await writeInquiries(nextInquiries);
  return nextRecord;
}

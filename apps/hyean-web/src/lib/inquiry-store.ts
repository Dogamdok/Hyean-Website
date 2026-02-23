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

const inquiryFilePath = path.join(process.cwd(), 'data', 'inquiries.json');

async function readInquiries(): Promise<InquiryRecord[]> {
  try {
    const raw = await readFile(inquiryFilePath, 'utf-8');
    return JSON.parse(raw) as InquiryRecord[];
  } catch {
    return [];
  }
}

export async function listInquiries(): Promise<InquiryRecord[]> {
  const inquiries = await readInquiries();
  return inquiries.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function saveInquiry(record: Omit<InquiryRecord, 'id' | 'createdAt'>) {
  const inquiries = await readInquiries();
  const nextRecord: InquiryRecord = {
    id: `inq_${Date.now()}`,
    createdAt: new Date().toISOString(),
    ...record,
  };

  const nextInquiries = [nextRecord, ...inquiries];
  await mkdir(path.dirname(inquiryFilePath), { recursive: true });
  await writeFile(inquiryFilePath, JSON.stringify(nextInquiries, null, 2), 'utf-8');
  return nextRecord;
}
